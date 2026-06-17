import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { _default_profileAvatar } from '../../constants';

export default function ProfileScreen({ navigation }: any) {
  const { logout, userData }: any = useAuth();

  const menuItems = [
    {
      id: 1,
      title: 'Edit Profile',
      icon: 'person-outline',
      type: 'Ionicons',
      color: '#2563EB',
      bg: '#EFF6FF',
      screen: 'EditProfile',
    },
    {
      id: 2,
      title: 'Change Password',
      icon: 'lock-closed-outline',
      type: 'Ionicons',
      color: '#7C3AED',
      bg: '#F3E8FF',
      screen: 'ChangePassword',
    },
    ...(userData?.role !== 'patient'
      ? [
        {
          id: 3,
          title: 'Notifications',
          icon: 'notifications-none',
          type: 'MaterialIcons',
          color: '#D97706',
          bg: '#FEF3C7',
          screen: 'Notifications',
        }]
      : []),
    // {
    //   id: 4,
    //   title: 'Settings',
    //   icon: 'settings',
    //   type: 'Ionicons',
    //   color: '#9333EA',
    //   bg: '#F3E8FF',
    //   screen: 'Settings',
    // },
    {
      id: 5,
      title: userData?.role === 'patient' ? 'Payment History' : 'Transactions',
      icon: 'wallet-outline',
      type: 'Ionicons',
      color: '#DB2777',
      bg: '#FCE7F3',
      screen: userData?.role === 'patient' ? 'PaymentHistory' : 'TransactionHistory',
    },
    {
      id: 6,
      title: 'Help & Support',
      icon: 'help-circle-outline',
      type: 'Ionicons',
      color: '#0284C7',
      bg: '#E0F2FE',
      screen: 'HelpSupport',
    },
    {
      id: 7,
      title: 'Privacy Policy',
      icon: 'shield-checkmark-outline',
      type: 'Ionicons',
      color: '#65A30D',
      bg: '#ECFCCB',
      screen: 'PrivacyPolicy',
    },
    {
      id: 8,
      title: 'Delete Account',
      icon: 'delete-outline',
      type: 'MaterialIcons',
      color: '#DC2626',
      bg: '#FEE2E2',
      screen: 'DeleteAccount',
    },
    {
      id: 9,
      title: 'Logout',
      icon: 'logout',
      type: 'MaterialCommunityIcons',
      color: '#DC2626',
      bg: '#FEE2E2',
      screen: 'Logout',
    },
  ];
  
  const renderIcon = (
    item: any,
  ) => {

    if (item.type === 'Ionicons') {

      return (
        <Ionicons
          name={item.icon}
          size={22}
          color={item.color}
        />
      );
    }

    if (
      item.type === 'MaterialIcons'
    ) {

      return (
        <MaterialIcons
          name={item.icon}
          size={22}
          color={item.color}
        />
      );
    }

    return (
      <MaterialCommunityIcons
        name={item.icon}
        size={22}
        color={item.color}
      />
    );
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F9FF"
      />

      <SafeAreaView
        edges={['top']}
        style={{
          backgroundColor: '#F5F9FF',
        }}
      />

      <LinearGradient
        colors={[
          '#F5F9FF',
          '#EEF6FF',
          '#FFFFFF',
        ]}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <Image
              source={
                userData.profileImage ?
                  { uri: userData.profileImage }
                  :
                  _default_profileAvatar
              }
              style={styles.profileImage}
            />
            <Text style={styles.userName}>
              {userData.fullName}
            </Text>

            <Text style={styles.userEmail}>
              {userData.email}
            </Text>
          </View>

          {/* Menu Card */}
          <View style={styles.menuContainer}>
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={styles.menuItem}
                onPress={() => {
                  (item.title === 'Logout') ?
                    logout() :
                    navigation.navigate(
                      item.screen,
                    )
                  }
                }
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor:
                        item.bg,
                    },
                  ]}
                >
                  {renderIcon(item)}
                </View>

                <Text style={styles.menuTitle}>
                  {item.title}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* App Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>
              Medora v{DeviceInfo.getVersion()}
            </Text>

            <Text style={styles.versionSubText}>
              Your Health, Our Priority
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  profileCard: {
    marginTop: 5,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 34,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 5,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 32,
  },

  userName: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  userEmail: {
    fontSize: 14,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  menuContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 34,
    paddingVertical: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },

  menuItem: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuTitle: {
    flex: 1,
    marginLeft: 15,
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  versionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  versionText: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: fonts.name.semibold,
  },

  versionSubText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontFamily: fonts.name.medium,
  },
});