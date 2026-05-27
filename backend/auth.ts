import { dataAnalysis } from "@/src/utils/dataAnalysis";
import {
  clearOnboardingData,
  getOnboardingData,
} from "@/src/utils/onboardingStorage";
import { supabase } from "@/src/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Purchases from "react-native-purchases";

// ─── Sign In ───────────────────────────────────────────────────────────────
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  await AsyncStorage.setItem("session", JSON.stringify(data.session));

  try {
    await Purchases.logIn(data.user.id);
  } catch (e) {
    console.warn("RevenueCat logIn failed (sign in):", e);
  }

  return data.user;
};

// ─── Shared post-auth finalization ─────────────────────────────────────────
// Called immediately AFTER any successful signup auth (email/pw OR Apple).
// This is the single source of truth for "what happens when a brand-new
// account is created" — onboarding data flush, target calculation, RevenueCat
// linking, and AsyncStorage cleanup.
//
// Why a separate exported function?
//   • Email/pw signup goes through supabase.auth.signUp()
//   • Apple signup goes through supabase.auth.signInWithIdToken()
// They produce a Supabase user the same way but the auth call shape differs.
// Splitting "auth" from "what happens after auth" lets both paths converge
// on identical post-auth behavior without duplicating code.
export const finalizeNewAccount = async (
  user: { id: string; email?: string | null },
  /** Optional override — useful for Apple where we get the full_name from the IdP */
  fullNameOverride?: string | null,
) => {
  // ── Save session to AsyncStorage ───────────────────────────────────────
  // The edge function needs an authenticated session to verify the request.
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData?.session) {
    await AsyncStorage.setItem("session", JSON.stringify(sessionData.session));
  }

  // ── Read everything collected during onboarding ────────────────────────
  const od = await getOnboardingData();

  // ── Upsert profile row with all onboarding data ────────────────────────
  // For Apple users, fullNameOverride is what we got from AppleAuthentication;
  // for email/pw users it's whatever was collected on the Name slide.
  const fullName = fullNameOverride ?? od.full_name ?? null;

  const { error: profileError } = await supabase.from("profile").upsert({
    id: user.id,
    full_name: fullName,
    gender: od.gender ?? null,
    goal: od.goal ?? null,
    age: od.age ?? null,
    height: od.height ?? null,
    weight: od.weight ?? null,
    target_weight: od.target_weight ?? null,
    onboarding: false, // flipped to true after dataAnalysis succeeds
  });

  if (profileError) {
    console.error("Profile flush failed:", profileError.message);
    throw profileError;
  }

  // ── Run dataAnalysis edge function ─────────────────────────────────────
  // Edge function calls OpenAI + writes results to the initial-details table.
  // Non-fatal: user still gets in even if this fails (goals show 0 until
  // recalculated from somewhere later in the app).
  if (
    od.weight &&
    od.height &&
    od.age &&
    od.target_weight &&
    od.gender &&
    od.goal
  ) {
    try {
      await dataAnalysis(
        od.weight,
        od.height,
        od.age,
        od.target_weight,
        od.gender,
        od.goal,
      );
    } catch (e) {
      console.warn("dataAnalysis failed during signup:", e);
    }
  }

  // ── Mark onboarding complete ───────────────────────────────────────────
  const { error: onboardingError } = await supabase
    .from("profile")
    .update({ onboarding: true })
    .eq("id", user.id);

  if (onboardingError) {
    console.warn("Onboarding flag update failed:", onboardingError.message);
  }

  // ── Link RevenueCat purchase to permanent UUID ─────────────────────────
  try {
    await Purchases.logIn(user.id);
  } catch (e) {
    console.warn("RevenueCat logIn failed (sign up):", e);
  }

  // ── Clear AsyncStorage onboarding scratch keys ─────────────────────────
  await clearOnboardingData();
};

// ─── Sign Up (email + password) ────────────────────────────────────────────
// Thin wrapper now — just creates the Supabase account then hands off to
// finalizeNewAccount(). All the heavy lifting lives in the shared function.
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error("Sign up succeeded but no user returned.");

  await finalizeNewAccount(user);

  return user;
};

// ─── Sign Out ──────────────────────────────────────────────────────────────
export const signOut = async () => {
  await AsyncStorage.removeItem("session");
  await supabase.auth.signOut();
  try {
    await Purchases.logOut();
  } catch (e) {
    console.warn("RevenueCat logOut failed:", e);
  }
};

// ─── Helpers ───────────────────────────────────────────────────────────────
export const getSession = async () => {
  const sessionStr = await AsyncStorage.getItem("session");
  if (sessionStr) {
    const session = JSON.parse(sessionStr);
    supabase.auth.setSession(session);
    return session;
  }
  return null;
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user?.id;
};
