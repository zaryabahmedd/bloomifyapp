import React, { useState } from 'react';
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

// Light theme colors
const colors = {
  primary: '#f91a91',
  background: '#FFF5F7',
  cardBg: '#FFFFFF',
  text: '#1c0d15',
  textSecondary: '#9e4776',
  textMuted: '#6b7280',
  border: 'rgba(0, 0, 0, 0.05)',
  savingsGreen: '#2D6A4F',
};

// Cart item type
interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

// Add-on type
interface AddOn {
  id: string;
  name: string;
  price: number;
  icon: string;
}

// Initial cart data
const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Midnight Romance',
    variant: 'Premium / Large Size',
    price: 59.50,
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFNyIF73AkWhlTfWV7C_1bmNdzZ33IDhRxUCi2EP_VrWxMJp7W-dj_J3LLGlQhCogCl1ghv5YTasl5f7Y6wyvjYuwTZQ2THuWFqmzFZyzOphfmmMD4VXTphvmeZxA9FwCW7RJB5WntnpAAQrKKueh2PN5dy8yD9LV02SZy6NDUK75EC8EpqpoSgtxIdU1kM4oayrLTftauFyV3acbh3vcavuTSDPMJRpNKTrk60StbEPkn6pPs4UlOiNafHRgJH-mlUTBMwfFqiUM',
  },
];

