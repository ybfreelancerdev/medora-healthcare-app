import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
//import { uploadCategories } from '../../services/categories.service';
import FirebaseService from '../../services/firebase.service';
import CategoriesModal from '../../dialogs/categories';
import { useAuth } from '../../context/AuthContext';
import _firebaseDb from '../../constants/firebaseDb';
import { _default_profileAvatar, getDrName } from '../../constants';
import AppSelectionModal from '../../dialogs/AppSelectionModal';
import { requestNotificationPermission } from "../../utils/notificationPermission";
import { getFcmToken, listenToNotifications } from "../../services/fcm.service";
import firestore from '@react-native-firebase/firestore';

export default function HomeScreen({ navigation }: any) {
  let { userData, setUserData }: any = useAuth();
  const [selectedCity, setSelectedCity] = useState<any>(userData.city || '');
  const [categories, setCategories] = useState<any>([]);
  const [seeCategories, setseeCategories] = useState<boolean>(false);
  const [showCities, setShowCities] = useState<boolean>(false);
  const [doctors, setDoctors] = useState<any>([]);
  const [appointmentsData, setappointmentsData] = useState<any>(null);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const setup = async () => {
      fetchCities();
      fetchCategories();
      fetchDoctors();
      fetchAppointments();
      await requestNotificationPermission();
      userDeviceRegister();
    };

    setup();
  }, []);

  const userDeviceRegister = async () => {
    const fcmToken = await getFcmToken();
    if(!fcmToken) return;
    
    if(userData?.role === 'patient') {
      await firestore()
        .collection(_firebaseDb.patients)
        .doc(userData?.id)
        .update({
          fcmToken: fcmToken,
        });
    } else if(userData?.role === 'doctor') {
      await firestore()
        .collection(_firebaseDb.doctors)
        .doc(userData?.id)
        .update({
          fcmToken: fcmToken,
        });
    }
  }

  // FETCH Cities 
  const fetchCities = async () => {
      try {
          const response = await FirebaseService.getCollection(_firebaseDb.cities);
          if (response.success) {
              const formattedData =
                  response.data.map(
                      (item: any) => ({
                          label: item.name,
                          value: item.name,
                      }),
                  );
              setCities(formattedData);
          }
      } catch (error) {
          console.log('Cities Error:', error,);
      }
  };

  const fetchCategories = async () => {
      const response =
        await FirebaseService.getCollection(
          _firebaseDb.categories,
          5
        );

      if (response.success) {

        setCategories(
          response.data,
        );
      }
    };

  const fetchDoctors = async (city?:string) => {
    const response = await FirebaseService.getDoctors(
        _firebaseDb.doctors,
        city ? city : selectedCity,
        5
      );

    if (response.success) {
      setDoctors(
        response.data,
      );
    }
  };

  const updateCity = async (city?:string) => {
    const response = await FirebaseService.update(
      _firebaseDb.patients,
      userData.id,
      {
        city: city,
      },
    );
    userData.city = city;
    setUserData(userData);
  }

  const fetchAppointments = async (status?:string) => {
        const response = await FirebaseService.getAppointmentsByStatus(_firebaseDb.appointments, status || 'pending', userData?.id, userData?.role);
        if (response.success) {
          setappointmentsData(response.data?.[0]);
        }
    };

  const renderCategory = ({ item }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.categoryCard}
        onPress={() => {
          navigation.navigate('Doctors', { category: item });
        }}
      >
        <View style={styles.categoryIconContainer}> 
          <MaterialCommunityIcons name={item.icon} size={32} color={Colors.APP_COLOR} /> 
        </View>

        <Text style={styles.categoryTitle}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDoctor = ({ item }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.doctorCard}
      >
        <View style={styles.doctorTopSection}>
          <Image
            source={item.profileImage ? {uri: item.profileImage} : _default_profileAvatar}
            style={styles.doctorsImage}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.doctorName}>
              {getDrName(item.fullName)}
            </Text>

            <Text style={styles.specialistText}>
              {item.specialization}
            </Text>
          </View>

          <View style={styles.ratingContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name="star"
                size={14}
                style={{ marginTop: -3 }}
                color="#D97706"
              />

              <Text style={[styles.ratingText, { marginLeft: 4 }]}>
                {item.rating}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AppointmentBooking', {doctor: item})}
          style={styles.bookButton}
        >
          <Text style={styles.bookButtonText}>
            Book Appointment
          </Text>
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

      <CategoriesModal
        visible={seeCategories}
        onClose={() => setseeCategories(false)}
        onSelectCategory={(item:any) => {
          navigation.navigate('Doctors', { category: item });
        }}
      />

      <AppSelectionModal
        visible={showCities}
        title="Select City"
        data={cities}
        value={selectedCity}
        onClose={() =>
          setShowCities(false)
        }
        onSelect={item => {
          setSelectedCity(item.value);
          fetchDoctors(item.value);
          updateCity(item.value);
        }}
      />

      {/* Top Safe Area */}
      <SafeAreaView
        edges={['top']}
        style={{ backgroundColor: '#F5F9FF' }}
      />

      <LinearGradient
        colors={['#F5F9FF', '#EEF6FF', '#FFFFFF']}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.cityButton}
            onPress={() => setShowCities(true)}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color={Colors.APP_COLOR}
            />

            <Text
              style={styles.cityText}
              numberOfLines={1}
            >
              {selectedCity || 'Select City'}
            </Text>

            <Ionicons
              name="chevron-down"
              size={18}
              color={Colors.subtitleColor}
            />
          </TouchableOpacity>

          <View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Hello</Text>
              <MaterialCommunityIcons name="hand-wave" size={20} color="#F59E0B" style={{ marginLeft: 6 }} />
            </View>

            <Text style={styles.userName}>
              {userData.fullName}
            </Text>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            // paddingBottom: 30,
          }}
        >
          {/* Search */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { navigation.navigate('Doctors') }}
            style={styles.searchContainer}
          >
            <Ionicons
              name="search"
              size={20}
              color="#9CA3AF"
            />

            <Text style={styles.searchPlaceholder}>
              Search doctors...
            </Text>
          </TouchableOpacity>

          {/* Health Banner */}
          <LinearGradient
            colors={['#2563EB', '#1D4ED8']}
            style={styles.bannerContainer}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>
                Your Health Matters
              </Text>

              <Text style={styles.bannerSubtitle}>
                Book appointments with trusted doctors quickly and easily.
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.navigate('Doctors') }}
                style={styles.bannerButton}
              >
                <Text style={styles.bannerButtonText}>
                  Book Now
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.bannerEmoji}>
              🏥
            </Text>
          </LinearGradient>

          {/* Categories */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Categories
            </Text>

            <TouchableOpacity
            onPress={() => setseeCategories(true)}>
              <Text style={styles.seeAllText}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            data={categories}
            keyExtractor={item => item.id}
            renderItem={renderCategory}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              marginVertical: 10
            }}
          />

          {/* Upcoming Appointment */}
          {appointmentsData && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Upcoming Appointment
                </Text>
              </View>

              <View style={styles.appointmentCard}>
                <View style={styles.appointmentTopSection}>
                  <Image
                    source={appointmentsData.doctor.profileImage ? {uri: appointmentsData.doctor.profileImage} : _default_profileAvatar}
                    style={styles.doctorImage}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.appointmentDoctorName}>
                      {getDrName(appointmentsData?.doctor?.fullName)}
                    </Text>

                    <Text style={styles.appointmentSpecialist}>
                      {appointmentsData?.doctor?.specialization}
                    </Text>
                  </View>
                </View>

                <View style={styles.appointmentInfoContainer}>
                  <View style={[styles.appointmentInfoCard, { marginRight: 10 }]}>
                    <Text style={styles.infoLabel}>
                      Date
                    </Text>

                    <Text style={styles.infoValue}>
                      {appointmentsData.appointmentDate?.toDate()?.toDateString()}
                    </Text>
                  </View>

                  <View style={[styles.appointmentInfoCard, { marginLeft: 10 }]}>
                    <Text style={styles.infoLabel}>
                      Time
                    </Text>

                    <Text style={styles.infoValue}>
                      {appointmentsData.timeSlot}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.joinButton}
                  onPress={() => {
                    navigation.navigate('AppointmentDetails', {
                      appointment: appointmentsData
                    })
                  }}
                >
                  <Text style={styles.joinButtonText}>
                    Join Consultation
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Top Doctors */}
          {doctors.length > 0 && (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Top Doctors
              </Text>

              <TouchableOpacity>
                <Text style={styles.seeAllText}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <FlatList
            scrollEnabled={false}
            data={doctors}
            keyExtractor={item => item.id}
            renderItem={renderDoctor}
            contentContainerStyle={{
              paddingHorizontal: 24,
              marginVertical: 10
            }}
          />
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 5
  },

  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  greetingText: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  userName: {
    // marginTop: 5,
    fontSize: 15,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#FFFFFF',
    // borderRadius: 18,
    // paddingHorizontal: 14,
    height: 45,

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.05,
    // shadowRadius: 10,
    // elevation: 3,
  },

  cityText: {
    marginHorizontal: 8,
    maxWidth: 100,
    color: Colors.titleColor,
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },

  searchContainer: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  searchPlaceholder: {
    marginLeft: 10,
    color: Colors.subtitleColor,
    fontSize: 14,
    fontFamily: fonts.name.medium,
  },

  bannerContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },

  bannerTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: fonts.name.bold,
  },

  bannerSubtitle: {
    marginTop: 10,
    color: '#DBEAFE',
    lineHeight: 22,
    fontSize: 12,
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
    color: '#2563EB',
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },

  bannerEmoji: {
    fontSize: 70,
    marginLeft: 15,
  },

  sectionHeader: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  seeAllText: {
    fontSize: 14,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.semibold,
  },

  categoryCard: {
    width: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 32.5,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryTitle: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.medium,
  },

  appointmentCard: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  appointmentTopSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 16,
  },

  appointmentDoctorName: {
    fontSize: 15,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  appointmentSpecialist: {
    color: Colors.subtitleColor,
    fontSize: 12,
    fontFamily: fonts.name.medium,
  },

  appointmentInfoContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },

  appointmentInfoCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  infoLabel: {
    fontSize: 10,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  infoValue: {
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  joinButton: {
    marginTop: 15,
    height: 50,
    backgroundColor: Colors.APP_COLOR,
    borderRadius: 18,

    justifyContent: 'center',
    alignItems: 'center',
  },

  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },

  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  doctorTopSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  doctorsImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 16,
  },

  doctorName: {
    fontSize: 15,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  specialistText: {
    color: Colors.subtitleColor,
    fontSize: 12,
    fontFamily: fonts.name.medium,
  },

  ratingContainer: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },

  ratingText: {
    color: '#D97706',
    fontSize: 10,
    fontFamily: fonts.name.semibold,
  },

  bookButton: {
    marginTop: 10,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',

    justifyContent: 'center',
    alignItems: 'center',
  },

  bookButtonText: {
    color: Colors.APP_COLOR,
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },
});