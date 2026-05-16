import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ─── Macro data ────────────────────────────────────────────────────────────
// Fat is set above limit (55/50g) to trigger the warning state
const MACROS = [
  {
    label: "Fat",
    value: 55,
    goal: 50,
    barColor: "#F59E0B", // amber
    isOver: true,
  },
  {
    label: "Net Carbs",
    value: 160,
    goal: 180,
    barColor: "#2ECC71", // green
    isOver: false,
  },
  {
    label: "Protein",
    value: 20,
    goal: 72,
    barColor: "#EF4444", // red — low
    isOver: false,
    isLow: true,
  },
  {
    label: "Fiber",
    value: 24,
    goal: 30,
    barColor: "#F47B20", // brand orange
    isOver: false,
  },
] as const;

// ─── Animated counter hook ─────────────────────────────────────────────────
const useCountUp = (target: number, duration: number, delay: number) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, []);
  return val;
};

// ─── Single macro row ──────────────────────────────────────────────────────
const MacroRow: React.FC<{
  label: string;
  value: number;
  goal: number;
  barColor: string;
  isOver?: boolean;
  isLow?: boolean;
  barAnim: Animated.Value;
  elevated?: boolean;
}> = ({ label, value, goal, barColor, isOver, isLow, barAnim, elevated }) => {
  const displayVal = useCountUp(value, 1000, 500);
  const progress = Math.min(value / goal, 1);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", `${progress * 100}%`],
  });

  return (
    <View style={[row.wrap, elevated && row.elevated]}>
      {/* Label + value */}
      <View style={row.top}>
        <Text style={row.label}>{label}</Text>
        <View style={row.valueWrap}>
          {(isOver || isLow) && <Text style={row.warningIcon}>⚠️</Text>}
          <Text style={[row.value, isOver && { color: "#EF4444" }]}>
            {displayVal}
          </Text>
          <Text style={row.goal}>/{goal}g</Text>
        </View>
      </View>

      {/* Progress bar track */}
      <View style={row.track}>
        <Animated.View
          style={[
            row.fill,
            { width: barWidth, backgroundColor: isOver ? "#EF4444" : barColor },
          ]}
        />
      </View>
    </View>
  );
};

const row = StyleSheet.create({
  wrap: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#FAF0E8",
  },
  elevated: {
    // Protein row pops out like the reference — extra shadow
    borderRadius: 16,
    marginHorizontal: -4,
    marginVertical: 2,
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 10,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F1A22",
  },
  valueWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  warningIcon: {
    fontSize: 16,
  },
  value: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F1A22",
  },
  goal: {
    fontSize: 16,
    fontWeight: "500",
    color: "#B0BECA",
  },
  track: {
    height: 8,
    backgroundColor: "#F0DED0",
    borderRadius: 6,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 6,
  },
});

// ─── Main Component ────────────────────────────────────────────────────────
export const AppIntro3: React.FC = () => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const noteAnim = useRef(new Animated.Value(0)).current;

  // One bar anim per macro — must be non-native (width %)
  const barAnims = useRef(MACROS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // UI entrance — native driver
    Animated.stagger(140, [
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

    // Progress bars — non-native (animating % width)
    // Run separately after 500ms delay so card is visible first
    const t = setTimeout(() => {
      Animated.stagger(
        120,
        barAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 900,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          }),
        ),
      ).start();
    }, 500);

    return () => clearTimeout(t);
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
          Master your macros for{"\n"}balance nutrition
        </Animated.Text>

        {/* ── Nutrition Facts Card ── */}
        <Animated.View
          style={[
            s.outerCard,
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
          {/* Orange header bar */}
          <View style={s.cardHeader}>
            <Text style={s.cardHeaderText}>Macros Facts</Text>
          </View>

          {/* White inner card with macro rows */}
          <View style={s.innerCard}>
            {MACROS.map((macro, i) => (
              <MacroRow
                key={macro.label}
                label={macro.label}
                value={macro.value}
                goal={macro.goal}
                barColor={macro.barColor}
                isOver={"isOver" in macro ? macro.isOver : false}
                isLow={"isLow" in macro ? macro.isLow : false}
                barAnim={barAnims[i]}
                elevated={"isLow" in macro && macro.isLow}
              />
            ))}
          </View>
        </Animated.View>

        {/* ── Note card ── */}
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
          <Text style={s.noteText}>
            Time to boost your protein!{" "}
            <Text style={s.noteHighlight}>Track smarter.</Text>
          </Text>
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

  // Title
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },

  // Outer orange card — matches reference exactly
  outerCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: SPACING.lg,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  cardHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardHeaderText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  innerCard: {
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20, // fixed height to match reference and show full bars
  },

  // Note card
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
    marginTop: SPACING.xxxl,
  },
  noteText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    lineHeight: 22,
    paddingRight: SPACING.sm,
  },
  noteHighlight: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  noteEmoji: {
    fontSize: 44,
  },
});
