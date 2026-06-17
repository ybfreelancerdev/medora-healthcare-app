import React, { useState } from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import CancelAppointmentModal from '../../dialogs/cancelAppointment';
import { showCustom } from '../../services/message.service';
import { _default_profileAvatar, canCancelAppointment, capitalizeFirstLetter, getDrName, getStatusStyle } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import CompleteAppointmentModal from '../../dialogs/completeAppointment';
import Loading from '../../components/Loading';
import _firebaseDb from '../../constants/firebaseDb';
import FirebaseService from '../../services/firebase.service';
import firestore from '@react-native-firebase/firestore';

export default function AppointmentDetailsScreen({navigation, route}: any) {
  const { userData }: any = useAuth();
  const appointment = route?.params?.appointment;
  const statusStyle = getStatusStyle(appointment.status);
  const appointmentStatus = appointment?.status || 'Pending';
  const [cancelVisible, setCancelVisible] = useState(false);
  const [completeVisible, setCompleteVisible] = useState(false);
  const canCancel = canCancelAppointment(appointment.createdAt);
  const [isLoading, setisLoading] = useState(false);

  const changeAppointmentStatus = async (status:any) => {
    try {
      setisLoading(true);

      const result = await FirebaseService.update(_firebaseDb.appointments, appointment.id, {status: status});
      if(result.success) {
        if (appointment?.transactions?.paymentMethod === 'Cash on Visit') {
          await FirebaseService.update(
            _firebaseDb.transactions,
            appointment?.transactions?.id,
            { paymentStatus: 'paid' }
          );

          await firestore()
            .collection(_firebaseDb.doctors)
            .doc(userData?.id)
            .update({
              patients: firestore.FieldValue.increment(1),
            });
        }

        if(status === 'completed') {
          showCustom('Appointment completed successfully');
        }
        else {
          showCustom('Appointment cancelled successfully');
        }
        navigation.goBack();
      }
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setisLoading(false);
    }
  }

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

      <CancelAppointmentModal
        visible={cancelVisible}
        onClose={() => setCancelVisible(false)}
        onConfirm={() => {
          setCancelVisible(false);
          changeAppointmentStatus('cancelled');
        }}
      />

      <CompleteAppointmentModal
        visible={completeVisible}
        onClose={() => setCompleteVisible(false)}
        onConfirm={() => {
          setCompleteVisible(false);
          changeAppointmentStatus('completed');
        }}
      />

      <Loading visible={isLoading} />

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
            Appointment Details
          </Text>
          
          {(appointmentStatus === 'pending' && userData?.role === 'doctor') ? 
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.headerButton}
              onPress={() => { setCompleteVisible(true) }}
            >
              <MaterialCommunityIcons
                name="check"
                size={22}
                color={Colors.APP_COLOR}
              />
            </TouchableOpacity>
            :
            <View style={{width : 45}}/>
          }
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}
        >
          {/* Doctor Card */}
          <View style={styles.doctorCard}>
            <View style={styles.doctorTop}>
              {userData.role === 'patient' ?
                <Image
                  source={appointment.doctor.profileImage ? { uri: appointment.doctor.profileImage } : _default_profileAvatar}
                  style={styles.doctorImage}
                />
                :
                <Image
                  source={appointment.patient.profileImage ? { uri: appointment.patient.profileImage } : _default_profileAvatar}
                  style={styles.doctorImage}
                />
              }

              <View style={{ flex: 1 }}>
                <Text style={styles.doctorName}>
                  {userData.role === 'patient' ?
                    getDrName(appointment?.doctor?.fullName)
                    :
                    appointment?.patient?.fullName
                  }
                </Text>
                
                {userData.role === 'patient' && (
                  <Text style={styles.specialist}>
                    {appointment?.doctor?.specialization}
                  </Text>
                )}

                {appointment?.doctor?.rating > 0 && (
                  <View style={styles.ratingRow}>
                    <Ionicons
                      name="star"
                      size={15}
                      style={{ marginTop: -3 }}
                      color="#F59E0B"
                    />

                    <Text style={styles.ratingText}>
                      {appointment?.doctor?.rating} Rating
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, {backgroundColor: statusStyle.backgroundColor}]}>
                <Text style={[styles.statusText, {color: statusStyle.textColor}]}>
                  {capitalizeFirstLetter(appointment.status)}
                </Text>
              </View>

              <Text style={styles.bookingId}>
                ID: {appointment?.bookingId}
              </Text>
            </View>
          </View>

          {/* Appointment Schedule */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Schedule
            </Text>

            <View style={styles.scheduleContainer}>
              <View style={styles.scheduleIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color={Colors.APP_COLOR}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.scheduleTitle}>
                  Appointment Date
                </Text>

                <Text style={styles.scheduleValue}>
                  {appointment.appointmentDate?.toDate()?.toDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.scheduleContainer}>
              <View style={styles.scheduleIcon}>
                <Ionicons
                  name="time-outline"
                  size={22}
                  color={Colors.APP_COLOR}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.scheduleTitle}>
                  Appointment Time
                </Text>

                <Text style={styles.scheduleValue}>
                  {appointment.timeSlot}
                </Text>
              </View>
            </View>
          </View>

          {/* Consultation Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Consultation Details
            </Text>

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <MaterialCommunityIcons
                  name={appointment?.consultationType === 'Chat' ? 'chat-processing-outline' : 'hospital-building'}
                  size={22}
                  color="#2563EB"
                />

                <Text style={styles.detailLabel}>
                  Consultation
                </Text>
              </View>

              <Text style={styles.detailValue}>
                {appointment?.consultationType}
              </Text>
            </View>

            {userData.role === 'patient' && (
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Ionicons
                    name="location-outline"
                    size={22}
                    color="#2563EB"
                  />

                  <Text style={styles.detailLabel}>
                    Hospital
                  </Text>
                </View>

                <Text style={styles.detailValue}>
                  {appointment?.doctor?.clinicName}
                </Text>
              </View>
            )}

            {userData?.role === 'patient' && (
              <View style={[styles.detailRow, { marginBottom: 0 }]}>
                <View style={styles.detailLeft}>
                  <Ionicons
                    name="wallet-outline"
                    size={22}
                    color="#2563EB"
                  />

                  <Text style={styles.detailLabel}>
                    Fee
                  </Text>
                </View>

                <Text style={styles.feeText}>
                  ₹{appointment?.amount}
                </Text>
              </View>
            )}
          </View>

          {/* Notes */}
          <View style={styles.notesCard}>
            <View style={styles.notesHeader}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color={Colors.APP_COLOR}
              />

              <Text style={styles.notesTitle}>
                Symptoms / Notes
              </Text>
            </View>
            <Text style={styles.detailValue}>
              {appointment?.note}
            </Text>
            {appointment?.patient?.diseases?.length > 0 && (
              <View>
                <Text style={[styles.sectionTitle, { fontSize: 12, marginTop: 10, marginBottom: 0 }]}>
                  Diseases
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {appointment?.patient?.diseases.map((item:any) => (
                    <View style={{ backgroundColor: '#EEF6FF', borderRadius: 14, paddingHorizontal:10, paddingVertical: 5, marginBottom: 10, marginRight: 10 }}>
                      <Text style={[styles.scheduleTitle, { color: Colors.APP_COLOR }]}>
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {appointment?.prescription && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.prescriptionCard}
              onPress={() =>
                navigation.navigate(
                  'PrescriptionPreview',
                  {
                    prescriptionData: appointment.prescription,
                    appointment
                  },
                )
              }
            >
              <View style={styles.prescriptionLeft}>
                <View style={styles.prescriptionIcon}>
                  <MaterialCommunityIcons
                    name="prescription"
                    size={24}
                    color={Colors.APP_COLOR}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.prescriptionTitle}>
                    Prescription Available
                  </Text>

                  <Text style={styles.prescriptionSubtitle}>
                    Tap to view doctor's prescription
                  </Text>
                </View>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}

          {/* Notes */}
          {userData.role === 'patient' && (
            <View style={styles.notesCard}>
              <View style={styles.notesHeader}>
                <Ionicons
                  name="document-text-outline"
                  size={22}
                  color={Colors.APP_COLOR}
                />

                <Text style={styles.notesTitle}>
                  Important Notes
                </Text>
              </View>

              {appointment?.consultationType === 'Chat' && (
                <>
                  <Text style={styles.notesText}>
                    • Doctor will reply during the scheduled consultation time.
                  </Text>

                  <Text style={styles.notesText}>
                    • You can upload reports and prescriptions in chat.
                  </Text>

                  <Text style={styles.notesText}>
                    • Keep notifications enabled for instant updates.
                  </Text>
                </>
              )}
              {appointment?.consultationType !== 'Chat' && (
                <>
                  <Text style={styles.notesText}>
                    • Please arrive 15 minutes before your appointment.
                  </Text>

                  <Text style={styles.notesText}>
                    • Carry your previous medical reports and ID proof.
                  </Text>

                  <Text style={styles.notesText}>
                    • Follow clinic safety and hygiene guidelines.
                  </Text>
                </>
              )}
            </View>
          )}

          {/* Action Buttons */}
          {/* {userData?.role === 'patient' && ( */}
            <>
            <View style={styles.buttonRow}>
              {userData?.role === 'patient' && appointmentStatus === 'pending' && canCancel && (
                <>
                  <TouchableOpacity
                    onPress={() => setCancelVisible(true)}
                    activeOpacity={0.8}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelText}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <View style={{ width: 20 }} />
                </>
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.joinButton}
                onPress={() => {
                  navigation.navigate('Chat', {
                    appointment: appointment,
                  });
                }}
              >
                <Ionicons
                  name="chatbubble-ellipses"
                  size={18}
                  style={{ marginTop: -3 }}
                  color="#FFFFFF"
                />

                <Text style={styles.joinText}>
                  Open Chat
                </Text>
              </TouchableOpacity>
            </View>

              {capitalizeFirstLetter(appointmentStatus) === 'Completed' && (
                <>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                    >
                      <Text style={styles.secondaryText}>
                        Download PDF
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() =>
                        navigation.navigate(
                          'AppointmentBooking',
                          {
                            doctor: appointment?.doctor,
                          },
                        )
                      }
                    >
                      <Text style={styles.primaryText}>
                        Rebook
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {capitalizeFirstLetter(appointmentStatus) === 'Cancelled' && (
                <TouchableOpacity
                  style={styles.fullButton}
                  onPress={() =>
                    navigation.navigate(
                      'AppointmentBooking',
                      {
                        doctor: appointment?.doctor,
                      },
                    )
                  }
                >
                  <Text style={styles.fullButtonText}>
                    Rebook Appointment
                  </Text>
                </TouchableOpacity>
              )}
            </>
          {/* )} */}
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
    paddingHorizontal: 20,
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
    borderRadius: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  doctorTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  doctorImage: {
    width: 60,
    height: 60,
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

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },

  ratingText: {
    marginLeft: 6,
    fontSize: 10,
    color: '#D97706',
    fontFamily: fonts.name.semibold,
  },

  statusContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 14,
  },

  statusText: {
    color: '#16A34A',
    fontSize: 10,
    fontFamily: fonts.name.semibold,
  },

  bookingId: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.semibold,
  },

  card: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
    marginBottom: 5,
  },

  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scheduleIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  scheduleTitle: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  scheduleValue: {
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 15,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailLabel: {
    marginLeft: 12,
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  detailValue: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.semibold,
  },

  feeText: {
    fontSize: 16,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.bold,
  },

  notesCard: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  notesTitle: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  notesText: {
    fontSize: 12,
    lineHeight: 24,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.regular,
    marginBottom: 5,
  },

  prescriptionCard: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  prescriptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  prescriptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  prescriptionTitle: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  prescriptionSubtitle: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: 10,
  },

  cancelText: {
    color: Colors.titleColor,
    fontSize: 15,
    fontFamily: fonts.name.semibold,
  },

  joinButton: {
    flex: 1,
    height: 50,
    borderRadius: 20,
    backgroundColor: Colors.APP_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  joinText: {
    marginLeft: 5,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fonts.name.bold,
  },

  fullButton: {
    height: 50,
    borderRadius: 20,
    backgroundColor: Colors.APP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  fullButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: fonts.name.bold,
  },

  secondaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  secondaryText: {
    color: Colors.APP_COLOR,
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },

  primaryButton: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    backgroundColor: Colors.APP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fonts.name.bold,
  },
});