// Add-ons data
const addOns: AddOn[] = [
  { id: '1', name: 'Glass Vase', price: 12.00, icon: 'local-bar' },
  { id: '2', name: 'Greeting Card', price: 4.50, icon: 'note' },
  { id: '3', name: 'Chocolates', price: 15.00, icon: 'card-giftcard' },
];

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [couponApplied, setCouponApplied] = useState(true);
  const couponCode = 'FLOWER20';
  const discountPercent = 20;

  const handleGoBack = () => {
    router.back();
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const removeCoupon = () => {
    setCouponApplied(false);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = couponApplied ? subtotal * (discountPercent / 100) : 0;
  const deliveryFee = 0; // Free delivery
  const total = subtotal - discount + deliveryFee;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.headerButton} onPress={handleGoBack}>
          <MaterialIcons name="arrow-back-ios" size={moderateScale(24)} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <Text style={styles.headerSubtitle}>{itemCount} Item{itemCount !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="more-horiz" size={moderateScale(24)} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + verticalScale(180) }}
      >
        <View style={styles.content}>
          {/* Cart Items */}
          <View style={styles.section}>
            {cartItems.length === 0 ? (
              <View style={styles.emptyCart}>
                <MaterialIcons name="shopping-cart" size={moderateScale(64)} color={colors.border} />
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptySubtitle}>Add some beautiful flowers!</Text>
                <TouchableOpacity
                  style={styles.shopButton}
                  onPress={() => router.push('/category')}
                >
                  <Text style={styles.shopButtonText}>Start Shopping</Text>
                </TouchableOpacity>
              </View>
            ) : (
              cartItems.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <TouchableOpacity onPress={() => removeItem(item.id)}>
                        <MaterialIcons name="delete" size={moderateScale(20)} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.itemVariant}>{item.variant}</Text>
                    <View style={styles.itemFooter}>
                      <View style={styles.quantityControl}>
                        <TouchableOpacity
                          style={styles.qtyButton}
                          onPress={() => updateQuantity(item.id, -1)}
                        >
                          <Text style={styles.qtyButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyValue}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.qtyButton}
                          onPress={() => updateQuantity(item.id, 1)}
                        >
                          <Text style={styles.qtyButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Complete Your Bouquet - Add-ons */}
          {cartItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Complete Your Bouquet</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.addOnsContainer}
              >
                {addOns.map(addon => (
                  <View key={addon.id} style={styles.addOnCard}>
                    <View style={styles.addOnIconContainer}>
                      <MaterialIcons
                        name={addon.icon as any}
                        size={moderateScale(36)}
                        color="rgba(249, 26, 145, 0.4)"
                      />
                    </View>
                    <Text style={styles.addOnName}>{addon.name}</Text>
                    <View style={styles.addOnFooter}>
                      <Text style={styles.addOnPrice}>${addon.price.toFixed(2)}</Text>
                      <TouchableOpacity style={styles.addOnButton}>
                        <MaterialIcons name="add" size={moderateScale(16)} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Coupon Section */}
          {cartItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.couponLabel}>Have a coupon?</Text>
              {couponApplied ? (
                <View style={styles.couponCard}>
                  <View style={styles.couponLeft}>
                    <MaterialIcons name="local-activity" size={moderateScale(24)} color={colors.primary} />
                    <View>
                      <Text style={styles.couponCode}>{couponCode}</Text>
                      <Text style={styles.couponSuccess}>Applied successfully!</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={removeCoupon}>
                    <Text style={styles.couponRemove}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.couponInputCard}>
                  <MaterialIcons name="local-activity" size={moderateScale(24)} color={colors.textMuted} />
                  <Text style={styles.couponPlaceholder}>Enter coupon code</Text>
                  <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Price Breakdown */}
          {cartItems.length > 0 && (
            <View style={styles.section}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
              </View>
              {couponApplied && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Discount ({discountPercent}%)</Text>
                  <Text style={[styles.priceValue, styles.discountValue]}>-${discount.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery</Text>
                <View style={styles.freeBadge}>
                  <Text style={styles.freeText}>FREE</Text>
                </View>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Checkout Bar */}
      {cartItems.length > 0 && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + verticalScale(16) }]}>
          <View style={styles.bottomBarContent}>
            <View style={styles.totalPayContainer}>
              <Text style={styles.totalPayLabel}>TOTAL PAY</Text>
              <Text style={styles.totalPayValue}>${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.9} onPress={() => router.push('/orderreceipt')}>
              <LinearGradient
                colors={['#f91a91', '#ff5eb3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.checkoutGradient}
              >
                <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                <MaterialIcons name="arrow-forward" size={moderateScale(20)} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    backgroundColor: 'rgba(255, 245, 247, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  headerSubtitle: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: verticalScale(2),
  },
  content: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(24),
  },
  section: {
    marginBottom: verticalScale(32),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: colors.text,
    marginBottom: verticalScale(16),
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  emptyCart: {
    alignItems: 'center',
    paddingVertical: verticalScale(60),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: colors.text,
    marginTop: verticalScale(16),
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    color: colors.textMuted,
    marginTop: verticalScale(8),
  },
  shopButton: {
    marginTop: verticalScale(24),
    backgroundColor: colors.primary,
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(24),
  },
  shopButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cartItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(16),
    flexDirection: 'row',
    gap: scale(16),
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: verticalScale(12),
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
  itemImage: {
    width: moderateScale(96),
    height: moderateScale(96),
    borderRadius: moderateScale(12),
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    flex: 1,
    marginRight: scale(8),
  },
  itemVariant: {
    fontSize: moderateScale(12),
    color: colors.textMuted,
    marginTop: verticalScale(2),
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderWidth: 1,
    borderColor: 'rgba(249, 26, 145, 0.1)',
    gap: scale(12),
  },
  qtyButton: {
    width: moderateScale(24),
    height: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.primary,
  },
  qtyValue: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.text,
    minWidth: moderateScale(16),
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.primary,
  },
  addOnsContainer: {
    gap: scale(16),
  },
  addOnCard: {
    width: moderateScale(144),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(12),
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
  addOnIconContainer: {
    width: '100%',
    height: moderateScale(96),
    backgroundColor: '#f3f4f6',
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  addOnName: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: colors.text,
    marginBottom: verticalScale(8),
  },
  addOnFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addOnPrice: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: colors.primary,
  },
  addOnButton: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponLabel: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.text,
    marginBottom: verticalScale(12),
  },
  couponCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(249, 26, 145, 0.3)',
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  couponCode: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  couponSuccess: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: colors.savingsGreen,
    marginTop: verticalScale(2),
  },
  couponRemove: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: colors.textMuted,
  },
  couponInputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    borderWidth: 1,
    borderColor: colors.border,
  },
  couponPlaceholder: {
    flex: 1,
    fontSize: moderateScale(14),
    color: colors.textMuted,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
  },
  applyButtonText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  priceLabel: {
    fontSize: moderateScale(14),
    color: colors.textMuted,
  },
  priceValue: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.text,
  },
  discountValue: {
    color: colors.savingsGreen,
  },
  freeBadge: {
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(4),
  },
  freeText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: colors.savingsGreen,
    letterSpacing: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: verticalScale(16),
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  totalPayContainer: {
    gap: verticalScale(2),
  },
  totalPayLabel: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 2,
  },
  totalPayValue: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: colors.primary,
  },
  checkoutButton: {
    flex: 1,
    borderRadius: moderateScale(28),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  checkoutGradient: {
    height: moderateScale(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
  },
  checkoutText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },
});