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
  primary: '#ff1492',
  background: '#f8f5f7',
  cardBg: '#FFFFFF',
  text: '#1d0c15',
  textSecondary: '#a14576',
  border: '#fce7f3',
};

// Occasion items
const occasions = [
  { id: 'birthday', icon: 'cake', label: 'Birthday' },
  { id: 'anniversary', icon: 'favorite', label: 'Anniversary' },
  { id: 'romance', icon: 'volunteer-activism', label: 'Romance' },
  { id: 'congrats', icon: 'celebration', label: 'Congrats' },
  { id: 'thanks', icon: 'sentiment-satisfied', label: 'Thanks' },
];

// Trending products
const trendingProducts = [
  {
    id: 1,
    name: 'Midnight Roses',
    price: 45.00,
    rating: 4.8,
    reviews: 120,
    description: 'A vibrant bouquet of deep red roses and dark foliage, perfect for romantic occasions and expressing heartfelt emotions.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArPzVs_WmXJ1vk_8EfPy4QtrU9WbLho5ReGS6p0Y0NvptoEG3VQh13CupwpaktGzAFbMVohA4p64CBMFeL49SNhStyk2Y3V_zCeIEaTFIYFUIT3k_coPmzR6BHz37AOL_-3cbFN8nhgGNiCEeLmw8iF0c8XDiGtOVzagid71K9uL33BrJMRT_N4o_l7TqbkdW9bCAl7e1RphIfLxLe4CHgKVmS02mYxIm379tLPEWGucj16YZThPfw0cqLi9FWjjWmB3LAIkOVqTk',
    isFavorite: true,
  },
  {
    id: 2,
    name: 'Sunlight Daisies',
    price: 38.00,
    rating: 4.7,
    reviews: 89,
    description: 'Bright yellow daisies in a white ceramic vase, bringing warmth and cheerfulness to any space.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrdbimPxRr_jpW91N7ICMQuTM0lxIOgkLD74aUuxBKNyApQNuQ-e6vOvkvHobakp6zXhvdmm1P49rxLcQUI04HfjJ0cfL2qfqkBcXR2IsTMxmZYidONgSUjm4Ha4_DAboi3yufjvFPGYUab-CoUF1XjQuW8UMVSKu_8wgdeAgfd4n7aJI_UtkGFiiXNs3c9iabo6JcnvFUZWyelM5VXX3j8khRSHe-Ep4Vyb3C0VqL0NG-s-QbfKNHUVxNeGBUDgNHPv594kLG0Cw',
    isFavorite: false,
  },
  {
    id: 3,
    name: 'Blushing Tulips',
    price: 42.00,
    rating: 4.9,
    reviews: 134,
    description: 'Soft pink and white tulips wrapped in premium paper, symbolizing perfect love and elegance.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHa2Lec1-QCZ9rk0vU1hTuRvvi5_LOJh4PE1mwFt-t8rZGArnVgD8DRRqb1-0LyeP2-Vxaq2f5SCBjIB3-PHvumuUg4IwG_QcisVIGUlxCjBsLsRDiRVThyADQ84iEJCfDcPQT1Rx0QO_QoZdP5AXqnGsuNWU2f1LRqR_pHJv_mlYn4uN_jIZECdhnlK0N8nmwZSHuiRQeXNdA1CAJbp1uGAGZn2qX4DhHo1XRfCk7_1lI06kTpU_-F7UWUfhk-DyrfDUe7ezJjnk',
    isFavorite: false,
  },
];

// Why Choose Us features
const features = [
  { icon: 'eco', title: 'Fresh Guarantee', subtitle: 'Hand-picked daily' },
  { icon: 'local-shipping', title: 'Same Day Delivery', subtitle: 'Fast & reliable' },
  { icon: 'verified-user', title: 'Secure Payment', subtitle: '100% encrypted' },
  { icon: 'support-agent', title: '24/7 Support', subtitle: 'Always here to help' },
];

