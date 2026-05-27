import { NUTRITION_ICONS } from "@/src/Screens/Home/Home.static";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMealDetails } from "./MealDetails.logic";
import { MACROS_CONFIG, SECTION_TITLES, UI_TEXT } from "./MealDetails.static";
import { mealDetailStyles } from "./mealDetails.style";

export const MealDetails = () => {
  const { meal, handleBack, formatTime, getNutrients } = useMealDetails();

  /*
   * insets.top = exact pixel height of the status bar / notch.
   * We use it to position the back button so it sits just below
   * the status bar on every device — no hardcoded values needed.
   */
  const insets = useSafeAreaInsets();

  if (!meal) {
    return (
      <View style={[mealDetailStyles.container, mealDetailStyles.errorContainer]}>
        <Text style={mealDetailStyles.errorText}>{UI_TEXT.ERROR_NOT_FOUND}</Text>
      </View>
    );
  }

  const nutrients = getNutrients();

  return (
    /*
     * Layout strategy:
     * ─ Root View fills the screen including under the status bar.
     * ─ ScrollView starts at top:0 — image is full bleed to the very top.
     * ─ Back button is position:absolute over the image, top = insets.top + 8.
     *   This means it physically overlaps the image but is rendered AFTER the
     *   ScrollView in the tree, so it gets its own touch layer above it.
     * ─ No SafeAreaView needed — we handle insets manually for full control.
     */
    <View style={mealDetailStyles.container}>

      <ScrollView
        style={mealDetailStyles.scrollView}
        contentContainerStyle={[
          mealDetailStyles.contentContainer,
          { paddingBottom: insets.bottom + 48 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Full-bleed Hero Image — goes all the way to top of screen ── */}
        <View style={mealDetailStyles.imageContainer}>
          {meal.meal_image ? (
            <Image
              source={{ uri: meal.meal_image }}
              style={mealDetailStyles.mealImage}
            />
          ) : (
            <View style={mealDetailStyles.imagePlaceholder}>
              <View style={mealDetailStyles.imagePlaceholderIcon}>
                <Ionicons name="restaurant" size={38} color="#F47B20" />
              </View>
            </View>
          )}
        </View>

        {/* ── Info Card — surfaces over image ── */}
        <View style={mealDetailStyles.infoCard}>
          <Text style={mealDetailStyles.mealName}>{meal.name}</Text>
          <View style={mealDetailStyles.timeContainer}>
            <Ionicons name="time-outline" size={15} color="#B0BECA" />
            <Text style={mealDetailStyles.timeText}>
              {formatTime(meal.created_at)}
            </Text>
          </View>
        </View>

        {/* ── Calories Card ── */}
        <View style={mealDetailStyles.caloriesCard}>
          <View style={mealDetailStyles.caloriesIconContainer}>
            <Image
              source={NUTRITION_ICONS.calories}
              style={{ width: 44, height: 44 }}
              resizeMode="contain"
            />
          </View>
          <View style={mealDetailStyles.caloriesInfo}>
            <Text style={mealDetailStyles.caloriesLabel}>
              {UI_TEXT.TOTAL_CALORIES}
            </Text>
            <Text style={mealDetailStyles.caloriesValue}>
              {Math.round(meal.calories)}
              <Text style={mealDetailStyles.caloriesUnit}> kcal</Text>
            </Text>
          </View>
        </View>

        {/* ── Macronutrients ── */}
        <View style={mealDetailStyles.section}>
          <Text style={mealDetailStyles.sectionTitle}>
            {SECTION_TITLES.MACRONUTRIENTS}
          </Text>
          <View style={mealDetailStyles.macroGrid}>
            {MACROS_CONFIG.map((macro) => (
              <View key={macro.key} style={mealDetailStyles.macroCard}>
                <Image
                  source={NUTRITION_ICONS[macro.iconKey]}
                  style={mealDetailStyles.macroIcon3d}
                  resizeMode="contain"
                />
                <Text style={mealDetailStyles.macroLabel}>{macro.label}</Text>
                <Text style={mealDetailStyles.macroValue}>
                  {Math.round(meal[macro.key])}g
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Additional Nutrients ── */}
        <View style={mealDetailStyles.section}>
          <Text style={mealDetailStyles.sectionTitle}>
            {SECTION_TITLES.ADDITIONAL_NUTRIENTS}
          </Text>
          <View style={mealDetailStyles.nutrientsList}>
            {nutrients.map((nutrient, index) => (
              <View
                key={index}
                style={[
                  mealDetailStyles.nutrientRow,
                  index === nutrients.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={mealDetailStyles.nutrientLeft}>
                  <View style={mealDetailStyles.nutrientAccentBar} />
                  <Image
                    source={NUTRITION_ICONS[nutrient.iconKey]}
                    style={mealDetailStyles.nutrientIcon3d}
                    resizeMode="contain"
                  />
                  <Text style={mealDetailStyles.nutrientLabel}>
                    {nutrient.label}
                  </Text>
                </View>
                <Text style={mealDetailStyles.nutrientValue}>
                  {nutrient.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── AI Notice ── */}
        <View style={mealDetailStyles.aiNotice}>
          <Ionicons name="sparkles" size={16} color="#F47B20" />
          <Text style={mealDetailStyles.aiNoticeText}>
            {UI_TEXT.AI_NOTICE}
          </Text>
        </View>
      </ScrollView>

      {/*
       * ── Back Button — rendered AFTER ScrollView so it sits above it in z-order.
       *
       * Key insight: in React Native, siblings rendered later in JSX paint on top.
       * By placing this View after <ScrollView>, it naturally overlays the image
       * without needing zIndex fighting.
       *
       * top = insets.top + 8 → always clears the status bar / notch precisely.
       * This is the ONLY correct way to do a floating action button on a
       * full-bleed image screen in React Native.
       */}
      <TouchableOpacity
        style={[
          mealDetailStyles.backButton,
          { top: insets.top + 8 },
        ]}
        onPress={handleBack}
        activeOpacity={0.85}
      >
        <Ionicons name="arrow-back" size={22} color="#0F1A22" />
      </TouchableOpacity>

    </View>
  );
};