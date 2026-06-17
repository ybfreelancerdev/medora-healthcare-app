import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import AppButton from '../../components/AppButton';
import { showCustom } from '../../services/message.service';

export default function DoctorPendingApprovalScreen() {
  const { logout, fetchUserData }: any = useAuth();
  const [checking, setChecking] = useState(false);

  const handleCheckStatus = async () => {
    try {
      setChecking(true);
      const uid = auth().currentUser?.uid;

      if (!uid) {
        return;
      }

      const latestUser = await fetchUserData(uid);
      const data = latestUser?.data;
      if (data?.approvalStatus === 'approved') {
        showCustom('Doctor account approved');
        // RootNavigator automatically redirects

      } else if (data?.approvalStatus === 'rejected') {
        showCustom('Your application was rejected');
      } else {
        showCustom('Still under review');
      }

    } catch (error) {
      console.log(error);
      showCustom('Failed to check status');
    } finally {
      setChecking(false);
    }
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
            paddingHorizontal: 24,
          }}
        >
          {/* Top Illustration */}
          <View style={styles.topContainer}>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons
                name="doctor"
                size={60}
                color={Colors.APP_COLOR}
              />
            </View>

            <Text style={styles.title}>
              Profile Under Review
            </Text>

            <Text style={styles.subtitle}>
              Your doctor profile has been
              submitted successfully.
            </Text>

            <Text style={styles.description}>
              Our admin team is currently
              verifying your medical details,
              specialization, and license
              information.
            </Text>
          </View>

          {/* Status Card */}
          <View style={styles.card}>
            <View style={styles.statusRow}>
              <View style={styles.statusIcon}>
                <Ionicons
                  name="time-outline"
                  size={22}
                  color="#D97706"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.statusTitle}>
                  Verification Pending
                </Text>

                <Text style={styles.statusText}>
                  Approval usually takes
                  24 to 48 hours.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#2563EB"
              />

              <Text style={styles.infoText}>
                You will receive an email
                once your account is approved.
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#16A34A"
              />

              <Text style={styles.infoText}>
                Your data is securely
                protected and verified.
              </Text>
            </View>

            <View style={[styles.infoRow, {marginBottom:0}]}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#7C3AED"
              />

              <Text style={styles.infoText}>
                Make sure your submitted
                details are accurate.
              </Text>
            </View>
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.refreshButton}
              disabled={checking}
              onPress={handleCheckStatus}
            >
              {checking ?
                <ActivityIndicator color={Colors.APP_COLOR} />
                :
                <>
                  <Ionicons
                    name="refresh"
                    size={18}
                    color={Colors.APP_COLOR}
                    style={{
                      marginRight: 8,
                    }}
                  />

                  <Text style={styles.refreshText}>
                    Check Status
                  </Text>
                </>}
            </TouchableOpacity>

            {/* <TouchableOpacity
              activeOpacity={0.8}
              style={styles.logoutButton}
              onPress={logout}
            >
              <Text style={styles.logoutText}>
                Logout
              </Text>
            </TouchableOpacity> */}
            <AppButton
              title="Logout"
              onPress={logout}
              style={{
                marginTop: 15,
              }}
            />
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
    flex: 1
  },

  topContainer: {
    marginTop: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 40,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },

  title: {
    marginTop: 10,
    fontSize: 20,
    color: Colors.titleColor,
    textAlign: 'center',
    fontFamily: fonts.name.bold,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: Colors.APP_COLOR,
    textAlign: 'center',
    fontFamily: fonts.name.medium,
  },

  description: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
    color: Colors.subtitleColor,
    fontFamily: fonts.name.regular,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  statusTitle: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  statusText: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },

  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 12,
    lineHeight: 20,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  bottomContainer: {
    marginTop: 30,
    marginBottom: 20,
  },

  refreshButton: {
    height: 50,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  refreshText: {
    color: Colors.APP_COLOR,
    fontSize: 15,
    fontFamily: fonts.name.bold,
  },

  logoutButton: {
    height: 50,
    borderRadius: 20,
    backgroundColor: Colors.APP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: fonts.name.bold,
  },
});