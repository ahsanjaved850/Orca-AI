import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/src/Screens/Onboarding/Onboarding.style";
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

interface EatingStyleProps {
  onValidationChange?: (isValid: boolean) => void;
}

const CONTENT = {
  header: {
    title: "What's your preferred\neating style?",
  },
  options: [
    { label: "I eat everything", emoji: "✅" },
    { label: "Vegan", emoji: "🥦" },
    { label: "Vegetarian", emoji: "🧀" },
    { label: "Keto", emoji: "🥑" },
    { label: "Paleo", emoji: "🥩" },
    { label: "Mediterranean", emoji: "🫒" },
    { label: "Alkaline", emoji: "🍎" },
    { label: "Pescatarian", emoji: "🐟" },
    { label: "Gluten-free", emoji: "🌾" },
  ],
} as const;

export const EatingStyle: React.FC<EatingStyleProps> = ({
  onValidationChange,
}) => {
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    onValidationChange?.(selected.length > 0);
  }, [selected]);

  const handlePress = useCallback(async (option: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(option);
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
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>{CONTENT.header.title}</Text>
        </View>

        {/* Options */}
        <ScrollView
          contentContainerStyle={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {CONTENT.options.map((option) => {
            const isSelected = selected === option.label;
            return (
              <TouchableOpacity
                key={option.label}
                onPress={() => handlePress(option.label)}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

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
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  optionsContainer: {
    gap: 10,
    paddingBottom: SPACING.xxxl,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#F0DED0",
    backgroundColor: "#FFFAF6",
    minHeight: 64,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  optionButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFF3E8",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: "500",
    flex: 1,
  },
  optionTextSelected: {
    color: COLORS.textDark,
    fontWeight: "700",
  },
  checkmark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