// Customer reviews
const reviews = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLgy7t1ir9q9vasDmWLZC_LFFoYGXgBOpbjkTz39S-MkmK_FokxACDgHGXyvdlqgvAKTLZ5lQSmDkw5z19MQMugxHs6ae3Zl5aps-Daiw3F7fpcisw-psqLdJcEbtOaypuUgEwH0Yg8q0Cw0JmUfT0HLigxC8fVQoVGNj1mRVRFbXx8D06gHEKsLYpxb28R1eozYp6D_2DL3Sm0ccGRHNF3yBBvtkYZlUtaPw7dsGYq5NjQtEv4uY5Mb8qmxmpgqlnG_CRBYkE2jY',
    rating: 5,
    comment: '"The lilies arrived perfectly fresh! My mom was so surprised for her birthday. Bloomify is my new go-to."',
  },
  {
    id: 2,
    name: 'David Chen',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHR-iTp1QVvXZKm4cQK8DjTRHAJNGyCW9tUL6-3-GauCmLZX_G9FLzxLXP3MDFYhJeFjUt5LqlSnnRghAuYLxZ8ReUnNCB1i7ZY5FLf29RZR-voW5TJdZQxrG50SJzdN5kv1O5N98bVBInJvOAiM6yfftdWammESsUNG307MprWA3RucKc6NJz--RxXJ3WSK_706tk2tbJTdgC2P3mAIImr2vAbKntgCO1f5j7CaGwTzVcDeeu5YAXmKtPmwkk-iHzoTHBKtPLb-s',
    rating: 5,
    comment: '"Incredible speed! Ordered at 9 AM and the flowers were delivered by lunch. Highly recommend same-day service."',
  },
];

