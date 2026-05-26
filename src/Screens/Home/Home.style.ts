import { Dimensions, StyleSheet } from "react-native";

const { width: SW } = Dimensions.get("window");

// ─── Theme Palette ──────────────────────────────────────────────────────────
// Mirrors Login screen: peach #FFE0C2 → white #FFFFFF gradient language
// Primary accent: #F47B20 (vibrant warm orange)
// Cards: warm off-white surfaces, peach-tinted borders, orange-glow shadows

export const GRADIENT = {
  top: "#FFE0C2",
  mid: "#FFF0E4",
  bottom: "#FFFFFF",
};

const C = {
  bg: "#FFFFFF",
  bgCard: "#FFFAF6",
  bgCardAlt: "#FFF5EC",
  bgGray: "#F5EDE0",
  bgPeach: "#FFE0C2",

  textDark: "#0F1A22",
  text: "#1C2B36",
  textSec: "#7A8A98",
  textLight: "#B0BECA",
  textOnDark: "#FFFFFF",

  primary: "#F47B20",
  primaryDark: "#D96A12",
  primaryLight: "#FFF3E8",
  primaryMuted: "#FFE0C2",

  secondary: "#1C2B36",
  accent: "#F47B20",

  border: "#F0DED0",
  borderLight: "#FAF0E8",
  divider: "#F5E8DC",

  success: "#2ECC71",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
};

