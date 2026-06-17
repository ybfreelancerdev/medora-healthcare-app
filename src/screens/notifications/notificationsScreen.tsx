import React, { useMemo, useState } from 'react';
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
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from "@react-navigation/native";
import FirebaseService from '../../services/firebase.service';
import _firebaseDb from '../../constants/firebaseDb';
import firestore from '@react-native-firebase/firestore';
import Loading from '../../components/Loading';
import { getNotificationTime } from '../../constants';

export default function NotificationsScreen({ navigation, route }: any) {
  const { hideBackBtn } = route?.params;
  const { userData }: any = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setisLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, []),
  );

  const fetchNotifications = async () => {
    try {
      setisLoading(true);
      const response = await FirebaseService.getNotifications(userData.id);
      if (response.success) {
        setNotifications(response.data || []);
      }
    }
    catch (error) {
      console.log(
        'Fetch notification list Error:',
        error,
      );
    }
    finally {
      setisLoading(false);
    }
  };

  const getNotificationConfig = (type: string) => {
    switch (type) {

      case 'appointment':
        return {
          icon: 'calendar-month',
          color: '#2563EB',
          bg: '#EFF6FF',
        };

      case 'prescription':
        return {
          icon: 'medical-services',
          color: '#16A34A',
          bg: '#DCFCE7',
        };

      case 'chat':
        return {
          icon: 'chat',
          color: '#D97706',
          bg: '#FEF3C7',
        };

      case 'review':
        return {
          icon: 'star-rate',
          color: '#F59E0B',
          bg: '#FEF3C7',
        };

      default:
        return {
          icon: 'notifications',
          color: '#64748B',
          bg: '#F1F5F9',
        };
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await firestore()
        .collection(
          _firebaseDb.notifications,
        )
        .doc(notificationId)
        .update({
          read: true,
        });
  
      fetchNotifications();
    }
    catch (error) {
      console.log(
        'Mark Read Error:',
        error,
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      setisLoading(true);

      const snapshot = await firestore().collection(_firebaseDb.notifications)
        .where(
          'userId',
          '==',
          userData.id,
        )
        .where(
          'read',
          '==',
          false,
        )
        .get();

      const batch = firestore().batch();
      snapshot.docs.forEach(doc => {
        batch.update(
          doc.ref,
          {
            read: true,
          },
        );
      });

    await batch.commit();
    fetchNotifications();
    } catch (error) {
      console.log(
        'Mark All Read Error:',
        error,
      );
    }
    finally {
      setisLoading(false);
    }
  };

  const notificationPressed = async (item: any) => {
    switch (item.type) {

      case 'appointment':
        return {
          icon: 'calendar-month',
          color: '#2563EB',
          bg: '#EFF6FF',
        };

      case 'prescription':
        navigatePrescriptionPreview(item);

      case 'chat':
        navigateChat(item);

      case 'review':
        return {
          icon: 'star-rate',
          color: '#F59E0B',
          bg: '#FEF3C7',
        };

      default:
        return {
          icon: 'notifications',
          color: '#64748B',
          bg: '#F1F5F9',
        };
    }
  }

  const renderNotification = ({ item }: any) => {
    const config = getNotificationConfig(item.type);

    return (
      <TouchableOpacity
        onPress={() => notificationPressed(item)}
        activeOpacity={0.8}
        style={[
          styles.notificationCard
        ]}
      >
        {/* Top */}
        <View style={styles.topContainer}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: config.bg,
              },
            ]}
          >
            <MaterialIcons
              name={config.icon}
              size={24}
              color={config.color}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.topRow}>
              <Text style={styles.title}>
                {item.title}
              </Text>

              {!item.read && (
                <View
                  style={
                    styles.unreadDot
                  }
                />
              )}
            </View>

            <Text style={styles.message}>
              {item.body}
            </Text>

            <Text style={styles.time}>
              {getNotificationTime(item.createdAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const navigateChat = async (notificationItem:any) => {
    try {

      setisLoading(true);
      let response: any = await FirebaseService.get(_firebaseDb.appointments, notificationItem.appointmentId);

      if (response.success) {
        const patientResponse: any = await FirebaseService.get(_firebaseDb.patients, response?.data?.patientId);
        const doctorResponse = await FirebaseService.get(_firebaseDb.doctors, response?.data?.doctorId);
        const prescriptionResponse = await FirebaseService.getPrescriptionByAppointmentId(notificationItem.appointmentId);

        const payload = {
          ...response.data,
          patient: (patientResponse.success) ? patientResponse.data : null,
          doctor: (doctorResponse.success) ? doctorResponse.data : null,
          prescription: (prescriptionResponse.success) ? prescriptionResponse.data : null
        }
        await markAsRead(notificationItem.id);

        navigation.navigate('Chat', {
          appointment: payload,
        });
      }
    }
    catch (error) {
      console.log(
        'notification detail fetch Error:',
        error,
      );
    }
    finally {
      setisLoading(false);
    }
  }

  const navigatePrescriptionPreview = async (notificationItem:any) => {
    try {

      setisLoading(true);
      let response: any = await FirebaseService.get(_firebaseDb.appointments, notificationItem.appointmentId);

      if (response.success) {
        const patientResponse: any = await FirebaseService.get(_firebaseDb.patients, response?.data?.patientId);
        const doctorResponse = await FirebaseService.get(_firebaseDb.doctors, response?.data?.doctorId);
        const prescriptionResponse = await FirebaseService.getPrescriptionByAppointmentId(notificationItem.appointmentId);

        const payload = {
          ...response.data,
          patient: (patientResponse.success) ? patientResponse.data : null,
          doctor: (doctorResponse.success) ? doctorResponse.data : null,
          prescription: (prescriptionResponse.success) ? prescriptionResponse.data : null
        }
        await markAsRead(notificationItem.id);

        navigation.navigate('PrescriptionPreview', {
          prescriptionData: prescriptionResponse.data,
          appointment: payload,
        });
      }
    }
    catch (error) {
      console.log(
        'notification detail fetch Error:',
        error,
      );
    }
    finally {
      setisLoading(false);
    }
  }

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

      <Loading visible={isLoading} />

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
          {!hideBackBtn ?
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
            :
            <View style={{ width: 45 }} />
          }

          <Text style={styles.headerTitle}>
            Notifications
          </Text>

          {notifications.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.headerButton}
              onPress={markAllAsRead}
            >
              <Ionicons
                name="checkmark-done"
                size={22}
                color={
                  Colors.APP_COLOR
                }
              />
            </TouchableOpacity>
          )}
          {notifications.length === 0 && (
            <View style={{width: 45}}/>
          )}
        </View>

        {/* Notifications */}
        <FlatList
          data={notifications}
          keyExtractor={item =>
            item.id
          }
          renderItem={
            renderNotification
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 30,
          }}
          ListEmptyComponent={() => (
            <View
              style={
                styles.emptyContainer
              }
            >
              <Ionicons
                name="notifications-off-outline"
                size={70}
                color="#CBD5E1"
              />

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No Notifications
              </Text>

              <Text
                style={
                  styles.emptySubtitle
                }
              >
                You're all caught up.
              </Text>
            </View>
          )}
        />
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
    justifyContent:
      'space-between',
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

  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  unreadCard: {
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },

  topContainer: {
    flexDirection: 'row',
  },

  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor:
      Colors.APP_COLOR,
    marginLeft: 8,
  },

  message: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 22,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  time: {
    marginTop: 10,
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: fonts.name.medium,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  emptySubtitle: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },
});