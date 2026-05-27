import { LoginScreen } from "@/src/Screens/Login";
import { useRouter } from "expo-router";

// ─── Post-onboarding signup screen ────────────────────────────────────────
// The user arrives here after completing onboarding AND paying (paywall).
// They create an account here — auth.signUp() handles:
//   1. Creating the Supabase account
//   2. Flushing all AsyncStorage onboarding data to Supabase profile table
//   3. Calling dataAnalysis edge function → saves to initial_details table
//   4. Marking onboarding complete
//   5. Linking RevenueCat subscription to the real UUID
//   6. Clearing AsyncStorage
// Only after ALL of that succeeds does onLogin() fire and the user reaches Home.
export default function Signup() {
  const router = useRouter();

  const handleSignedUp = () => {
    // Everything is in Supabase — safe to go to Home
    router.replace("/tabs/home");
  };

  return <LoginScreen mode="signup" onLogin={handleSignedUp} />;
}
