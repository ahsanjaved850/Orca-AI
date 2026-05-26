import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");

export const BodyChange: React.FC = () => {
  const wordmarkAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const phoneAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(140, [
      Animated.spring(wordmarkAnim, {
        toValue: 1,
        tension: 60,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(phoneAnim, {
        toValue: 1,
        tension: 38,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundGradientTop}
      />

      {/*
       * Full-screen peach→cream→white gradient — identical to Home,
       * Data, Settings, Login screens. One continuous brand language.
       */}
      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={s.content}>
        {/* ── Bold headline — large, dark, center-aligned ── */}
        <Animated.View
          style={{
            opacity: titleAnim,
            transform: [
              {
                translateY: titleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <Text style={s.headline}>
            With Orca{"\n"}Every milestone is{"\n"}is within reach
          </Text>
        </Animated.View>
        <Image
          source={require("@/assets/images/Onboarding/fulltrans.png")}
          resizeMode="cover"
          style={{ width: SW * 0.9, height: SH * 0.33, marginTop: 80 }}
        />
        <Animated.View style={[s.noteCard, { opacity: titleAnim }]}>
          <Ionicons name="eye" size={16} color={COLORS.primary} />
          <Text style={s.noteText}>
            In every step of your journey, we will be there to guide you.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  wordmark: {
    fontSize: 36,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -1.5,
    includeFontPadding: false,
    marginBottom: SPACING.md,
  },
  headline: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: SPACING.lg,
  },

  // ─── Bottom note ───────────────────────────────────────────────
  noteCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF3E8",
    borderRadius: 16,
    padding: 14,
    marginTop: SPACING.xl,
    width: "100%",
    borderWidth: 1,
    borderColor: "#F0DED0",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
});
