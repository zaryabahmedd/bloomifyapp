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
  TextInput,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  textSecondary: '#6b7280',
  border: '#f3f4f6',
};

// Size options
const sizeOptions = ['Small', 'Medium', 'Large'];

// Add-ons data
const addOns = [
  {
    id: 1,
    name: 'Glass Vase',
    price: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPKV8Ic4UnGWGnD7_Z9L1S0JTqpZoAPxErBTPZZoBEizG6Oz3SDrOsh74l9zn7nt0i4U4LHaEWvoOn3ViouwrPWeHDxhuJoPW7DUn9gIwhUXPGmJnlXwO8vU_G9Zqxpmw_JKOIiW1OYLU6_Y2clAOcLwp-EzgnEqxn0t-87D5u42FIs_8TaETt3SH3knz-wdeEBAaR17MgeUPKOYcklnNHcZr2WScfzl-qzSZ4N_CsNj-b8RcuhEDuW414_8wI1HOEhbkvdPzO9xU',
  },
  {
    id: 2,
    name: 'Greeting Card',
    price: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCHFAc1CHYGba56WpCcHCMdI3Pb4QgZtVzVqE7PRuiaPdZMUdivdHwcI0rKpGVaPR7-8vQA0-xDH2j6oaqS0e3sKbVajNSFHeqePpwbr5QGb-b0sfbUGC_aRhkb89avdm9BFUgUm535dcyCdlejtCE3xX1hVM-0VwsPtgw--KkAye5rv3JULpyJw5kTIxjCAlYJ5qXvHkBmoRo2sMmOHDJJlUM7wnUndSC64GNogT5hVnIr5m0VQFYRmJkv7dBjlkyRjBEMLoX4cs',
  },
  {
    id: 3,
    name: 'Truffles',
    price: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAqsojxH9f8m9xbENmKd6egsBW0wQ64EVxjR5rnS8nuSyuuZzFLaDHQgN_KjCb0_xnwXyjyuDjw0Rl5iUmMzOvhS32n_T9ya7S4GATHKl79IbvqcNQtOWuc-_L6MRuz8tygbPMxuDFIZPPVzJFkvILPlxjMcbnED0S_HgqJrJDnrt4IlDEsqV3eQtT8UvNWj_hWAVvABIPy95xxLB-QXyjhF9mhX80GmR8CjD0fFcmEYNJXMg6E93yAQDRa6gStMgDfXolmx-_MBs',
  },
];

// Default product data
const defaultProduct = {
  id: 1,
  name: 'Midnight Romance',
  price: 85,
  rating: 4.8,
  reviews: 120,
  description: 'A captivating arrangement of premium long-stemmed red roses and fragrant white Oriental lilies, artfully hand-tied to express deep affection.',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbuf_q5gPcHrtANrkNE2Qnn52N-ruDYWb19B8gOiYtxVzkIpyhtWn1osh3k5fJ6bZRvO_fnuXOhRxqKG88O_m5SgWSN2bBx9q7WkBzVid5SQ9wHGqMo10LBqc82wS3eJlmeRYaVMiNXi4emw87pc6azIcDDK3c7QlFPxdifLagtUu_GNskTbv5OfBuxg3siT49y1P05X7WqrCdlBAINNxVcBfHA7LtLzA4xdC8GDNnG2ELIrfZSM68f_pTDrtOKPaVyuMuisjVYQc',
};

