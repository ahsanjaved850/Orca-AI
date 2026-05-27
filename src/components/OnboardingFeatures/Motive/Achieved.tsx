import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MealsPerDayProps {
  onValidationChange?: (isValid: boolean) => void;
}

const OPTIONS = [
  { label: "Being Proud of Myself", value: "2" },
  { label: "Feel great about myself", value: "3" },
  { label: "I'm the King/Queen of the World", value: "4" },
  { label: "Believe in myself", value: "5" },
  { label: "feel empowered", value: "6" },
  { label: "Worry less about my body", value: "7" },
] as const;

export const Achieved: React.FC<MealsPerDayProps> = ({
  onValidationChange,
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    onValidationChange?.(selected !== null);
  }, [selected]);

  const handlePress = useCallback(async (value: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(value);
  }, []);

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundGradientTop}
      />

      {/* Peach → cream → white gradient */}
      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Title ── */}
        <Text style={s.title}>
          {" "}
          After reaching your goal, {"\n"}how would you feel {"\n"} about
          yourself?
        </Text>

        {/* ── Options ── */}
        <View style={s.options}>
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[s.optionRow, isSelected && s.optionRowSelected]}
                onPress={() => handlePress(opt.value)}
                activeOpacity={0.75}
              >
                {/* Left orange accent bar — appears on selection */}
                <View
                  style={[
                    s.accentBar,
                    {
                      backgroundColor: isSelected
                        ? COLORS.primary
                        : "transparent",
                    },
                  ]}
                />
                <Text
                  style={[s.optionLabel, isSelected && s.optionLabelSelected]}
                >
                  {opt.label}
                </Text>
                {isSelected && (
                  <View style={s.checkmark}>
                    <Text style={s.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },

  // ─── Title ───────────────────────────────────────────────────────
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: SPACING.sm,
  },

  // ─── Behind the question card ────────────────────────────────────
  behindCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFAF6",
    borderRadius: 20,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: "#F0DED0",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
    gap: 12,
  },
  behindEmoji: {
    fontSize: 36,
  },
  behindBody: {
    flex: 1,
  },
  behindTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  behindText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  behindMore: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  // ─── Options ─────────────────────────────────────────────────────
  options: {
    gap: 16,
    marginTop: SPACING.xxxl,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF6",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#F0DED0",
    minHeight: 64,
    overflow: "hidden",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  optionRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFF3E8",
    shadowOpacity: 0.14,
  },

  // Left orange accent bar — same as meal cards on Home
  accentBar: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 4,
  },

  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    paddingHorizontal: SPACING.md,
    letterSpacing: -0.2,
  },
  optionLabelSelected: {
    fontWeight: "800",
    color: COLORS.textDark,
  },

  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
