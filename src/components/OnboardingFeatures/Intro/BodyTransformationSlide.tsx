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

// ─── 3 transformation stages ──────────────────────────────────────────────
const STAGES = [
  {
    image: require("@/assets/images/Onboarding/trans1.png"),
    label: "Start",
    day: "Day 0",
    dayColor: "#EF4444", // red — beginning
  },
  {
    image: require("@/assets/images/Onboarding/trans2.png"),
    label: "Progress",
    day: "Day 15",
    dayColor: "#F59E0B", // amber — halfway
  },
  {
    image: require("@/assets/images/Onboarding/trans3.png"),
    label: "Goal",
    day: "Day 28",
    dayColor: "#2ECC71", // green — achieved
  },
] as const;

// ─── Single image stage card ───────────────────────────────────────────────
const StageCard: React.FC<{
  image: any;
  label: string;
  day: string;
  dayColor: string;
  anim: Animated.Value;
  delay: number;
}> = ({ image, label, day, dayColor, anim, delay }) => {
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      tension: 48,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        s.stageWrap,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [24, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* Image card */}
      <View style={s.imageCard}>
        <Image source={image} style={s.bodyImage} resizeMode="cover" />

        {/* Day badge — overlaid top-right on the image */}
        <View style={[s.dayBadge, { backgroundColor: dayColor }]}>
          <Text style={s.dayBadgeText}>{day}</Text>
        </View>
      </View>

      {/* Label below image */}
      <Text style={s.stageLabel}>{label}</Text>
    </Animated.View>
  );
};

// ─── Arrow between stages ──────────────────────────────────────────────────
const Arrow: React.FC<{ anim: Animated.Value }> = ({ anim }) => (
  <Animated.View style={[s.arrowWrap, { opacity: anim }]}>
    <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
  </Animated.View>
);

// ─── Main Component ────────────────────────────────────────────────────────
export const BodyTransformationSlide: React.FC = () => {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;
  const arrowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(arrowAnim, {
        toValue: 1,
        duration: 400,
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
        {/* ── Header ── */}
        <Animated.View
          style={{
            opacity: titleAnim,
            transform: [
              {
                translateY: titleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
            ],
          }}
        >
          <Text style={s.headline}>
            Lets make your goal a reality{"\n"}a reality
          </Text>

          <Text style={s.subtitle}>{""}</Text>
        </Animated.View>

        {/* ── 3 stage images with arrows ── */}
        <View style={s.stagesRow}>
          <StageCard
            image={STAGES[0].image}
            label={STAGES[0].label}
            day={STAGES[0].day}
            dayColor={STAGES[0].dayColor}
            anim={card1Anim}
            delay={200}
          />

          <Arrow anim={arrowAnim} />

          <StageCard
            image={STAGES[1].image}
            label={STAGES[1].label}
            day={STAGES[1].day}
            dayColor={STAGES[1].dayColor}
            anim={card2Anim}
            delay={350}
          />

          <Arrow anim={arrowAnim} />

          <StageCard
            image={STAGES[2].image}
            label={STAGES[2].label}
            day={STAGES[2].day}
            dayColor={STAGES[2].dayColor}
            anim={card3Anim}
            delay={500}
          />
        </View>
      </View>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────
const CARD_W = (SW - SPACING.lg * 2 - 44 * 2 - 12 * 4) / 3; // 3 cards + 2 arrows + gaps
const CARD_H = CARD_W * 1.55;

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

  // ─── Header ────────────────────────────────────────────────────
  badge: {
    alignSelf: "center",
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
    textTransform: "uppercase",
  },
  headline: {
    color: COLORS.textDark,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.8,
    lineHeight: 36,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 22,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },

  // ─── Stages row ────────────────────────────────────────────────
  stagesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 6,
  },

  // Single stage wrapper
  stageWrap: {
    alignItems: "center",
    gap: 10,
  },

  // Image card — warm off-white surface, orange border, shadow
  imageCard: {
    width: 105,
    height: 350,
    elevation: 5,
    marginTop: 16,
  },
  bodyImage: {
    width: "100%",
    height: "100%",
  },

  // Day badge overlaid top-right on each image
  dayBadge: {
    position: "absolute",
    top: -10,
    right: 8,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dayBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  // Label below each image card
  stageLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.2,
    borderRadius: 16,
    borderColor: "#171717",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  // Arrow between cards
  arrowWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF3E8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F0DED0",
    marginBottom: 24, // align vertically with image center
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