export const homeStyles = StyleSheet.create({
  // ─── Shell ───────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: C.bgPeach,
  },
  body: {
    flex: 1,
    backgroundColor: C.bg,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  // ─── Header ──────────────────────────────────────────────────────────────
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: C.bgPeach,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },

  greetingContainer: { marginTop: 4 },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: C.textDark,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 14,
    color: C.textSec,
    fontWeight: "500",
  },

  // ─── Daily Summary Card ──────────────────────────────────────────────────
  dailySummaryCard: {
    backgroundColor: C.bgCard,
    borderRadius: 28,
    marginTop: 12,
    padding: 22,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.3,
  },
  summaryTitleEmoji: {
    fontSize: 18,
    marginRight: 7,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.primaryMuted,
  },
  streakText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.primary,
    marginLeft: 4,
  },
  moreButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.bgGray,
    alignItems: "center",
    justifyContent: "center",
  },
  moreButtonText: {
    fontSize: 16,
    color: C.textSec,
    fontWeight: "800",
    letterSpacing: 2,
  },

  // ─── Calorie Ring ────────────────────────────────────────────────────────
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  calorieRingOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 12,
    borderColor: C.borderLight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.bgCard,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 8,
  },
  calorieRingInner: {
    alignItems: "center",
  },
  calorieCount: {
    fontSize: 44,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -2,
  },
  calorieCanEatLabel: {
    fontSize: 13,
    color: C.textLight,
    fontWeight: "600",
    marginTop: 2,
    letterSpacing: 0.3,
  },
  calorieTarget: {
    fontSize: 12,
    color: C.textLight,
    fontWeight: "500",
    marginTop: 2,
  },
  progressLabel: {
    fontSize: 11,
    color: C.textLight,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 4,
  },

  calorieSubRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 32,
  },
  calorieSubItem: {
    alignItems: "center",
  },
  calorieSubValue: {
    fontSize: 22,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.5,
  },
  calorieSubLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textLight,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  calorieSubDivider: {
    width: 1,
    height: 32,
    backgroundColor: C.border,
  },

  // ─── Macro Summary Row ───────────────────────────────────────────────────
  macroSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: C.borderLight,
  },
  macroSummaryItem: {
    alignItems: "flex-start",
    flex: 1,
  },
  macroSummaryLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textDark,
    marginBottom: 8,
  },
  macroSummaryDotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },
  macroSummaryDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  macroSummaryBar: {
    height: 8,
    backgroundColor: C.borderLight,
    borderRadius: 6,
    width: "90%",
    overflow: "hidden",
  },
  macroSummaryBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  macroSummaryValue: {
    fontSize: 11,
    color: C.textLight,
    fontWeight: "600",
  },

  // ─── Nutrient Cards ──────────────────────────────────────────────────────
  macroSection: {
    marginTop: 0,
  },
  macroHeader: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textDark,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  macroNutrients: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  nutrientsCard: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: C.bgCardAlt,
    borderRadius: 20,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  // 3D image icon — replaces the coloured Ionicons square
  nutrientIcon3d: {
    width: 52,
    height: 52,
    marginBottom: 10,
  },
  nutrientIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  proteinIcon: { backgroundColor: "#FEE2E2" },
  carbsIcon: { backgroundColor: "#DBEAFE" },
  fatsIcon: { backgroundColor: "#FEF3C7" },
  sugarIcon: { backgroundColor: "#FDE2E4" },
  sodiumIcon: { backgroundColor: "#E9D5FF" },
  fiberIcon: { backgroundColor: "#D1FAE5" },
  nutrientsLabel: {
    fontSize: 10,
    color: C.textSec,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  nutrientsValue: {
    fontSize: 24,
    fontWeight: "800",
    color: C.textDark,
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  nutrientsTotal: {
    fontSize: 11,
    color: C.textLight,
    fontWeight: "500",
  },
  nutrientsProgress: {
    marginTop: 10,
    width: "100%",
    height: 6,
    backgroundColor: C.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  nutrientsProgressBar: {
    height: "100%",
    borderRadius: 4,
  },

  // ─── Floating AI Scan FAB — right-bottom, pill with icon + text ──────────
  floatingButtonWrap: {
    position: "absolute",
    right: 20,
    // bottom set inline via useSafeAreaInsets in Home.tsx
    pointerEvents: "box-none",
  },
  floatingAiButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primary,
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 50,
    gap: 10,
    // Orange glow shadow for lift
    shadowColor: "#C05010",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 14,
    // Semi-transparent white inner ring — premium edge detail
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  floatingAiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingAiText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.textOnDark,
    letterSpacing: 0.3,
  },

  // ─── Legacy Add Meal ─────────────────────────────────────────────────────
  addMealContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  addMealButton: {
    backgroundColor: C.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  addMealButtonPressed: {
    backgroundColor: C.primaryDark,
    transform: [{ scale: 0.95 }],
  },
  addMealIcon: {
    color: C.textOnDark,
    fontSize: 28,
    fontWeight: "300",
  },
  addMealText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: C.textSec,
  },

  // ─── Meal History ────────────────────────────────────────────────────────
  mealHistorySection: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.5,
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: "700",
    color: C.primary,
  },

  // Meal Card
  mealItem: {
    backgroundColor: C.bgCard,
    borderRadius: 22,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  mealItemContent: {
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
  },
  mealAccentBar: {
    width: 4,
    backgroundColor: C.primary,
    borderRadius: 4,
    marginRight: 12,
    alignSelf: "stretch",
  },
  mealImageContainer: {
    width: 78,
    height: 78,
    borderRadius: 18,
    marginRight: 14,
    overflow: "hidden",
    backgroundColor: C.bgGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mealImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mealPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: C.bgGray,
    alignItems: "center",
    justifyContent: "center",
  },
  mealInfo: {
    flex: 1,
    justifyContent: "center",
  },
  mealTime: {
    fontSize: 11,
    color: C.textLight,
    fontWeight: "600",
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  mealName: {
    fontSize: 16,
    color: C.textDark,
    fontWeight: "800",
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 7,
  },
  macrosInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  macroInlineItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  macroInlineText: {
    fontSize: 12,
    color: C.textSec,
    fontWeight: "600",
  },

  // ─── Empty State ─────────────────────────────────────────────────────────
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
    backgroundColor: C.primaryLight,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: C.primaryMuted,
    borderStyle: "dashed",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 14,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textDark,
    marginBottom: 6,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  emptyStateText: {
    fontSize: 14,
    color: C.textSec,
    textAlign: "center",
    lineHeight: 21,
  },

  // ─── Modal ───────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 26, 34, 0.55)",
  },
  modalContent: {
    backgroundColor: C.bgCard,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 4,
    paddingBottom: 34,
    paddingHorizontal: 20,
    maxHeight: "90%",
    borderTopWidth: 1,
    borderColor: C.border,
  },
  modalHandle: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 12,
  },
  modalHandleBar: {
    width: 44,
    height: 5,
    backgroundColor: C.border,
    borderRadius: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
    color: C.textDark,
    letterSpacing: -0.5,
  },
  modalButtonContainer: {
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 17,
    borderRadius: 50,
    backgroundColor: C.bgGray,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.textSec,
  },

  // ─── Loading ─────────────────────────────────────────────────────────────
  loadingOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(15, 26, 34, 0.8)",
  },
  loadingContainer: {
    backgroundColor: C.bgCard,
    padding: 34,
    borderRadius: 28,
    alignItems: "center",
    minWidth: 220,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
    color: C.textDark,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  loadingSubtext: {
    marginTop: 6,
    fontSize: 13,
    color: C.textLight,
    textAlign: "center",
    lineHeight: 18,
  },
  refreshText: {
    fontSize: 13,
    color: C.textLight,
    marginTop: 8,
  },
});
