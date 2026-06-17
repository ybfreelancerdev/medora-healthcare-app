import React, { useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import fonts from '../../../constants/fonts';
import * as Colors from '../../../styles/colors';
import AppInput from '../../../components/AppInput';
import AppButton from '../../../components/AppButton';
import { useFocusEffect } from '@react-navigation/native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import firebaseAuthService from '../auth.service';
import { showCustom } from '../../../services/message.service';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ForgotPasswordScreen({ navigation }: any) {
    const [loading, setLoading] = useState(false);
    const formikRef = useRef<any>(null);

    // Load saved credentials when component mounts
    useFocusEffect(
        useCallback(() => {
            formikRef.current?.resetForm();
        }, [])
    );

    const initialValues = {
        email: ''
    };

    // Validation schema with Yup
    const validationSchema = Yup.object({
        email: Yup.string()
            .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$/, 'Invalid email format')
            .required('Email is required'),
    });

    const forgotPasswordHandler = async (values: any) => {
        setLoading(true);
        const response = await firebaseAuthService.forgotPassword( values.email, );
        if (response.success) {
            showCustom(response.message);
            navigation.goBack();
        }
        else {
            showCustom(response.message);
        }
        setLoading(false);
    }

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F5F9FF"
            />

            <SafeAreaView edges={['top']} style={{ backgroundColor: '#F5F9FF' }} />
            <LinearGradient
                colors={['#F5F9FF', '#EEF6FF', '#FFFFFF']}
                style={styles.container}
            >
                <Formik
                    innerRef={formikRef}
                    enableReinitialize={true}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        // Handle form submission
                        forgotPasswordHandler(values);
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue }) => (
                        <KeyboardAwareScrollView
                            contentContainerStyle={styles.scrollContainer}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            enableOnAndroid
                            extraScrollHeight={20}
                        >
                            <View style={styles.topContainer}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons
                                        name="lock-reset"
                                        size={46}
                                        color={Colors.APP_COLOR}
                                    />
                                </View>

                                <Text style={styles.title}>
                                    Forgot Password?
                                </Text>

                                <Text style={styles.subtitle}>
                                    Don’t worry! Enter your registered email
                                    address and we’ll send you a password reset
                                    link.
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


                                <AppButton
                                    title="Send Reset Link"
                                    style={{ marginTop: 25 }}
                                    onPress={handleSubmit}
                                    loading={loading}
                                />

                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}
                                    style={styles.backButton}
                                >
                                    <Text style={styles.backText}>
                                        Back to Login
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAwareScrollView>
                    )}
                </Formik>
            </LinearGradient>
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
    },

    topContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },

    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1, 
        borderColor: '#DBEAFE',
        shadowColor: '#2563EB',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
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
        lineHeight: 22,
        textAlign: 'center',
    },

    card: {
        marginTop: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 8,
    },

    backButton: {
        marginTop: 20,
        alignItems: 'center',
    },

    backText: {
        fontSize: 14,
        color: Colors.APP_COLOR,
        fontFamily: fonts.name.semibold,
    },
});