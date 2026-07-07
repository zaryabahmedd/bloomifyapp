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
  Switch,
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
  textMuted: '#6b7280',
  border: 'rgba(236, 72, 153, 0.1)',
  borderLight: 'rgba(236, 72, 153, 0.2)',
};

// User profile data
const userProfile = {
  name: 'Sophia Anderson',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB69ozqFv2V5iaJld6OJ12MSeFJMNdTfYULz9Hg1mGsO-OF3WryUFcDzRjPfp3PFtX1Mb6VTL2fRJfElRQ-xb6EC9SdryYrrPthd6BLH3ul7Cv-COtSS6e3ck5PhCx6eDcu-oPXQogQxKmj4ozpq6E1Hq8dMu_87Sr-V_al5dE-sKqm5mqa15XrrLit2uKoIjO_H3FrwHOjH0iLNdsg5pik94v6pcPd1VneT2NYLlCFuHZ46nZhRZByokya6ckrx_FFxxADvVwnCY8',
  membershipType: 'Gold Member',
  stats: {
    orders: 12,
    wishlist: 8,
    points: 450,
  },
};

// Menu items
const menuItems = [
  { id: 'account', icon: 'person', label: 'Account Info', route: null },
  { id: 'orders', icon: 'local-florist', label: 'My Orders', route: '/myorders' },
  { id: 'addresses', icon: 'location-on', label: 'My Addresses', route: null },
  { id: 'payment', icon: 'credit-card', label: 'Payment Methods', route: null },
  { id: 'loyalty', icon: 'card-membership', label: 'Loyalty Program', route: null },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleGoBack = () => {
    router.back();
  };

  const handleLogout = () => {
    // Navigate to sign in screen
    router.replace('/signin');
  };

  const handleMenuPress = (route: string | null) => {
    if (route) {
      router.push(route as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="edit" size={moderateScale(24)} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + verticalScale(100) }}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <View style={styles.avatarImage}>
                {/* Using a gradient placeholder since we can't load external images reliably */}
                <MaterialIcons name="person" size={moderateScale(48)} color={colors.primary} />
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={moderateScale(14)} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <View style={styles.membershipBadge}>
            <MaterialIcons name="stars" size={moderateScale(16)} color={colors.primary} />
            <Text style={styles.membershipText}>{userProfile.membershipType}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Orders</Text>
            <Text style={styles.statValue}>{userProfile.stats.orders}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Wishlist</Text>
            <Text style={styles.statValue}>{userProfile.stats.wishlist}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Points</Text>
            <Text style={styles.statValue}>{userProfile.stats.points}</Text>
          </View>
        </View>

        {/* Menu List */}
        <View style={styles.menuSection}>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => handleMenuPress(item.route)}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconContainer}>
                  <MaterialIcons
                    name={item.icon as any}
                    size={moderateScale(24)}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <MaterialIcons
                  name="chevron-right"
                  size={moderateScale(24)}
                  color="rgba(236, 72, 153, 0.3)"
                />
              </TouchableOpacity>
            ))}

            {/* Notifications with Toggle */}
            <View style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <MaterialIcons
                  name="notifications"
                  size={moderateScale(24)}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.menuLabel}>Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#d1d5db', true: colors.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#d1d5db"
              />
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <MaterialIcons name="logout" size={moderateScale(24)} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + verticalScale(8) }]}>
        <TouchableOpacity style={styles.navItem} onPress={handleGoBack}>
          <MaterialIcons name="home" size={moderateScale(24)} color={colors.textMuted} />
          <Text style={styles.navLabel}>Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/category')}>
          <MaterialIcons name="search" size={moderateScale(24)} color={colors.textMuted} />
          <Text style={styles.navLabel}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="favorite-border" size={moderateScale(24)} color={colors.textMuted} />
          <Text style={styles.navLabel}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={moderateScale(24)} color={colors.primary} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Profile</Text>
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
    backgroundColor: 'rgba(255, 245, 247, 0.9)',
  },
  headerButton: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: moderateScale(48),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: verticalScale(24),
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: moderateScale(128),
    height: moderateScale(128),
    borderRadius: moderateScale(64),
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  avatarImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249, 26, 145, 0.1)',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: moderateScale(4),
    right: moderateScale(4),
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: colors.text,
    marginTop: verticalScale(16),
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    marginTop: verticalScale(8),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(6),
    backgroundColor: 'rgba(249, 26, 145, 0.1)',
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: 'rgba(249, 26, 145, 0.2)',
  },
  membershipText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    gap: scale(12),
    marginVertical: verticalScale(16),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: scale(16),
    alignItems: 'center',
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
  statLabel: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: 'rgba(249, 26, 145, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: verticalScale(4),
  },
  statValue: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: colors.text,
  },
  menuSection: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(8),
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    overflow: 'hidden',
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    height: verticalScale(64),
    gap: scale(16),
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(236, 72, 153, 0.08)',
  },
  menuIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(249, 26, 145, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: colors.text,
  },
  logoutSection: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(32),
    marginBottom: verticalScale(40),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: verticalScale(16),
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  logoutText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#ef4444',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(12),
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(4),
  },
  navLabel: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: colors.textMuted,
  },
  navLabelActive: {
    color: colors.primary,
  },
});