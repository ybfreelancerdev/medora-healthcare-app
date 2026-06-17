import React from 'react';
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
import { _default_profileAvatar } from '../../constants';

const reports = [
  {
    id: '1',
    title: 'Blood Test Report',
    date: '12 May 2026',
  },
  {
    id: '2',
    title: 'X-Ray Chest',
    date: '28 Apr 2026',
  },
];

const prescriptions = [
  {
    id: '1',
    diagnosis: 'Viral Fever',
    date: '10 May 2026',
  },
  {
    id: '2',
    diagnosis: 'Blood Pressure',
    date: '02 Apr 2026',
  },
];

export default function PatientDetailsScreen({
  navigation,
  route,
}: any) {

  const patient =
    route?.params?.patient || {
      name: 'Rahul Sharma',
      age: 28,
      gender: 'Male',
      image:
        'https://i.pravatar.cc/300?img=12',
      condition:
        'Fever & Headache',
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
            Patient Details
          </Text>

          <View style={{width: 45}}/>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 10,
          }}
        >
          {/* Profile Card */}
          <View style={styles.profileContainer}>
            <Image
              source={patient.profileImage ? {uri: patient.profileImage} : _default_profileAvatar}
              style={styles.profileImage}
            />

            <Text style={styles.patientName}>
              {patient.fullName}
            </Text>

            <Text style={styles.patientInfo}>
              {patient.age} Years •{' '}
              {patient.gender}
            </Text>

            <View style={styles.conditionBadge}>
              <Text
                style={
                  styles.conditionText
                }
              >
                {patient.address}, {patient.city}
              </Text>
            </View>

            {/* Quick Actions */}
            {/* <View style={styles.actionRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.actionButton}
                onPress={() =>
                  navigation.navigate(
                    'Chat',
                    {
                      patient,
                    },
                  )
                }
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={22}
                  color={
                    Colors.APP_COLOR
                  }
                />

                <Text
                  style={
                    styles.actionText
                  }
                >
                  Chat
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.actionButton}
              >
                <Ionicons
                  name="call-outline"
                  size={22}
                  color={
                    Colors.APP_COLOR
                  }
                />

                <Text
                  style={
                    styles.actionText
                  }
                >
                  Call
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.actionButton}
                onPress={() =>
                  navigation.navigate(
                    'PrescriptionBuilder',
                    {
                      patient,
                    },
                  )
                }
              >
                <MaterialCommunityIcons
                  name="prescription"
                  size={22}
                  color={
                    Colors.APP_COLOR
                  }
                />

                <Text
                  style={
                    styles.actionText
                  }
                >
                  Rx
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>

          {/* Health Info */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              Health Information
            </Text>

            <View style={styles.infoRow}>
              <View
                style={styles.infoItem}
              >
                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  Age
                </Text>

                <Text
                  style={
                    styles.infoValue
                  }
                >
                  {patient.age} yr
                </Text>
              </View>

              <View
                style={styles.infoItem}
              >
                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  Height
                </Text>

                <Text
                  style={
                    styles.infoValue
                  }
                >
                  {patient.height} ft
                </Text>
              </View>

              <View
                style={styles.infoItem}
              >
                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  Weight
                </Text>

                <Text
                  style={
                    styles.infoValue
                  }
                >
                  {patient.weight} kg
                </Text>
              </View>
            </View>

            {patient?.diseases?.length > 0 && (
              <View
                style={{
                  marginTop: 15,
                }}
              >
                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  Medical Conditions
                </Text>

                <View
                  style={
                    styles.conditionsRow
                  }
                >
                  {patient?.diseases.map((item: any) => (
                    <View
                      key={item}
                      style={
                        styles.conditionChip
                      }
                    >
                      <Text
                        style={
                          styles.conditionChipText
                        }
                      >
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Reports */}
          {/* <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Medical Reports
              </Text>

              <TouchableOpacity>
                <Text
                  style={
                    styles.viewAllText
                  }
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            {reports.map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={styles.listCard}
                onPress={() =>
                  navigation.navigate(
                    'ReportDetails',
                    {
                      report: item,
                    },
                  )
                }
              >
                <View
                  style={
                    styles.listIcon
                  }
                >
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color={
                      Colors.APP_COLOR
                    }
                  />
                </View>

                <View
                  style={{ flex: 1 }}
                >
                  <Text
                    style={
                      styles.listTitle
                    }
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={
                      styles.listDate
                    }
                  >
                    {item.date}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            ))}
          </View> */}

          {/* Prescriptions */}
          {/* <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Prescriptions
              </Text>

              <TouchableOpacity>
                <Text
                  style={
                    styles.viewAllText
                  }
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            {prescriptions.map(
              item => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={
                    styles.listCard
                  }
                  onPress={() =>
                    navigation.navigate(
                      'PrescriptionPreview',
                      {
                        prescriptionData:
                          item,
                      },
                    )
                  }
                >
                  <View
                    style={
                      styles.listIcon
                    }
                  >
                    <MaterialCommunityIcons
                      name="prescription"
                      size={22}
                      color={
                        Colors.APP_COLOR
                      }
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        styles.listTitle
                      }
                    >
                      {
                        item.diagnosis
                      }
                    </Text>

                    <Text
                      style={
                        styles.listDate
                      }
                    >
                      {item.date}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              ),
            )}
          </View> */}
        </ScrollView>
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

  profileContainer: {
    marginTop: 5,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 34,
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 32,
  },

  patientName: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  patientInfo: {
    fontSize: 14,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  conditionBadge: {
    marginTop: 5,
    // backgroundColor: '#EFF6FF',
    // borderRadius: 16,
    // paddingHorizontal: 15,
    // paddingVertical: 5,
  },

  conditionText: {
    textAlign: 'center',
    color: Colors.APP_COLOR,
    fontSize: 12,
    fontFamily: fonts.name.semibold,
  },

  actionRow: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  actionButton: {
    width: '30%',
    height: 80,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  sectionCard: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },

  sectionHeader: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  viewAllText: {
    fontSize: 12,
    color: Colors.APP_COLOR,
    fontFamily:
      fonts.name.semibold,
  },

  infoRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  infoItem: {
    width: '30%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },

  infoLabel: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  infoValue: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  conditionsRow: {
    marginTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  conditionChip: {
    backgroundColor: '#EEF6FF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },

  conditionChipText: {
    color: Colors.APP_COLOR,
    fontSize: 12,
    fontFamily: fonts.name.semibold,
  },

  listCard: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  listIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#EEF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  listTitle: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  listDate: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.regular,
  },
});