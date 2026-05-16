import { StyleSheet } from "react-native";

// ─── Theme Palette ─────────────────────────────────────────────────────────
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

  textDark: "#0F1A22",
  text: "#1C2B36",
  textSec: "#7A8A98",
  textLight: "#B0BECA",
  textOnDark: "#FFFFFF",

  primary: "#F47B20",
  primaryDark: "#D96A12",
  primaryLight: "#FFF3E8",
  primaryMuted: "#FFE0C2",

  border: "#F0DED0",
  borderLight: "#FAF0E8",
};

export const mealDetailStyles = StyleSheet.create({

  // ─── Shell ─────────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // ─── Scroll ────────────────────────────────────────────────────────────
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 48,
  },

  // ─── Hero Image — full bleed to top of screen ──────────────────────────
  // The image goes edge-to-edge including behind the status bar.
  // The back button floats absolutely on top of it.
  imageContainer: {
    width: "100%",
    height: 320,
    backgroundColor: C.bgCardAlt,
  },
  mealImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.bgCardAlt,
  },
  imagePlaceholderIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.primaryMuted,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },

  // ─── Back Button — absolutely over the image ──────────────────────────
  // position: absolute + top set inline from insets in the component.
  // zIndex: 20 ensures it's always above the image and info card overlap.
  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(240,222,208,0.8)",
  },

  // ─── Info Card — overlaps image from below ────────────────────────────
  infoCard: {
    backgroundColor: C.bgCard,
    padding: 22,
    marginHorizontal: 16,
    borderRadius: 28,
    marginTop: -40,
    marginBottom: 12,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  mealName: {
    fontSize: 26,
    fontWeight: "800",
    color: C.textDark,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    color: C.textLight,
    fontWeight: "500",
  },

  // ─── Calories Card ─────────────────────────────────────────────────────
  caloriesCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCardAlt,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  caloriesIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: C.primaryMuted,
  },
  caloriesInfo: {
    flex: 1,
  },
  caloriesLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.primary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  caloriesValue: {
    fontSize: 38,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  caloriesUnit: {
    fontSize: 14,
    color: C.textSec,
    fontWeight: "600",
  },

  // ─── Section ───────────────────────────────────────────────────────────
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: C.primary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 12,
  },

  // ─── Macro Cards ───────────────────────────────────────────────────────
  macroGrid: {
    flexDirection: "row",
    gap: 10,
  },
  macroCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: 22,
    padding: 16,
    alignItems: "center",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  // 3D image replacing the Ionicons coloured square
  macroIcon3d: {
    width: 52,
    height: 52,
    marginBottom: 10,
  },
  macroIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.textSec,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: "800",
    color: C.textDark,
    letterSpacing: -0.5,
  },

  // ─── Additional Nutrients ───────────────────────────────────────────────
  nutrientsList: {
    backgroundColor: C.bgCard,
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  nutrientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  nutrientLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nutrientAccentBar: {
    width: 4,
    height: 36,
    borderRadius: 4,
    backgroundColor: C.primary,
    marginRight: 4,
  },
  // 3D image for additional nutrients rows
  nutrientIcon3d: {
    width: 40,
    height: 40,
  },
  nutrientIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  nutrientLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: C.textDark,
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: "800",
    color: C.primary,
  },

  // ─── AI Notice ─────────────────────────────────────────────────────────
  aiNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primaryLight,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 14,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: C.primaryMuted,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
  },
  aiNoticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: C.textSec,
    lineHeight: 18,
  },

  // ─── Error ─────────────────────────────────────────────────────────────
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: C.textLight,
  },

  // ─── Ingredients (compatibility) ────────────────────────────────────────
  ingredientsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  ingredientsContainer: {
    backgroundColor: C.bgCard,
    borderRadius: 22,
    padding: 18,
    shadowColor: "#F47B20",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingLeft: 4,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.primary,
    marginRight: 10,
    marginTop: 7,
  },
  ingredientText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: C.text,
    lineHeight: 21,
  },
  noIngredientsText: {
    fontSize: 14,
    color: C.textLight,
    fontStyle: "italic",
    textAlign: "center",
  },
});