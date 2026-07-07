import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Image,
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
  textMuted: '#6b7280',
  border: 'rgba(0, 0, 0, 0.05)',
};

// Mock order data
const orderData = {
  id: 'ORD-12345',
  status: 'Delivered',
  date: 'October 24, 2023 • 2:30 PM',
  deliveredTo: {
    name: 'Sarah Jenkins',
    address: '123 Floral Lane, Blossom Hill\nCalifornia, 90210',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY2rnsgMEk3XTUCm0T0-gGIYKXymPxGcPV2UhmRMnTLeHFJ0CUOvthNpKiUpdE4y-OiyQfP5KKvWl0uVaBlkXCNaejZnx4g_UddFzRRH88W4-6caW1hbUWWTyENx0vU7Q9WQ6LMN3MDvcVz8DjedQc4b2wYa60_DTIrew6CxhXUYvh6vtcFGtWY1CH4YQS_DkokBtLDLCtnZT1Ow49LX47MWTnDxuQfC3u6xEDlRmsLJABpQJa5qGXQzyLYwTpin2jV4wA-206-88',
  },
  items: [
    {
      id: 1,
      name: 'Midnight Romance',
      quantity: 1,
      price: 85.00,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFNyIF73AkWhlTfWV7C_1bmNdzZ33IDhRxUCi2EP_VrWxMJp7W-dj_J3LLGlQhCogCl1ghv5YTasl5f7Y6wyvjYuwTZQ2THuWFqmzFZyzOphfmmMD4VXTphvmeZxA9FwCW7RJB5WntnpAAQrKKueh2PN5dy8yD9LV02SZy6NDUK75EC8EpqpoSgtxIdU1kM4oayrLTftauFyV3acbh3vcavuTSDPMJRpNKTrk60StbEPkn6pPs4UlOiNafHRgJH-mlUTBMwfFqiUM',
    },
  ],
  subtotal: 85.00,
  deliveryFee: 10.00,
  total: 95.00,
  paymentMethod: {
    type: 'Visa',
    lastFour: '4242',
  },
};

export default function OrderReceiptScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const orderId = params.orderId || orderData.id;

  const handleGoBack = () => {
    router.back();
  };

  const handleDownload = () => {
    // Download receipt functionality
  };

  const handleEmailReceipt = () => {
    // Email receipt functionality
  };

  const handleWriteReview = () => {
    // Navigate to review screen
  };

  const handleReorder = () => {
    // Reorder functionality
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.headerButton} onPress={handleGoBack}>
          <MaterialIcons name="arrow-back" size={moderateScale(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Receipt</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleDownload}>
          <MaterialIcons name="download" size={moderateScale(24)} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + verticalScale(120) }}
      >
        {/* Status Header */}
        <View style={styles.statusHeader}>
          <View style={styles.statusBadge}>
            <MaterialIcons name="check-circle" size={moderateScale(16)} color={colors.primary} />
            <Text style={styles.statusText}>{orderData.status}</Text>
          </View>
          <Text style={styles.orderId}>#{orderId}</Text>
          <Text style={styles.orderDate}>{orderData.date}</Text>
        </View>

        {/* Delivered To Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivered To</Text>
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryInfo}>
              <Text style={styles.recipientName}>{orderData.deliveredTo.name}</Text>
              <Text style={styles.recipientAddress}>{orderData.deliveredTo.address}</Text>
            </View>
            <Image
              source={{ uri: orderData.deliveredTo.photo }}
              style={styles.deliveryPhoto}
            />
          </View>
        </View>

        {/* Order Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          {orderData.items.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Price Breakdown Section */}
        <View style={styles.section}>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>${orderData.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Fee</Text>
              <Text style={styles.priceValue}>${orderData.deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${orderData.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentCard}>
            <View style={styles.visaLogo}>
              <Text style={styles.visaText}>VISA</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentText}>
                {orderData.paymentMethod.type} ending in {orderData.paymentMethod.lastFour}
              </Text>
            </View>
            <MaterialIcons name="lock" size={moderateScale(20)} color={colors.textMuted} />
          </View>
        </View>

        {/* Secondary Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleEmailReceipt}>
            <MaterialIcons name="mail" size={moderateScale(18)} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Email Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleWriteReview}>
            <MaterialIcons name="rate-review" size={moderateScale(18)} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Write Review</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomCta, { paddingBottom: insets.bottom + verticalScale(16) }]}>
        <TouchableOpacity style={styles.reorderButton} onPress={handleReorder}>
          <Text style={styles.reorderButtonText}>Reorder Items</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: 'rgba(248, 245, 247, 0.9)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
    }),
  },
  headerButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  statusHeader: {
    alignItems: 'center',
    paddingVertical: verticalScale(24),
    gap: verticalScale(8),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 26, 145, 0.1)',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
    gap: scale(6),
  },
  statusText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.primary,
  },
  orderId: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: colors.text,
    marginTop: verticalScale(4),
  },
  orderDate: {
    fontSize: moderateScale(14),
    color: colors.textMuted,
  },
  section: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: colors.text,
    marginBottom: verticalScale(16),
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  deliveryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(16),
    flexDirection: 'row',
    gap: scale(16),
    borderWidth: 1,
    borderColor: colors.border,
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
  deliveryInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.text,
    marginBottom: verticalScale(4),
  },
  recipientAddress: {
    fontSize: moderateScale(14),
    color: colors.textMuted,
    lineHeight: moderateScale(20),
  },
  deliveryPhoto: {
    width: moderateScale(96),
    height: moderateScale(96),
    borderRadius: moderateScale(12),
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  productImage: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(12),
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.text,
  },
  productQty: {
    fontSize: moderateScale(14),
    color: colors.textMuted,
    marginTop: verticalScale(2),
  },
  productPrice: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.text,
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(24),
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  priceLabel: {
    fontSize: moderateScale(14),
    color: colors.textMuted,
  },
  priceValue: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.text,
  },
  priceDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: verticalScale(8),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  totalLabel: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  totalValue: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: colors.primary,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    borderWidth: 1,
    borderColor: colors.border,
  },
  visaLogo: {
    width: moderateScale(40),
    height: moderateScale(24),
    backgroundColor: '#f3f4f6',
    borderRadius: moderateScale(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  visaText: {
    fontSize: moderateScale(10),
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#1e3a8a',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    gap: scale(12),
    marginBottom: verticalScale(32),
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(24),
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.primary,
  },
  bottomCta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(248, 245, 247, 0.95)',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reorderButton: {
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  reorderButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },
});