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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';

const reportsData = [
  {
    id: '1',
    title: 'Blood Test Report',
    doctor: 'Dr. Sarah Johnson',
    date: '15 May 2026',
    type: 'Blood Test',
    fileSize: '2.4 MB',
    icon: 'bloodtype',
    color: '#DC2626',
    bg: '#FEE2E2',
  },

  {
    id: '2',
    title: 'X-Ray Chest',
    doctor: 'Dr. Michael Brown',
    date: '12 May 2026',
    type: 'Radiology',
    fileSize: '5.1 MB',
    icon: 'medical-services',
    color: '#2563EB',
    bg: '#EFF6FF',
  },

  {
    id: '3',
    title: 'ECG Report',
    doctor: 'Dr. Emma Wilson',
    date: '09 May 2026',
    type: 'Cardiology',
    fileSize: '1.8 MB',
    icon: 'monitor-heart',
    color: '#16A34A',
    bg: '#DCFCE7',
  },

  {
    id: '4',
    title: 'MRI Scan',
    doctor: 'Dr. Robert Smith',
    date: '02 May 2026',
    type: 'Radiology',
    fileSize: '8.6 MB',
    icon: 'biotech',
    color: '#9333EA',
    bg: '#F3E8FF',
  },
];

export default function ReportsScreen({
  navigation,
}: any) {

  const [reports] =
    useState(reportsData);

  const renderReport = ({
    item,
  }: any) => {

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.reportCard}
        onPress={() =>
          navigation.navigate(
            'ReportDetails',
            {
              report: item,
            },
          )
        }
      >
        {/* Top Row */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor:
                  item.bg,
              },
            ]}
          >
            <MaterialIcons
              name={item.icon}
              size={26}
              color={item.color}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.menuButton}
          >
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.reportTitle}>
          {item.title}
        </Text>

        {/* Type Badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>
            {item.type}
          </Text>
        </View>

        {/* Info */}
        <View style={styles.infoRow}>
          <Ionicons
            name="person-outline"
            size={14}
            color="#64748B"
          />

          <Text style={styles.infoText}>
            {item.doctor}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color="#64748B"
          />

          <Text style={styles.infoText}>
            {item.date}
          </Text>
        </View>

        {/* Bottom */}
        <View style={styles.bottomRow}>
          <View style={styles.fileRow}>
            <MaterialIcons
              name="insert-drive-file"
              size={16}
              color="#94A3B8"
            />

            <Text style={styles.fileText}>
              {item.fileSize}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.viewButton}
          >
            <Text
              style={styles.viewButtonText}
            >
              View
            </Text>

            <Ionicons
              name="arrow-forward"
              size={14}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
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
            activeOpacity={0.8}
            style={styles.headerButton}
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

          <Text style={styles.headerTitle}>
            Reports
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.headerButton}
          >
            <Ionicons
              name="search"
              size={22}
              color={
                Colors.titleColor
              }
            />
          </TouchableOpacity>
        </View>

        {/* Reports */}
        <FlatList
          data={reports}
          keyExtractor={item => item.id}
          renderItem={renderReport}
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 10,
            paddingBottom: 30,
          }}
          ListEmptyComponent={() => (
            <View
              style={styles.emptyContainer}
            >
              <MaterialIcons
                name="description"
                size={70}
                color="#CBD5E1"
              />

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No Reports Found
              </Text>

              <Text
                style={
                  styles.emptySubtitle
                }
              >
                Uploaded reports will
                appear here.
              </Text>
            </View>
          )}
        />
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
    marginHorizontal: 20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  headerButton: {
    width: 46,
    height: 46,

    borderRadius: 18,

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

  reportCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 30,

    padding: 20,

    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  iconContainer: {
    width: 58,
    height: 58,

    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },

  menuButton: {
    width: 38,
    height: 38,

    borderRadius: 14,

    backgroundColor: '#F8FAFC',

    justifyContent: 'center',
    alignItems: 'center',
  },

  reportTitle: {
    marginTop: 18,

    fontSize: 18,
    lineHeight: 28,

    color: Colors.titleColor,

    fontFamily: fonts.name.bold,
  },

  typeBadge: {
    alignSelf: 'flex-start',

    marginTop: 10,

    backgroundColor: '#EEF6FF',

    borderRadius: 14,

    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  typeText: {
    fontSize: 11,
    color: Colors.APP_COLOR,
    fontFamily:
      fonts.name.semibold,
  },

  infoRow: {
    marginTop: 14,

    flexDirection: 'row',
    alignItems: 'center',
  },

  infoText: {
    marginLeft: 8,

    fontSize: 13,
    color: Colors.subtitleColor,

    fontFamily:
      fonts.name.medium,
  },

  bottomRow: {
    marginTop: 20,

    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  fileText: {
    marginLeft: 6,

    fontSize: 12,
    color: '#94A3B8',

    fontFamily:
      fonts.name.medium,
  },

  viewButton: {
    height: 40,

    borderRadius: 14,

    backgroundColor:
      Colors.APP_COLOR,

    paddingHorizontal: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewButtonText: {
    marginRight: 6,

    fontSize: 13,
    color: '#FFFFFF',

    fontFamily:
      fonts.name.semibold,
  },

  emptyContainer: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 120,
  },

  emptyTitle: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },
});