import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import FirebaseService from '../../services/firebase.service';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from "@react-navigation/native";
import { _default_profileAvatar, getDrName } from '../../constants';
import _firebaseDb from '../../constants/firebaseDb';
import firestore from '@react-native-firebase/firestore';

export default function DoctorHomeScreen({ navigation }: any) {
  const [hasAvailability, setHasAvailability] = useState(true);
  const [appointmentsData, setappointmentsData] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const { userData }: any = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      checkAvailability();
      fetchDashboardCount();
      fetchAppointments();
    }, [])
  );

  useEffect(() => {
    const unsubscribe = firestore()
      .collection(_firebaseDb.notifications)
      .where('userId', '==', userData.id)
      .where('read', '==', false)
      .onSnapshot(snapshot => {
        setNotificationCount(snapshot.size);
      });

    return unsubscribe;
  }, []);

  const checkAvailability = async () => {
    try {

      const response:any = await FirebaseService.get(
          _firebaseDb.doctor_availability,
          userData.id,
        );
      console.log(response, 'availability')
      // IF RECORD EXISTS
      if (response.success && response.data?.availability?.length > 0) {
        setHasAvailability(true);
      } else {
        setHasAvailability(false);
      }

    } catch (error) {
      console.log(
        'Availability Error:',
        error,
      );
      setHasAvailability(false);
    }
  };

  const fetchDashboardCount = async () => {
    const response = await FirebaseService.getDoctorDashboardStats(userData.id);
    if (response.success) {
      console.log(response.data, 'response.data')
      setDashboardData(response.data);
    }
  };

  const fetchAppointments = async () => {
    const response = await FirebaseService.getAppointmentsByStatus(_firebaseDb.appointments, 'pending', userData?.id, userData?.role);
    if (response.success) {
      setappointmentsData(response.data || []);
    }
  };

  const renderAppointment = ({
    item,
  }: any) => {

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.appointmentCard}
      >
        <Image
          source={item.patient.profileImage ? {uri: item.patient.profileImage} : _default_profileAvatar}
          style={styles.patientImage}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.patientName}>
            {item?.patient?.fullName}
          </Text>

          <Text style={styles.appointmentType}>
            {item.consultationType}
          </Text>

          <View style={styles.timeRow}>
            <Ionicons
              name="time-outline"
              size={14}
              color="#64748B"
            />

            <Text style={styles.timeText}>
              {item.timeSlot}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.callButton}
        >
          <Ionicons
            name={item.consultationType ? 'chatbubble-ellipses' : 'hospital-building'}
            size={18}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </TouchableOpacity>
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
          backgroundColor:
            '#F5F9FF',
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
          <View>
            <Text style={styles.welcomeText}>
              Welcome Back 👋
            </Text>

            <Text style={styles.doctorName}>
              {getDrName('dr. ' + userData.fullName)}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Notifications')}
            style={styles.notificationButton}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={
                Colors.titleColor
              }
            />
            {notificationCount > 0 && (
              <View
                style={
                  styles.notificationDot
                }
              />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          {!hasAvailability && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.setupCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.setupIcon}>
                  <MaterialIcons
                    name="schedule"
                    size={28}
                    color="#2563EB"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.setupTitle}>
                    Setup Your Availability
                  </Text>
                </View>
              </View>

              <Text style={styles.setupText}>
                Add your working days and
                consultation timings to
                start accepting patient
                bookings.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.bannerButton, { backgroundColor: Colors.APP_COLOR }]}
                onPress={() =>
                  navigation.navigate(
                    'ScheduleAvailability',
                  )}
              >
                <Text
                  style={[styles.bannerButtonText, { color: '#fff', paddingHorizontal: 10 }]}
                >
                  Setup
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          <>
            {/* Banner */}
            {appointmentsData.length > 0 && (
            <LinearGradient
              colors={[
                '#2563EB',
                '#1D4ED8',
              ]}
              style={styles.bannerCard}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>
                  Today's Schedule
                </Text>

                <Text style={styles.bannerSubtitle}>
                  You have {appointmentsData.length} {appointmentsData.length > 1 ? 'appointments' : 'appointment'}
                  scheduled for today.
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.bannerButton}
                >
                  <Text
                    style={
                      styles.bannerButtonText
                    }
                  >
                    View Schedule
                  </Text>
                </TouchableOpacity>
              </View>

              <MaterialCommunityIcons
                name="doctor"
                size={90}
                color="rgba(255,255,255,0.2)"
              />
            </LinearGradient>
            )}

            {/* Stats */}
            <View style={styles.statsContainer}>
              <TouchableOpacity style={styles.statCard}
                onPress={() => navigation.navigate('Patients')}>
                <View
                  style={[
                    styles.statIconContainer,
                    {
                      backgroundColor: '#DBEAFE'
                    },
                  ]}
                >
                  <Ionicons
                    name={'people-outline'}
                    size={22}
                    color={'#2563EB'}
                  />
                </View>

                <Text style={styles.statValue}>
                  {dashboardData?.patientCount}
                </Text>

                <Text style={styles.statTitle}>
                  Patients
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statCard}
                onPress={() => navigation.navigate('Appointments')}>
                <View
                  style={[
                    styles.statIconContainer,
                    {
                      backgroundColor: '#DCFCE7'
                    },
                  ]}
                >
                  <Ionicons
                    name={'calendar-outline'}
                    size={22}
                    color={'#16A34A'}
                  />
                </View>

                <Text style={styles.statValue}>
                  {dashboardData?.appointmentCount}
                </Text>

                <Text style={styles.statTitle}>
                  Appointments
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statCard}
                onPress={() => navigation.navigate('DoctorReviews')}>
                <View
                  style={[
                    styles.statIconContainer,
                    {
                      backgroundColor: '#FDF2F8'
                    },
                  ]}
                >
                  <Ionicons
                    name={'star-outline'}
                    size={22}
                    color={'#EC4899'}
                  />
                </View>

                <Text style={styles.statValue}>
                  {userData?.ratingCount} 
                </Text>

                <Text style={styles.statTitle}>
                  Reviews
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statCard}
                onPress={() => navigation.navigate('DoctorWallet')}>
                <View
                  style={[
                    styles.statIconContainer,
                    {
                      backgroundColor: '#FEF3C7'
                    },
                  ]}
                >
                  <Ionicons
                    name={'wallet-outline'}
                    size={22}
                    color={'#D97706'}
                  />
                </View>

                <Text style={styles.statValue}>
                  ₹{dashboardData?.earnings} 
                  {/* 12k */}
                </Text>

                <Text style={styles.statTitle}>
                  Earnings
                </Text>
              </TouchableOpacity>
            </View>

            {/* Appointments */}
            {appointmentsData.length > 0 && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Today's Appointments
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Appointments')}
                >
                  <Text style={styles.viewAllText}>
                    View All
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <FlatList
              data={appointmentsData}
              keyExtractor={item => item.id}
              renderItem={
                renderAppointment
              }
              scrollEnabled={false}
              contentContainerStyle={{
                marginTop: 5,
                paddingHorizontal: 20,
              }}
            />
          </>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    marginTop: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  welcomeText: {
    fontSize: 14,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  doctorName: {
    fontSize: 18,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },

  setupCard: {
    marginTop: 15,
    marginHorizontal: 20,
    backgroundColor: '#EFF6FF',
    borderRadius: 28,
    padding: 15,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },

  setupIcon: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  setupTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  setupText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 22,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  bannerCard: {
    marginTop: 15,
    marginHorizontal: 20,
    borderRadius: 34,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },

  bannerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: fonts.name.bold,
  },

  bannerSubtitle: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 22,
    color: '#DBEAFE',
    fontFamily: fonts.name.medium,
  },

  bannerButton: {
    height: 50,
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    borderRadius: 14,
  },

  bannerButtonText: {
    fontSize: 14,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.semibold,
  },

  statsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },

  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statValue: {
    marginTop: 5,
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  statTitle: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  sectionHeader: {
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  viewAllText: {
    fontSize: 12,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.semibold,
  },

  quickActionsRow: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },

  patientImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
  },

  patientName: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  appointmentType: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#64748B',
    fontFamily: fonts.name.medium,
  },

  callButton: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: Colors.APP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
