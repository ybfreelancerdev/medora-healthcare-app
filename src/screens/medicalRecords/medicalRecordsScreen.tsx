import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';

const tabs = [
  {
    id: '1',
    title: 'Prescriptions',
  },
  {
    id: '2',
    title: 'Reports',
  },
  {
    id: '3',
    title: 'Documents',
  },
];

const prescriptions = [
  {
    id: '1',
    title: 'Headache Prescription',
    doctor: 'Dr. Sarah Johnson',
    date: '12 May 2026',
  },
  {
    id: '2',
    title: 'Fever Prescription',
    doctor: 'Dr. Emily Watson',
    date: '08 May 2026',
  },
  {
    id: '3',
    title: 'Headache Prescription',
    doctor: 'Dr. Sarah Johnson',
    date: '12 May 2026',
  },
  {
    id: '4',
    title: 'Fever Prescription',
    doctor: 'Dr. Emily Watson',
    date: '08 May 2026',
  },
  {
    id: '5',
    title: 'Headache Prescription',
    doctor: 'Dr. Sarah Johnson',
    date: '12 May 2026',
  },
  {
    id: '6',
    title: 'Fever Prescription',
    doctor: 'Dr. Emily Watson',
    date: '08 May 2026',
  },
];

const reports = [
  {
    id: '1',
    title: 'CBC Blood Report',
    date: '10 May 2026',
    type: 'PDF',
  },
  {
    id: '2',
    title: 'Chest X-Ray',
    date: '06 May 2026',
    type: 'Image',
  },
  {
    id: '3',
    title: 'CBC Blood Report',
    date: '10 May 2026',
    type: 'PDF',
  },
  {
    id: '4',
    title: 'Chest X-Ray',
    date: '06 May 2026',
    type: 'Image',
  },
  {
    id: '5',
    title: 'CBC Blood Report',
    date: '10 May 2026',
    type: 'PDF',
  },
  {
    id: '6',
    title: 'Chest X-Ray',
    date: '06 May 2026',
    type: 'Image',
  },
  {
    id: '7',
    title: 'CBC Blood Report',
    date: '10 May 2026',
    type: 'PDF',
  },
];

const documents = [
  {
    id: '1',
    title: 'Insurance Card',
    date: '02 May 2026',
    type: 'PDF',
  },
  {
    id: '2',
    title: 'Vaccination Certificate',
    date: '01 Apr 2026',
    type: 'PDF',
  },
  {
    id: '3',
    title: 'Insurance Card',
    date: '02 May 2026',
    type: 'PDF',
  },
  {
    id: '4',
    title: 'Vaccination Certificate',
    date: '01 Apr 2026',
    type: 'PDF',
  },
  {
    id: '5',
    title: 'Insurance Card',
    date: '02 May 2026',
    type: 'PDF',
  },
  {
    id: '6',
    title: 'Vaccination Certificate',
    date: '01 Apr 2026',
    type: 'PDF',
  },
];

export default function MedicalRecordsScreen({
  navigation,
}: any) {

  const [selectedTab, setSelectedTab] =
    useState('Prescriptions');

  const renderTab = ({
    item,
  }: any) => {

    const active =
      selectedTab === item.title;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.tabButton,
          active && styles.activeTab,
        ]}
        onPress={() =>
          setSelectedTab(item.title)
        }
      >
        <Text
          style={[
            styles.tabText,
            active &&
              styles.activeTabText,
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPrescription = ({
    item,
  }: any) => {

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.card}
            onPress={() => {
                navigation.navigate(
                    'PrescriptionPreview',
                    {
                        prescriptionData: item,
                    },
                );
            }}
        >
        <View style={styles.iconContainer}>
          <Ionicons
            name="medical-outline"
            size={24}
            color={Colors.APP_COLOR}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {item.title}
          </Text>

          <Text style={styles.subText}>
            {item.doctor}
          </Text>

          <Text style={styles.metaText}>
            {item.date}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>
    );
  };

  const renderReport = ({
    item,
  }: any) => {

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.card}
            onPress={() => {
                navigation.navigate(
                    'ReportDetails',
                    {
                        report: item,
                    },
                );
            }}
        >
        <View style={styles.iconContainer}>
          <Ionicons
            name="document-text-outline"
            size={24}
            color={Colors.APP_COLOR}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {item.title}
          </Text>

          <Text style={styles.metaText}>
            {item.date} • {item.type}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>
    );
  };

  const renderDocument = ({
    item,
  }: any) => {

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.card}
            onPress={() => {
                navigation.navigate(
                    'ReportDetails',
                    {
                        report: item,
                    },
                );
            }}
        >
        <View style={styles.iconContainer}>
          <Ionicons
            name="folder-outline"
            size={24}
            color={Colors.APP_COLOR}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {item.title}
          </Text>

          <Text style={styles.metaText}>
            {item.date} • {item.type}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>
            Records
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.headerButton}
          >
            <Ionicons
              name="search-outline"
              size={22}
              color={Colors.titleColor}
            />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map(item =>
            renderTab({ item }),
          )}
        </View>

        {/* Prescriptions */}
        {selectedTab ===
          'Prescriptions' && (
          <FlatList
            data={prescriptions}
            keyExtractor={item => item.id}
            renderItem={
              renderPrescription
            }
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 5,
            }}
          />
        )}

        {/* Reports */}
        {selectedTab ===
          'Reports' && (
          <FlatList
            data={reports}
            keyExtractor={item => item.id}
            renderItem={renderReport}
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 5,
            }}
          />
        )}

        {/* Documents */}
        {selectedTab ===
          'Documents' && (
          <FlatList
            data={documents}
            keyExtractor={item => item.id}
            renderItem={
              renderDocument
            }
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 5,
            }}
          />
        )}

        {/* Floating Upload Button */}
        {selectedTab !==
          'Prescriptions' && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.floatingButton}
            onPress={() =>
              navigation.navigate(
                'UploadMedicalFile',
                {
                  type:
                    selectedTab ===
                    'Reports'
                      ? 'report'
                      : 'document',
                },
              )
            }
          >
            <Ionicons
              name="cloud-upload-outline"
              size={24}
              color="#FFFFFF"
            />
            <Text
              style={styles.floatingText}
            >
              Upload
            </Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
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

  headerTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
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

  tabsContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  tabButton: {
    flex: 1,
    height: 45,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  activeTab: {
    backgroundColor: Colors.APP_COLOR,
  },

  tabText: {
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.medium,
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 15,
    marginBottom: 15,
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

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  title: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  subText: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  metaText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontFamily: fonts.name.medium,
  },

  floatingButton: {
    position: 'absolute',
    right: 24,
    bottom: 30,
    height: 58,
    borderRadius: 20,
    backgroundColor: Colors.APP_COLOR,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.APP_COLOR,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  floatingText: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fonts.name.semibold,
  },
});