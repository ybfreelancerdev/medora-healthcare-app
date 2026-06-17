// AppointmentSlotsModal.tsx

import React, {
  useMemo,
} from 'react';

import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import Ionicons from 'react-native-vector-icons/Ionicons';

import fonts from '../constants/fonts';

import * as Colors from '../styles/colors';

type AvailabilityItem = {
  day: string;
  enabled: boolean;
  time: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedDate?: Date | null;
  doctorAvailability: AvailabilityItem[];
  selectedSlot?: string;
  onSelectSlot: (slot: string) => void;
};

const SLOT_DURATION = 30;

export default function AppointmentSlotsModal({
  visible,
  onClose,
  selectedDate,
  doctorAvailability,
  selectedSlot,
  onSelectSlot,
}: Props) {
  console.log(doctorAvailability, 'doctorAvailability');
  const slots = useMemo(() => {
    if (!selectedDate) return [];

    return generateSlots(
      selectedDate,
      doctorAvailability,
      SLOT_DURATION,
    );

  }, [
    selectedDate,
    doctorAvailability,
  ]);

  const renderSlot = ({
    item,
  }: any) => {

    const isSelected =
      selectedSlot === item;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.slotCard,
          isSelected &&
            styles.selectedSlotCard,
        ]}
        onPress={() => {
          onSelectSlot(item);
          onClose();
        }}
      >
        <View
          style={[
            styles.iconContainer,
            isSelected && {
              backgroundColor:
                Colors.APP_COLOR,
            },
          ]}
        >
          <Ionicons
            name="time-outline"
            size={24}
            color={
              isSelected
                ? '#FFFFFF'
                : Colors.APP_COLOR
            }
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.slotTitle,
              isSelected && {
                color:
                  Colors.APP_COLOR,
              },
            ]}
          >
            {item}
          </Text>

          <Text style={styles.slotSubtitle}>
            Available Appointment
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#94A3B8"
        />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
    >
      <SafeAreaView
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>

          <TouchableOpacity
            activeOpacity={0.8}
            style={
              styles.headerButton
            }
            onPress={onClose}
          >
            <Ionicons
              name="close"
              size={24}
              color={
                Colors.titleColor
              }
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Appointment Slots
          </Text>

          <View style={{width: 45}}/>
        </View>

        {/* Selected Date */}
        <View style={styles.dateContainer}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color={Colors.APP_COLOR}
          />

          <Text style={styles.dateText}>
            {selectedDate
              ? selectedDate.toDateString()
              : 'Select Date'}
          </Text>
        </View>

        {/* Slots */}
        <FlatList
          data={slots}
          keyExtractor={(item) => item}
          renderItem={renderSlot}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
            paddingHorizontal: 20,
            marginTop: 10,
          }}
          ListEmptyComponent={() => (
            <View
              style={
                styles.emptyContainer
              }
            >
              <Ionicons
                name="time-outline"
                size={60}
                color="#CBD5E1"
              />

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No Slots Available
              </Text>

              <Text
                style={
                  styles.emptySubtitle
                }
              >
                Try another date
              </Text>
            </View>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
}

/* -------------------------------- */
/* Generate Slots */
/* -------------------------------- */

const generateSlots = (
  selectedDate: Date,
  doctorAvailability: AvailabilityItem[],
  duration: number,
) => {

  const dayName =
    selectedDate.toLocaleDateString(
      'en-US',
      {
        weekday: 'long',
      },
    );

  const availability =
    doctorAvailability.find(
      item =>
        item.day === dayName &&
        item.enabled,
    );

  if (!availability) return [];

  if (!availability.time) {
    return [];
  }

  const times =
    availability.time.split('-');

  if (times.length < 2) {
    return [];
  }

  const startTime =
    times[0].trim();

  const endTime =
    times[1].trim();

  const start = convertToDate(
    selectedDate,
    startTime,
  );

  const end = convertToDate(
    selectedDate,
    endTime,
  );

  const now = new Date();

  const result: string[] = [];

  while (start < end) {

    const slotStart =
      new Date(start);

    const slotEnd =
      new Date(start);

    slotEnd.setMinutes(
      slotEnd.getMinutes() +
        duration,
    );

    if (slotEnd > end) break;

    // Hide past slots
    if (
      selectedDate.toDateString() ===
        now.toDateString() &&
      slotStart <= now
    ) {

      start.setMinutes(
        start.getMinutes() +
          duration,
      );

      continue;
    }

    result.push(
      `${formatTime(
        slotStart,
      )} - ${formatTime(
        slotEnd,
      )}`,
    );

    start.setMinutes(
      start.getMinutes() +
        duration,
    );
  }

  return result;
};

/* -------------------------------- */
/* Helpers */
/* -------------------------------- */

const convertToDate = (
  date: Date,
  time?: string,
) => {

  if (!time) {
    return new Date(date);
  }

  const parts =
    time.split(' ');

  if (parts.length < 2) {
    return new Date(date);
  }

  const [
    timePart,
    modifier,
  ] = parts;

  const values =
    timePart.split(':');

  if (values.length < 2) {
    return new Date(date);
  }

  let [hours, minutes] =
    values.map(Number);

  if (
    modifier === 'PM' &&
    hours !== 12
  ) {
    hours += 12;
  }

  if (
    modifier === 'AM' &&
    hours === 12
  ) {
    hours = 0;
  }

  const result =
    new Date(date);

  result.setHours(hours);
  result.setMinutes(minutes);
  result.setSeconds(0);

  return result;
};

const formatTime = (
  date: Date,
) => {
  return date.toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    },
  );
};

/* -------------------------------- */
/* Styles */
/* -------------------------------- */

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
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

    dateContainer: {
      marginTop: 15,
      marginBottom: 5,
      marginHorizontal: 20,
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      paddingVertical: 15,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },

    dateText: {
      marginLeft: 10,
      fontSize: 14,
      color: Colors.titleColor,
      fontFamily: fonts.name.semibold,
    },

    slotCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 22,
      paddingVertical: 15,
      paddingHorizontal: 18,
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 3,
    },

    selectedSlotCard: {
      borderWidth: 1,
      borderColor: '#BFDBFE',
      backgroundColor: '#EFF6FF',
    },

    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 18,
      backgroundColor: '#EFF6FF',
      justifyContent: 'center',
      alignItems: 'center',
    },

    slotTitle: {
      fontSize: 14,
      marginLeft: 15,
      color: Colors.titleColor,
      fontFamily: fonts.name.semibold,
    },

    slotSubtitle: {
      marginTop: 4,
      marginLeft: 15,
      fontSize: 12,
      color: Colors.subtitleColor,
      fontFamily: fonts.name.medium,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    emptyTitle: {
      marginTop: 10,
      fontSize: 14,
      color: Colors.titleColor,
      fontFamily: fonts.name.semibold,
    },

    emptySubtitle: {
      fontSize: 12,
      color: Colors.subtitleColor,
      fontFamily: fonts.name.medium,
    },
  });