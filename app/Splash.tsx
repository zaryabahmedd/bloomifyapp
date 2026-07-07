import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Spin animation for loader
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Fade and scale in animation for content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to signin after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/signin');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#FF1493', '#FFB6C1']}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {/* Top Safe Area Spacer */}
      <View style={{ height: insets.top + verticalScale(12) }} />

      {/* Center Brand Identity */}
      <Animated.View
        style={[
          styles.centerContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          {/* Outer Circle with Glass Effect */}
          <View style={styles.logoOuterCircle}>
            {/* Inner Logo */}
            <View style={styles.logoInnerCircle}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXuWr4OI__UvBV_Lo4Lbhz8HB5_FfefzT6kc8sUqSwrgFsjrsn3xfMQvSSyHTQubhzbv5VkZE8vBkdSd_mF8xa8uOCBeg8B65Ku34SCVkK2ULvtMGR7o5xHIQRgAM87Mvpn8vraKG5HsqLCeQIqnxlYaGP9ehiIW2v1Wg30SpmYsX0PIzBeYahgwtUW_BQXpR-OF_xxEQtpuZd3VMYnEqPmSpLOBF169pjqnkjZhp4M8JHSVe4lJugnPlm-roCXwoRQ_nvL1zxNd0',
                }}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Decorative Petals */}
          <View style={styles.petalTopRight}>
            <MaterialCommunityIcons
              name="flower"
              size={moderateScale(32)}
              color="rgba(255, 255, 255, 0.6)"
            />
          </View>
          <View style={styles.petalBottomLeft}>
            <MaterialCommunityIcons
              name="flower-tulip"
              size={moderateScale(28)}
              color="rgba(255, 255, 255, 0.4)"
            />
          </View>
        </View>

        {/* Typography Section */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Bloomify</Text>
          <Text style={styles.tagline}>Happiness Delivered Fresh</Text>
        </View>
      </Animated.View>

      {/* Bottom Loading Section */}
      <View style={styles.bottomSection}>
        {/* Loader */}
        <View style={styles.loaderContainer}>
          <View style={styles.loaderWrapper}>
            {/* Circular Base */}
            <View style={styles.loaderBase} />
            {/* Spinning Progress */}
            <Animated.View
              style={[
                styles.loaderProgress,
                { transform: [{ rotate: spin }] },
              ]}
            />
            {/* Center Icon */}
            <MaterialCommunityIcons
              name="leaf"
              size={moderateScale(24)}
              color="#FFFFFF"
              style={styles.loaderIcon}
            />
          </View>
          <Text style={styles.loadingText}>Arranging your blooms...</Text>
        </View>

        {/* Version Number */}
        <View style={styles.versionContainer}>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </View>

        {/* Bottom Safe Area */}
        <View style={{ height: insets.bottom + verticalScale(24) }} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(32),
  },
  logoContainer: {
    position: 'relative',
    marginBottom: verticalScale(32),
  },
  logoOuterCircle: {
    width: moderateScale(180),
    height: moderateScale(180),
    borderRadius: moderateScale(90),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  logoInnerCircle: {
    width: moderateScale(150),
    height: moderateScale(150),
    borderRadius: moderateScale(75),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  petalTopRight: {
    position: 'absolute',
    top: -verticalScale(16),
    right: -scale(8),
  },
  petalBottomLeft: {
    position: 'absolute',
    bottom: verticalScale(16),
    left: -scale(24),
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: Platform.select({
      ios: 'Baskerville-Bold',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: moderateScale(52),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      },
    }),
  },
  tagline: {
    fontFamily: Platform.select({
      ios: 'SnellRoundhand-Bold',
      android: 'cursive',
      default: 'cursive',
    }),
    fontSize: moderateScale(22),
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: verticalScale(8),
    fontStyle: 'italic',
    textAlign: 'center',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: verticalScale(12),
  },
  loaderContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(32),
  },
  loaderWrapper: {
    width: moderateScale(60),
    height: moderateScale(60),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
  },
  loaderBase: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(30),
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loaderProgress: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(30),
    borderWidth: 4,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
  },
  loaderIcon: {
    position: 'absolute',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: moderateScale(12),
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  versionContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: scale(32),
    marginBottom: verticalScale(8),
  },
  versionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: 9999,
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
});
