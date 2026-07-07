import React, { useState } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

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
  background: '#FFF5F7',
  cardBg: '#FFFFFF',
  text: '#1c0d15',
  textSecondary: '#9e4776',
  border: '#e9cedc',
  lightPink: '#f4e6ee',
};

// Tab options
const tabs = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

// Order data
const orders = [
  {
    id: 'ORD-12345',
    status: 'in-transit',
    statusLabel: 'In Transit',
    statusColor: { bg: '#FFF7ED', text: '#EA580C' },
    productName: 'Mixed Bouquet',
    quantity: 1,
    date: 'Expected: Feb 15',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhZonpUIRqVUZjUZVjrC2ighr7R1nEUXjFDLWQFNT146kRthiurtrEa5BV-7-VHPZOMCeOQ0q8U_8SidhNifC3Qkc6IEN9QG0HTblC_OOIXBjxOj7EzmdKwv9TjYjisfMmzhBCT1SDT7K0f9tmTQcwUPDZFeiLV0aCznPi3D4AWtM2VxD4Hk14yEit00lWHRYawEJOcAA195DeE_Q7y7Ge_w96HHHy5eURfBwS-t0lvlsJ6jZcS5ZF7hNFXXOVXTJrWr78l9lYAfw',
    primaryAction: 'Track Order',
    secondaryAction: 'Cancel',
  },
  {
    id: 'ORD-11982',
    status: 'delivered',
    statusLabel: 'Delivered',
    statusColor: { bg: '#F0FDF4', text: '#16A34A' },
    productName: 'Sunflowers & Daisies',
    quantity: 1,
    date: 'Delivered: Feb 10',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN98sPPXMbwEHHIExKvsLSW9iJRLV7Fr18Mg79r94zxfRPltVlRZfOOoZFvycqVTiFVr2wNKPu7O5bu-muWGa-oynE9QDyB5VHcPZ0ITK14qX71254AsWYtHwx8SJQ3_3wDECMSfv6AgCuPTBg2mRaprmQVC2Bawg8avtRP_g9qvQAvBo0brg1MbCh4s958zwpi90o8IVpaC3MVbbjy9KnjFsvzbvH2x5b9-uV6QiHIrrn_i4GLsag68yaLSwRBU5SN28oXtN_dxc',
    primaryAction: 'Reorder',
    secondaryAction: 'View Receipt',
  },
  {
    id: 'ORD-11850',
    status: 'cancelled',
    statusLabel: 'Cancelled',
    statusColor: { bg: '#FEF2F2', text: '#DC2626' },
    productName: 'Red Roses Premium',
    quantity: 2,
    date: 'Cancelled: Feb 5',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxeaNxOGIZp1p_bzbAT530Fb3tQvUXxwAdw8Tl8GX3KNRaDbvDG-BjNhZzFD8tG4PfnfJHkqr_G4u0yQWtSnsDmWXPTc0BF-_agQlLec0GBRtoF_4EZi7GxFwy3d6-yP_6XENmfXvrPL-TRmX0rNrzkyXY9rDVGFxfm4FYwPWjsIIKEJip0Ja77XKW-8lhQGodymbDZrsPvM-ldelT56BkiQaOf0GhPu_wdJrGPmveIyl-ZJDyGP988SG1kYj_oWGorJKCqU85N3c',
    primaryAction: 'Reorder',
    secondaryAction: 'View Details',
  },
];

export default function MyOrdersScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('active');

  const handleGoBack = () => {
    router.back();
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return order.status === 'in-transit';
    if (activeTab === 'completed') return order.status === 'delivered';
    if (activeTab === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <MaterialIcons name="arrow-back-ios" size={moderateScale(24)} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconButton}>
              <MaterialIcons name="language" size={moderateScale(22)} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton}>
              <MaterialIcons name="tune" size={moderateScale(22)} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tabs Navigation */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsWrapper}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Orders List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + verticalScale(100) },
        ]}
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="receipt-long" size={moderateScale(64)} color={colors.border} />
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptySubtitle}>You don't have any {activeTab} orders yet</Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.push('/category')}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {filteredOrders.map((order, index) => (
              <View key={order.id} style={[styles.orderCard, index > 0 && { marginTop: 0 }]}>
                <ImageBackground
                  source={{ uri: order.image }}
                  style={styles.orderImage}
                  imageStyle={styles.orderImageStyle}
                />
                <View style={styles.orderContent}>
                  <View style={styles.orderHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: order.statusColor.bg }]}>
                      <Text style={[styles.statusText, { color: order.statusColor.text }]}>
                        {order.statusLabel}
                      </Text>
                    </View>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <Text style={styles.productName}>{order.productName} • x{order.quantity}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.primaryButton}
                      onPress={() => {
                        if (order.primaryAction === 'Track Order') {
                          router.push({ pathname: '/trackorder', params: { orderId: order.id } });
                        }
                      }}
                    >
                      <Text style={styles.primaryButtonText}>{order.primaryAction}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.secondaryButton}
                      onPress={() => {
                        if (order.secondaryAction === 'View Receipt') {
                          router.push({ pathname: '/orderreceipt', params: { orderId: order.id } });
                        }
                      }}
                    >
                      <Text style={styles.secondaryButtonText}>{order.secondaryAction}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* View Older Orders Button */}
            <TouchableOpacity style={styles.viewOlderButton}>
              <Text style={styles.viewOlderText}>View Older Orders</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + verticalScale(8) }]}>
        <TouchableOpacity style={styles.navItem} onPress={handleGoBack}>
          <MaterialIcons name="home" size={moderateScale(24)} color={colors.textSecondary} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/category')}>
          <MaterialIcons name="local-florist" size={moderateScale(24)} color={colors.textSecondary} />
          <Text style={styles.navLabel}>Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="receipt-long" size={moderateScale(24)} color={colors.primary} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <MaterialIcons name="person-outline" size={moderateScale(24)} color={colors.textSecondary} />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'rgba(255, 245, 247, 0.9)',
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
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: moderateScale(80),
    justifyContent: 'flex-end',
    gap: scale(12),
  },
  headerIconButton: {
    padding: scale(4),
  },
  tabsContainer: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.text,
  },
  scrollContent: {
    padding: scale(16),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(80),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: colors.text,
    marginTop: verticalScale(16),
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
    marginTop: verticalScale(8),
  },
  shopButton: {
    marginTop: verticalScale(24),
    backgroundColor: colors.primary,
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
  },
  shopButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    marginBottom: verticalScale(16),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  orderImage: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  orderImageStyle: {
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
  },
  orderContent: {
    padding: scale(16),
    gap: verticalScale(8),
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
  },
  statusText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderDate: {
    fontSize: moderateScale(12),
    color: colors.textSecondary,
  },
  orderId: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.text,
    marginTop: verticalScale(4),
  },
  productName: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: verticalScale(8),
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.lightPink,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.text,
  },
  viewOlderButton: {
    backgroundColor: 'rgba(249, 26, 145, 0.1)',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
  },
  viewOlderText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.primary,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(12),
    justifyContent: 'space-between',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(4),
  },
  navLabel: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: colors.textSecondary,
  },
  navLabelActive: {
    color: colors.primary,
  },
});