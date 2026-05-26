import {
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
import { getSelectedBirthYear } from "@/src/components/OnboardingFeatures/GoalInfo/BirthYearPicker";
import { getGlobalCurrentWeight } from "@/src/components/OnboardingFeatures/GoalInfo/CurrentWeight";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StatusBar, StyleSheet, Text, View } from "react-native";

// ────────────────────────────────────────────────────────────────────
// Content
// ────────────────────────────────────────────────────────────────────
const CONTENT = {
  title: "Your personalized\ndaily plan",
  subtitle: "Based on your body stats and goals",
} as const;

// ────────────────────────────────────────────────────────────────────
// Basic TDEE / Macro calculator
// ────────────────────────────────────────────────────────────────────
function calculatePlan(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string,
  goal: string,
) {
  let bmr: number;

  if (gender === "Female") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  }

  const tdee = Math.round(bmr * 1.55);

  let targetCal: number;

  if (goal === "Lose") {
    targetCal = Math.round(tdee - 500);
  } else if (goal === "Gain") {
    targetCal = Math.round(tdee + 350);
  } else {
    targetCal = tdee;
  }

  const proteinG = Math.round(weightKg * 1.8);
  const fatG = Math.round((targetCal * 0.25) / 9);
  const carbG = Math.round((targetCal - proteinG * 4 - fatG * 9) / 4);

  const bmi = parseFloat((weightKg / (heightCm / 100) ** 2).toFixed(1));

  const bmiCategory =
    bmi < 18.5
      ? "Underweight"
      : bmi < 25
        ? "Normal"
        : bmi < 30
          ? "Overweight"
          : "Obese";

  const waterL = parseFloat((weightKg * 0.033).toFixed(1));

  return {
    calories: Math.max(targetCal, 1200),
    protein: proteinG,
    carbs: Math.max(carbG, 50),
    fat: fatG,
    bmi,
    bmiCategory,
    waterL,
  };
}

// ────────────────────────────────────────────────────────────────────
// Animated Macro Card
// ────────────────────────────────────────────────────────────────────
const MacroCard: React.FC<{
  label: string;
  value: number;
  unit: string;
  color: string;
  delay: number;
}> = ({ label, value, unit, color, delay }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        macroStyles.card,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[macroStyles.dot, { backgroundColor: color }]} />

      <Text style={macroStyles.value}>
        {value}
        <Text style={macroStyles.unit}>{unit}</Text>
      </Text>

      <Text style={macroStyles.label}>{label}</Text>
    </Animated.View>
  );
};

const macroStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    borderRadius: 20,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(28, 43, 54, 0.08)",
    ...SHADOWS.small,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginBottom: 8,
  },

  value: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.4,
  },

  unit: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textLight,
  },

  label: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: "700",
  },
});

