import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import FirebaseService from '../../services/firebase.service';
import _firebaseDb from '../../constants/firebaseDb';

export default function BookingSuccessScreen({ navigation, route }: any) {
  const { appointmentData, transactionId, paymentId, paymentMethod } = route.params;
  
  useEffect(() => {
    updateTransactionStatus();
  }, []);
  
  const updateTransactionStatus = async () => {
    if(paymentMethod !== 'Cash on Visit') {
      await FirebaseService.update(
        _firebaseDb.transactions,
        paymentId,
        { paymentStatus: 'paid' }
      );
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

      <LinearGradient
        colors={['#F5F9FF', '#EEF6FF', '#FFFFFF']}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.innerIconContainer}>
              <Ionicons
                name="checkmark"
                size={55}
                color="#FFFFFF"
              />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            Booking Confirmed
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Your appointment has been booked
            successfully. You will receive a
            confirmation notification shortly.
          </Text>

          {/* Appointment Card */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>
                BookingId
              </Text>

              <Text style={styles.value}>
                {appointmentData.bookingId}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                TransactionId
              </Text>

              <Text style={styles.value}>
                {transactionId}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Date
              </Text>

              <Text style={styles.value}>
                {new Date(appointmentData.appointmentDate.fullDate).toDateString()}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Time
              </Text>

              <Text style={styles.value}>
                {appointmentData.timeSlot}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Consultation
              </Text>

              <Text style={styles.value}>
                {appointmentData.consultationType}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.primaryButton}
            onPress={() => {
                navigation.navigate('Main', {
                    screen: 'Appointments',
                });
            }}>
            <Text style={styles.primaryButtonText}>
              View Appointments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.secondaryButton}
            onPress={() => {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Main',
                            state: {
                                routes: [
                                    {
                                        name: 'Home',
                                    },
                                ],
                            },
                        },
                    ],
                });
            }}
          >
            <Text style={styles.secondaryButtonText}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
  },

  content: {
    marginTop: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 70,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  innerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22C55E',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },

  title: {
    fontSize: 18,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: Colors.subtitleColor,
    fontFamily: fonts.name.regular,
  },

  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    marginTop: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  value: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  primaryButton: {
    width: '100%',
    height: 50,
    borderRadius: 20,
    backgroundColor: Colors.APP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },

  secondaryButton: {
    width: '100%',
    height: 50,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },

  secondaryButtonText: {
    color: Colors.APP_COLOR,
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },
});