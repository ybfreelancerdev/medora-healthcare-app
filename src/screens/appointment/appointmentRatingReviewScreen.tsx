import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import FirebaseService from '../../services/firebase.service';
import _firebaseDb from '../../constants/firebaseDb';
import firestore from '@react-native-firebase/firestore';
import { showCustom } from '../../services/message.service';
import { getDrName } from '../../constants';
import { _default_profileAvatar } from '../../constants/index';

export default function AppointmentRatingReviewScreen({ navigation, route }: any) {
  const appointment = route.params?.appointment;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const updateDoctorRating = async (doctorId: string, newRating: number) => {
      const doctorDoc =
        await firestore()
          .collection(
            _firebaseDb.doctors,
          )
          .doc(doctorId)
          .get();

      const doctor = doctorDoc.data();

      const totalRating = (doctor?.totalRating || 0) + newRating;
      const ratingCount = (doctor?.ratingCount || 0) + 1;
      const averageRating = totalRating / ratingCount;

      await firestore()
        .collection(
          _firebaseDb.doctors,
        )
        .doc(doctorId)
        .update({
          totalRating,
          ratingCount,
          rating:
            Number(
              averageRating.toFixed(
                1,
              ),
            ),
        });
    };

  const handleSubmit = async () => {
      try {
        if (rating === 0) {
          showCustom(
            'Please select rating',
          );
          return;
        }

        setLoading(true);
        const response =
          await FirebaseService.insert(
            _firebaseDb.reviews,
            {
              appointmentId: appointment.id,
              doctorId: appointment.doctorId,
              patientId: appointment.patientId,
              rating,
              review,
            },
          );

        if (!response.success) {
          showCustom('Failed to submit review');
          return;
        }

        await FirebaseService.update(
          _firebaseDb.appointments,
          appointment.id,
          {
            reviewed: true,
          },
        );

        await updateDoctorRating(appointment.doctorId, rating);

        showCustom('Review submitted successfully');
        navigation.goBack();
      } catch (error) {
        console.log(error);
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

          <TouchableOpacity
            style={
              styles.headerButton
            }
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={
                Colors.titleColor
              }
            />
          </TouchableOpacity>

          <Text
            style={
              styles.headerTitle
            }
          >
            Rate Doctor
          </Text>

          <View style={{width : 45}} />
        </View>

        {/* Doctor Card */}

        <View
          style={styles.card}
        >

          <Image
            source={
              appointment?.doctor
                ?.profileImage
                ? {
                    uri:
                      appointment
                        ?.doctor
                        ?.profileImage,
                  }
                : _default_profileAvatar
            }
            style={styles.doctorImage}
          />

          <Text
            style={styles.doctorName}
          >
            {getDrName(appointment?.doctor?.fullName)}
          </Text>

          <Text style={styles.specialization}>
            {
              appointment
                ?.doctor
                ?.specialization
            }
          </Text>
        </View>

        {/* Rating */}

        <View style={styles.ratingCard}>
          <Text style={styles.ratingTitle}
          >
            How was your experience?
          </Text>

          <View
            style={
              styles.starContainer
            }
          >
            {[1, 2, 3, 4, 5].map(
              star => (
                <TouchableOpacity
                  key={star}
                  activeOpacity={
                    0.8
                  }
                  onPress={() =>
                    setRating(
                      star,
                    )
                  }
                >
                  <Ionicons
                    name={
                      star <= rating
                        ? 'star'
                        : 'star-outline'
                    }
                    size={35}
                    color="#F59E0B"
                  />
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>

        {/* Review */}

        <View
          style={styles.card}
        >
            <AppInput
                label="Write Review"
                placeholder="Share your experience..."
                value={review}
                onChangeText={setReview}
                multiline={true}
                numberOfLines={5}
                containerStyle={{ width: '100%' }}
            />
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 20,
          }}
        >
          <AppButton
            title="Submit Review"
            loading={loading}
            disabled={loading}
            onPress={
              handleSubmit
            }
          />
        </View>

      </LinearGradient>

      <SafeAreaView
        edges={['bottom']}
        style={{
          backgroundColor:
            '#FFFFFF',
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
    elevation: 3,
  },

  headerTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  card: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 15,
    alignItems: 'center',
    elevation: 4,
  },

  doctorImage: {
    width: 90,
    height: 90,
    borderRadius: 30,
  },

  doctorName: {
    marginTop: 15,
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  specialization: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  ratingCard: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    elevation: 4,
  },

  ratingTitle: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  starContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});