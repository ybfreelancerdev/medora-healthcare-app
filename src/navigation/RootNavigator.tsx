import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import SplashScreen from '../screens/splash/SplashScreen';
import { AuthContext } from '../context/AuthContext';
import { OnBoardingKey } from '../constants';
import auth from '@react-native-firebase/auth';
import FirebaseService from '../services/firebase.service';
import CompleteProfileScreen from '../screens/profile/completeProfileScreen';
import DoctorPendingApprovalScreen from '../screens/doctors/doctorPendingApprovalScreen';

export default function RootNavigator() {
  const { isLoggedIn, loading, userData }: any = useContext(AuthContext);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isOnboardingDone, setIsOnboardingDone] = useState<boolean | null>(null);
  
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const onboardingDone = await AsyncStorage.getItem(OnBoardingKey);

      setTimeout(() => {
        setIsSplashVisible(false);
        setIsOnboardingDone(
          !!onboardingDone,
        );
      }, 2000);

    } catch (error) {
      setIsSplashVisible(false);
      setIsOnboardingDone(false);
    }
  };

  if (isSplashVisible || loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {!isOnboardingDone ? (
        <OnboardingScreen
          onDone={async () => {
            await AsyncStorage.setItem(OnBoardingKey, 'true');
            setIsOnboardingDone(true);
          }}
        />
      ) : !isLoggedIn ? (
        /* AUTH */
        <AuthStack />
      ) : !userData?.role ||
        !userData?.onboardingCompleted ? (

        /* COMPLETE PROFILE */
        <CompleteProfileScreen />

      ) : userData?.role ===
          'doctor' &&
        userData?.approvalStatus !==
          'approved' ? (

        /* DOCTOR APPROVAL */
        <DoctorPendingApprovalScreen />

      ) : (
        /* MAIN APP */
        <AppStack />
      )}
    </NavigationContainer>
  );
}