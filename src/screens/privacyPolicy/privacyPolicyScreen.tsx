import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';

const policySections = [
  {
    id: 1,
    title: 'Information We Collect',
    icon: 'person-outline',
    content:
      'We collect basic profile information, appointment details, uploaded reports, prescriptions, and communication history to provide healthcare services.',
  },
  {
    id: 2,
    title: 'Medical Records Security',
    icon: 'shield-outline',
    content:
      'Your medical records and reports are securely stored and accessible only to authorized doctors and healthcare staff.',
  },
  {
    id: 3,
    title: 'Appointments & Payments',
    icon: 'calendar-outline',
    content:
      'Appointment bookings, cancellations, and payment history are securely maintained within the Medora platform.',
  },
  {
    id: 4,
    title: 'Chat & Consultation',
    icon: 'chatbubble-ellipses-outline',
    content:
      'Doctor-patient conversations and consultation details are kept private and protected with secure communication standards.',
  },
  {
    id: 5,
    title: 'Data Sharing',
    icon: 'share-social-outline',
    content:
      'Medora never sells your personal information. Your data is shared only with healthcare professionals involved in your treatment.',
  },
  {
    id: 6,
    title: 'Account Safety',
    icon: 'lock-closed-outline',
    content:
      'Users are responsible for maintaining the confidentiality of their account credentials and passwords.',
  },
];

export default function PrivacyPolicyScreen({
  navigation,
}: any) {

  const renderIcon = (
    icon: string,
  ) => {

    return (
      <Ionicons
        name={icon}
        size={22}
        color={Colors.APP_COLOR}
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
            Privacy Policy
          </Text>

          <View style={{ width: 45 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingHorizontal: 24,
          }}
        >
          {/* Top Banner */}
          <View style={styles.bannerCard}>
            <View
              style={
                styles.bannerIcon
              }
            >
              <MaterialIcons
                name="privacy-tip"
                size={34}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.bannerTitle}>
              Your Privacy Matters
            </Text>

            <Text
              style={
                styles.bannerSubtitle
              }
            >
              Medora is committed to
              protecting your personal
              and medical information.
            </Text>
          </View>

          {/* Last Updated */}
          <View
            style={
              styles.updatedContainer
            }
          >
            <Ionicons
              name="time-outline"
              size={18}
              color="#64748B"
            />

            <Text style={styles.updatedText}>
              Last updated: May 2026
            </Text>
          </View>

          {/* Policy Sections */}
          {policySections.map(item => (
            <View
              key={item.id}
              style={styles.policyCard}
            >
              <View
                style={
                  styles.policyHeader
                }
              >
                <View
                  style={
                    styles.iconContainer
                  }
                >
                  {renderIcon(
                    item.icon,
                  )}
                </View>

                <Text
                  style={
                    styles.policyTitle
                  }
                >
                  {item.title}
                </Text>
              </View>

              <Text
                style={
                  styles.policyContent
                }
              >
                {item.content}
              </Text>
            </View>
          ))}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using Medora, you agree
              to our privacy practices and
              secure healthcare policies.
            </Text>
          </View>
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
    paddingVertical: 20,
    paddingHorizontal: 25,
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

  updatedContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },

  updatedText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#64748B',
    fontFamily: fonts.name.medium,
  },

  policyCard: {
    marginTop: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },

  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  policyTitle: {
    flex: 1,
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  policyContent: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 22,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  footer: {
    marginTop: 15,
    marginBottom: 10,
    alignItems: 'center',
  },

  footerText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 22,
    color: '#94A3B8',
    fontFamily: fonts.name.medium,
  },
});