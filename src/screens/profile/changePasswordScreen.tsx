import React, { useState } from 'react';
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
import { Formik } from 'formik';
import * as Yup from 'yup';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import auth from '@react-native-firebase/auth';
import { showCustom } from '../../services/message.service';
import { useAuth } from '../../context/AuthContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),

  newPassword: Yup.string()
    .min(
      6,
      'Password must be at least 6 characters',
    )
    .required('New password is required'),

  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref('newPassword')],
      'Passwords do not match',
    )
    .required(
      'Confirm password is required',
    ),
});

export default function ChangePasswordScreen({ navigation }: any) {
  const { userData }: any = useAuth();
  const [isLoading, setisLoading] = useState(false);

  const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const handleChangePassword = async (values: any) => {
    try {
      setisLoading(true);

      const user = auth().currentUser;
      if (!user || !user.email) {
        showCustom('User not found');
      }

      // Re-authenticate user
      const credential = auth.EmailAuthProvider.credential(
        userData.email,
        values.currentPassword,
      );

      await user?.reauthenticateWithCredential(
        credential,
      );

      // Update password
      await user?.updatePassword(
        values.newPassword,
      );

      showCustom('Password updated successfully');
      navigation.goBack();
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
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
            Change Password
          </Text>

          <View style={{ width: 45 }} />
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={
            validationSchema
          }
          onSubmit={
            handleChangePassword
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
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              enableOnAndroid={true}
              extraScrollHeight={50}
              extraHeight={120}
              contentContainerStyle={{
                flexGrow: 1,
                paddingHorizontal: 20,
                paddingBottom: 20,
              }}
            >
              {/* Icon Section */}
              <View
                style={styles.topSection}
              >
                <View
                  style={styles.iconContainer}
                >
                  <Ionicons
                    name="lock-closed"
                    size={40}
                    color={
                      Colors.APP_COLOR
                    }
                  />
                </View>

                <Text style={styles.title}>
                  Update Password
                </Text>

                <Text
                  style={styles.subtitle}
                >
                  Create a strong password
                  to keep your Medora
                  account secure.
                </Text>
              </View>

              {/* Form Card */}
              <View style={styles.card}>
                <AppInput
                  title="Current Password"
                  placeholder="Enter current password"
                  value={
                    values.currentPassword
                  }
                  onChangeText={handleChange(
                    'currentPassword',
                  )}
                  onBlur={handleBlur(
                    'currentPassword',
                  )}
                  error={errors.currentPassword}
                  touched={touched.currentPassword}
                  leftIcon="lock-closed-outline"
                  secureTextEntry
                />

                <AppInput
                  title="New Password"
                  placeholder="Enter new password"
                  value={
                    values.newPassword
                  }
                  onChangeText={handleChange(
                    'newPassword',
                  )}
                  onBlur={handleBlur(
                    'newPassword',
                  )}
                  error={errors.newPassword}
                  touched={touched.newPassword}
                  leftIcon="shield-checkmark-outline"
                  secureTextEntry
                  containerStyle={{ marginTop: 15 }}
                />

                <AppInput
                  title="Confirm Password"
                  placeholder="Confirm new password"
                  value={
                    values.confirmPassword
                  }
                  onChangeText={handleChange(
                    'confirmPassword',
                  )}
                  onBlur={handleBlur(
                    'confirmPassword',
                  )}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  leftIcon="checkmark-circle-outline"
                  secureTextEntry
                  containerStyle={{ marginTop: 15 }}
                />
              </View>

              {/* Button */}
              <AppButton
                title="Update Password"
                loading={isLoading}
                disabled={isLoading}
                onPress={handleSubmit}
                style={{
                  marginTop: 25,
                }}
              />
            </KeyboardAwareScrollView>
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

  topSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 30,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  title: {
    fontSize: 18,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
});