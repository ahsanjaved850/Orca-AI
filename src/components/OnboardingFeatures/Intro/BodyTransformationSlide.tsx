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

const { width: SW } = Dimensions.get("window");

// ─── 3 transformation stages ──────────────────────────────────────────────
const STAGES = [
  {
    image: require("@/assets/images/Onboarding/trans1.png"),
    label: "Start",
    color: "#EF4444", // red — beginning
    tint: "#FEE2E2", // soft red bg for label pill
  },
  {
    image: require("@/assets/images/Onboarding/trans2.png"),
    label: "Progress",
    color: "#F59E0B", // amber — halfway
    tint: "#FEF3C7",
  },
  {
    image: require("@/assets/images/Onboarding/trans3.png"),
    label: "Goal",
    color: "#10B981", // green — achieved
    tint: "#D1FAE5",
  },
] as const;

// ─── Layout math ──────────────────────────────────────────────────────────
const H_PADDING = SPACING.lg * 2;
const ARROW_SIZE = 28;
const GAP = 8;
const CARD_W = Math.floor(SW - H_PADDING - ARROW_SIZE * 9 - GAP * 4);
const CARD_H = Math.round(CARD_W * 3.2);

// ─── Single image stage card ───────────────────────────────────────────────
const StageCard: React.FC<{
  image: any;
  label: string;
  color: string;
  tint: string;
  anim: Animated.Value;
}> = ({ image, label, color, tint, anim }) => {
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
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
        },
      ]}
    >
      {/* Image card — rounded, clipped, soft shadow */}
      <View style={s.imageCard}>
        <Image source={image} style={s.bodyImage} resizeMode="cover" />
      </View>

      {/* Label pill below — tinted to match stage color */}
      <View style={[s.labelPill, { backgroundColor: tint }]}>
        <View style={[s.labelDot, { backgroundColor: color }]} />
        <Text style={[s.labelText, { color }]}>{label}</Text>
      </View>
    </Animated.View>
  );
};

// ─── Arrow between stages ──────────────────────────────────────────────────
const Arrow: React.FC<{ anim: Animated.Value }> = ({ anim }) => (
  <Animated.View
    style={[
      s.arrowWrap,
      {
        opacity: anim,
        transform: [
          {
            scale: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.6, 1],
            }),
          },
        ],
      },
    ]}
  >
    <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
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
    Animated.sequence([
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.stagger(140, [
        Animated.spring(card1Anim, {
          toValue: 1,
          tension: 48,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(card2Anim, {
          toValue: 1,
          tension: 48,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(card3Anim, {
          toValue: 1,
          tension: 48,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(arrowAnim, {
        toValue: 1,
        duration: 350,
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
            alignItems: "center",
          }}
        >
          <Text style={s.headline}>Let's make your goal{"\n"}a reality</Text>
          <Text style={s.subtitle}>See the transformation, step by step</Text>
        </Animated.View>

        {/* ── 3 stage images with arrows ── */}
        <View style={s.stagesRow}>
          <StageCard
            image={STAGES[0].image}
            label={STAGES[0].label}
            color={STAGES[0].color}
            tint={STAGES[0].tint}
            anim={card1Anim}
          />

          <Arrow anim={arrowAnim} />

          <StageCard
            image={STAGES[1].image}
            label={STAGES[1].label}
            color={STAGES[1].color}
            tint={STAGES[1].tint}
            anim={card2Anim}
          />

          <Arrow anim={arrowAnim} />

          <StageCard
            image={STAGES[2].image}
            label={STAGES[2].label}
            color={STAGES[2].color}
            tint={STAGES[2].tint}
            anim={card3Anim}
          />
        </View>
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

  // ─── Header ────────────────────────────────────────────────────
  eyebrow: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  headline: {
    color: COLORS.textDark,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
    lineHeight: 36,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },

  // ─── Stages row ────────────────────────────────────────────────
  stagesRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    gap: GAP,
    marginTop: SPACING.md,
  },

  // Single stage wrapper — relative parent for badge absolute positioning
  stageWrap: {
    alignItems: "center",
    width: CARD_W,
  },

  // Image card — rounded, clipped so image respects corners, soft shadow
  imageCard: {
    width: CARD_W,
    height: CARD_H,

    // iOS shadow

    // Android
    elevation: 6,
    // subtle border for definition on light bg
  },
  bodyImage: {
    width: "100%",
    height: "100%",
  },

  // Day badge — positioned relative to stageWrap so it sits cleanly
  // on the top-right corner of the image card without clipping
  dayBadge: {
    position: "absolute",
    top: -8,
    right: 0,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
    // pop it forward
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
    // crisp white outline so it reads on any image
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  dayBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },

  // Label pill below — soft tinted bg + colored dot + colored text
  // replaces the hard black hairline border with something cohesive
  labelPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  labelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.1,
  },

  // Arrow between cards — sized to align with image vertical center
  arrowWrap: {
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    borderRadius: ARROW_SIZE / 2,
    backgroundColor: "#FFF3E8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F0DED0",
    // align with image center: half of card height minus half of arrow
    marginTop: CARD_H / 2 - ARROW_SIZE / 2,
  },
});
