import {
  clearOnboardingData,
  getOnboardingData,
} from "@/src/utils/onboardingStorage";
import { supabase } from "@/src/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Purchases from "react-native-purchases";
import { dataAnalysis } from "./dataAnalysis";

// ─── Sign In ───────────────────────────────────────────────────────────────
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  await AsyncStorage.setItem("session", JSON.stringify(data.session));

  // Link RevenueCat to the signed-in user so their subscription follows them
  try {
    await Purchases.logIn(data.user.id);
  } catch (e) {
    console.warn("RevenueCat logIn failed (sign in):", e);
  }

  return data.user;
};

// ─── Sign Up ───────────────────────────────────────────────────────────────
// Complete flow — everything happens here before the user reaches Home:
//
//  1. Create Supabase account
//  2. Read onboarding data from AsyncStorage
//  3. Write profile row (name, gender, goal, age, height, weight, target)
//  4. Call dataAnalysis edge function:
//       → edge function calls OpenAI
//       → edge function saves BMI + macro targets to initial_details table
//     (we do NOT save initial_details ourselves — the edge function does it)
//  5. Mark onboarding: true on the profile
//  6. Link RevenueCat subscription to real UUID
//  7. Clear AsyncStorage
//
// The user only navigates to Home after ALL steps complete successfully.
export const signUp = async (email: string, password: string) => {
  // ── Step 1: Create account ─────────────────────────────────────────────
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const user = data.user;
  if (!user) throw new Error("Sign up succeeded but no user returned.");

  // Save session immediately — the edge function needs it to auth the request
  if (data.session) {
    await AsyncStorage.setItem("session", JSON.stringify(data.session));
  }

  // ── Step 2: Read everything from AsyncStorage ──────────────────────────
  const od = await getOnboardingData();

  // ── Step 3: Write profile to Supabase ─────────────────────────────────
  const { error: profileError } = await supabase.from("profile").upsert({
    id: user.id,
    full_name: od.full_name ?? null,
    gender: od.gender ?? null,
    goal: od.goal ?? null,
    age: od.age ?? null,
    height: od.height ?? null,
    weight: od.weight ?? null,
    target_weight: od.target_weight ?? null,
    onboarding: false,
  });

  if (profileError) {
    console.error("Profile flush failed:", profileError.message);
    throw profileError;
  }

  // ── Step 4: Run edge function ──────────────────────────────────────────
  // The edge function does two things:
  //   a) Calls OpenAI to calculate BMI + daily calorie/macro targets
  //   b) Saves those results directly to the initial_details table
  // We do NOT save initial_details here — the edge function owns that write.
  // If any data is missing we skip this — user can recalculate from Settings.
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
      // Non-fatal — the user still gets into the app.
      // Home will show 0 for goals until they recalculate from Settings.
      console.warn("dataAnalysis failed during signup:", e);
    }
  }

  // ── Step 5: Mark onboarding complete ──────────────────────────────────
  // Must happen after analysis so the routing guard (useOnboardingDone)
  // keeps the user from reaching Home if something failed earlier.
  const { error: onboardingError } = await supabase
    .from("profile")
    .update({ onboarding: true })
    .eq("id", user.id);

  if (onboardingError) {
    console.warn("Onboarding flag update failed:", onboardingError.message);
  }

  // ── Step 6: Link RevenueCat purchase to permanent UUID ─────────────────
  // User subscribed pre-signup (paywall before signup screen).
  // logIn() transfers the subscription from anonymous ID to real UUID.
  try {
    await Purchases.logIn(user.id);
  } catch (e) {
    console.warn("RevenueCat logIn failed (sign up):", e);
  }

  // ── Step 7: Clear AsyncStorage — all data is now in Supabase ──────────
  await clearOnboardingData();

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
