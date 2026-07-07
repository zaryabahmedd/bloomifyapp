import React, { useState, useRef, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { getProducts, formatPrice, type ShopifyProduct } from '../lib/shopify';

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
  primary: '#ed2690',
  background: '#f8f6f7',
  cardBg: '#FFFFFF',
  text: '#1b0d15',
  textSecondary: '#9a4c75',
  border: '#e7cfdc',
};

// Category tabs
const categoryTabs = [
  { id: 'all', name: 'All' },
  { id: 'roses', name: 'Roses' },
  { id: 'lilies', name: 'Lilies' },
  { id: 'tulips', name: 'Tulips' },
  { id: 'sunflowers', name: 'Sunflowers' },
  { id: 'orchids', name: 'Orchids' },
];

// Products are now loaded live from Shopify (see lib/shopify.ts).

export default function CategoryScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const tabScrollRef = useRef<ScrollView>(null);

  // Live Shopify products
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getProducts(50)
      .then(data => {
        if (mounted) setProducts(data);
      })
      .catch(err => {
        if (mounted) setError(err.message ?? 'Failed to load products');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product => {
    // The tabs are flower-type keywords; match them against the product title.
    const matchesCategory =
      activeTab === 'all' ||
      product.name.toLowerCase().includes(activeTab.toLowerCase());
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGoBack = () => {
    router.back();
  };

  const navigateToProduct = (product: ShopifyProduct) => {
    router.push({
      pathname: '/productdetails',
      params: {
        id: product.id,
        name: product.name,
        price: product.price.toString(),
        rating: '4.8',
        reviews: '0',
        description: product.description,
        image: product.image,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <MaterialIcons name="arrow-back-ios" size={moderateScale(24)} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Categories</Text>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={() => setShowSearch(!showSearch)}
            >
              <MaterialIcons name="search" size={moderateScale(24)} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton}>
              <MaterialIcons name="language" size={moderateScale(24)} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar (conditional) */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={moderateScale(20)} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <MaterialIcons name="close" size={moderateScale(20)} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Category Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            ref={tabScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {categoryTabs.map((tab) => (
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
                  {tab.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Product Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.gridContainer,
          { paddingBottom: insets.bottom + verticalScale(100) },
        ]}
      >
        {loading && (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.stateText}>Loading flowers…</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.stateContainer}>
            <MaterialIcons name="error-outline" size={moderateScale(40)} color={colors.primary} />
            <Text style={styles.stateText}>{error}</Text>
          </View>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <View style={styles.stateContainer}>
            <MaterialIcons name="local-florist" size={moderateScale(40)} color={colors.textSecondary} />
            <Text style={styles.stateText}>No products found</Text>
          </View>
        )}

        <View style={styles.grid}>
          {filteredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              activeOpacity={0.9}
              onPress={() => navigateToProduct(product)}
            >
              <ImageBackground
                source={{ uri: product.image }}
                style={styles.productImage}
                imageStyle={styles.productImageStyle}
              >
                <LinearGradient
                  colors={['transparent', 'transparent', 'rgba(0,0,0,0.7)']}
                  locations={[0, 0.4, 1]}
                  style={styles.productGradient}
                >
                  {/* Wishlist Button */}
                  <TouchableOpacity
                    style={styles.wishlistButton}
                    onPress={() => toggleFavorite(product.id)}
                  >
                    <MaterialIcons
                      name={favorites.includes(product.id) ? 'favorite' : 'favorite-border'}
                      size={moderateScale(20)}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>

                  {/* Add to Cart Button */}
                  <TouchableOpacity style={styles.addToCartButton} onPress={() => router.push('/cart')}>
                    <MaterialIcons name="add" size={moderateScale(24)} color="#FFFFFF" />
                  </TouchableOpacity>

                  {/* Product Info */}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                    <Text style={styles.productPrice}>{formatPrice(product.price, product.currency)}</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Filter Button */}
      <TouchableOpacity style={[styles.filterFab, { bottom: insets.bottom + verticalScale(90) }]}>
        <MaterialIcons name="tune" size={moderateScale(24)} color="#FFFFFF" />
        <Text style={styles.filterFabText}>Filter</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + verticalScale(8) }]}>
        <TouchableOpacity style={styles.navItem} onPress={handleGoBack}>
          <MaterialIcons name="home" size={moderateScale(24)} color={colors.textSecondary} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="grid-view" size={moderateScale(24)} color={colors.primary} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="favorite-border" size={moderateScale(24)} color={colors.textSecondary} />
          <Text style={styles.navLabel}>Wishlist</Text>
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
    backgroundColor: 'rgba(248, 246, 247, 0.9)',
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  backButton: {
    width: moderateScale(48),
    height: moderateScale(48),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1b0d15',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: moderateScale(96),
    justifyContent: 'flex-end',
  },
  headerIconButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(12),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: scale(16),
    marginBottom: verticalScale(12),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(12),
    height: verticalScale(44),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#1b0d15',
    marginLeft: scale(8),
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e7cfdc',
  },
  tabsContent: {
    paddingHorizontal: scale(16),
    gap: scale(32),
  },
  tab: {
    paddingVertical: verticalScale(16),
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#ed2690',
  },
  tabText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#9a4c75',
  },
  tabTextActive: {
    color: '#ed2690',
  },
  gridContainer: {
    padding: scale(16),
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(60),
    gap: verticalScale(12),
  },
  stateText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#9a4c75',
    textAlign: 'center',
    paddingHorizontal: scale(24),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(16),
  },
  productCard: {
    width: (width - scale(32) - scale(16)) / 2 - 1,
    aspectRatio: 3 / 4,
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  productImage: {
    flex: 1,
  },
  productImageStyle: {
    borderRadius: moderateScale(16),
  },
  productGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: scale(12),
  },
  wishlistButton: {
    position: 'absolute',
    top: scale(12),
    right: scale(12),
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: scale(12),
    right: scale(12),
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#ed2690',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  productInfo: {
    paddingRight: moderateScale(50),
  },
  productName: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: verticalScale(2),
  },
  productPrice: {
    fontSize: moderateScale(12),
    color: 'rgba(255, 255, 255, 0.9)',
  },
  filterFab: {
    position: 'absolute',
    right: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ed2690',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(28),
    gap: scale(8),
    ...Platform.select({
      ios: {
        shadowColor: '#ed2690',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  filterFabText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#f8f6f7',
    borderTopWidth: 1,
    borderTopColor: '#f3e7ee',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(4),
  },
  navLabel: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: '#9a4c75',
  },
  navLabelActive: {
    color: '#ed2690',
  },
});