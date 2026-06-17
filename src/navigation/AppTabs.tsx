import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home/HomeScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as colors from "../styles/colors";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { roleSessionKey } from '../constants';
import DoctorsScreen from '../screens/doctors/doctorsScreen';
import AppointmentsScreen from '../screens/appointment/appointmentsScreen';
import ProfileScreen from '../screens/profile/profileScreen';
import MedicalRecordsScreen from '../screens/medicalRecords/medicalRecordsScreen';
import { useAuth } from '../context/AuthContext';
import DoctorHomeScreen from '../screens/home/doctorHomeScreen';
import PatientsScreen from '../screens/patients/patientsScreen';
import DoctorReviewsScreen from '../screens/doctors/doctorReviewsScreen';
import NotificationsScreen from '../screens/notifications/notificationsScreen';
import firestore from '@react-native-firebase/firestore';
import _firebaseDb from '../constants/firebaseDb';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const insets = useSafeAreaInsets();
  const { userData }: any = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection(_firebaseDb.notifications)
      .where('userId', '==', userData.id)
      .where('read', '==', false)
      .onSnapshot(snapshot => {
        setNotificationCount(snapshot.size);
      });

    return unsubscribe;
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarSafeAreaInset: { bottom: 'always' },
        tabBarActiveTintColor: colors.APP_COLOR,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          paddingTop: 5,
          // height: 70,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          height: 60 + insets.bottom,   // ⬅️ add safe bottom inset dynamically
          // paddingBottom: insets.bottom, // ⬅️ push icons above nav buttons
        },
        tabBarLabelStyle: {
          marginTop: -2,
          fontSize: 10
        },
        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={{ color: 'transparent' }}
          >
            {props.children}
          </Pressable>
        ),
      })}
    >
      {/* dynamic home based on role */}
      {userData.role === 'patient' && (
        <Tab.Screen name="Home" component={Home}
          options={({ navigation }) => ({
            title: "Home",
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={25} color={color} />
            ),
          })}
        />
      )}
      {userData.role === 'doctor' && (
        <Tab.Screen name="Home" component={DoctorHomeScreen}
          options={({ navigation }) => ({
            title: "Home",
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={25} color={color} />
            ),
          })}
        />
      )}

      {/* dynamic list based on role */}
      {userData.role === 'patient' && (
        <Tab.Screen name="Doctors" component={DoctorsScreen}
          options={({ navigation }) => ({
            title: "Doctors",
            tabBarLabel: "Doctors",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="medical-services" size={25} color={color} />
            ),
          })}
        />
      )}
      {userData.role === 'doctor' && (
        <Tab.Screen name="Patients" component={PatientsScreen}
          options={({ navigation }) => ({
            title: "Patients",
            tabBarLabel: "Patients",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="groups" size={25} color={color} />
            ),
          })}
        />
      )}

      <Tab.Screen name="Appointments" component={AppointmentsScreen}
        options={({ navigation }) => ({
          title: "Appointments",
          tabBarLabel: "Appointments",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="calendar-month" size={25} color={color} />
          ),
        })}
      />
      {userData.role === 'patient' && (
        <Tab.Screen
          name="NotificationList"
          component={NotificationsScreen}
          initialParams={{hideBackBtn: true}}
          options={{
            title: 'Notifications',
            tabBarLabel: 'Notifications',
            tabBarIcon: ({ color }) => (
              <View>
                <MaterialIcons
                  name="notifications-active"
                  size={25}
                  color={color}
                />

                {notificationCount > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      right: -8,
                      top: -5,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: '#EF4444',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 10,
                        fontWeight: '700',
                      }}
                    >
                      {notificationCount > 99
                        ? '99+'
                        : notificationCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
      )}
      {userData.role === 'doctor' && (
        <Tab.Screen name="DoctorReviews" component={DoctorReviewsScreen}
          options={({ navigation }) => ({
            title: "Reviews",
            tabBarLabel: "Reviews",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="star-rate" size={25} color={color} />
            ),
          })}
        />
      )}

      <Tab.Screen name="Profile" component={ProfileScreen}
        options={({ navigation }) => ({
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-circle" size={25} color={color} />
          ),
        })}
      />
    </Tab.Navigator>
  );
}