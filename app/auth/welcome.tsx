import { WelcomeScreen } from "@/src/Screens/Welcome/WelcomeScreen";
import { useLocalSearchParams } from "expo-router";
import { JSX } from "react";
 
export default function Welcome(): JSX.Element {
  // If index.tsx routed here with ?direct=1, the user has already seen
  // the carousel before — skip the marketing slides and land on slide 3.
  const { direct } = useLocalSearchParams<{ direct?: string }>();
  const startIndex = direct === "1" ? 2 : 0;
 
  return <WelcomeScreen startIndex={startIndex} />;
}
 