import { LoginScreen } from "@/src/Screens/Login";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    // Signing in means account + onboarding already done — go straight home
    router.replace("/tabs/home");
  };

  return <LoginScreen mode="signin" onLogin={handleLogin} />;
}
