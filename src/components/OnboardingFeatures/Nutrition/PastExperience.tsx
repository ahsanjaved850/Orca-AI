import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface PastExperienceProps {
  onValidationChange?: (isValid: boolean) => void;
}

export const PastExperience: React.FC<PastExperienceProps> = ({
  onValidationChange,
}) => {
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);

  useEffect(() => {
    onValidationChange?.(selected !== null);
  }, [selected]);

  const handlePress = useCallback(async (value: "yes" | "no") => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(value);
  }, []);

  return (
    <View style={s.root}>
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

      {/* ── Title ── */}
      <View style={s.titleWrap}>
        <Text style={s.title}>
          Have you tried weight loss method involing a restricted diet before?
        </Text>
      </View>

      {/* ── Yes / No options pushed to bottom ── */}
      <View style={s.optionsWrap}>
        {/* Yes */}
        <TouchableOpacity
          style={[s.optionRow, selected === "yes" && s.optionRowSelected]}
          onPress={() => handlePress("yes")}
          activeOpacity={0.75}
        >
          <View style={[s.iconCircle, s.iconCircleYes]}>
            <Text style={s.iconText}>✓</Text>
          </View>
          <Text
            style={[s.optionLabel, selected === "yes" && s.optionLabelSelected]}
          >
            Yes
          </Text>
        </TouchableOpacity>

        {/* No */}
        <TouchableOpacity
          style={[s.optionRow, selected === "no" && s.optionRowSelected]}
          onPress={() => handlePress("no")}
          activeOpacity={0.75}
        >
          <View style={[s.iconCircle, s.iconCircleNo]}>
            <Text style={s.iconText}>✕</Text>
          </View>
          <Text
            style={[s.optionLabel, selected === "no" && s.optionLabelSelected]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
    paddingHorizontal: SPACING.lg,
  },

  // ─── Title ──────────────────────────────────────────────────────
  titleWrap: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.8,
    lineHeight: 40,
  },

  // ─── Options — pinned to bottom of screen ───────────────────────
  optionsWrap: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: SPACING.xl,
    gap: 28,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF6",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#F0DED0",
    minHeight: 72,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
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

  // Coloured circle icon — green for Yes, red for No
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircleYes: {
    backgroundColor: "#2ECC71",
  },
  iconCircleNo: {
    backgroundColor: "#EF4444",
  },
  iconText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  optionLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  optionLabelSelected: {
    fontWeight: "900",
  },
});
