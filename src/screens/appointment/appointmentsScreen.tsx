import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import FirebaseService from '../../services/firebase.service';
import _firebaseDb from '../../constants/firebaseDb';
import { _default_profileAvatar, capitalizeFirstLetter, getDrName, getStatusStyle } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const tabs = [
  {
    id: '1',
    title: 'Pending',
    slug: 'pending',
  },
  {
    id: '2',
    title: 'Completed',
    slug: 'completed',
  },
  {
    id: '3',
    title: 'Cancelled',
    slug: 'cancelled',
  },
];

export default function AppointmentsScreen({navigation}: any) {
  const { userData }: any = useAuth();
  const [selectedTab, setSelectedTab] = useState('pending');
  const [isLoading, setisLoading] = useState(false);
  const [appointmentsData, setappointmentsData] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchAppointments(selectedTab);
  //   }, [selectedTab])
  // );

  useEffect(() => {
    fetchAppointments(selectedTab);
  }, []);

  const fetchAppointments = async (status?:string) => {
      setisLoading(true);
      const response = await FirebaseService.getAppointmentsByStatus(
        _firebaseDb.appointments, 
        status || '',
        userData?.id,
        userData?.role,
      );
      if (response.success) {
        setappointmentsData(response.data);
      }
      setisLoading(false);
  };

  const renderAppointment = ({
    item,
  }: any) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
        onPress={() => {
          navigation.navigate('AppointmentDetails', {
            appointment: item
          })
        }}
      >
        {/* Top */}
        <View style={styles.topRow}>
          <View style={styles.iconContainer}>
            {userData.role === 'patient' ?
              <Image
                source={item.doctor.profileImage ? { uri: item.doctor.profileImage } : _default_profileAvatar}
                style={styles.doctorImage}
              />
              :
              <Image
                source={item.patient.profileImage ? { uri: item.patient.profileImage } : _default_profileAvatar}
                style={styles.doctorImage}
              />
            }
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.doctorName}>
              {userData.role === 'patient' ?
                getDrName(item.doctor.fullName)
                :
                item.patient.fullName
              }
            </Text>
              
            <Text style={styles.specialist}>
              {userData.role === 'patient' ?
                item.doctor.specialization
                :
                item.note
              }
            </Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons
              name="calendar-outline"
              size={18}
              style={{marginTop: -3}}
              color="#6B7280"
            />

            <Text style={styles.infoText}>
              {item.appointmentDate?.toDate()?.toDateString()}
            </Text>
          </View>
        </View>
        <View style={[styles.infoRow, {marginTop: 5}]}>
          <View style={styles.infoItem}>
            <Ionicons
              name="time-outline"
              size={18}
              style={{ marginTop: -3 }}
              color="#6B7280"
            />

            <Text style={styles.infoText}>
              {item.timeSlot}
            </Text>
          </View>
        </View>

        <View>
          <View style={[styles.consultationRow, {justifyContent: 'space-between'}]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons
                style={{ marginTop: -3 }}
                name={item.consultationType === 'Chat' ? 'chat-processing-outline' : 'hospital-building'}
                size={20}
                color="#2563EB"
              />

              <Text style={styles.consultationText}>
                {item.consultationType}
              </Text>
            </View>

            <View style={[styles.statusBadge, {backgroundColor: statusStyle.backgroundColor}]}>
              <Text style={[styles.statusText, {color : statusStyle.textColor}]}>
                {capitalizeFirstLetter(item.status)}
              </Text>
            </View>
          </View>

          {userData.role === 'patient' &&
            item.status === 'completed' && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={
                  item.reviewed
                    ? styles.reviewAddedButton
                    : styles.reviewButton
                }
                disabled={item?.reviewed}
                onPress={() =>
                  navigation.navigate(
                    'RatingReview',
                    {
                      appointment: item,
                    },
                  )
                }
              >
                <Ionicons
                  name={
                    item.reviewed
                      ? 'star'
                      : 'star-outline'
                  }
                  size={18}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.reviewButtonText
                  }
                >
                  {item.reviewed
                    ? 'Review Submitted'
                    : 'Rate & Review'}
                </Text>
              </TouchableOpacity>
            )}

        </View>
      </TouchableOpacity>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments(selectedTab);
    setRefreshing(false);
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
          <Text style={styles.headerTitle}>
            My Appointments
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
            {tabs.map(item => {
                const active =
                    selectedTab === item.slug;

                return (
                    <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.8}
                        style={[
                            styles.tabButton,
                            active && styles.activeTab,
                        ]}
                        onPress={() => {
                          setSelectedTab(item.slug);
                          fetchAppointments(item.slug);
                        }}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                active &&
                                styles.activeTabText,
                            ]}
                        >
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>

        {/* Appointment List */}
        {isLoading ?
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Colors.APP_COLOR} />
          </View>
          :
          <FlatList
            data={appointmentsData}
            keyExtractor={item => item.id}
            renderItem={renderAppointment}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 10,
              flexGrow: 1
            }}
            ListEmptyComponent={() => (
              <View style={
                styles.emptyContainer
              }>
                <Ionicons
                  name="search-outline"
                  size={60}
                  color="#CBD5E1"
                />
                <Text style={
                  styles.emptyTitle
                }>
                  No Appointment Found
                </Text>
              </View>
            )}
          />
        }
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 15,
    justifyContent: 'space-between',
    marginBottom: 10
  },

  tabButton: {
    flex: 1,
    height: 45,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  activeTab: {
    backgroundColor: Colors.APP_COLOR,
  },

  tabText: {
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.medium,
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 24,
    // marginRight: 18,
  },

  doctorName: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  specialist: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  statusText: {
    color: '#16A34A',
    fontSize: 10,
    fontFamily: fonts.name.semibold,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoText: {
    marginLeft: 8,
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  consultationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  consultationText: {
    marginLeft: 8,
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.semibold,
  },

  reviewButton: {
    marginTop: 12,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F59E0B',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  reviewAddedButton: {
    marginTop: 12,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#16A34A',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  reviewButtonText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: fonts.name.semibold,
  },
});