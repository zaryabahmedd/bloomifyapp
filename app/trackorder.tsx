import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  ImageBackground,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Responsive scaling
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Light theme colors
const colors = {
  primary: '#f91a91',
  background: '#f8f5f7',
  cardBg: '#FFFFFF',
  text: '#1c0d15',
  textSecondary: '#9e4776',
  border: '#e9cedc',
  green: '#22c55e',
  greenLight: '#dcfce7',
  yellow: '#eab308',
};

// Timeline steps
const timelineSteps = [
  {
    id: 1,
    title: 'Order Confirmed',
    status: 'completed',
    icon: 'check',
  },
  {
    id: 2,
    title: 'Preparing Bouquet',
    status: 'completed',
    icon: 'check',
  },
  {
    id: 3,
    title: 'Out for Delivery',
    status: 'active',
    icon: 'local-shipping',
  },
  {
    id: 4,
    title: 'Delivered',
    status: 'pending',
    icon: 'home',
  },
];

export default function TrackOrderScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const orderId = params.orderId || 'ORD-12345';
  
  // Pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 2.5,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const getStepStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: colors.green, text: colors.green };
      case 'active':
        return { bg: colors.primary, text: colors.primary };
      default:
        return { bg: '#d1d5db', text: '#9ca3af' };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <MaterialIcons name="arrow-back-ios" size={moderateScale(24)} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Track Order #{orderId}</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + verticalScale(24) }}
      >
        {/* Timeline Section */}
        <View style={styles.timelineSection}>
          {timelineSteps.map((step, index) => {
            const stepStyle = getStepStyle(step.status);
            const isLast = index === timelineSteps.length - 1;
            const showLine = !isLast && step.status !== 'pending';

            return (
              <View key={step.id} style={styles.timelineRow}>
                {/* Icon Column */}
                <View style={styles.timelineIconColumn}>
                  {step.status === 'active' && (
                    <Animated.View
                      style={[
                        styles.pulseCircle,
                        {
                          transform: [{ scale: pulseAnim }],
                          opacity: opacityAnim,
                        },
                      ]}
                    />
                  )}
                  <View style={[styles.timelineIcon, { backgroundColor: stepStyle.bg }]}>
                    <MaterialIcons
                      name={step.icon as any}
                      size={moderateScale(16)}
                      color="#FFFFFF"
                    />
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor: showLine ? stepStyle.bg : '#d1d5db',
                        },
                      ]}
                    />
                  )}
                </View>

                {/* Content Column */}
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineTitle,
                      step.status === 'active' && { color: colors.primary },
                      step.status === 'pending' && { color: '#9ca3af' },
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.timelineStatus,
                      step.status === 'completed' && { color: colors.green },
                      step.status === 'active' && { color: colors.primary },
                      step.status === 'pending' && { color: '#9ca3af' },
                    ]}
                  >
                    {step.status === 'completed'
                      ? 'Completed'
                      : step.status === 'active'
                      ? 'In Progress'
                      : 'Pending'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <ImageBackground
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7YJ9wSDSfnRF8agUDo9CzoIIxlnNe2_HaVl4TmC83wKNDcM1851215ROjMuRf7d3BJVZ5kWL1WmYufThkpNvpUBBG4xZuB_NTDRfAWOxSV-jPMsTCvAqWGg6vp1iLjs41zRCNJuvK0Lnl9TkrhDPEP-DIvgIUrWsFLslcqFwa7EFIB1_wvs9jyjS4vZeecNPSSpPhQjzweOwQ6ncgyQCYJpv03f2JS-4x_SUyTrHDE_KnFtQPywXdCRi3RMNhundoukhsfsNuFp4',
            }}
            style={styles.mapImage}
            imageStyle={styles.mapImageStyle}
          >
            {/* Truck Icon on Map */}
            <View style={styles.truckMarker}>
              <MaterialIcons name="local-shipping" size={moderateScale(16)} color="#FFFFFF" />
            </View>

            {/* Destination Pin */}
            <View style={styles.destinationPin}>
              <MaterialIcons name="location-on" size={moderateScale(40)} color={colors.primary} />
            </View>

            {/* Floating ETA Card */}
            <View style={styles.etaCard}>
              <MaterialIcons name="schedule" size={moderateScale(20)} color="#FFFFFF" />
              <Text style={styles.etaText}>Estimated Arrival: 15 mins</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Driver Profile Card */}
        <View style={styles.driverCard}>
          <View style={styles.driverInfo}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz61fo_sb4h2RLfAU7m4Cs_05EQaaoA0hKwiz0DkUu3hWnmVenHkNo56FX3kz9h_ccFyL0Q3MtfnLAfEwWqJOT9DNDS8PLMt6qMNoi9JIusAOvPAypB_H5kXPZcHEjypgYHuwP9xvjZRkt_rQFqtrq3cDphD1CixZiZrugyhgylZNinDCuIXbKtbtK0M5aqn1EkvGT-_8vrLGPUiugEie2e_rLA054tU1CAuRgGC4c8KJSF_VUk0SLoUGXLJ4L1FlYFZmlHpb2Rm0',
              }}
              style={styles.driverAvatar}
            />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>Alex Rivera</Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={moderateScale(14)} color={colors.yellow} />
                <Text style={styles.ratingText}>4.9 Rating</Text>
              </View>
            </View>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.callButton}>
              <MaterialIcons name="call" size={moderateScale(20)} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatButton}>
              <MaterialIcons name="chat-bubble" size={moderateScale(20)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Snapshot Card */}
        <TouchableOpacity style={styles.orderCard} activeOpacity={0.7}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC76J8EagRQO3QaKcYsa8bmvcyzSxqGBRhvvHFH5ATaZclAPr79QXIqrFctT-r-HQ1gF7TkRu-_D9loO4Y1YH2trvrZNysrXmm_S8SlvB4UYRP1dNzboX1nr4W-7ejqoBILVGhtCWQNdWo2jq-aAd9oXooUdNoSlo3j2BRut_5qZecvK0l9tgZw0BAQP8OuQZAhuMnRlguqvfg6KIgvkup3D9xa23ZZEzm8YnNBd_f5iXDCuoEgsEYlYb4UIgn9leVSoIr0TNliNtY',
            }}
            style={styles.orderImage}
          />
          <View style={styles.orderDetails}>
            <Text style={styles.orderName} numberOfLines={1}>
              Midnight Romance Bouquet
            </Text>
            <Text style={styles.orderMeta}>Standard Delivery • 1 Item</Text>
          </View>
          <MaterialIcons name="chevron-right" size={moderateScale(24)} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <TouchableOpacity style={styles.helpButton}>
            <MaterialIcons name="help-outline" size={moderateScale(20)} color={colors.primary} />
            <Text style={styles.helpButtonText}>Need Help with your order?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'rgba(248, 245, 247, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(249, 26, 145, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  backButton: {
    width: moderateScale(48),
    height: moderateScale(48),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginRight: moderateScale(48),
  },
  headerSpacer: {
    width: moderateScale(48),
  },
  timelineSection: {
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(16),
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: verticalScale(56),
  },
  timelineIconColumn: {
    width: moderateScale(32),
    alignItems: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: colors.primary,
    top: 0,
  },
  timelineIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    height: verticalScale(24),
    marginTop: verticalScale(4),
  },
  timelineContent: {
    flex: 1,
    paddingLeft: scale(16),
    paddingBottom: verticalScale(16),
  },
  timelineTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.text,
  },
  timelineStatus: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
  mapContainer: {
    marginHorizontal: scale(16),
    height: verticalScale(300),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mapImage: {
    flex: 1,
    position: 'relative',
  },
  mapImageStyle: {
    borderRadius: moderateScale(16),
  },
  truckMarker: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    backgroundColor: colors.primary,
    padding: moderateScale(8),
    borderRadius: moderateScale(20),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  destinationPin: {
    position: 'absolute',
    bottom: '20%',
    right: '20%',
  },
  etaCard: {
    position: 'absolute',
    top: verticalScale(16),
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(24),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  etaText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  driverCard: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(16),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(249, 26, 145, 0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  driverAvatar: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
  },
  driverDetails: {
    gap: verticalScale(4),
  },
  driverName: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  ratingText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.textSecondary,
  },
  driverActions: {
    flexDirection: 'row',
    gap: scale(8),
  },
  callButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(249, 26, 145, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  orderCard: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(12),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    borderWidth: 1,
    borderColor: 'rgba(249, 26, 145, 0.05)',
  },
  orderImage: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(8),
  },
  orderDetails: {
    flex: 1,
  },
  orderName: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.text,
  },
  orderMeta: {
    fontSize: moderateScale(12),
    color: colors.textSecondary,
    marginTop: verticalScale(2),
  },
  helpSection: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: verticalScale(14),
    backgroundColor: 'rgba(249, 26, 145, 0.1)',
    borderRadius: moderateScale(12),
  },
  helpButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.primary,
  },
});