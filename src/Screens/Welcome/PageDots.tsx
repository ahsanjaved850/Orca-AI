import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface PageDotsProps {
  count: number;
  scrollX: SharedValue<number>;
  width: number;
  activeColor?: string;
  inactiveColor?: string;
}

const Dot = ({
  index,
  scrollX,
  width,
  activeColor,
  inactiveColor,
}: {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
  activeColor: string;
  inactiveColor: string;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const input = scrollX.value / width;
    const distance = Math.abs(input - index);

    const dotWidth = interpolate(
      distance,
      [0, 1],
      [28, 8],
      Extrapolation.CLAMP
    );

    const backgroundColor = interpolateColor(
      distance,
      [0, 1],
      [activeColor, inactiveColor]
    );

    const opacity = interpolate(
      distance,
      [0, 1],
      [1, 0.5],
      Extrapolation.CLAMP
    );

    return {
      width: dotWidth,
      backgroundColor,
      opacity,
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

export const PageDots: React.FC<PageDotsProps> = ({
  count,
  scrollX,
  width,
  activeColor = "#0A1A3D",
  inactiveColor = "#0A1A3D",
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <Dot
          key={i}
          index={i}
          scrollX={scrollX}
          width={width}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
