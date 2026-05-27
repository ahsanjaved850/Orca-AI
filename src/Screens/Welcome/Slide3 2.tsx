import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// 🖼 Make sure these paths match your project structure.
// If your `assets` folder lives at a different depth relative to this file,
// only the relative `../../../../` portion needs adjustment.
const ICON_CAMERA = require("@/assets/images/icons/camera.png");
const ICON_PROGRESS = require("@/assets/images/icons/progress.png");
const ICON_TARGET = require("@/assets/images/icons/target.png");

interface Props {
  isActive: boolean;
  onGetStarted: () => void;
  onLogin: () => void;
}

interface StepCardProps {
  number: string;
  icon: ImageSourcePropType;
  title: string;
  subtitle: string;
  delay: number;
}

const StepCard: React.FC<StepCardProps> = ({
  number,
  icon,
  title,
  subtitle,
  delay,
}) => (
  <Animated.View
    entering={FadeInUp.duration(500).delay(delay)}
    style={styles.card}
  >
    {/* Icon circle with small step badge */}
    <View style={styles.iconWrap}>
      <View style={styles.iconCircle}>
        <Image source={icon} style={styles.iconImage} resizeMode="contain" />
      </View>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>{number}</Text>
      </View>
    </View>

    {/* Text */}
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  </Animated.View>
);

export const Slide3: React.FC<Props> = ({
  isActive,
  onGetStarted,
  onLogin,
}) => {
  const confettiRef = useRef<ConfettiCannon | null>(null);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (isActive && !hasFiredRef.current) {
      hasFiredRef.current = true;
      const t = setTimeout(() => {
        confettiRef.current?.start();
      }, 250);
      return () => clearTimeout(t);
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFF4C2", "#FFFBEA", "#FFFFFF"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Confetti — fires once when slide becomes active */}
      {isActive && (
        <ConfettiCannon
          ref={(ref) => {
            confettiRef.current = ref;
          }}
          count={140}
          origin={{ x: SCREEN_W / 2, y: -10 }}
          autoStart={false}
          fadeOut
          fallSpeed={3200}
          explosionSpeed={400}
          colors={["#FC6146", "#FFB627", "#FFD93D", "#0A1A3D", "#FF8A1F"]}
        />
      )}

      <View style={styles.content}>
        {/* Headline */}
        {isActive && (
          <Animated.View
            entering={FadeInDown.duration(600)}
            style={styles.headlineBlock}
          >
            <Text style={styles.headlineSmall}>Let's start the</Text>
            <Text style={styles.headlineHuge}>EASIER</Text>
            <Text style={styles.headlineHugeNavy}>Weight Loss Journey</Text>
          </Animated.View>
        )}

        {/* Three-step recap */}
        {isActive && (
          <View style={styles.stepsBlock}>
            <StepCard
              number="1"
              icon={ICON_CAMERA}
              title="Snap your meal"
              subtitle="AI recognizes the food instantly"
              delay={300}
            />
            <StepCard
              number="2"
              icon={ICON_PROGRESS}
              title="Track your day"
              subtitle="See calories, macros, and progress"
              delay={450}
            />
            <StepCard
              number="3"
              icon={ICON_TARGET}
              title="Hit your goal"
              subtitle="Lose weight"
              delay={600}
            />
          </View>
        )}

        {/* CTA */}
        {isActive && (
          <Animated.View
            entering={FadeInUp.duration(500).delay(800)}
            style={styles.ctaBlock}
          >
            <Pressable
              onPress={onGetStarted}
              style={({ pressed }) => [
                styles.ctaButton,
                pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 },
              ]}
              android_ripple={{ color: "rgba(255,255,255,0.15)" }}
            >
              <Text style={styles.ctaText}>Get Started</Text>
            </Pressable>

            <Pressable
              onPress={onLogin}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
              ]}
            >
              <Text style={styles.loginButtonText}>Already a user?</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_W,
    height: SCREEN_H,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: SCREEN_H * 0.08,
    paddingBottom: 40,
    justifyContent: "space-between",
  },

  // Headline
  headlineBlock: {
    alignItems: "center",
    marginTop: 8,
  },
  headlineSmall: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A1A3D",
    marginBottom: 6,
  },
  headlineHuge: {
    fontSize: 56,
    fontWeight: "900",
    color: "#FC6146",
    letterSpacing: -1.5,
    lineHeight: 60,
  },
  headlineHugeNavy: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0A1A3D",
    letterSpacing: -1,
    lineHeight: 38,
    marginTop: 4,
  },

  // Steps
  stepsBlock: {
    gap: 14,
    marginVertical: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    paddingRight: 20,
    gap: 16,
    shadowColor: "#0A1A3D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(10, 26, 61, 0.06)",
  },

  // Icon + badge composition
  iconWrap: {
    width: 56,
    height: 56,
    position: "relative",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 28,
    // backgroundColor: "#FFF1ED", // soft tint of the orange
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(252, 97, 70, 0.18)",
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  stepBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FC6146",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#FC6146",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 14,
  },

  // Card text
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0A1A3D",
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    lineHeight: 18,
  },

  // CTA
  ctaBlock: {
    alignItems: "center",
    gap: 16,
  },
  ctaButton: {
    backgroundColor: "#0A1A3D",
    width: "100%",
    paddingVertical: 20,
    borderRadius: 32,
    alignItems: "center",
    shadowColor: "#0A1A3D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  loginButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: "center",
    backgroundColor: "#F47B20",
    shadowColor: "#D96A12",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});
