import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppInput from '../../../components/AppInput';
import AppButton from '../../../components/AppButton';
import * as Yup from 'yup';
import { Formik } from 'formik';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import fonts from '../../../constants/fonts';
import * as Colors from '../../../styles/colors';
import firebaseAuthService from '../auth.service';
import { showCustom } from '../../../services/message.service';
import { useAuth } from '../../../context/AuthContext';

export default function LoginScreen({navigation}:any) {
  const [loading, setLoading] = useState(false);
  const { login, fetchUserData }: any = useAuth();
  const formikRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      formikRef.current?.resetForm();
    }, [])
  );

  const initialValues = {
    email: '',
    password: '',
  };

  // Validation schema with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$/, 'Invalid email format')
      .required('Email is required'),

    password: Yup.string()
      .min(6, 'Password must be at least 6 digits')
      .required('Password is required')
  });

  const loginHandler = async (values: any) => {
    setLoading(true);
    try {
        // Firebase Login 
        const response = await firebaseAuthService.login(values.email, values.password); 

        // Success 
        if (response.success) {
          const currentUser = auth().currentUser;

          if (currentUser?.uid) {
            await fetchUserData(
              currentUser.uid,
            );
          }
          // Store Session 
          await login(response.token);
        }
        else if (response.emailNotVerified) { 
          // EMAIL NOT VERIFIED 
          showCustom(response.message); 
          navigation.navigate( 'Verification', { email: values.email }); 
        }
        else {
            showCustom(response.message);
        }
    }
    catch(error:any) {
        showCustom(error.message)
    }
    finally {
        setLoading(false);
    }
  }

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FBFF"
      />
      {/* Top Safe Area */} 
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#F8FBFF' }} />
      <LinearGradient
        colors={['#F8FBFF', '#EEF7FF', '#FFFFFF']}
        style={styles.container}
      >
        <Formik
            innerRef={formikRef}
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              // Handle form submission
              loginHandler(values);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue }) => (
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topSection}>
            <Text style={styles.title}>
              Welcome Back
            </Text>

            <Text style={styles.subtitle}>
              Login to continue using Medora
            </Text>
          </View>

          <View style={styles.card}>
            <AppInput
                label="Email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                placeholder="Email"
                keyboardType="email-address"
                icon="email"
                error={errors.email}
                touched={touched.email}
            />

            <AppInput
                label="Password"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                placeholder="Enter password"
                secureTextEntry
                icon="lock"
                error={errors.password}
                touched={touched.password}
                containerStyle={{marginTop: 15}}
            />

            <TouchableOpacity activeOpacity={0.5}
            onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
            
            <AppButton
                title="Login"
                style={{ marginTop: 25 }}
                onPress={handleSubmit}
                loading={loading}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />

              <Text style={styles.dividerText}>
                OR
              </Text>

              <View style={styles.divider} />
            </View>

            {/* <TouchableOpacity style={styles.socialButton}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
                }}
                style={styles.socialIcon}
              />

              <Text style={styles.socialText}>
                Continue with Google
              </Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity style={styles.socialButton}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/5968/5968764.png',
                }}
                style={styles.socialIcon}
              />

              <Text style={styles.socialText}>
                Continue with Facebook
              </Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity style={styles.socialButton}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png',
                }}
                style={styles.socialIcon}
              />

              <Text style={styles.socialText}>
                Continue with Apple
              </Text>
            </TouchableOpacity> */}

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don’t have an account?
              </Text>

              <TouchableOpacity activeOpacity={0.5}
              onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signupText}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
        )}
          </Formik>
      </LinearGradient>
      {/* Bottom Safe Area */}
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#FFFFFF' }} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },

  topSection: {
    alignItems: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontFamily: fonts.name.bold,
    color: Colors.titleColor,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: fonts.name.regular,
    color: Colors.subtitleColor,
  },

  card: {
    marginTop: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },

  forgotText: {
    alignSelf: 'flex-end',
    marginTop: 20,
    color: Colors.APP_COLOR,
    fontSize: 14,
    fontFamily: fonts.name.medium,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginTop: 25
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  dividerText: {
    marginHorizontal: 15,
    fontFamily: fonts.name.medium,
    color: Colors.Form_PlaceholderColor,
  },

  socialButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },

  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  socialText: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.medium,
    bottom: -3
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    //marginTop: 10,
  },

  footerText: {
    color: Colors.subtitleColor,
    fontSize: 14,
    fontFamily: fonts.name.regular,
  },

  signupText: {
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.semibold,
    marginLeft: 6,
    fontSize: 14,
  },
});
