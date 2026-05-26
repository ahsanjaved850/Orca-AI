import { configureRevenueCat } from "@/src/utils/revenuecat";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const onboardingDone = useOnboardingDone();

  console.log(onboardingDone, "from main layout");

  useEffect(() => {
    configureRevenueCat();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="tabs" />
      </Stack>
    </>
  );
}