// ────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────
export const PersonalizedPlan: React.FC = () => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const calAnim = useRef(new Animated.Value(0)).current;
  const detailAnim = useRef(new Animated.Value(0)).current;

  const currentWeight = getGlobalCurrentWeight() || 78;
  const birthYear = getSelectedBirthYear() || 2000;
  const age = new Date().getFullYear() - birthYear;

  const gender = "Male";
  const goal = "Lose";
  const heightCm = 170;

  const plan = calculatePlan(currentWeight, heightCm, age, gender, goal);

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(calAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(detailAnim, {
        toValue: 1,
        duration: 500,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundGradientTop}
      />

      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.screenContainer}>
        {/* Header */}
        <Animated.View
          style={[
            styles.headerSection,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.headerTitle}>{CONTENT.title}</Text>
          <Text style={styles.subtitle}>{CONTENT.subtitle}</Text>
        </Animated.View>

        {/* Calorie Hero Card */}
        <Animated.View
          style={[
            styles.calorieCard,
            {
              opacity: calAnim,
              transform: [
                {
                  scale: calAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.calLabel}>Daily Calorie Goal</Text>

          <View style={styles.calValueRow}>
            <Text style={styles.calValue}>{plan.calories}</Text>
            <Text style={styles.calUnit}>kcal</Text>
          </View>

          <View style={styles.calBadge}>
            <Text style={styles.calBadgeText}>
              {goal === "Lose"
                ? "Healthy deficit for steady progress"
                : goal === "Gain"
                  ? "Clean surplus for lean gains"
                  : "Maintenance for your body"}
            </Text>
          </View>
        </Animated.View>

        {/* Macro Cards */}
        <Animated.View style={[styles.macroRow, { opacity: detailAnim }]}>
          <MacroCard
            label="Protein"
            value={plan.protein}
            unit="g"
            color="#2196F3"
            delay={1000}
          />
          <MacroCard
            label="Carbs"
            value={plan.carbs}
            unit="g"
            color="#8BC34A"
            delay={1150}
          />
          <MacroCard
            label="Fat"
            value={plan.fat}
            unit="g"
            color="#F5A623"
            delay={1300}
          />
        </Animated.View>

        {/* Body Stats Row */}
        <Animated.View style={[styles.statsCard, { opacity: detailAnim }]}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{plan.bmi}</Text>
            <Text style={styles.statLabel}>BMI</Text>

            <View
              style={[
                styles.statBadge,
                {
                  backgroundColor:
                    plan.bmiCategory === "Normal"
                      ? "#2ECC71"
                      : plan.bmiCategory === "Overweight"
                        ? "#F5A623"
                        : plan.bmiCategory === "Obese"
                          ? "#FF4757"
                          : "#2196F3",
                },
              ]}
            >
              <Text style={styles.statBadgeText}>{plan.bmiCategory}</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{plan.waterL}L</Text>
            <Text style={styles.statLabel}>Daily Water</Text>

            <View
              style={[styles.statBadge, { backgroundColor: COLORS.primary }]}
            >
              <Text style={styles.statBadgeText}>Recommended</Text>
            </View>
          </View>
        </Animated.View>

        {/* Reassurance */}
        <Animated.View style={[styles.reassurance, { opacity: detailAnim }]}>
          <Text style={styles.reassuranceText}>
            These targets adapt as you progress — no rigid numbers.
          </Text>

          <Text style={styles.citationText}>
            Personalized estimates are for guidance only and not medical advice.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

// ────────────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
  },

  screenContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },

  headerSection: {
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },

  preTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: "900",
    marginBottom: SPACING.xs,
    letterSpacing: -0.2,
  },

  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textDark,
    textAlign: "center",
    lineHeight: 36,
    letterSpacing: -0.8,
  },

  subtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.textDark,
    opacity: 0.68,
    textAlign: "center",
    marginTop: SPACING.sm,
    fontWeight: "600",
  },

  calorieCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.28)",
    ...SHADOWS.medium,
  },

  calTopBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: SPACING.sm,
  },

  calTopBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  calLabel: {
    ...TYPOGRAPHY.body,
    color: "rgba(255,255,255,0.84)",
    marginBottom: SPACING.xs,
    fontWeight: "700",
  },

  calValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  calValue: {
    fontSize: 58,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: -2,
  },

  calUnit: {
    fontSize: 20,
    fontWeight: "800",
    color: "rgba(255,255,255,0.75)",
    marginLeft: 6,
  },

  calBadge: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: SPACING.sm,
  },

  calBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
  },

  macroRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },

  statsCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 24,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(28, 43, 54, 0.08)",
    ...SHADOWS.small,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },

  statLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: "700",
  },

  statBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 7,
  },

  statBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 0.3,
  },

  statDivider: {
    width: 1,
    backgroundColor: "rgba(28, 43, 54, 0.1)",
    marginHorizontal: SPACING.md,
  },

  reassurance: {
    alignItems: "center",
    marginTop: SPACING.lg,
  },

  reassuranceText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textDark,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "600",
  },

  citationText: {
    fontSize: 10,
    color: COLORS.textDark,
    opacity: 0.45,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 8,
    fontStyle: "italic",
  },
});
