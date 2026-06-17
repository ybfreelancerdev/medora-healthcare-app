import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import { _default_profileAvatar, getDrName } from '../../constants';
import FirebaseService from '../../services/firebase.service';
import _firebaseDb from '../../constants/firebaseDb';

export default function DoctorDetailsScreen({
  navigation,
  route,
}: any) {
  
  const { doctor } = route.params;
  const [doctorAvailability, setDoctorAvailability] = useState<any>([]);

  useEffect(() => {
    if (doctor) {
      fetchDoctorAvailability();
    }
  }, [doctor]);

  const fetchDoctorAvailability = async () => {
    const response = await FirebaseService.getDoctorAvailability(_firebaseDb.doctor_availability, doctor.id);
    if (response.success) {
      setDoctorAvailability(response.data);
    }
  };

  const getMapUrl = (clinicName: string, address: string, city: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${clinicName} ${address} ${city}`
    )}`;
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.APP_COLOR}
      />

      <SafeAreaView
        edges={['top']}
        style={{
          backgroundColor: Colors.APP_COLOR,
        }}
      />

      <LinearGradient
        colors={[Colors.APP_COLOR, '#3B82F6']}
        style={styles.headerContainer}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View style={{width: 45}}/>
        </View>

        <View style={styles.doctorHeader}>
          <Image
            source={doctor.profileImage ? {uri: doctor.profileImage} : _default_profileAvatar}
            style={styles.doctorImage}
          />

          <Text style={styles.doctorName}>
            {getDrName(doctor.fullName)}
          </Text>

          <Text style={styles.specialist}>
            {doctor.specialization}
          </Text>

          <View style={styles.ratingContainer}>
            <Ionicons
              name="star"
              size={15}
              style={{marginTop: -3}}
              color="#FBBF24"
            />

            <Text style={styles.ratingText}>
              {doctor.rating}
            </Text>

            <View style={styles.dot} />

            <Text style={styles.patientText}>
              {doctor.patients} Patients
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.bottomContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 5}}
        >
          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              About Doctor
            </Text>

            <Text style={styles.description}>
              {doctor.description}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="briefcase-outline"
                size={26}
                color={Colors.APP_COLOR}
              />

              <Text style={styles.statValue}>
                {doctor.experience} {doctor.experience > 1 ? 'years': 'year'}
              </Text>

              <Text style={styles.statLabel}>
                Experience
              </Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="account-group-outline"
                size={26}
                color={Colors.APP_COLOR}
              />

              <Text style={styles.statValue}>
                {doctor.patients}
              </Text>

              <Text style={styles.statLabel}>
                Patients
              </Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="star-outline"
                size={26}
                color={Colors.APP_COLOR}
              />

              <Text style={styles.statValue}>
                {doctor.rating}
              </Text>

              <Text style={styles.statLabel}>
                Rating
              </Text>
            </View>
          </View>

          {/* Location & Clinic */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Location & Clinic
            </Text>

            <View style={styles.availabilityCard}>
              <View style={styles.availabilityRow}>
                <Ionicons
                  name="business-outline"
                  size={18}
                  color={Colors.APP_COLOR}
                />

                <Text style={styles.availabilityText}>
                  {doctor.clinicName}
                </Text>
              </View>

              <View style={styles.availabilityRow}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={Colors.APP_COLOR}
                />

                <Text style={styles.availabilityText}>
                  {doctor.address} - {doctor.city}
                </Text>
              </View>

              <View style={styles.availabilityRow}>
                <Ionicons
                  name="navigate-outline"
                  size={18}
                  color={Colors.APP_COLOR}
                />

                <TouchableOpacity activeOpacity={0.8}
                onPress={() => {
                      Linking.openURL(getMapUrl(doctor.clinicName, doctor.address, doctor.city));
                  }}>
                  <Text style={[styles.availabilityText, {textDecorationLine: 'underline', color: Colors.APP_COLOR}]}>
                    View map location
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Availability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Availability
            </Text>

            <View style={styles.availabilityCard}>
              {doctorAvailability
                //?.filter((item:any) => item.enabled)
                .map((item:any, index:number) => (
                  <View style={styles.availabilityRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={Colors.APP_COLOR}
                    />

                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[styles.availabilityText, { fontFamily: fonts.name.bold }]}>
                        {item.day}
                      </Text>
                      {item.enabled ? 
                        <Text style={styles.availabilityText}>
                          {`${item.time}`}
                        </Text>
                        :
                        <Text style={styles.availabilityText}>
                          Closed
                        </Text>
                      }
                    </View>
                  </View>
                ))
              }
            </View>
          </View>

          {/* Consultation Fees */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Consultation Fees
            </Text>

            <View style={styles.availabilityCard}>

              {/* Consultation Fee */}
              <View style={styles.availabilityRow}>
                <Ionicons
                  name="business-outline"
                  size={18}
                  color={Colors.APP_COLOR}
                />

                <Text style={styles.availabilityText}>
                  Clinic Visit Fee: ₹{doctor.fees.clinicVisit}
                </Text>
              </View>

              {/* Follow-up Fee (optional) */}
              <View style={styles.availabilityRow}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={18}
                  color={Colors.APP_COLOR}
                />

                <Text style={styles.availabilityText}>
                  Online Consultation Fee: ₹{doctor.fees.onlineChat}
                </Text>
              </View>
            </View>
          </View>

        </ScrollView>
        {/* Book Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.bookButton}
          onPress={() => navigation.navigate('AppointmentBooking', {doctor: doctor})}
        >
          <Text style={styles.bookButtonText}>
            Book Appointment
          </Text>
        </TouchableOpacity>
      </View>

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
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  headerTop: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  headerButton: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  doctorHeader: {
    alignItems: 'center',
    marginBottom: 10
  },

  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: 30,
  },

  doctorName: {
    marginTop: 10,
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: fonts.name.bold,
  },

  specialist: {
    fontSize: 14,
    color: '#DBEAFE',
    fontFamily: fonts.name.medium,
  },

  ratingContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: fonts.name.semibold,
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#BFDBFE',
    marginHorizontal: 10,
  },

  patientText: {
    fontSize: 12,
    color: '#DBEAFE',
    fontFamily: fonts.name.medium,
  },

  bottomContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: -30,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  section: {
    marginBottom: 10,
    marginTop: 10
  },

  sectionTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  description: {
    fontSize: 12,
    lineHeight: 24,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingVertical: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  statValue: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  statLabel: {
    fontSize: 10,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  availabilityCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20
  },

  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  availabilityText: {
    marginLeft: 12,
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.medium,
  },

  bookButton: {
    height: 50,
    borderRadius: 20,
    backgroundColor: Colors.APP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },
});