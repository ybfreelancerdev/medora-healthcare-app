import React from 'react';
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
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import { getDrName } from '../../constants';

export default function PrescriptionPreviewScreen({ navigation, route }: any) {

    const prescriptionData = route?.params?.prescriptionData || {};
    const appointment = route?.params?.appointment;
    console.log(prescriptionData, 'prescriptionData')
    const {
        diagnosis = '',
        tests = '',
        notes = '',
        recommendedTests = '',
        medicines = [],
    } = prescriptionData;

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
            Prescription Preview
          </Text>

          <View style={{ width: 45 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}
        >

          {/* Doctor Card */}
          <View style={styles.topCard}>

            <Text style={styles.doctorName}>
              {getDrName(appointment?.doctor?.fullName)}
            </Text>

            <Text style={styles.specialist}>
              {appointment?.doctor?.specialization}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.patientLabel}>
              Patient
            </Text>

            <Text style={styles.patientName}>
              {appointment?.patient?.fullName}
            </Text>
          </View>

          {/* Diagnosis */}
          <View style={styles.card}>

            <Text style={styles.sectionTitle}>
              Diagnosis
            </Text>

            <Text style={styles.sectionText}>
              {diagnosis}
            </Text>
          </View>

          {/* Medicines */}
          <View style={styles.card}>

            <Text style={styles.sectionTitle}>
              Medicines
            </Text>

            {medicines.map(
              (
                item: any,
                index: number,
              ) => {
                console.log(medicines, 'medicines')
                return  (
                <View
                  key={item.id}
                  style={styles.medicineCard}
                >
                  <View style={styles.rowBetween}>
                    <Text style={styles.medicineName}>
                      {index + 1}. {item.medicine}
                    </Text>
                  </View>

                  <Text style={styles.medicineInfo}>
                    Frequency: {item.frequency}
                  </Text>

                  <Text style={styles.medicineInfo}>
                    Duration: {item.duration}
                  </Text>

                  <Text style={styles.medicineInfo}>
                    Timing: {item.timing}
                  </Text>
                </View>
              )},
            )}
          </View>

          {/* Tests */}
          {!!tests && (
            <View style={styles.card}>

              <Text style={styles.sectionTitle}>
                Recommended Tests
              </Text>

              <Text style={styles.sectionText}>
                {tests}
              </Text>
            </View>
          )}

          {/* Notes */}
          <View style={styles.card}>

            <Text style={styles.sectionTitle}>
              Doctor Notes
            </Text>

            <Text style={styles.sectionText}>
              {notes || recommendedTests}
            </Text>
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

  topCard: {
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 15,
    paddingHorizontal: 20,
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

  doctorName: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  specialist: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },

  patientLabel: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  patientName: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  card: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
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

  sectionTitle: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  sectionText: {
    lineHeight: 24,
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  medicineCard: {
    marginTop: 10,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 15
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  medicineName: {
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  medicineInfo: {
    marginTop: 0,
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },
});