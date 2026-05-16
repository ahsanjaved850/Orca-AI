import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "orca_onboarding_data";

// ─── Shape of all data collected during onboarding ────────────────────────
export interface OnboardingData {
  full_name?: string;
  gender?: string;
  goal?: string;
  age?: number;
  height?: number;
  weight?: number;
  target_weight?: number;
}

// ─── Save — merges with existing data so each screen can write its own fields
export const saveOnboardingData = async (
  data: Partial<OnboardingData>
): Promise<void> => {
  try {
    const existing = await getOnboardingData();
    await AsyncStorage.setItem(KEY, JSON.stringify({ ...existing, ...data }));
  } catch (e) {
    console.error("onboardingStorage.save error:", e);
  }
};

// ─── Read all collected data
export const getOnboardingData = async (): Promise<OnboardingData> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("onboardingStorage.get error:", e);
    return {};
  }
};

// ─── Clear after flush to Supabase
export const clearOnboardingData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.error("onboardingStorage.clear error:", e);
  }
};
