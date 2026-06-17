import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';

const medicines = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    dosage: '1 Tablet • Twice Daily',
    duration: '5 Days',
  },
  {
    id: '2',
    name: 'Vitamin C',
    dosage: '1 Tablet • Once Daily',
    duration: '7 Days',
  },
];

const tests = [
  'Complete Blood Count (CBC)',
  'Vitamin D Test',
];

export default function PrescriptionScreen({
  navigation,
  route,
}: any) {

  const doctor =
    route?.params?.doctor;

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
            Prescription
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.headerButton}
          >
            <Ionicons
              name="download-outline"
              size={22}
              color={Colors.APP_COLOR}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 10,
          }}
        >
          {/* Doctor Card */}
          <View style={styles.doctorCard}>
            <Image
              source={{
                uri:
                  doctor?.image ||
                  'https://i.pravatar.cc/300',
              }}
              style={styles.doctorImage}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.doctorName}>
                {doctor?.name ||
                  'Dr. Sarah Johnson'}
              </Text>

              <Text style={styles.specialist}>
                {doctor?.specialist ||
                  'Cardiologist'}
              </Text>

              <View style={styles.dateRow}>
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  style={{marginTop: -3}}
                  color="#6B7280"
                />

                <Text style={styles.dateText}>
                  12 May 2026
                </Text>
              </View>
            </View>
          </View>

          {/* Diagnosis */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="stethoscope"
                size={22}
                color={Colors.APP_COLOR}
              />

              <Text style={styles.sectionTitle}>
                Diagnosis
              </Text>
            </View>

            <Text style={styles.description}>
              Mild viral fever with headache
              and dehydration symptoms.
            </Text>
          </View>

          {/* Medicines */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="pill"
                size={22}
                color={Colors.APP_COLOR}
              />

              <Text style={styles.sectionTitle}>
                Medicines
              </Text>
            </View>

            {medicines.map(item => (
              <View
                key={item.id}
                style={styles.medicineCard}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.medicineName}>
                    {item.name}
                  </Text>

                  <Text style={styles.medicineInfo}>
                    {item.dosage}
                  </Text>
                </View>

                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>
                    {item.duration}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Instructions */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color={Colors.APP_COLOR}
              />

              <Text style={styles.sectionTitle}>
                Instructions
              </Text>
            </View>

            <Text style={styles.notesText}>
              • Drink plenty of water daily.
            </Text>

            <Text style={styles.notesText}>
              • Take proper rest for 3-5 days.
            </Text>

            <Text style={styles.notesText}>
              • Avoid oily and spicy food.
            </Text>

            <Text style={styles.notesText}>
              • Contact doctor if fever increases.
            </Text>
          </View>

          {/* Recommended Tests */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="test-tube"
                size={22}
                color={Colors.APP_COLOR}
              />

              <Text style={styles.sectionTitle}>
                Recommended Tests
              </Text>
            </View>

            {tests.map((item, index) => (
              <View
                key={index}
                style={styles.testRow}
              >
                <View style={styles.dot} />

                <Text style={styles.testText}>
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Follow Up */}
          <View style={styles.followupCard}>
            <Text style={styles.followupTitle}>
              Follow-up Consultation
            </Text>

            <Text style={styles.followupText}>
              Recommended after 7 days if
              symptoms continue.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.followupButton}
            >
              <Text style={styles.followupButtonText}>
                Book Follow-up
              </Text>
            </TouchableOpacity>
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
    flex: 1,
  },

  header: {
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
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 18,
    marginTop: 10,
    flexDirection: 'row',
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

  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 22,
    marginRight: 16,
  },

  doctorName: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  specialist: {
    fontSize: 14,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateText: {
    marginLeft: 6,
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
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

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  sectionTitle: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  description: {
    fontSize: 14,
    lineHeight: 24,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.regular,
  },

  medicineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },

  medicineName: {
    fontSize: 15,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  medicineInfo: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  durationBadge: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  durationText: {
    color: Colors.APP_COLOR,
    fontSize: 12,
    fontFamily: fonts.name.semibold,
  },

  notesText: {
    fontSize: 14,
    lineHeight: 24,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
    marginBottom: 5,
  },

  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 4,
    backgroundColor: Colors.APP_COLOR,
    marginRight: 10,
  },

  testText: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.medium,
  },

  followupCard: {
    marginTop: 24,
    backgroundColor: '#EFF6FF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },

  followupTitle: {
    fontSize: 18,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  followupText: {
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  followupButton: {
    marginTop: 20,
    height: 52,
    borderRadius: 18,
    backgroundColor: Colors.APP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  followupButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: fonts.name.bold,
  },
});