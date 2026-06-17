import React, { useState } from 'react';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import FirebaseService from '../../services/firebase.service';
import _firebaseDb from '../../constants/firebaseDb';
import { generateTransactionId } from '../../constants';
import { showCustom } from '../../services/message.service';

const paymentMethods = [
  {
    id: '1',
    title: 'Credit / Debit Card',
    icon: 'credit-card',
  },
  {
    id: '2',
    title: 'UPI Payment',
    icon: 'google-wallet',
  },
  {
    id: '3',
    title: 'Cash on Visit',
    icon: 'cash',
  },
];

export default function PaymentScreen({ navigation, route }: any) {

  const {doctor, appointmentData} = route.params;
  const [selectedMethod, setSelectedMethod] = useState('1');
  const [platformFee, setPlatformFee] = useState<number>(49);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const selectedPaymentMethod = paymentMethods.find(x => x.id === selectedMethod)?.title || '';
      appointmentData.amount = (Number(appointmentData.amount) + platformFee);

      const payload = {
        ...appointmentData,
        appointmentDate: appointmentData.appointmentDate.fullDate
      };

      const response = await FirebaseService.insert(
        _firebaseDb.appointments,
        payload,
      );

      if (response.success) {

        const transPayload = {
          appointmentId: response.id,
          transactionId: generateTransactionId(),
          paymentMethod: selectedPaymentMethod,
          amount: appointmentData.amount,
          doctorFee: appointmentData.amount - platformFee,
          platformFee: platformFee,
          paymentStatus: 'pending',
        };

        const transResponse = await FirebaseService.insert(
          _firebaseDb.transactions,
          transPayload,
        );

        if (response.success) {
          navigation.replace(
            'BookingSuccess',
            {
              appointmentData: appointmentData,
              transactionId: transPayload.transactionId,
              paymentId: transResponse.id,
              paymentMethod: selectedPaymentMethod
            },
          );
        }
        else {
          showCustom('Opps, something went wrong. Please try again.');
        }
      }
    } catch (error) {
      console.log(
        'Booking Error:',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentIcon = (
    icon: string,
    active: boolean,
  ) => {

    const color =
      active
        ? '#FFFFFF'
        : Colors.APP_COLOR;

    switch (icon) {

      case 'credit-card':
        return (
          <FontAwesome5
            name="credit-card"
            size={22}
            color={color}
          />
        );

      case 'google-wallet':
        return (
          <MaterialCommunityIcons
            name="wallet-outline"
            size={24}
            color={color}
          />
        );

      default:
        return (
          <MaterialCommunityIcons
            name="cash"
            size={24}
            color={color}
          />
        );
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
            Payment
          </Text>

          <View style={{width: 45}} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
        >
          {/* Appointment Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>
              Appointment Summary
            </Text>

            <View style={styles.summaryRow}>
              <Text style={styles.label}>
                Doctor
              </Text>

              <Text style={styles.value}>
                {doctor.fullName}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.label}>
                Date
              </Text>

              <Text style={styles.value}>
                {new Date(appointmentData.appointmentDate.fullDate).toDateString()}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.label}>
                Time
              </Text>

              <Text style={styles.value}>
                {appointmentData.timeSlot}
              </Text>
            </View>

            <View style={[styles.summaryRow, { marginBottom: 15}]}>
              <Text style={styles.label}>
                Consultation
              </Text>

              <Text style={styles.value}>
                {appointmentData.consultationType}
              </Text>
            </View>
          </View>

          {/* Payment Methods */}
          <Text style={styles.sectionTitle}>
            Payment Method
          </Text>

          {paymentMethods.map(item => {

            const active =
              selectedMethod === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={[
                  styles.paymentCard,
                  active &&
                    styles.activePaymentCard,
                ]}
                onPress={() =>
                  setSelectedMethod(item.id)
                }
              >
                <View
                  style={[
                    styles.iconContainer,
                    active &&
                      styles.activeIconContainer,
                  ]}
                >
                  {renderPaymentIcon(
                    item.icon,
                    active,
                  )}
                </View>

                <Text
                  style={[
                    styles.paymentTitle,
                    active &&
                      styles.activePaymentTitle,
                  ]}
                >
                  {item.title}
                </Text>

                <Ionicons
                  name={
                    active
                      ? 'radio-button-on'
                      : 'radio-button-off'
                  }
                  size={22}
                  color={
                    active
                      ? '#FFFFFF'
                      : '#9CA3AF'
                  }
                />
              </TouchableOpacity>
            );
          })}

          {/* Price Details */}
          <View style={styles.priceCard}>
            <Text style={styles.cardTitle}>
              Payment Details
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Consultation Fee
              </Text>

              <Text style={styles.priceValue}>
                ₹{appointmentData.amount}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Platform Fee
              </Text>

              <Text style={styles.priceValue}>
                ₹{platformFee}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={[styles.priceRow, {alignContent: 'center'}]}>
              <Text style={styles.totalLabel}>
                Total Amount
              </Text>

              <Text style={styles.totalAmount}>
                ₹{(Number(appointmentData.amount) + platformFee)}
              </Text>
            </View>
          </View>

          {/* Pay Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.payButton}
            onPress={handlePayment}
          >
            <Text style={styles.payButtonText}>
              Pay ₹{Number(appointmentData.amount) + platformFee}
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

  summaryCard: {
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
    marginVertical: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  label: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  value: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  paymentCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },

  activePaymentCard: {
    backgroundColor: Colors.APP_COLOR,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  activeIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  paymentTitle: {
    flex: 1,
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  activePaymentTitle: {
    color: '#FFFFFF',
  },

  priceCard: {
    paddingVertical: 5,
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  priceLabel: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  priceValue: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 10,
  },

  totalLabel: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  totalAmount: {
    fontSize: 16,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.bold,
  },

  payButton: {
    marginHorizontal: 20,
    height: 50,
    borderRadius: 20,
    backgroundColor: Colors.APP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },
});