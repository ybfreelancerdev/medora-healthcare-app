import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';

export default function SettingsScreen({ navigation }: any) {

  const [appointmentReminder, setAppointmentReminder] = useState(true);
  const [chatNotification, setChatNotification] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsData = [
    {
      id: 1,
      title: 'Appointment Reminder',
      subtitle: 'Receive reminder before appointment',
      icon: 'calendar-month',
      type: 'MaterialIcons',
      color: '#2563EB',
      bg: '#EFF6FF',
      isSwitch: true,
      value: appointmentReminder,
      onChange:
        setAppointmentReminder,
    },
    {
      id: 2,
      title: 'Chat Notifications',
      subtitle: 'Get notified for doctor messages',
      icon: 'chat-processing-outline',
      type: 'MaterialCommunityIcons',
      color: '#16A34A',
      bg: '#DCFCE7',
      isSwitch: true,
      value: chatNotification,
      onChange:
        setChatNotification,
    }
  ];

  const renderIcon = (
    item: any,
  ) => {

    if (
      item.type === 'Ionicons'
    ) {
      return (
        <Ionicons
          name={item.icon}
          size={24}
          color={item.color}
        />
      );
    }

    if (
      item.type ===
      'MaterialCommunityIcons'
    ) {
      return (
        <MaterialCommunityIcons
          name={item.icon}
          size={24}
          color={item.color}
        />
      );
    }

    return (
      <MaterialIcons
        name={item.icon}
        size={24}
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.headerButton}
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={Colors.titleColor}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Settings
          </Text>

          <View style={{ width: 45 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 20,
          }}
        >
          {/* Banner */}
          <View style={styles.bannerCard}>
            <View
              style={
                styles.bannerIcon
              }
            >
              <MaterialIcons
                name="settings"
                size={34}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.bannerTitle}>
              App Settings
            </Text>

            <Text
              style={
                styles.bannerSubtitle
              }
            >
              Customize your Medora
              experience and manage
              preferences.
            </Text>
          </View>

          {/* Settings List */}
          {settingsData.map(item => (
            <View
              key={item.id}
              style={styles.settingCard}
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

              <View style={{ flex: 1 }}>
                <Text style={styles.title}>
                  {item.title}
                </Text>

                <Text
                  style={
                    styles.subtitle
                  }
                >
                  {item.subtitle}
                </Text>
              </View>

              {item.isSwitch && (
                <Switch
                  value={item.value}
                  onValueChange={
                    item.onChange
                  }
                  trackColor={{
                    false: '#CBD5E1',
                    true:
                      Colors.APP_COLOR,
                  }}
                  thumbColor="#FFFFFF"
                />
              )}
            </View>
          ))}
        </ScrollView>
      </LinearGradient>

      <SafeAreaView
        edges={['bottom']}
        style={{
          backgroundColor: '#FFFFFF',
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerButton: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  headerTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  bannerCard: {
    marginTop: 5,
    borderRadius: 30,
    backgroundColor: Colors.APP_COLOR,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  bannerIcon: {
    width: 50,
    height: 50,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bannerTitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: fonts.name.bold,
  },

  bannerSubtitle: {
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 12,
    color: '#E0E7FF',
    fontFamily: fonts.name.medium,
  },

  settingCard: {
    marginTop: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  title: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  subtitle: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },
});