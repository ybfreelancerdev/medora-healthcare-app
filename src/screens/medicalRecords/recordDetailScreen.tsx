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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';

export default function ReportDetailsScreen({ navigation, route }: any) {
  const report = route?.params?.report || {};

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
            Report Details
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.headerButton}
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color={Colors.APP_COLOR}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 15,
          }}
        >
          {/* File Preview */}
          <View style={styles.previewCard}>
            <View style={styles.fileIconContainer}>
              <MaterialIcons
                name="description"
                size={50}
                color={Colors.APP_COLOR}
              />
            </View>

            <Text style={styles.reportTitle}>
              {report?.title ||
                'Blood Test Report.pdf'}
            </Text>

            <Text style={styles.reportSize}>
              PDF • 2.4 MB
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.viewButton}
            >
              <Ionicons
                name="eye-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.viewButtonText}>
                View File
              </Text>
            </TouchableOpacity>
          </View>

          {/* Information */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>
              Report Information
            </Text>

            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={Colors.APP_COLOR}
                />

                <Text style={styles.infoLabel}>
                  Uploaded Date
                </Text>
              </View>

              <Text style={styles.infoValue}>
                12 May 2026
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={Colors.APP_COLOR}
                />

                <Text style={styles.infoLabel}>
                  Uploaded By
                </Text>
              </View>

              <Text style={styles.infoValue}>
                Patient
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Ionicons
                  name="medical-outline"
                  size={20}
                  color={Colors.APP_COLOR}
                />

                <Text style={styles.infoLabel}>
                  Doctor
                </Text>
              </View>

              <Text style={styles.infoValue}>
                Dr. Sarah Johnson
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={Colors.APP_COLOR}
                />

                <Text style={styles.infoLabel}>
                  Category
                </Text>
              </View>

              <Text style={styles.infoValue}>
                Lab Report
              </Text>
            </View>
          </View>

          {/* Doctor Notes */}
          <View style={styles.notesCard}>
            <View style={styles.notesHeader}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={20}
                color={Colors.APP_COLOR}
              />

              <Text style={styles.notesTitle}>
                Doctor Notes
              </Text>
            </View>

            <Text style={styles.notesText}>
              Your blood sugar levels are slightly
              elevated. Please maintain a healthy
              diet and continue medications as
              prescribed. Recommended follow-up
              after 2 weeks.
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.downloadButton}
            >
              <Ionicons
                name="download-outline"
                size={18}
                color={Colors.APP_COLOR}
              />

              <Text style={styles.downloadText}>
                Download
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.deleteButton}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.deleteText}>
                Delete
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

  previewCard: {
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 20,
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

  fileIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  reportTitle: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
    textAlign: 'center',
  },

  reportSize: {
    fontSize: 14,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  viewButton: {
    marginTop: 5,
    height: 50,
    borderRadius: 18,
    backgroundColor: Colors.APP_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  viewButtonText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },

  infoCard: {
    marginTop: 20,
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
    marginBottom: 15,
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoLabel: {
    marginLeft: 12,
    fontSize: 14,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  infoValue: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 15,
  },

  notesCard: {
    marginTop: 20,
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

  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  notesTitle: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  notesText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.regular,
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 25,
  },

  downloadButton: {
    flex: 1,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  downloadText: {
    marginLeft: 8,
    color: Colors.APP_COLOR,
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },

  deleteButton: {
    flex: 1,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  deleteText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fonts.name.bold,
  },
});