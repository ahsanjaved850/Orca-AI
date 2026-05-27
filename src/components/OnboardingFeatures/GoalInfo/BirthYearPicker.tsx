import { COLORS, SPACING } from "@/src/Screens/Onboarding/Onboarding.style";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SW } = Dimensions.get("window");

interface BirthYearPickerProps {
  onValidationChange?: (isValid: boolean) => void;
}

// ── Picker config ──────────────────────────────────────────────────
const ITEM_H = 68; // Bigger rows like Eato
const VISIBLE = 7; // Show 7 items, center is selected
const PICKER_H = ITEM_H * VISIBLE;
const PAD = ITEM_H * 3; // top/bottom padding so center item aligns

const YEARS = Array.from({ length: 76 }, (_, i) => 1940 + i); // 1940–2015
const DEFAULT_YEAR = 2000;

export const BirthYearPicker: React.FC<BirthYearPickerProps> = ({
  onValidationChange,
}) => {
  const [selected, setSelected] = useState(DEFAULT_YEAR);
  const listRef = useRef<FlatList>(null);

  // Always valid — has a default
  useEffect(() => {
    onValidationChange?.(true);
  }, []);

  // Scroll to default on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const idx = YEARS.indexOf(selected);
      if (idx >= 0) {
        listRef.current?.scrollToOffset({
          offset: idx * ITEM_H,
          animated: false,
        });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const idx = Math.round(y / ITEM_H);
      const clamped = Math.max(0, Math.min(idx, YEARS.length - 1));
      if (YEARS[clamped] !== selected) {
        setSelected(YEARS[clamped]);
        setGlobalBirthYear(YEARS[clamped]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [selected],
  );

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
      listRef.current?.scrollToOffset({ offset: idx * ITEM_H, animated: true });
    },
    [],
  );

  const renderItem = ({ item }: { item: number }) => {
    const isSel = item === selected;
    const dist = Math.abs(item - selected);
    // Fade out items further from center
    const opacity = dist === 0 ? 1 : dist === 1 ? 0.5 : dist === 2 ? 0.3 : 0.15;

    return (
      <View style={s.item}>
        <Text style={[s.itemText, isSel && s.itemTextSelected, { opacity }]}>
          {item}
        </Text>
      </View>
    );
  };

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_H,
    offset: ITEM_H * index,
    index,
  });

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

      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>When is your birthyear?</Text>
      </View>

      {/* Scroll Picker */}
      <View style={s.pickerWrap}>
        {/* Selection highlight band */}
        <View style={s.selectionBand} />

        <FlatList
          ref={listRef}
          data={YEARS}
          renderItem={renderItem}
          keyExtractor={(item) => String(item)}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_H}
          decelerationRate="fast"
          onScroll={onScroll}
          onMomentumScrollEnd={onMomentumEnd}
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
          contentContainerStyle={{ paddingVertical: PAD }}
        />
      </View>
    </View>
  );
};

// ── Shared birth year for HeightPicker API call ────────────────────
let _selectedBirthYear = DEFAULT_YEAR;
export const getSelectedBirthYear = () => _selectedBirthYear;
export const setGlobalBirthYear = (year: number) => {
  _selectedBirthYear = year;
};

// ── Styles ─────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.backgroundGradientTop,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    alignItems: "center",
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    letterSpacing: -0.4,
  },

  // Picker
  pickerWrap: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  selectionBand: {
    position: "absolute",
    top: PAD,
    left: SPACING.md,
    right: SPACING.md,
    height: ITEM_H,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: "#FFF3E8",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    zIndex: -1,
  },

  // Items
  item: {
    height: ITEM_H,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 24,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  itemTextSelected: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: -1,
  },
});
