export interface DailyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  fiber: number;
}

export interface MacroCardConfig {
  label: string;
  value: number;
  goal: number;
  iconName: string;
  iconColor: string;
  iconBgColor: string;
}

export const INITIAL_NUTRITION_STATE: DailyNutrition = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  sugar: 0,
  sodium: 0,
  fiber: 0,
};

export const NUTRITION_ICONS = {
  fat: require("@/assets/images/icons/fats.png"),
  calories: require("@/assets/images/icons/calories.png"),
  protein: require("@/assets/images/icons/protein.png"),
  carbs: require("@/assets/images/icons/carbs.png"),
  sugar: require("@/assets/images/icons/sugar.png"),
  sodium: require("@/assets/images/icons/sodium.png"),
  fiber: require("@/assets/images/icons/fiber.png"),
  food: require("@/assets/images/icons/food.png"),
} as const;

export const MACRO_CARDS_CONFIG = {
  PROTEIN: {
    label: "Protein",
    iconKey: "protein" as keyof typeof NUTRITION_ICONS,
  },
  CARBS: {
    label: "Carbs",
    iconKey: "carbs" as keyof typeof NUTRITION_ICONS,
  },
  FATS: {
    label: "Fats",
    iconKey: "fat" as keyof typeof NUTRITION_ICONS,
  },
  SUGAR: {
    label: "Sugar",
    iconKey: "sugar" as keyof typeof NUTRITION_ICONS,
  },
  SODIUM: {
    label: "Sodium",
    iconKey: "sodium" as keyof typeof NUTRITION_ICONS,
  },
  FIBER: {
    label: "Fiber",
    iconKey: "fiber" as keyof typeof NUTRITION_ICONS,
  },
  FOOD: {
    label: "Food",
    iconKey: "food" as keyof typeof NUTRITION_ICONS,
  },
} as const;

export const PROGRESS_COLORS = {
  LOW: "#10B981",
  MEDIUM: "#F59E0B",
  HIGH: "#3B82F6",
  EXCEEDED: "#EF4444",
} as const;

export const PROGRESS_THRESHOLDS = {
  LOW: 50,
  MEDIUM: 80,
  HIGH: 100,
} as const;
