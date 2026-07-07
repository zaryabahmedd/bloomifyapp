import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  KeyboardAvoidingView,
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
  primary: '#FF1493',
  primaryLight: '#FF69B4',
  background: '#f8f5f7',
  cardBg: '#FFFFFF',
  text: '#1d0c15',
  textSecondary: '#a14576',
  inputBg: 'rgba(248, 245, 247, 0.5)',
  border: 'rgba(255, 20, 147, 0.2)',
};

export default function SignInScreen() {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // Navigate to main app
    router.replace('/(tabs)');
  };

  const handleSignUp = () => {
    // Navigate to signup screen
    router.push('/signup');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background Watermark */}
      <Image
        source={{
          uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSQHP64USceNFPrAlFLrVIRBy1QXT60oOgHEcQnhQFmvt1_4ctEcb3JM0zPnOUFegLiLkVi9iUitcsV3btwbpDDd8PGPDj9nxLrInb4mGbXrri4_v0m2SfcQudAPmX1fIhLdTnQMu-J2kvak-rCJk3zgG0VRlhd4FreOvQo8UKnS2Z3hyEE-Y4x21SD9OZ8a4E-NOLf4DS5Uiw9isss8t84d-MkO7FZE1-Gf6xJZuJoisU0Tf9gtDyXW28DM0epUpB_DzUBb6keW8',
        }}
        style={styles.watermark}
        resizeMode="cover"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View
          style={[
            styles.mainContent,
            { paddingTop: insets.top + verticalScale(16), paddingBottom: insets.bottom + verticalScale(12) },
          ]}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <MaterialCommunityIcons
              name="flower-tulip"
              size={moderateScale(48)}
              color={colors.primary}
            />
            <Text style={[styles.brandName, { color: colors.text }]}>Bloomify</Text>
            <Text style={[styles.tagline, { color: colors.primary }]}>
              Where every bouquet tells a story
            </Text>
          </View>

          {/* Welcome Message */}
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            Welcome to Bloomify!
          </Text>

          {/* Auth Card */}
          <View
            style={[
              styles.authCard,
              {
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Segmented Control */}
            <View style={[styles.segmentedControl, { backgroundColor: 'rgba(255, 20, 147, 0.1)' }]}>
              <TouchableOpacity
                style={[styles.segmentButton, styles.segmentButtonActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.segmentText, { color: '#FFFFFF' }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.segmentButton}
                onPress={handleSignUp}
                activeOpacity={0.8}
              >
                <Text style={[styles.segmentText, { color: colors.primary }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="hello@bloomify.com"
                    placeholderTextColor="rgba(255, 20, 147, 0.4)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                  />
                  <MaterialIcons name="mail-outline" size={moderateScale(22)} color={colors.primary} />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Password</Text>
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter password"
                    placeholderTextColor="rgba(255, 20, 147, 0.4)"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons
                      name={showPassword ? 'lock-open' : 'lock-outline'}
                      size={moderateScale(22)}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                style={styles.signInButton}
                onPress={handleSignIn}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#FF1493', '#FF69B4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradient}
                >
                  <Text style={styles.signInButtonText}>Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Social Auth Section */}
            <View style={styles.socialSection}>
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: 'rgba(255, 20, 147, 0.6)' }]}>
                  Or continue with
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              <View style={styles.socialButtons}>
                {/* Google */}
                <TouchableOpacity
                  style={[styles.socialButton, { borderColor: colors.border, backgroundColor: '#FFFFFF' }]}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="google" size={moderateScale(24)} color="#DB4437" />
                </TouchableOpacity>

                {/* Facebook */}
                <TouchableOpacity
                  style={[styles.socialButton, { borderColor: colors.border, backgroundColor: '#1877F2' }]}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="facebook" size={moderateScale(24)} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Apple */}
                <TouchableOpacity
                  style={[styles.socialButton, { borderColor: colors.border, backgroundColor: '#000000' }]}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="apple" size={moderateScale(24)} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  watermark: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  keyboardView: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: scale(24),
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  brandName: {
    fontFamily: Platform.select({ ios: 'Baskerville-Bold', default: 'serif' }),
    fontSize: moderateScale(26),
    fontWeight: '700',
    marginTop: verticalScale(4),
  },
  tagline: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    marginTop: verticalScale(4),
  },
  welcomeText: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: verticalScale(12),
  },
  authCard: {
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#FF1493',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  segmentedControl: {
    flexDirection: 'row',
    height: verticalScale(52),
    borderRadius: moderateScale(26),
    padding: moderateScale(4),
    marginBottom: verticalScale(16),
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(24),
  },
  segmentButtonActive: {
    backgroundColor: '#FF1493',
    ...Platform.select({
      ios: {
        shadowColor: '#FF1493',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  segmentText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  form: {
    gap: verticalScale(12),
  },
  inputGroup: {
    gap: verticalScale(6),
  },
  inputLabel: {
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(50),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    paddingHorizontal: scale(16),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(15),
    height: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
  signInButton: {
    marginTop: verticalScale(4),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FF1493',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  gradient: {
    height: verticalScale(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(17),
    fontWeight: '700',
  },
  socialSection: {
    marginTop: verticalScale(20),
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: scale(16),
    fontSize: moderateScale(11),
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(16),
  },
  socialButton: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  footerLink: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
});