export default function ShopOccasionScreen() {
  const insets = useSafeAreaInsets();
  const [favorites, setFavorites] = useState<number[]>([1]);
  const [activeNav, setActiveNav] = useState('home');

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  const navigateToProduct = (product: typeof trendingProducts[0]) => {
    router.push({
      pathname: '/productdetails',
      params: {
        id: product.id.toString(),
        name: product.name,
        price: product.price.toString(),
        rating: product.rating.toString(),
        reviews: product.reviews.toString(),
        description: product.description,
        image: product.image,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(8) }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <MaterialIcons name="arrow-back-ios" size={moderateScale(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop by Occasion</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + verticalScale(100) },
        ]}
      >
        {/* Shop by Occasion Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Occasion</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.occasionsContainer}
          >
            {occasions.map((occasion) => (
              <TouchableOpacity key={occasion.id} style={styles.occasionItem}>
                <View style={styles.occasionIcon}>
                  <MaterialIcons
                    name={occasion.icon as any}
                    size={moderateScale(28)}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.occasionLabel}>{occasion.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending This Week Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending This Week</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingContainer}
          >
            {trendingProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                activeOpacity={0.9}
                onPress={() => navigateToProduct(product)}
              >
                <View style={styles.productImageContainer}>
                  <ImageBackground
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    imageStyle={styles.productImageStyle}
                  >
                    <TouchableOpacity
                      style={[
                        styles.wishlistButton,
                        favorites.includes(product.id) && styles.wishlistButtonActive,
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                    >
                      <MaterialIcons
                        name={favorites.includes(product.id) ? 'favorite' : 'favorite-border'}
                        size={moderateScale(18)}
                        color={favorites.includes(product.id) ? colors.primary : '#9ca3af'}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <View style={styles.productMeta}>
                    <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                    <Text style={styles.productDot}>•</Text>
                    <View style={styles.ratingContainer}>
                      <MaterialIcons name="star" size={moderateScale(14)} color="#eab308" />
                      <Text style={styles.ratingText}>{product.rating}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push('/cart');
                  }}
                >
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Why Choose Us Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <MaterialIcons
                    name={feature.icon as any}
                    size={moderateScale(24)}
                    color={colors.primary}
                  />
                </View>
                <View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Customer Love Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Love</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsContainer}
          >
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                  <View>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <MaterialIcons
                          key={star}
                          name="star"
                          size={moderateScale(14)}
                          color={star <= review.rating ? '#eab308' : '#d1d5db'}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + verticalScale(8) }]}>
        <TouchableOpacity style={styles.navItem} onPress={handleGoBack}>
          <MaterialIcons name="home" size={moderateScale(28)} color={colors.primary} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="category" size={moderateScale(28)} color="#9ca3af" />
          <Text style={styles.navLabel}>Categories</Text>
        </TouchableOpacity>

        {/* Central Custom Button */}
        <View style={styles.centralButtonContainer}>
          <View style={styles.centralButtonGlow} />
          <TouchableOpacity style={styles.centralButton}>
            <MaterialIcons name="auto-awesome" size={moderateScale(28)} color="#FFFFFF" />
            <Text style={styles.centralButtonLabel}>Custom</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/myorders')}>
          <MaterialIcons name="local-mall" size={moderateScale(28)} color="#9ca3af" />
          <Text style={styles.navLabel}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <MaterialIcons name="person-outline" size={moderateScale(28)} color="#9ca3af" />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
    backgroundColor: colors.background,
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.text,
  },
  headerRight: {
    width: moderateScale(40),
  },
  scrollContent: {
    paddingBottom: verticalScale(24),
  },
  section: {
    marginTop: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(12),
    letterSpacing: -0.3,
  },
  occasionsContainer: {
    paddingHorizontal: scale(16),
    gap: scale(20),
  },
  occasionItem: {
    alignItems: 'center',
    gap: verticalScale(8),
    minWidth: scale(70),
  },
  occasionIcon: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: 'rgba(255, 20, 146, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 20, 146, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  occasionLabel: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  trendingContainer: {
    paddingHorizontal: scale(16),
    gap: scale(16),
  },
  productCard: {
    width: scale(240),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(12),
    borderWidth: 1,
    borderColor: '#fce7f3',
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
  productImageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    marginBottom: verticalScale(12),
  },
  productImage: {
    flex: 1,
  },
  productImageStyle: {
    borderRadius: moderateScale(12),
  },
  wishlistButton: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  productInfo: {
    gap: verticalScale(4),
    marginBottom: verticalScale(12),
  },
  productName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.text,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  productPrice: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.primary,
  },
  productDot: {
    fontSize: moderateScale(12),
    color: '#9ca3af',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(2),
  },
  ratingText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: colors.textSecondary,
  },
  addToCartButton: {
    width: '100%',
    height: verticalScale(40),
    backgroundColor: colors.primary,
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: scale(16),
    gap: scale(16),
  },
  featureCard: {
    width: (width - scale(48)) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(16),
    borderWidth: 1,
    borderColor: '#fdf2f8',
    gap: verticalScale(12),
  },
  featureIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 20, 146, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.text,
  },
  featureSubtitle: {
    fontSize: moderateScale(11),
    color: colors.textSecondary,
  },
  reviewsContainer: {
    paddingHorizontal: scale(16),
    gap: scale(16),
  },
  reviewCard: {
    width: scale(280),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(20),
    borderWidth: 1,
    borderColor: '#fdf2f8',
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
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    marginBottom: verticalScale(12),
  },
  reviewAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },
  reviewName: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.text,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: moderateScale(14),
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: moderateScale(20),
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#fce7f3',
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(12),
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(4),
  },
  navLabel: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: '#9ca3af',
  },
  navLabelActive: {
    fontWeight: '700',
    color: colors.primary,
  },
  centralButtonContainer: {
    alignItems: 'center',
    marginTop: -verticalScale(24),
  },
  centralButtonGlow: {
    position: 'absolute',
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: colors.primary,
    opacity: 0.3,
    top: verticalScale(4),
  },
  centralButton: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.background,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  centralButtonLabel: {
    fontSize: moderateScale(9),
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    marginTop: -verticalScale(2),
    letterSpacing: -0.5,
  },
});