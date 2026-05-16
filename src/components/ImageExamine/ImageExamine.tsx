import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useImageExamine } from "./ImageExamine.logic";
import {
  ImageExamineProps,
  OPTION_CONFIGS,
  UI_TEXT,
} from "./ImageExamine.static";
import { imageExamineStyles } from "./imageExamine.style";


const PROCESSING_STAGES = [
  "Analysing your meal...",
  "Checking the nutrition...",
  "Almost done ✨",
];

const AnimatedProcessingText: React.FC<{ style?: object }> = ({ style }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setStageIndex((prev) => (prev + 1) % PROCESSING_STAGES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.Text
      style={[imageExamineStyles.processingText, { opacity: fadeAnim }, style]}
    >
      {PROCESSING_STAGES[stageIndex]}
    </Animated.Text>
  );
};

export const ImageExamine: React.FC<ImageExamineProps> = ({
  onSuccess,
  onLoading,
  onClose,
}) => {
  const {
    image,
    processing,
    cameraPressed,
    galleryPressed,
    setCameraPressed,
    setGalleryPressed,
    handlePickGalleryImage,
    handleTakeCameraPhoto,
    handleRemoveImage,
  } = useImageExamine({ onSuccess, onLoading, onClose });

  return (
    <View style={imageExamineStyles.container}>

      {/* ── Option Cards — only shown when no image is selected ── */}
      {!image && (
        <>
          <View style={imageExamineStyles.optionsGrid}>

            {/* Camera Card */}
            <TouchableOpacity
              style={[
                imageExamineStyles.optionCard,
                imageExamineStyles.cameraCard,
                cameraPressed && imageExamineStyles.optionCardPressed,
              ]}
              onPress={handleTakeCameraPhoto}
              onPressIn={() => setCameraPressed(true)}
              onPressOut={() => setCameraPressed(false)}
              activeOpacity={1}
              disabled={processing}
            >
              <View style={[imageExamineStyles.iconContainer, imageExamineStyles.cameraIconContainer]}>
                <Ionicons name={OPTION_CONFIGS.CAMERA.icon as any} size={26} color={OPTION_CONFIGS.CAMERA.iconColor} />
              </View>
              <Text style={imageExamineStyles.optionTitle}>{OPTION_CONFIGS.CAMERA.title}</Text>
              <Text style={imageExamineStyles.optionSubtitle}>{OPTION_CONFIGS.CAMERA.subtitle}</Text>
            </TouchableOpacity>

            {/* Gallery Card */}
            <TouchableOpacity
              style={[
                imageExamineStyles.optionCard,
                imageExamineStyles.galleryCard,
                galleryPressed && imageExamineStyles.optionCardPressed,
              ]}
              onPress={handlePickGalleryImage}
              onPressIn={() => setGalleryPressed(true)}
              onPressOut={() => setGalleryPressed(false)}
              activeOpacity={1}
              disabled={processing}
            >
              <View style={[imageExamineStyles.iconContainer, imageExamineStyles.galleryIconContainer]}>
                <Ionicons name={OPTION_CONFIGS.GALLERY.icon as any} size={26} color={OPTION_CONFIGS.GALLERY.iconColor} />
              </View>
              <Text style={imageExamineStyles.optionTitle}>{OPTION_CONFIGS.GALLERY.title}</Text>
              <Text style={imageExamineStyles.optionSubtitle}>{OPTION_CONFIGS.GALLERY.subtitle}</Text>
            </TouchableOpacity>

          </View>
        </>
      )}

      {image && (
        <View style={imageExamineStyles.imagePreviewContainer}>

          <View style={imageExamineStyles.previewHeader}>
            {processing ? (
              <AnimatedProcessingText style={{ flex: 1 }} />
            ) : (
              <>
                <View style={imageExamineStyles.previewStatusDot} />
                <Text style={imageExamineStyles.previewLabel}>
                  {UI_TEXT.IMAGE_SELECTED}
                </Text>
                <Ionicons name="checkmark-circle" size={18} color="#2ECC71" />
              </>
            )}
          </View>

          {/* Full-width image */}
          <View style={imageExamineStyles.previewImageWrapper}>
            <Image source={{ uri: image }} style={imageExamineStyles.previewImage} />

            {!processing && (
              <TouchableOpacity
                style={imageExamineStyles.removeButton}
                onPress={handleRemoveImage}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            {/*
             * Processing overlay — single spinner lives here ONLY.
             * AnimatedProcessingText reused here below the spinner.
             */}
            {processing && (
              <View style={imageExamineStyles.processingOverlay}>
                <View style={imageExamineStyles.processingIconWrap}>
                  <ActivityIndicator size="large" color="#F47B20" />
                </View>
                <AnimatedProcessingText />
                <Text style={imageExamineStyles.processingSubtext}>
                  AI-powered nutrition analysis
                </Text>
              </View>
            )}
          </View>

        </View>
      )}

    </View>
  );
};