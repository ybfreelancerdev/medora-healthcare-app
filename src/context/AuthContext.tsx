import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { roleSessionKey, tokenSessionKey } from '../constants';
import { useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { sessionLogin, sessionLogout } from '../store/authSlice';
import { disablePushNotifications } from '../services/fcm.service';
import messaging from "@react-native-firebase/messaging";
import { removefcmToken } from '../services/api.service';
import FirebaseService from '../services/firebase.service';
import _firebaseDb from '../constants/firebaseDb';
import { AppState } from 'react-native';

export const AuthContext = createContext({});
let externalLogout: () => void = () => {};

export const AuthProvider: React.FC = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // default false
  const [loading, setLoading] = useState<boolean>(true); // show loading while checking
  const [userData, setUserData] = useState<any>(null);
  const dispatch = useDispatch();

  const login = async(token:any) => {
    try {
      await AsyncStorage.setItem(tokenSessionKey, token);
      dispatch(sessionLogin(token));
      setIsLoggedIn(true);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logout = async () => {
    // const storedRole = await AsyncStorage.getItem(roleSessionKey);
    // const token = await messaging().getToken();
    // if(storedRole === 'User') await removefcmToken({fcmToken: token});
    // await disablePushNotifications();
    await AsyncStorage.removeItem(tokenSessionKey);
    // await AsyncStorage.removeItem(roleSessionKey);

    await FirebaseService.updateOnlineStatus(
      userData.role === 'doctor'
        ? _firebaseDb.doctors
        : _firebaseDb.patients,
      userData.id,
      false,
    );

    dispatch(sessionLogout());
    setIsLoggedIn(false);
    setUserData(null);
    await auth().signOut();
    return true;
  };

  const fetchUserData = async (uid: string) => {
    try {
      const user:any =
        await FirebaseService.get(
          _firebaseDb.users,
          uid,
        );

      let userDetail:any = null;

      if(user?.data?.role === 'patient') {
        userDetail = await FirebaseService.get(_firebaseDb.patients, uid);
      } else if(user?.data?.role === 'doctor') {
        userDetail = (await FirebaseService.get(_firebaseDb.doctors, uid));
      }

      const data = {
        ...user?.data,
        ...(userDetail && userDetail.success && {
          ...userDetail.data
        })
      }
      
      setUserData(data);
      return user;
    } catch (error) {

      console.log(
        'FETCH USER ERROR:',
        error,
      );

      return null;
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Simulate async auth check
        const token = await AsyncStorage.getItem(tokenSessionKey);
        const currentUser = auth().currentUser;

        if (token && currentUser) {
          setIsLoggedIn(true);
          dispatch(sessionLogin(token));
          await fetchUserData(currentUser.uid);
        }
        else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (e) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!userData?.id) {
      return;
    }

    // USER ONLINE
    FirebaseService.updateOnlineStatus(
      userData.role === 'doctor'
        ? _firebaseDb.doctors
        : _firebaseDb.patients,
      userData.id,
      true,
    );

    const subscription =
      AppState.addEventListener(
        'change',
        async state => {

          await FirebaseService.updateOnlineStatus(
            userData.role === 'doctor'
              ? _firebaseDb.doctors
              : _firebaseDb.patients,
            userData.id,
            state === 'active',
          );
        },
      );

    return () => {
      subscription.remove();
    };

  }, [userData]);

  externalLogout = logout;

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout, userData, setUserData, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
export const getLogout = () => externalLogout;
