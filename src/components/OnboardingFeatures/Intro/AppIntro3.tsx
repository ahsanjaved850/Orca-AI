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
    barColor: "#FF6B00", // vivid orange-red — over limit
    isOver: true,
  },
  {
    label: "Net Carbs",
    value: 160,
    goal: 180,
    barColor: "#00C48C", // vivid teal-green
    isOver: false,
  },
  {
    label: "Protein",
    value: 20,
    goal: 72,
    barColor: "#FF3B5C", // vivid red — critically low
    isOver: false,
    isLow: true,
  },
  {
    label: "Fiber",
    value: 24,
    goal: 30,
    barColor: "#845EF7", // vivid purple
    isOver: false,
  },
] as const;

// ─── Animated counter hook ─────────────────────────────────────────────────
const useCountUp = (
  target: number,
  duration: number,
  delay: number,
  resetKey: number,
) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    setVal(0); // reset before replaying
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
  }, [resetKey]);
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
  resetKey?: number;
  bgAnim?: Animated.Value;
}> = ({
  label,
  value,
  goal,
  barColor,
  isOver,
  isLow,
  barAnim,
  elevated,
  resetKey = 0,
  bgAnim,
}) => {
  const displayVal = useCountUp(value, 1000, 500, resetKey);
  const progress = Math.min(value / goal, 1);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", `${progress * 100}%`],
  });

  // Always use Animated.View so TypeScript is happy — bg color animates when bgAnim provided
  const animatedBg = bgAnim
    ? bgAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#FFFFFF", "#FFF0F0"],
      })
    : undefined;

  return (
    <Animated.View
      style={[
        row.wrap,
        elevated && row.elevated,
        animatedBg ? { backgroundColor: animatedBg } : null,
      ]}
    >
      {/* Label + value */}
      <View style={row.top}>
        <View style={row.labelWrap}>
          <View
            style={[
              row.colorDot,
              { backgroundColor: isOver ? "#FF3B5C" : barColor },
            ]}
          />
          <Text style={row.label}>{label}</Text>
        </View>
        <View style={row.valueWrap}>
          {(isOver || isLow) && <Text style={row.warningIcon}>⚠️</Text>}
          <Text style={[row.value, isOver && { color: "#FF3B5C" }]}>
            {displayVal}
          </Text>
          <Text style={row.goal}>/{goal}g</Text>
        </View>
      </View>

      {/* Progress bar track */}
      <View
        style={[
          row.track,
          { backgroundColor: (isOver ? "#FF3B5C" : barColor) + "22" },
        ]}
      >
        <Animated.View
          style={[
            row.fill,
            { width: barWidth, backgroundColor: isOver ? "#FF3B5C" : barColor },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const row = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5EDE0",
  },
  elevated: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 0,
    backgroundColor: "#FFFFFF",
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  labelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F1A22",
    letterSpacing: -0.2,
  },
  valueWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  warningIcon: {
    fontSize: 13,
  },
  value: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F1A22",
    letterSpacing: -0.5,
  },
  goal: {
    fontSize: 13,
    fontWeight: "500",
    color: "#B0BECA",
  },
  track: {
    height: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 8,
  },
});

// ─── Main Component ────────────────────────────────────────────────────────
interface AppIntro3Props {
  isActive?: boolean;
}

export const AppIntro3: React.FC<AppIntro3Props> = ({ isActive = true }) => {
  const [animKey, setAnimKey] = React.useState(0);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const noteAnim = useRef(new Animated.Value(0)).current;

  // One bar anim per macro — must be non-native (width %)
  const barAnims = useRef(MACROS.map(() => new Animated.Value(0))).current;
  // Background color animations — MUST stay useNativeDriver:false only
  // Fresh refs that never touch the native driver
  const fatBgAnim = useRef(new Animated.Value(0)).current;
  const proteinBgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isActive) return;

    // Reset everything
    headerAnim.setValue(0);
    cardAnim.setValue(0);
    noteAnim.setValue(0);
    barAnims.forEach((a) => a.setValue(0));
    // bg anims reset in separate useEffect below
    setAnimKey((k) => k + 1);

    // Entrance — native driver
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

    // Progress bars — non-native
    const tBars = setTimeout(() => {
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

    return () => {
      clearTimeout(tBars);
    };
  }, [isActive]);

  // ── Background color animations — separate effect, useNativeDriver:false ONLY
  useEffect(() => {
    fatBgAnim.setValue(0);
    proteinBgAnim.setValue(0);
    if (!isActive) return;

    const tFat = setTimeout(() => {
      Animated.timing(fatBgAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, 1300);

    const tProtein = setTimeout(() => {
      Animated.timing(proteinBgAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, 1650);

    return () => {
      clearTimeout(tFat);
      clearTimeout(tProtein);
    };
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
                resetKey={animKey}
                bgAnim={
                  "isLow" in macro && macro.isLow
                    ? proteinBgAnim
                    : "isOver" in macro && macro.isOver
                      ? fatBgAnim
                      : undefined
                }
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
            Watch out for the fats!{" "}
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
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.8,
    lineHeight: 34,
    marginBottom: SPACING.md,
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
    borderWidth: 8,
    borderColor: "#F47B20",
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
    borderBottomRightRadius: 20,
    height: 320,
    flexDirection: "column",
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
    marginTop: SPACING.md,
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
