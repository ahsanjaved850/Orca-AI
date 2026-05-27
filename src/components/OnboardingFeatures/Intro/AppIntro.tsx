import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

const { width: SW } = Dimensions.get("window");

const IMAGES = [
  require("@/assets/images/Onboarding/intro1.png"),
  require("@/assets/images/Onboarding/intro2.png"),
  require("@/assets/images/Onboarding/intro3.png"),
] as const;

const SLIDE_DURATION = 2200; // ms each image is shown
const FADE_DURATION = 600; // ms for crossfade

interface AppIntroProps {
  isActive?: boolean;
}

export const AppIntro: React.FC<AppIntroProps> = ({ isActive = true }) => {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const currentOpacity = useRef(new Animated.Value(1)).current;
  const nextOpacity = useRef(new Animated.Value(0)).current;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(1);
  const [showNext, setShowNext] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Entrance animations ──────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;
    titleAnim.setValue(0);

    Animated.spring(titleAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  // ── Crossfade image cycle — runs once per activation ────────────
  useEffect(() => {
    // Reset on slide exit
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      currentOpacity.setValue(1);
      nextOpacity.setValue(0);
      setCurrentIdx(0);
      setNextIdx(1);
      setShowNext(false);
      return;
    }

    // Track how many transitions have fired
    let step = 0;
    const totalSteps = IMAGES.length - 1; // 2 transitions for 3 images

    const cycle = () => {
      step++;

      setNextIdx((cur) => (cur + 1) % IMAGES.length);
      setShowNext(true);
      nextOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(nextOpacity, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(currentOpacity, {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIdx((cur) => (cur + 1) % IMAGES.length);
        currentOpacity.setValue(1);
        nextOpacity.setValue(0);
        setShowNext(false);

        // Stop after one full cycle (all images shown once)
        if (step >= totalSteps && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      });
    };

    intervalRef.current = setInterval(cycle, SLIDE_DURATION);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
            s.headline,
            {
              opacity: titleAnim,
              transform: [
                {
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Scan every meal easily with{"\n"}Orca calorie tracker
        </Animated.Text>

        {/* ── Crossfade image frame ── */}
        <View style={s.imageWrap}>
          {/* Current image */}
          <Animated.Image
            source={IMAGES[currentIdx]}
            resizeMode="contain"
            style={[s.image, { opacity: currentOpacity }]}
          />

          {/* Next image fades in on top during transition */}
          {showNext && (
            <Animated.Image
              source={IMAGES[nextIdx]}
              resizeMode="contain"
              style={[s.image, s.imageOverlay, { opacity: nextOpacity }]}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
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

  // Image frame — both images stack absolutely inside
  imageWrap: {
    width: SW * 0.82,
    flex: 1,
    marginBottom: SPACING.md,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
