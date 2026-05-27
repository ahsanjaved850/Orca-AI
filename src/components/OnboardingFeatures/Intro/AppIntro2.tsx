import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

const { width: SW } = Dimensions.get("window");

// Animated SVG ring
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RING_SIZE = SW * 0.62;
const RADIUS = (RING_SIZE - 24) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Demo calorie values — in production read from user profile
const INTAKE_CAL = 1942;
const GOAL_CAL = 2000;
const REMAINING = Math.max(0, GOAL_CAL - INTAKE_CAL);
const PROGRESS = Math.min(INTAKE_CAL / GOAL_CAL, 1); // 0→1

const CalorieRing: React.FC<{ animValue: Animated.Value }> = ({
  animValue,
}) => {
  const strokeDashoffset = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, CIRCUMFERENCE * (1 - PROGRESS)],
  });

  return (
    <Svg width={RING_SIZE} height={RING_SIZE}>
      {/* Track — warm peach */}
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke="#F0DED0"
        strokeWidth={14}
        fill="none"
      />
      {/* Progress arc — brand orange */}
      <AnimatedCircle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RADIUS}
        stroke={COLORS.primary}
        strokeWidth={14}
        fill="none"
        strokeDasharray={`${CIRCUMFERENCE}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
      />
    </Svg>
  );
};

//  Animated counter
const useCountUp = (
  target: number,
  duration: number,
  delay: number,
  resetKey: number,
) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(0); // reset to 0 before replaying
    const timeout = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay, resetKey]);
  return value;
};

// Main Component
interface AppIntro2Props {
  isActive?: boolean;
}

export const AppIntro2: React.FC<AppIntro2Props> = ({ isActive = true }) => {
  const [animKey, setAnimKey] = React.useState(0);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const noteAnim = useRef(new Animated.Value(0)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;

  // Animated counters
  const displayRemaining = useCountUp(REMAINING, 1200, 600, animKey);
  const displayIntake = useCountUp(INTAKE_CAL, 1200, 600, animKey);
  const displayGoal = useCountUp(GOAL_CAL, 1000, 600, animKey);

  useEffect(() => {
    if (!isActive) return;

    // Reset all animated values so they replay from scratch
    headerAnim.setValue(0);
    cardAnim.setValue(0);
    noteAnim.setValue(0);
    ringAnim.setValue(0);
    setAnimKey((k) => k + 1);

    // ── UI entrance animations — useNativeDriver: true ──────────────
    Animated.stagger(150, [
      Animated.spring(headerAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 44,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(noteAnim, {
        toValue: 1,
        tension: 48,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // ── Ring animation — separate, useNativeDriver: false ────────────
    // SVG strokeDashoffset cannot use the native driver.
    // Delayed 500ms so the card is visible before the arc starts.
    const ringTimeout = setTimeout(() => {
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, 500);

    return () => clearTimeout(ringTimeout);
  }, [isActive]);

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
        {/* ── Headline ── */}
        <Animated.Text
          style={[
            s.title,
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
          Stay below your target to{"\n"}create a calorie deficit
        </Animated.Text>

        {/* ── Calorie Ring Card ── */}
        <Animated.View
          style={[
            s.card,
            {
              opacity: cardAnim,
              transform: [
                {
                  scale: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.94, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Ring + center text */}
          <View style={s.ringWrap}>
            <CalorieRing animValue={ringAnim} />

            {/* Center label */}
            <View style={s.ringCenter}>
              <Text style={s.ringLabel}>You Can Eat</Text>
              <Text style={s.ringValue}>{displayRemaining}</Text>
              <Text style={s.ringUnit}>Cal</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={s.divider} />

          {/* Intake / Goal row */}
          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Text style={s.statLabel}>Calorie Intake</Text>
              <Text style={s.statValue}>{displayIntake} Cal</Text>
            </View>
            <View style={s.statSep} />
            <View style={s.statItem}>
              <Text style={s.statLabel}>Goal Calories</Text>
              <Text style={s.statValue}>{displayGoal} Cal</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Warning note ── */}
        <Animated.View
          style={[
            s.noteCard,
            {
              opacity: noteAnim,
              transform: [
                {
                  translateY: noteAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={s.noteTextWrap}>
            <Text style={s.noteText}>
              Watch out, you're about to hit your{" "}
              <Text style={s.noteHighlight}>Calorie Limit</Text>
            </Text>
          </View>
          <Text style={s.noteEmoji}>🧐</Text>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },

  // ─── Title ────────────────────────────────────────────────────────
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },

  // ─── Card ─────────────────────────────────────────────────────────
  card: {
    backgroundColor: "#FFFAF6",
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#F0DED0",
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    marginBottom: SPACING.lg,
  },

  // ─── Ring ─────────────────────────────────────────────────────────
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ringLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  ringValue: {
    fontSize: 52,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -2,
    lineHeight: 58,
  },
  ringUnit: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // ─── Stats row ────────────────────────────────────────────────────
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#F0DED0",
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  statSep: {
    width: 1,
    height: 36,
    backgroundColor: "#F0DED0",
  },

  // ─── Warning note card ────────────────────────────────────────────
  noteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFAF6",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#F0DED0",
    padding: SPACING.md,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  noteTextWrap: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  noteText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    lineHeight: 22,
  },
  noteHighlight: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  noteEmoji: {
    fontSize: 44,
  },
});
