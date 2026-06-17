import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import FirebaseService from '../../services/firebase.service';
import _firebaseDb from '../../constants/firebaseDb';
import { _default_profileAvatar, generateBookingId, getDrName } from '../../constants';
import AppointmentSlotsModal from '../../dialogs/appointmentSlotsModal';
import { useAuth } from '../../context/AuthContext';
import { showCustom } from '../../services/message.service';

export default function AppointmentBookingScreen({
  navigation,
  route,
}: any) {
  const { doctor } = route.params;
  const { userData }: any = useAuth();
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState('Chat');
  const [notes, setNotes] = useState('');
  const [doctorAvailability, setDoctorAvailability] = useState<any>([]);
  const [dates, setDates] = useState<any>([]);
  const [slotModalVisible, setSlotModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctor) {
      fetchDoctorAvailability();
    }
  }, [doctor]);

  const fetchDoctorAvailability = async () => {
    const response = await FirebaseService.getDoctorAvailability(_firebaseDb.doctor_availability, doctor.id);
    if (response.success) {
      setDoctorAvailability(response.data);

      const dates = generateAvailableDates(response.data);
      console.log(dates, 'dates');
      setDates(dates)
    }
  };

  const generateAvailableDates = (dtAvailability: any[]) => {
    const result = [];

    const today = new Date();

    for (let i = 0; i < 8; i++) {
      const current = new Date();
      current.setDate(today.getDate() + i);

      const fullDay = current.toLocaleDateString("en-US", {
        weekday: "long",
      });

      // Find doctor availability for this day
      const availability = dtAvailability.find(
        item => item.day === fullDay && item.enabled
      );

      // Skip if not enabled
      if (!availability) continue;

      // ✅ Check today's end time
      if (i === 0) {
        const now = new Date();

        const endDateTime = convertToDateTime(
          current,
          availability.endTime
        );

        // Current time passed end time
        if (now > endDateTime) {
          continue;
        }
      }

      result.push({
        id: `${i + 1}`,
        day: current.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        date: current.getDate().toString(),
        fullDate: current,
      });
    }

    return result;
  };

  const convertToDateTime = (
    date: Date,
    time?: string
  ) => {
    if (!time) {
      return new Date(date);
    }

    const [timePart, modifier] = time.split(" ");

    if (!timePart || !modifier) {
      return new Date(date);
    }

    let [hours, minutes] = timePart
      .split(":")
      .map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    const newDate = new Date(date);

    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);

    return newDate;
  };

  const handleBookAppointment = async () => {
    try {
      if(notes === '') {
        showCustom('Symptoms/Notes are required.');
        return;
      }

      //setLoading(true);
      const appointmentData = {
        bookingId: generateBookingId(),
        patientId: userData?.id,
        doctorId: doctor?.id,
        appointmentDate: selectedDate,
        timeSlot: selectedTime,
        consultationType: consultationType,
        note: notes,
        amount: consultationType === 'Chat' ? doctor.fees.onlineChat : doctor.fees.clinicVisit,
        status: 'pending'
      };

      console.log(appointmentData, 'appointmentData');
      //return
      // const response = await FirebaseService.insert(
      //     _firebaseDb.appointments,
      //     appointmentData,
      //   );

      // if (response.success) {
        navigation.navigate('Payment',
          {
            appointmentData: appointmentData,
            doctor: doctor
          },
        );
      //}

    } catch (error) {
      console.log(
        'Booking Error:',
        error,
      );
    } finally {
      setLoading(false);
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

      {/* Modal */}
      <AppointmentSlotsModal
        visible={slotModalVisible}
        onClose={() =>
          setSlotModalVisible(false)
        }
        selectedDate={selectedDate ? selectedDate.fullDate : null}
        doctorAvailability={
          doctorAvailability
        }
        selectedSlot={selectedTime}
        onSelectSlot={(slot) => {
          setSelectedTime(slot);

          // close modal after select
          setSlotModalVisible(false);
        }}
      />

      <LinearGradient
        colors={['#F5F9FF', '#EEF6FF', '#FFFFFF']}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={Colors.titleColor}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Book Appointment
          </Text>

          <View style={{ width: 45 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          {/* Doctor Card */}
          <View style={styles.doctorCard}>
            <Image
              source={doctor.profileImage ? {uri: doctor.profileImage} : _default_profileAvatar}
              style={styles.doctorImage}
            />

            <View style={{ flex: 1 }}>
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
                  style={{ marginTop: -5 }}
                  color="#F59E0B"
                />

                <Text style={styles.ratingText}>
                  {doctor.rating}
                </Text>
              </View>
            </View>
          </View>

          {/* Select Date */}
          <Text style={styles.sectionTitle}>
            Select Date
          </Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={dates}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingRight: 24,
              marginHorizontal: 20
            }}
            renderItem={({ item }) => {
              const active =
                selectedDate === item;

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={[
                    styles.dateCard,
                    active && styles.activeDateCard,
                  ]}
                  onPress={() =>
                    setSelectedDate(item)
                  }
                >
                  <Text
                    style={[
                      styles.dayText,
                      active && styles.activeDateText,
                    ]}
                  >
                    {item.day}
                  </Text>

                  <Text
                    style={[
                      styles.dateText,
                      active && styles.activeDateText,
                    ]}
                  >
                    {item.date}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* Time Slots */}
          <Text style={styles.sectionTitle}>
            Available Time
          </Text>

          <View style={styles.timeContainer}>
            <View style={styles.timeCard}>
              {selectedTime && (
                <Text style={[styles.timeText, {fontSize: 16}]}>{selectedTime}</Text>
              )}
              {selectedDate ?
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSlotModalVisible(true)}>
                  <Text
                    style={[
                      styles.timeLinkButton,
                      !selectedTime && {fontSize: 14}
                    ]}
                  >
                    {selectedTime ? 'Change slot' : 'Select time slot'}
                  </Text>
                </TouchableOpacity>
                :
                <Text style={styles.timeText}>Select date first then select the time slot</Text>
              }
            </View>
          </View>

          {/* Consultation Type */}
          <Text style={styles.sectionTitle}>
            Consultation Type
          </Text>

          <View style={styles.consultationContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.consultationCard,
                consultationType === 'Chat' &&
                styles.activeConsultationCard,
              ]}
              onPress={() =>
                setConsultationType('Chat')
              }
            >
              <MaterialCommunityIcons
                name="chat-processing-outline"
                size={26}
                color={
                  consultationType === 'Chat'
                    ? '#FFFFFF'
                    : Colors.APP_COLOR
                }
              />

              <Text
                style={[
                  styles.consultationText,
                  consultationType === 'Chat' &&
                  styles.activeConsultationText,
                ]}
              >
                Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.consultationCard,
                consultationType === 'Clinic' &&
                styles.activeConsultationCard,
              ]}
              onPress={() =>
                setConsultationType('Clinic')
              }
            >
              <MaterialCommunityIcons
                name="hospital-building"
                size={26}
                color={
                  consultationType === 'Clinic'
                    ? '#FFFFFF'
                    : Colors.APP_COLOR
                }
              />

              <Text
                style={[
                  styles.consultationText,
                  consultationType === 'Clinic' &&
                  styles.activeConsultationText,
                ]}
              >
                Clinic Visit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notes */}
          <Text style={styles.sectionTitle}>
            Symptoms / Notes
          </Text>

          <View style={styles.notesContainer}>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Describe your symptoms..."
              placeholderTextColor="#9CA3AF"
              multiline
              style={styles.notesInput}
            />
          </View>

          {/* Fee Card */}
          <View style={styles.feeCard}>
            <View>
              <Text style={styles.feeLabel}>
                {consultationType === 'Chat' ?
                  'Online Chat Fee'
                  :
                  'Consultation Fee'
                }
              </Text>

              <Text style={styles.feeAmount}>
                ₹{consultationType === 'Chat' ?
                    doctor.fees.onlineChat
                    :
                    doctor.fees.clinicVisit
                  }
              </Text>
            </View>

            <View style={styles.feeBadge}>
              <Text style={styles.feeBadgeText}>
                30 Min
              </Text>
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.bookButton}
            onPress={handleBookAppointment}>
            <Text style={styles.bookButtonText}>
              Confirm Appointment
            </Text>
          </TouchableOpacity>
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

  headerContainer: {
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

  doctorCard: {
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 15,
    marginHorizontal: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 24,
    marginRight: 18,
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

  ratingContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#D97706',
    fontFamily: fonts.name.semibold,
  },

  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 15,
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  dateCard: {
    width: 75,
    height: 75,
    marginVertical: 5,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },

  activeDateCard: {
    backgroundColor: Colors.APP_COLOR,
  },

  dayText: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  dateText: {
    fontSize: 18,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  activeDateText: {
    color: '#FFFFFF',
  },

  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },

  timeCard: {
    width: '100%',
    // height: 50,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },

  timeText: {
    fontSize: 12,
    marginVertical: 5,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  timeLinkButton: {
    fontSize: 12,
    marginVertical: 5,
    color: Colors.APP_COLOR,
    textDecorationLine: 'underline',
    fontFamily: fonts.name.semibold,
  },

  consultationContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },

  consultationCard: {
    width: '48%',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },

  activeConsultationCard: {
    backgroundColor: Colors.APP_COLOR,
  },

  consultationText: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  activeConsultationText: {
    color: '#FFFFFF',
  },

  notesContainer: {
    marginTop: 10,
    marginHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },

  notesInput: {
    minHeight: 100,
    maxHeight: 100,
    marginHorizontal: 15,
    textAlignVertical: 'top',
    color: Colors.titleColor,
    fontSize: 14,
    fontFamily: fonts.name.medium,
  },

  feeCard: {
    marginHorizontal: 20,
    marginTop: 25,
    backgroundColor: '#EFF6FF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },

  feeLabel: {
    fontSize: 14,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  feeAmount: {
    fontSize: 20,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.bold,
  },

  feeBadge: {
    backgroundColor: '#DBEAFE',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  feeBadgeText: {
    color: Colors.APP_COLOR,
    fontSize: 13,
    fontFamily: fonts.name.semibold,
  },

  bookButton: {
    marginHorizontal: 20,
    height: 50,
    borderRadius: 20,
    backgroundColor: Colors.APP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20
  },

  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },
});