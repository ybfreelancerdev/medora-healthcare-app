import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { showCustom } from '../../services/message.service';
import _firebaseDb from '../../constants/firebaseDb';
import FirebaseService from '../../services/firebase.service';
import { getDrName } from '../../constants';

export default function PrescriptionBuilderScreen({ navigation, route }: any) {
  const appointment = route?.params?.appointment;
  const [isLoading, setisLoading] = useState(false);
  const [medicines, setMedicines] =
    useState([
      {
        id: 1,
        medicine: '',
        frequency: '',
        duration: '',
        timing: '',
      },
    ]);

  const validateMedicines = () => {
    for (const item of medicines) {
      if (
        !item.medicine.trim() ||
        !item.frequency.trim() ||
        !item.duration.trim() ||
        !item.timing.trim()
      ) {

        return false;
      }
    }

    return true;
  };

  const addMedicine = () => {
    setMedicines(prev => [
      ...prev,
      {
        id: Date.now(),
        medicine: '',
        frequency: '',
        duration: '',
        timing: '',
      },
    ]);
  };

  const removeMedicine = (id: number) => {
    const updated =
      medicines.filter(
        item => item.id !== id,
      );

    setMedicines(updated);
  };

  const updateMedicine = (
    id: number,
    field: string,
    value: string,
  ) => {

    const updated =
      medicines.map(item => {

        if (item.id === id) {

          return {
            ...item,
            [field]: value,
          };
        }

        return item;
      });

    setMedicines(updated);
  };

  const initialValues = {
    diagnosis: '',
    tests: '',
    notes: '',
  };

  const validationSchema =
    Yup.object({

      diagnosis:
        Yup.string()
          .required(
            'Diagnosis is required',
          ),

      notes:
        Yup.string()
          .required(
            'Doctor notes are required',
          ),
    });

  const handleSavePrescription = async (values: any) => {
    try {
      if (!validateMedicines()) {
        showCustom(
          'Please fill all medicine details',
        );
        return;
      }

      setisLoading(true);

      const prescriptionResponse = await FirebaseService.insert(
        _firebaseDb.prescriptions,
        {
          appointmentId: appointment.id,
          doctorId: appointment.doctorId,
          patientId: appointment.patientId,
          diagnosis: values.diagnosis,
          medicines: medicines,
          recommendedTests: values.tests,
          doctorNotes: values.notes,
        },
      );

      if (!prescriptionResponse.success) {
        showCustom('Something went wrong, Please try again.!');
        return;
      }

      const chatId = `${appointment.doctorId}_${appointment.patientId}_${appointment.bookingId}`;
      await FirebaseService.insert(
        `${_firebaseDb.chats}/${chatId}/${_firebaseDb.messages}`,
        {
          type: 'prescription',
          prescriptionId: prescriptionResponse.id,
          senderId: appointment.doctorId,
          receiverId: appointment.patientId,
          read: false,
        },
      );

      await FirebaseService.insert(_firebaseDb.notifications, {
        userId: appointment.patientId,
        title: 'Prescription Added',
        body: `${getDrName(appointment?.doctor?.fullName)} shared a new prescription for your consultation.`,
        type: 'prescription',
        chatId,
        appointmentId: appointment?.id,
        prescriptionId: prescriptionResponse.id,
        read: false,
      });

      showCustom('Prescription Added');
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setisLoading(false);
    }
  };

  const handlePreview = async (values: any) => {
    if (!validateMedicines()) {
      showCustom(
        'Please fill all medicine details',
      );
      return;
    }

    const payload = {
      diagnosis: values.diagnosis, 
      tests: values.tests,
      notes: values.notes,
      medicines,
    };
    
    navigation.navigate(
      'PrescriptionPreview',
      {
        prescriptionData: payload,
        appointment
      },
    );
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
            Create Prescription
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.headerButton}
            onPress={() => showCustom('Prescription Draft Saved')}
          >
            <Ionicons
              name="save-outline"
              size={22}
              color={Colors.APP_COLOR}
            />
          </TouchableOpacity>
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={
            validationSchema
          }
          onSubmit={
            handleSavePrescription
          }
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={
                Platform.OS === 'ios'
                  ? 'padding'
                  : 'height'
              }
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  paddingBottom: 30,
                }}
              >

                {/* Diagnosis */}
                <View style={styles.card}>

                  <Text style={styles.sectionTitle}>
                    Diagnosis
                  </Text>

                  <AppInput
                    // label="Description"
                    value={values.diagnosis}
                    onChangeText={handleChange('diagnosis')}
                    onBlur={handleBlur('diagnosis')}
                    placeholder="Enter diagnosis"
                    multiline={true}
                    numberOfLines={4}
                    keyboardType="default"
                    error={errors.diagnosis}
                    touched={touched.diagnosis}
                    containerStyle={{ marginTop: 5 }}
                  />
                </View>

                {/* Medicines */}
                <View style={styles.card}>
                  <View
                    style={
                      styles.medicineHeader
                    }
                  >
                    <Text
                      style={
                        styles.sectionTitle
                      }
                    >
                      Medicines
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={
                        styles.addButton
                      }
                      onPress={addMedicine}
                    >
                      <Ionicons
                        name="add"
                        size={18}
                        color="#FFFFFF"
                      />

                      <Text
                        style={
                          styles.addButtonText
                        }
                      >
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {medicines.map(
                    (item, index) => (
                      <View
                        key={item.id}
                        style={
                          styles.medicineCard
                        }
                      >
                        <View
                          style={
                            styles.rowBetween
                          }
                        >
                          <Text
                            style={
                              styles.medicineTitle
                            }
                          >
                            Medicine {index + 1}
                          </Text>

                          {medicines.length >
                            1 && (
                              <TouchableOpacity
                                activeOpacity={
                                  0.8
                                }
                                onPress={() =>
                                  removeMedicine(
                                    item.id,
                                  )
                                }
                              >
                                <Ionicons
                                  name="trash-outline"
                                  size={20}
                                  color="#EF4444"
                                />
                              </TouchableOpacity>
                            )}
                        </View>

                        <AppInput
                          value={item.medicine}
                          onChangeText={(text: any) =>
                            updateMedicine(
                              item.id,
                              'medicine',
                              text,
                            )
                          }
                          placeholder="Medicine Name"
                        />

                        <View
                          style={
                            styles.doubleRow
                          }
                        >
                          <View
                            style={{
                              width: '48%',
                            }}
                          >
                            <AppInput
                              value={item.frequency}
                              onChangeText={(text: any) =>
                                updateMedicine(
                                  item.id,
                                  'frequency',
                                  text,
                                )
                              }
                              placeholder="Frequency"
                            />
                          </View>

                          <View
                            style={{
                              width: '48%',
                            }}
                          >
                            <AppInput
                              value={
                                item.duration
                              }
                              onChangeText={(text: any) =>
                                updateMedicine(
                                  item.id,
                                  'duration',
                                  text,
                                )
                              }
                              placeholder="Duration"
                            />
                          </View>
                        </View>

                        <AppInput
                          value={
                            item.timing
                          }
                          onChangeText={(text: any) =>
                            updateMedicine(
                              item.id,
                              'timing',
                              text,
                            )
                          }
                          placeholder="Timing (After Food / Before Food)"
                          containerStyle={{
                            marginTop: 15,
                          }}
                        />
                      </View>
                    ),
                  )}
                </View>

                {/* Recommended Tests */}
                <View style={styles.card}>

                  <Text style={styles.sectionTitle}>
                    Recommended Tests
                  </Text>

                  <AppInput
                    value={values.tests}
                    onChangeText={handleChange(
                      'tests',
                    )}
                    onBlur={handleBlur(
                      'tests',
                    )}
                    placeholder="CBC, Vitamin D, Sugar Test..."
                    multiline
                    numberOfLines={4}
                    containerStyle={{ marginTop: 5 }}
                  />
                </View>

                {/* Notes */}
                <View style={styles.card}>

                  <Text style={styles.sectionTitle}>
                    Doctor Notes
                  </Text>

                  <AppInput
                    value={values.notes}
                    onChangeText={handleChange(
                      'notes',
                    )}
                    onBlur={handleBlur(
                      'notes',
                    )}
                    placeholder="Additional instructions..."
                    multiline
                    numberOfLines={4}
                    containerStyle={{ marginTop: 5 }}
                    error={errors.notes}
                    touched={touched.notes}
                  />
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={
                      styles.previewButton
                    }
                    onPress={() => handlePreview(values)}
                  >
                    <Text
                      style={
                        styles.previewText
                      }
                    >
                      Preview
                    </Text>
                  </TouchableOpacity>

                  <View style={{ flexShrink: 1, width: '100%' }}>
                    <AppButton
                      title="Save Prescription"
                      loading={isLoading}
                      disabled={isLoading}
                      style={{
                        flex: 1,
                      }}
                      onPress={handleSubmit}
                    />
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          )}
        </Formik>
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

  card: {
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
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

  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  addButton: {
    height: 35,
    borderRadius: 14,
    backgroundColor: Colors.APP_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  addButtonText: {
    marginLeft: 4,
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: fonts.name.semibold,
  },

  medicineCard: {
    marginTop: 20,
    // borderRadius: 22,
    // backgroundColor: '#EFF6FF',
    // padding: 16,
  },

  rowBetween: {
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  medicineTitle: {
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  doubleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },

  previewButton: {
    width: 120,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewText: {
    color: Colors.APP_COLOR,
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },
});