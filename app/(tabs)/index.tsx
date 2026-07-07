import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  ImageBackground,
  StatusBar,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { getCollections, type ShopifyCollection } from '../../lib/shopify';

// Menu items for drawer
const menuItems = [
  { id: 'home', icon: 'home', label: 'Home', route: null },
  { id: 'occasion', icon: 'celebration', label: 'Shop by Occasion', route: '/shopoccasion' },
  { id: 'categories', icon: 'category', label: 'Categories', route: '/category' },
  { id: 'cart', icon: 'shopping-cart', label: 'My Cart', route: '/cart' },
  { id: 'deals', icon: 'local-offer', label: 'Flash Deals', route: null },
  { id: 'orders', icon: 'receipt-long', label: 'My Orders', route: '/myorders' },
  { id: 'trackorder', icon: 'local-shipping', label: 'Track my Order', route: '/trackorder' },
  { id: 'receipt', icon: 'receipt', label: 'Order Receipt', route: '/orderreceipt' },
  { id: 'wishlist', icon: 'favorite-border', label: 'Wishlist', route: null },
  { id: 'settings', icon: 'settings', label: 'Settings', route: null },
  { id: 'help', icon: 'help-outline', label: 'Help & Support', route: null },
];

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
  primary: '#f91f94',
  background: '#FFF5F7',
  cardBg: '#FFFFFF',
  text: '#1c0d15',
  textSecondary: '#9e4776',
};

// Quick action items
const quickActions = [
  {
    icon: 'auto-awesome',
    label: 'Custom Bouquet',
    gradient: ['#f91f94', '#ff6fb1'] as const,
    shadowColor: '#f91f94',
    route: null,
  },
  {
    icon: 'local-shipping',
    label: 'Same Day Delivery',
    gradient: ['#7e22ce', '#c084fc'] as const,
    shadowColor: '#7e22ce',
    route: null,
  },
  {
    icon: 'percent',
    label: 'Flash Deals',
    gradient: ['#ea580c', '#fb923c'] as const,
    shadowColor: '#ea580c',
    route: null,
  },
  {
    icon: 'event',
    label: 'By Occasion',
    gradient: ['#16a34a', '#4ade80'] as const,
    shadowColor: '#16a34a',
    route: '/shopoccasion',
  },
];

