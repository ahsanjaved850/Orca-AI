import { Auth } from "@/src/utils/auth.native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogin } from "./Login.logic";
import {
  BUTTON_LABELS,
  FORM_LABELS,
  FORM_SUBTITLES,
  FORM_TITLES,
  KEYBOARD_CONFIG,
  LoginScreenProps,
  PASSWORD_TOGGLE_ICONS,
  PLACEHOLDERS,
  TOGGLE_LINKS,
  TOGGLE_TEXTS,
} from "./Login.static";
import { COLORS, loginStyles } from "./login.style";

export function LoginScreen({ onLogin, mode = "signin" }: LoginScreenProps) {
  const {
    email,
    password,
    newUser,
    loading,
    showPassword,
    focusedField,
    errors,
    isFormValid,
    setEmail,
    setPassword,
    handleSignInSignUp,
    handleToggleSignInForm,
    handleTogglePasswordVisibility,
    handleFocus,
    handleBlur,
  } = useLogin({ onLogin, mode });

  return (
    <SafeAreaView style={loginStyles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.gradientTop} />

      <LinearGradient
        colors={[COLORS.gradientTop, COLORS.gradientMid, COLORS.gradientBottom]}
        locations={[0, 0.4, 1]}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          style={loginStyles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={
            Platform.OS === "ios"
              ? KEYBOARD_CONFIG.IOS_OFFSET
              : KEYBOARD_CONFIG.ANDROID_OFFSET
          }
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={loginStyles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={loginStyles.contentContainer}>
                {/* Logo */}
                <View style={loginStyles.logoContainer}>
                  <Text style={loginStyles.wordmark}>orca</Text>
                </View>

                {/* Form */}
                <View style={loginStyles.formContainer}>
                  <Text style={loginStyles.formTitle}>
                    {newUser ? FORM_TITLES.SIGN_UP : FORM_TITLES.SIGN_IN}
                  </Text>
                  <Text style={loginStyles.formSubtitle}>
                    {newUser ? FORM_SUBTITLES.SIGN_UP : FORM_SUBTITLES.SIGN_IN}
                  </Text>

                  {/* Email */}
                  <View style={loginStyles.inputContainer}>
                    <Text style={loginStyles.inputLabel}>
                      {FORM_LABELS.EMAIL}
                    </Text>
                    <View style={loginStyles.inputWrapper}>
                      <TextInput
                        placeholder={PLACEHOLDERS.EMAIL}
                        placeholderTextColor={COLORS.textLight}
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => handleFocus("email")}
                        onBlur={handleBlur}
                        style={[
                          loginStyles.input,
                          focusedField === "email" && loginStyles.inputFocused,
                          errors.email && loginStyles.inputError,
                        ]}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                        returnKeyType="next"
                        editable={!loading}
                      />
                    </View>
                    {errors.email && (
                      <Text style={loginStyles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  {/* Password */}
                  <View style={loginStyles.inputContainer}>
                    <Text style={loginStyles.inputLabel}>
                      {FORM_LABELS.PASSWORD}
                    </Text>
                    <View style={loginStyles.inputWrapper}>
                      <TextInput
                        placeholder={
                          newUser
                            ? PLACEHOLDERS.PASSWORD_SIGNUP
                            : PLACEHOLDERS.PASSWORD_LOGIN
                        }
                        placeholderTextColor={COLORS.textLight}
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => handleFocus("password")}
                        onBlur={handleBlur}
                        secureTextEntry={!showPassword}
                        style={[
                          loginStyles.input,
                          focusedField === "password" &&
                            loginStyles.inputFocused,
                          errors.password && loginStyles.inputError,
                        ]}
                        autoComplete="password"
                        returnKeyType="done"
                        onSubmitEditing={handleSignInSignUp}
                        editable={!loading}
                      />
                      <TouchableOpacity
                        style={loginStyles.inputIcon}
                        onPress={handleTogglePasswordVisibility}
                        activeOpacity={0.7}
                      >
                        <Text style={loginStyles.passwordToggleText}>
                          {showPassword
                            ? PASSWORD_TOGGLE_ICONS.SHOW
                            : PASSWORD_TOGGLE_ICONS.HIDE}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {errors.password && (
                      <Text style={loginStyles.errorText}>
                        {errors.password}
                      </Text>
                    )}
                  </View>

                  {/* Submit */}
                  <TouchableOpacity
                    style={[
                      loginStyles.submitButton,
                      !isFormValid && loginStyles.submitButtonDisabled,
                    ]}
                    onPress={handleSignInSignUp}
                    disabled={!isFormValid}
                    activeOpacity={0.8}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                      <Text
                        style={[
                          loginStyles.submitButtonText,
                          !isFormValid && loginStyles.submitButtonTextDisabled,
                        ]}
                      >
                        {newUser
                          ? BUTTON_LABELS.SIGN_UP
                          : BUTTON_LABELS.SIGN_IN}
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* Divider + Apple */}
                  <View style={loginStyles.dividerContainer}>
                    <View style={loginStyles.dividerLine} />
                    <Text style={loginStyles.dividerText}>or</Text>
                    <View style={loginStyles.dividerLine} />
                  </View>

                  <View style={loginStyles.appleButtonContainer}>
                    <Auth
                      onLogin={onLogin}
                      mode={newUser ? "signup" : "signin"}
                    />
                  </View>

                  {/* Toggle — hidden when mode is locked to signin or signup */}
                  {!mode && (
                    <View style={loginStyles.toggleContainer}>
                      <Text style={loginStyles.toggleText}>
                        {newUser
                          ? TOGGLE_TEXTS.TO_SIGN_IN
                          : TOGGLE_TEXTS.TO_SIGN_UP}
                      </Text>
                      <TouchableOpacity
                        onPress={handleToggleSignInForm}
                        activeOpacity={0.7}
                      >
                        <Text style={loginStyles.toggleLink}>
                          {newUser
                            ? TOGGLE_LINKS.SIGN_IN
                            : TOGGLE_LINKS.SIGN_UP}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
