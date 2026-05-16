import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SW } = Dimensions.get("window");

// ─── Review data ───────────────────────────────────────────────────────────
const REVIEWS = [
  {
    image: require("@/assets/images/Onboarding/review1.png"),
    name: "James K.",
    quote:
      "I never thought tracking could be this easy. Orca changed everything for me!",
    stars: 5,
  },
  {
    image: require("@/assets/images/Onboarding/review2.png"),
    name: "Sarah M.",
    quote:
      "The AI scan is insane. I just snap my meal and it does the rest. Game changer.",
    stars: 5,
  },
  {
    image: require("@/assets/images/Onboarding/review3.png"),
    name: "Tom W.",
    quote:
      "Finally an app that actually works. I feel confident in my body again.",
    stars: 5,
  },
  {
    image: require("@/assets/images/Onboarding/review4.png"),
    name: "Natalie R.",
    quote:
      "Simple, fast, and accurate. My macros have never been this on point.",
    stars: 5,
  },
] as const;

const CARD_W = SW * 0.72;
const CARD_GAP = 14;
const SCROLL_INTERVAL_MS = 2800;

// ─── Star Row ──────────────────────────────────────────────────────────────
const Stars: React.FC<{ count: number }> = ({ count }) => (
  <View style={s.starsRow}>
    {Array.from({ length: count }).map((_, i) => (
      <Text key={i} style={s.star}>
        ★
      </Text>
    ))}
  </View>
);

// ─── Main Component ────────────────────────────────────────────────────────
export const TransformationReviews: React.FC = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const headerAnim = useRef(new Animated.Value(0)).current;

  // Entrance animation for header
  useEffect(() => {
    Animated.spring(headerAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  // Auto-scroll right to left every SCROLL_INTERVAL_MS
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % REVIEWS.length;
        scrollRef.current?.scrollTo({
          x: next * (CARD_W + CARD_GAP),
          animated: true,
        });
        return next;
      });
    }, SCROLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.backgroundGradientTop}
      />

      {/* Peach → cream → white gradient */}
      <LinearGradient
        colors={[
          COLORS.backgroundGradientTop,
          COLORS.backgroundGradientMid,
          COLORS.backgroundGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Header ── */}
      <Animated.View
        style={[
          s.header,
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
        <Text style={s.title}>They did it So can{"\n"} You</Text>
        <Text style={s.subtitle}>
          Join community of users who transformed their health with Us
        </Text>
      </Animated.View>

      {/* ── Scrolling Review Cards ── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={CARD_W + CARD_GAP}
        contentContainerStyle={s.scrollContent}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(
            e.nativeEvent.contentOffset.x / (CARD_W + CARD_GAP),
          );
          setActiveIndex(idx);
        }}
      >
        {REVIEWS.map((review, i) => (
          <View key={i} style={[s.card, i === activeIndex && s.cardActive]}>
            {/* Before/After transformation image */}
            <View style={s.imageWrap}>
              <Image source={review.image} style={s.image} resizeMode="cover" />
            </View>

            {/* Review content */}
            <View style={s.reviewBody}>
              <Stars count={review.stars} />
              <Text style={s.quote}>"{review.quote}"</Text>
              <View style={s.reviewer}>
                <View style={s.reviewerDot} />
                <Text style={s.reviewerName}>{review.name}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ── Dot indicators ── */}
      <View style={s.dots}>
        {REVIEWS.map((_, i) => (
          <View
            key={i}
            style={[s.dot, i === activeIndex ? s.dotActive : s.dotInactive]}
          />
        ))}
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

  // ─── Header ──────────────────────────────────────────────────────
  header: {
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  badge: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "black",
    textAlign: "center",
    lineHeight: 20,
  },

  // ─── Scroll ───────────────────────────────────────────────────────
  scrollContent: {
    paddingLeft: (SW - CARD_W) / 2,
    paddingRight: (SW - CARD_W) / 2,
    gap: CARD_GAP,
    alignItems: "flex-start",
  },

  // ─── Card ─────────────────────────────────────────────────────────
  card: {
    width: CARD_W,
    backgroundColor: "#FFFAF6",
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#F0DED0",
    overflow: "hidden",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 5,
    opacity: 0.75, // non-active cards slightly faded
    transform: [{ scale: 0.96 }],
  },
  cardActive: {
    opacity: 1,
    transform: [{ scale: 1 }],
    borderColor: COLORS.primary,
    shadowOpacity: 0.16,
  },

  // ─── Image ────────────────────────────────────────────────────────
  imageWrap: {
    width: "100%",
    height: CARD_W * 0.9,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  // Weight loss overlay badge — bottom-left of image
  lossBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: "#C05010",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  lossValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  lossDays: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
  },

  // ─── Review body ──────────────────────────────────────────────────
  reviewBody: {
    padding: 16,
    gap: 8,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    fontSize: 14,
    color: COLORS.primary,
  },
  quote: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontStyle: "italic",
  },
  reviewer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  reviewerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  // ─── Dots ─────────────────────────────────────────────────────────
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: "#F0DED0",
  },
});