// Fallback category items (shown while live collections load or if the API fails)
const fallbackCategories = [
  {
    name: 'Roses',
    items: '120+ Items',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2BEnO0vCg5twhOAmP0ypFsAihbQu0IJtRd5DNnkHPKAj99lkdTDjwzkhPvOUjTs_JkPys6DXxBHdqGI6uBkRk5eSjfkHl9hyjBRvVohkqyOaGsnMbe40B80Vw8lO0Ul64Zje78E5nkV87mBU75MRduu7klreQjBF7ICASWIo_FNN2YL_H2VlhCVBwDK0PAzy3hD7esG3fevOsdLXTmnv8E_baa5yCgQiG9H9nacrQYVtmTS_kn9yt_SIxOYUXd5qq3iVdhGY7zOU',
  },
  {
    name: 'Lilies',
    items: '85+ Items',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3EdKQkennaXNox_PkTvbO6II9ftfGj7U0N9UERhHw0njzYvzYnGKKWYD2hGoXQ3iVfgZeKrKWwdTAMyMqKrdtk4x6F5umx8oC18Akg-ow2Nh0PwVe3r81b6DYQhcq3ELsH8uZHw31SxswHufA4_WgFMd3r1XXNRI5nFwm1SSztWWqCjbbBq6KnKlOOhjL2MaKkDMq53Sao-Kv73Ezl-uggzNk_3Zs5zAjHEMNUgds0nRDg4BfOyp4UtJ4UKxFJosYZtQmtZGjM_o',
  },
  {
    name: 'Sunflowers',
    items: '42+ Items',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCDb7IO16p4Vio5uWs2Iy6JOqfENHRFaUJFVwiHczi5LC0BmCnBNJc-aqPxNGWeTkD0ly2aQzAARgmmjs9AGKzqQwjvah3Whr2l9oRhdJaQlP_QxdPWwNqJ70PC3nz0HR7FQzgfMkWmJWZdr4z454_Q_5Cwh5HJU4--VEBjVpfWEh36zVeuqOdwZlviEd80QmcO4frHnjJ_wKMk-riTiF6aVR0Ido35GRQMzAE_fRUULpim75wVx7Ea8ruw518y6DF5ypLIit8yvE',
  },
  {
    name: 'Tulips',
    items: '64+ Items',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4N6jBi3nIhMjEsxn9cUwi4KItI7E6G2j_kK5WHEID30aeJZ13lhxACkLtjn78lQMRKRt6qnVfwWkYZ5UXOEMCSXx8elSBzYpKNXNyQjzTPd5a2XlRxxun3rV572LoZN2ioo6dbQThV1k1HlVzo_7Ucr7oqqKcqi8MsXHAaRpG0oP2xy3oIai7tzlMhGqL9BttmLrxpQ9In4Ub5-WB3EoVYljD3wszAvV0giaryPzevE3TPQ8RYX2M5KGVbyX0zTAetR5eaUtHAgs',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('home');
  const [searchText, setSearchText] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);

  useEffect(() => {
    let mounted = true;
    getCollections(10)
      .then(data => {
        if (mounted && data.length) setCollections(data);
      })
      .catch(() => {
        // Keep the fallback categories on failure.
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Use live Shopify collections when available, otherwise the fallback list.
  const categories =
    collections.length > 0
      ? collections.map(c => ({ name: c.name, items: c.items, image: c.image, handle: c.handle }))
      : fallbackCategories.map(c => ({ ...c, handle: undefined as string | undefined }));
  const drawerAnim = useRef(new Animated.Value(-width * 0.8)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerAnim, {
        toValue: -width * 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setDrawerOpen(false));
  };

  const handleMenuPress = (item: typeof menuItems[0]) => {
    closeDrawer();
    if (item.route) {
      setTimeout(() => router.push(item.route as any), 300);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Drawer Menu */}
      {drawerOpen && (
        <View style={StyleSheet.absoluteFill}>
          <TouchableWithoutFeedback onPress={closeDrawer}>
            <Animated.View
              style={[
                styles.drawerOverlay,
                { opacity: overlayAnim },
              ]}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.drawer,
              { transform: [{ translateX: drawerAnim }], paddingTop: insets.top },
            ]}
          >
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
              <View style={styles.drawerLogoContainer}>
                <MaterialIcons name="local-florist" size={moderateScale(32)} color="#FFFFFF" />
              </View>
              <Text style={styles.drawerBrandName}>Bloomify</Text>
              <Text style={styles.drawerTagline}>Fresh Flowers Delivered</Text>
            </View>

            {/* Menu Items */}
            <ScrollView style={styles.drawerContent} showsVerticalScrollIndicator={false}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.drawerMenuItem,
                    item.id === 'home' && styles.drawerMenuItemActive,
                  ]}
                  onPress={() => handleMenuPress(item)}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={moderateScale(24)}
                    color={item.id === 'home' ? colors.primary : colors.text}
                  />
                  <Text
                    style={[
                      styles.drawerMenuText,
                      item.id === 'home' && styles.drawerMenuTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.id === 'occasion' && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Drawer Footer */}
            <View style={[styles.drawerFooter, { paddingBottom: insets.bottom + verticalScale(16) }]}>
              <TouchableOpacity style={styles.logoutButton}>
                <MaterialIcons name="logout" size={moderateScale(20)} color={colors.primary} />
                <Text style={styles.logoutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
      
      {/* Top Navigation Bar */}
      <View style={[styles.header, { paddingTop: insets.top + verticalScale(8) }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.headerButton} onPress={openDrawer}>
              <MaterialIcons name="menu" size={moderateScale(24)} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.brandContainer}>
              <Text style={styles.brandName}>Bloomify</Text>
              <View style={styles.locationContainer}>
                <MaterialIcons name="location-on" size={moderateScale(12)} color={colors.textSecondary} />
                <Text style={styles.locationText}>Dubai, UAE</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.langButton}>
              <Text style={styles.langText}>EN</Text>
              <MaterialIcons name="translate" size={moderateScale(16)} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <MaterialIcons name="notifications" size={moderateScale(24)} color={colors.primary} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/cart')}>
              <MaterialIcons name="shopping-cart" size={moderateScale(24)} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + verticalScale(100) },
        ]}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialIcons name="search" size={moderateScale(24)} color={colors.primary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search flowers..."
              placeholderTextColor="#9ca3af"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity>
              <MaterialIcons name="mic" size={moderateScale(24)} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="tune" size={moderateScale(24)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Promotional Banner */}
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwIJ8ayTBFr4UjgfZSH7KRPddwSPfYsQHjVvFD5UlQaLxgN8-1lMy7KCadMojySEfJvgPWzibR_4tAfXASf3_QJplLBokHrKvc6cffBzA9Yza4EXAJpuSg5OboAS5ar13HYp5BxOft5G6Nyz8drPs9Vb79JGX1cr6y-mQGSrfD_FFNbiN9BNxkskP3bxOxVKdU0sRwKDVkl1yjLAesa7WfU2cCyFyRifbVtHhvE4FQsS0OUr0U6ArNgld9m30igVPwRjCkp8Dbj_Y',
            }}
            style={styles.banner}
            imageStyle={styles.bannerImage}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.bannerGradient}
            >
              <View style={styles.bannerContent}>
                <View style={styles.offerBadge}>
                  <Text style={styles.offerBadgeText}>Limited Offer</Text>
                </View>
                <Text style={styles.bannerTitle}>Valentine's Special</Text>
                <Text style={styles.bannerSubtitle}>Get 25% Off Today</Text>
                <TouchableOpacity style={styles.shopNowButton}>
                  <Text style={styles.shopNowText}>Shop Now</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContent}
          >
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => action.route && router.push(action.route as any)}
              >
                <LinearGradient
                  colors={action.gradient}
                  style={[styles.quickActionCard, { shadowColor: action.shadowColor }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialIcons name={action.icon as any} size={moderateScale(28)} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>{action.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>Shop by Category</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/category')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCard}
                activeOpacity={0.9}
                onPress={() => router.push('/category')}
              >
                <ImageBackground
                  source={{ uri: category.image }}
                  style={styles.categoryImage}
                  imageStyle={styles.categoryImageStyle}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.categoryGradient}
                  >
                    <View style={styles.categoryContent}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categoryItems}>{category.items}</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + verticalScale(8) }]}>
        <View style={styles.bottomNavContainer}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('home')}
          >
            <MaterialIcons
              name="home"
              size={moderateScale(28)}
              color={activeTab === 'home' ? colors.primary : 'rgba(158, 71, 118, 0.5)'}
            />
            <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('catalog')}
          >
            <MaterialIcons
              name="category"
              size={moderateScale(28)}
              color={activeTab === 'catalog' ? colors.primary : 'rgba(158, 71, 118, 0.5)'}
            />
            <Text style={[styles.navLabel, activeTab === 'catalog' && styles.navLabelActive]}>Catalog</Text>
          </TouchableOpacity>

          {/* Central Action Button */}
          <View style={styles.centralButtonContainer}>
            <TouchableOpacity style={styles.centralButton}>
              <MaterialIcons name="add-circle" size={moderateScale(36)} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.centralButtonLabel}>Custom</Text>
          </View>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push('/myorders')}
          >
            <MaterialIcons
              name="receipt-long"
              size={moderateScale(28)}
              color={activeTab === 'orders' ? colors.primary : 'rgba(158, 71, 118, 0.5)'}
            />
            <Text style={[styles.navLabel, activeTab === 'orders' && styles.navLabelActive]}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push('/profile')}
          >
            <MaterialIcons
              name="person"
              size={moderateScale(28)}
              color={activeTab === 'profile' ? colors.primary : 'rgba(158, 71, 118, 0.5)'}
            />
            <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>Profile</Text>
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
  header: {
    backgroundColor: 'rgba(255, 245, 247, 0.9)',
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(249, 31, 148, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  headerButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
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
        elevation: 2,
      },
    }),
  },
  brandContainer: {
    gap: verticalScale(2),
  },
  brandName: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    color: '#f91f94',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(2),
  },
  locationText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: 'rgba(28, 13, 21, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    gap: scale(4),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  langText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#f91f94',
    textTransform: 'uppercase',
  },
  notificationDot: {
    position: 'absolute',
    top: moderateScale(8),
    right: moderateScale(8),
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#f91f94',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    marginBottom: verticalScale(20),
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(56),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(28),
    paddingHorizontal: scale(16),
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
  searchIcon: {
    marginRight: scale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: '#1c0d15',
  },
  filterButton: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: '#f91f94',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#f91f94',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  bannerContainer: {
    marginBottom: verticalScale(24),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  banner: {
    height: verticalScale(220),
  },
  bannerImage: {
    borderRadius: moderateScale(16),
  },
  bannerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: scale(20),
  },
  bannerContent: {},
  offerBadge: {
    backgroundColor: '#f91f94',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
    alignSelf: 'flex-start',
    marginBottom: verticalScale(8),
  },
  offerBadgeText: {
    color: '#FFFFFF',
    fontSize: moderateScale(10),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: moderateScale(28),
    fontWeight: '800',
    fontStyle: 'italic',
    marginBottom: verticalScale(4),
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: moderateScale(18),
    fontWeight: '500',
    marginBottom: verticalScale(12),
  },
  shopNowButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(20),
    alignSelf: 'flex-start',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  shopNowText: {
    color: '#f91f94',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  sectionContainer: {
    marginBottom: verticalScale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  sectionDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#f91f94',
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    color: '#1c0d15',
  },
  seeAllText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#f91f94',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickActionsContent: {
    paddingRight: scale(16),
    gap: scale(12),
  },
  quickActionCard: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(16),
    padding: scale(16),
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: moderateScale(12),
    fontWeight: '800',
    lineHeight: moderateScale(16),
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(12),
  },
  categoryCard: {
    width: (width - scale(32) - scale(12)) / 2 - 1,
    aspectRatio: 4 / 5,
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  categoryImage: {
    flex: 1,
  },
  categoryImageStyle: {
    borderRadius: moderateScale(16),
  },
  categoryGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: scale(16),
  },
  categoryContent: {},
  categoryName: {
    color: '#FFFFFF',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  categoryItems: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: moderateScale(10),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale(24),
  },
  bottomNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: moderateScale(32),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(4),
  },
  navLabel: {
    fontSize: moderateScale(9),
    fontWeight: '700',
    color: 'rgba(158, 71, 118, 0.5)',
    textTransform: 'uppercase',
    marginTop: verticalScale(2),
  },
  navLabelActive: {
    color: '#f91f94',
  },
  centralButtonContainer: {
    alignItems: 'center',
    marginTop: -verticalScale(40),
  },
  centralButton: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(36),
    backgroundColor: '#f91f94',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFF5F7',
    ...Platform.select({
      ios: {
        shadowColor: '#f91f94',
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
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: '#f91f94',
    textTransform: 'uppercase',
    marginTop: verticalScale(4),
    letterSpacing: 0.5,
  },
  // Drawer styles
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: '#FFFFFF',
    zIndex: 101,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  drawerHeader: {
    backgroundColor: '#f91f94',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(24),
    paddingTop: verticalScale(16),
  },
  drawerLogoContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  drawerBrandName: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  drawerTagline: {
    fontSize: moderateScale(12),
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: verticalScale(4),
  },
  drawerContent: {
    flex: 1,
    paddingTop: verticalScale(16),
  },
  drawerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(14),
    gap: scale(16),
  },
  drawerMenuItemActive: {
    backgroundColor: 'rgba(249, 31, 148, 0.08)',
    borderRightWidth: 3,
    borderRightColor: '#f91f94',
  },
  drawerMenuText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#1c0d15',
    flex: 1,
  },
  drawerMenuTextActive: {
    color: '#f91f94',
    fontWeight: '700',
  },
  newBadge: {
    backgroundColor: '#f91f94',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(10),
  },
  newBadgeText: {
    fontSize: moderateScale(9),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(249, 31, 148, 0.1)',
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(16),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingVertical: verticalScale(12),
  },
  logoutText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#f91f94',
  },
});