export default function ProductDetailsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  
  // Parse product data from params or use defaults
  const product = {
    id: params.id ? Number(params.id) : defaultProduct.id,
    name: (params.name as string) || defaultProduct.name,
    price: params.price ? Number(params.price) : defaultProduct.price,
    rating: params.rating ? Number(params.rating) : defaultProduct.rating,
    reviews: params.reviews ? Number(params.reviews) : defaultProduct.reviews,
    description: (params.description as string) || defaultProduct.description,
    image: (params.image as string) || defaultProduct.image,
  };

  const [selectedSize, setSelectedSize] = useState('Medium');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([1]);
  const [personalMessage, setPersonalMessage] = useState('');

  const toggleAddOn = (addOnId: number) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  // Calculate total price
  const addOnsTotal = selectedAddOns.reduce((total, id) => {
    const addOn = addOns.find(a => a.id === id);
    return total + (addOn?.price || 0);
  }, 0);
  const totalPrice = product.price + addOnsTotal;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + verticalScale(120) }}
        bounces={false}
      >
        {/* Hero Image Section */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{ uri: product.image }}
            style={styles.heroImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'transparent', 'transparent']}
              style={styles.heroGradient}
            >
              {/* Top Navigation */}
              <View style={[styles.topNav, { paddingTop: insets.top + verticalScale(8) }]}>
                <TouchableOpacity style={styles.glassButton} onPress={handleGoBack}>
                  <MaterialIcons name="arrow-back" size={moderateScale(24)} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.topNavRight}>
                  <TouchableOpacity style={styles.glassButton}>
                    <MaterialIcons name="share" size={moderateScale(24)} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.glassButton}
                    onPress={() => setIsFavorite(!isFavorite)}
                  >
                    <MaterialIcons
                      name={isFavorite ? 'favorite' : 'favorite-border'}
                      size={moderateScale(24)}
                      color={isFavorite ? colors.primary : '#FFFFFF'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>

            {/* Image Pagination */}
            <View style={styles.pagination}>
              <View style={[styles.paginationDot, styles.paginationDotActive]} />
              <View style={styles.paginationDot} />
              <View style={styles.paginationDot} />
            </View>
          </ImageBackground>
        </View>

        {/* Product Details Card */}
        <View style={styles.detailsCard}>
          {/* Title & Price Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.ratingRow}>
                <MaterialIcons name="star" size={moderateScale(16)} color={colors.primary} />
                <Text style={styles.ratingText}>{product.rating}</Text>
                <Text style={styles.reviewsText}>({product.reviews} Reviews)</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>${totalPrice}</Text>
              <Text style={styles.shippingText}>FREE SHIPPING</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{product.description}</Text>

          {/* Size Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SELECT SIZE</Text>
            <View style={styles.sizeOptions}>
              {sizeOptions.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.sizeButtonActive,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeButtonText,
                      selectedSize === size && styles.sizeButtonTextActive,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Add-ons Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ADD-ONS</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.addOnsContainer}
            >
              {addOns.map((addOn) => (
                <TouchableOpacity
                  key={addOn.id}
                  style={[
                    styles.addOnCard,
                    selectedAddOns.includes(addOn.id) && styles.addOnCardActive,
                  ]}
                  onPress={() => toggleAddOn(addOn.id)}
                >
                  <View style={styles.addOnImageContainer}>
                    <Image source={{ uri: addOn.image }} style={styles.addOnImage} />
                  </View>
                  <Text style={styles.addOnName}>{addOn.name}</Text>
                  <Text style={styles.addOnPrice}>+${addOn.price}</Text>
                  <TouchableOpacity
                    style={styles.addOnButton}
                    onPress={() => toggleAddOn(addOn.id)}
                  >
                    <MaterialIcons
                      name={selectedAddOns.includes(addOn.id) ? 'check-circle' : 'add-circle'}
                      size={moderateScale(24)}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Personal Message */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PERSONAL MESSAGE</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here..."
              placeholderTextColor="#9ca3af"
              value={personalMessage}
              onChangeText={setPersonalMessage}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + verticalScale(16) }]}>
        <View style={styles.bottomBarContent}>
          <TouchableOpacity style={styles.buyNowButton}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addToCartButton} onPress={() => router.push('/cart')}>
            <MaterialIcons name="shopping-bag" size={moderateScale(20)} color="#FFFFFF" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    height: height * 0.5,
    width: '100%',
  },
  heroImage: {
    flex: 1,
  },
  heroGradient: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
  },
  topNavRight: {
    flexDirection: 'row',
    gap: scale(8),
  },
  glassButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pagination: {
    position: 'absolute',
    bottom: verticalScale(48),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(6),
  },
  paginationDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
  },
  detailsCard: {
    marginTop: -verticalScale(40),
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: moderateScale(40),
    borderTopRightRadius: moderateScale(40),
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(32),
    minHeight: height * 0.6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(16),
  },
  titleContainer: {
    flex: 1,
    paddingRight: scale(16),
  },
  productName: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: colors.text,
    fontStyle: 'italic',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
    gap: scale(4),
  },
  ratingText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.text,
  },
  reviewsText: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
    marginLeft: scale(4),
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: moderateScale(28),
    fontWeight: '800',
    color: colors.primary,
  },
  shippingText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  description: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    color: colors.textSecondary,
    marginBottom: verticalScale(24),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: verticalScale(16),
  },
  viewAllText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: colors.primary,
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: scale(12),
  },
  sizeButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(24),
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  sizeButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.text,
  },
  sizeButtonTextActive: {
    color: '#FFFFFF',
  },
  addOnsContainer: {
    gap: scale(16),
    paddingRight: scale(24),
  },
  addOnCard: {
    width: scale(140),
    backgroundColor: colors.background,
    borderRadius: moderateScale(16),
    padding: scale(12),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  addOnCardActive: {
    borderColor: 'rgba(249, 26, 145, 0.2)',
  },
  addOnImageContainer: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(12),
    backgroundColor: '#FFFFFF',
    marginBottom: verticalScale(8),
    overflow: 'hidden',
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
  addOnImage: {
    width: '100%',
    height: '100%',
  },
  addOnName: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  addOnPrice: {
    fontSize: moderateScale(12),
    fontWeight: '800',
    color: colors.primary,
  },
  addOnButton: {
    marginTop: verticalScale(8),
  },
  messageInput: {
    backgroundColor: colors.background,
    borderRadius: moderateScale(16),
    padding: scale(16),
    fontSize: moderateScale(14),
    color: colors.text,
    minHeight: verticalScale(100),
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(16),
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  bottomBarContent: {
    flexDirection: 'row',
    gap: scale(16),
  },
  buyNowButton: {
    flex: 0.4,
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(24),
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.primary,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(24),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  addToCartText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#FFFFFF',
  },
});