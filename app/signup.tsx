import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Responsive scaling
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Always use light theme colors (app default)
const colors = {
  primary: '#f91a91',
  primaryLight: '#ff61b6',
  background: '#f8f5f7',
  cardBg: '#FFFFFF',
  text: '#1c0d15',
  textSecondary: '#6b7280',
  inputBg: '#FFFFFF',
  border: 'rgba(249, 26, 145, 0.3)',
};

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '#e5e7eb' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) return { level: 1, label: 'Weak', color: '#ef4444' };
    if (strength <= 2) return { level: 2, label: 'Medium Strength', color: '#eab308' };
    return { level: 3, label: 'Strong', color: '#22c55e' };
  }, [password]);

  const handleSignUp = () => {
    // Navigate to main app
    router.replace('/(tabs)');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSignIn = () => {
    router.replace('/signin');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Header Section with Background Image */}
          <ImageBackground
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3B-nrM6GIqHPABiwo9LxFa4p3Hi97_C9t_daYkKufZ5GLg6vBlfWPjWhVlE4Gb56s-KVT9NRxGHCDiE8HyGzcIsjj5G08075DnTMS0G8qTFcG1BZhQtjMqG8n5q9UmmflSY-FnptdSOT8jSlH8L5pT4SAo5TY2AKGPwjL8NvkIKET-nIPa2oUnq4H9T1LwLNtKv1rYndaQctHUYaieNdvchzUimOiQ4wbd_SHOGMf3dCZnAtZmMkIKJ6rxVKFc2U37ZhziBKdwG4',
            }}
            style={[styles.header, { paddingTop: insets.top }]}
            resizeMode="cover"
          >
            <View style={styles.headerOverlay} />
            
            {/* Top App Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <MaterialIcons name="arrow-back" size={moderateScale(22)} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerBrand}>Bloomify</Text>
              <View style={styles.backButton} />
            </View>

            {/* Header Text */}
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Create Account</Text>
              <Text style={styles.headerSubtitle}>Join our floral community today</Text>
            </View>
          </ImageBackground>

          {/* Main Form Card */}
          <View style={styles.formCard}>
            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity style={styles.tab} onPress={handleSignIn}>
                <Text style={[styles.tabText, styles.tabTextInactive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, styles.tabActive]}>
                <Text style={[styles.tabText, styles.tabTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#9ca3af"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                  <MaterialIcons name="person-outline" size={moderateScale(22)} color={colors.primary} />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email address"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                  />
                  <MaterialIcons name="mail-outline" size={moderateScale(22)} color={colors.primary} />
                </View>
              </View>

              {/* Phone Number - UAE Only */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.countrySelector}>
                    {/* UAE Flag using colored bars */}
                    <View style={styles.uaeFlag}>
                      <View style={[styles.flagStripe, { backgroundColor: '#00732F' }]} />
                      <View style={[styles.flagStripe, { backgroundColor: '#FFFFFF' }]} />
                      <View style={[styles.flagStripe, { backgroundColor: '#000000' }]} />
                      <View style={styles.flagRedBar} />
                    </View>
                    <Text style={styles.countryCode}>+971</Text>
                  </View>
                  <TextInput
                    style={[styles.input, styles.phoneInput]}
                    placeholder="50 123 4567"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={moderateScale(22)}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                      {passwordStrength.label}
                    </Text>
                    <View style={styles.strengthBars}>
                      <View style={[styles.strengthBar, { backgroundColor: passwordStrength.level >= 1 ? colors.primary : '#e5e7eb' }]} />
                      <View style={[styles.strengthBar, { backgroundColor: passwordStrength.level >= 2 ? colors.primary : '#e5e7eb' }]} />
                      <View style={[styles.strengthBar, { backgroundColor: passwordStrength.level >= 3 ? colors.primary : '#e5e7eb' }]} />
                    </View>
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Repeat your password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <MaterialIcons
                      name={showConfirmPassword ? 'lock-open' : 'lock-outline'}
                      size={moderateScale(22)}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms and Conditions */}
              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                  {agreedToTerms && (
                    <MaterialIcons name="check" size={moderateScale(14)} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I agree to Bloomify's{' '}
                  <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>.
                </Text>
              </TouchableOpacity>

              {/* Create Account Button */}
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleSignUp}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#f91a91', '#ff61b6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradient}
                >
                  <Text style={styles.createButtonText}>Create Account</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Social Login Section */}
            <View style={styles.socialSection}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or sign up with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                {/* Google */}
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="google" size={moderateScale(24)} color="#DB4437" />
                </TouchableOpacity>

                {/* Apple */}
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="apple" size={moderateScale(24)} color="#000000" />
                </TouchableOpacity>

                {/* Facebook */}
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="facebook" size={moderateScale(24)} color="#1877F2" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: height * 0.25,
    width: '100%',
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(30),
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBrand: {
    color: '#FFFFFF',
    fontSize: moderateScale(20),
    fontWeight: '700',
  },
  headerTextContainer: {
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(8),
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: moderateScale(24),
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },
  formCard: {
    flex: 1,
    backgroundColor: '#f8f5f7',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    marginTop: -verticalScale(30),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(4),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(249, 26, 145, 0.2)',
    marginBottom: verticalScale(10),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#f91a91',
  },
  tabText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: '#f91a91',
  },
  tabTextInactive: {
    color: '#9ca3af',
  },
  form: {
    gap: verticalScale(8),
  },
  inputGroup: {
    gap: verticalScale(4),
  },
  inputLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#1c0d15',
    marginLeft: scale(4),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(44),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: 'rgba(249, 26, 145, 0.3)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(12),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#1c0d15',
    height: '100%',
  },
  phoneInput: {
    marginLeft: scale(8),
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingRight: scale(10),
    borderRightWidth: 1,
    borderRightColor: 'rgba(249, 26, 145, 0.2)',
  },
  uaeFlag: {
    width: moderateScale(24),
    height: moderateScale(16),
    flexDirection: 'column',
    borderRadius: moderateScale(2),
    overflow: 'hidden',
    position: 'relative',
  },
  flagStripe: {
    flex: 1,
    width: '100%',
  },
  flagRedBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '30%',
    backgroundColor: '#FF0000',
  },
  countryCode: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#1c0d15',
  },
  strengthContainer: {
    marginTop: verticalScale(4),
    paddingHorizontal: scale(4),
  },
  strengthLabel: {
    fontSize: moderateScale(9),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: verticalScale(2),
  },
  strengthBars: {
    flexDirection: 'row',
    gap: scale(4),
  },
  strengthBar: {
    flex: 1,
    height: verticalScale(4),
    borderRadius: moderateScale(2),
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(10),
    paddingVertical: verticalScale(4),
  },
  checkbox: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(4),
    borderWidth: 1,
    borderColor: 'rgba(249, 26, 145, 0.3)',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#f91a91',
    borderColor: '#f91a91',
  },
  termsText: {
    flex: 1,
    fontSize: moderateScale(11),
    color: '#6b7280',
    lineHeight: moderateScale(16),
  },
  termsLink: {
    color: '#f91a91',
    fontWeight: '700',
  },
  createButton: {
    marginTop: verticalScale(6),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#f91a91',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  gradient: {
    height: verticalScale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
  socialSection: {
    marginTop: verticalScale(12),
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(249, 26, 145, 0.1)',
  },
  dividerText: {
    paddingHorizontal: scale(16),
    fontSize: moderateScale(11),
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(20),
  },
  socialButton: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    borderWidth: 1,
    borderColor: 'rgba(249, 26, 145, 0.2)',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
  },
  footerText: {
    fontSize: moderateScale(13),
    color: '#6b7280',
  },
  footerLink: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: '#f91a91',
  },
});
