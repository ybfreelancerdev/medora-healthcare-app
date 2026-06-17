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
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useFocusEffect } from '@react-navigation/native';
import AppInput from '../../../components/AppInput';
import AppButton from '../../../components/AppButton';
import fonts from '../../../constants/fonts';
import * as Colors from '../../../styles/colors';
import firebaseAuthService from '../auth.service';
import { showCustom } from '../../../services/message.service';

export default function RegisterScreen({ navigation }: any) {
    const [loading, setLoading] = useState(false);
    const formikRef = useRef<any>(null);
    const scrollRef = useRef<KeyboardAwareScrollView>(null);

    useFocusEffect(
        useCallback(() => {
            formikRef.current?.resetForm();
        }, []),
    );

    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$/,
                'Invalid email format',
            )
            .required('Email is required'),

        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),

        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords do not match')
            .required('Confirm password is required'),
    });

    const registerHandler = async (values: any) => {
        setLoading(true);
        const response = await firebaseAuthService.register(values);
        if (response.success) {
            navigation.navigate('Verification');
        }
        else {
            showCustom(response.message);
        }
        setLoading(false);
    };

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F8FBFF"
            />

            {/* Top Safe Area */}
            <SafeAreaView
                edges={['top']}
                style={{ backgroundColor: '#F8FBFF' }}
            />

            <LinearGradient
                colors={['#F8FBFF', '#EEF7FF', '#FFFFFF']}
                style={styles.container}
            >
                <Formik
                    innerRef={formikRef}
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async values => {
                        registerHandler(values);
                    }}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        touched,
                        errors,
                    }) => (
                        <KeyboardAwareScrollView
                            ref={scrollRef}
                            contentContainerStyle={styles.scrollContainer}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.topSection}>
                                <Text style={styles.title}>
                                    Create Account
                                </Text>

                                <Text style={styles.subtitle}>
                                    Join Medora and manage your health easily
                                </Text>
                            </View>

                            <View style={styles.card}>
                                <AppInput
                                    label="Email"
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    placeholder="Enter email"
                                    keyboardType="email-address"
                                    icon="email"
                                    error={errors.email}
                                    touched={touched.email}
                                />

                                <AppInput
                                    label="Password"
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    placeholder="Enter password"
                                    secureTextEntry
                                    icon="lock"
                                    error={errors.password}
                                    touched={touched.password}
                                    containerStyle={{ marginTop: 15 }}
                                />

                                <AppInput
                                    label="Confirm Password"
                                    value={values.confirmPassword}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    placeholder="Confirm password"
                                    secureTextEntry
                                    icon="lock"
                                    error={errors.confirmPassword}
                                    touched={touched.confirmPassword}
                                    containerStyle={{ marginTop: 15 }}
                                />

                                <AppButton
                                    title="Create Account"
                                    style={{ marginTop: 30 }}
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
                                        Already have an account?
                                    </Text>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => navigation.goBack()}
                                    >
                                        <Text style={styles.loginText}>
                                            Login
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    )}
                </Formik>
            </LinearGradient>

            {/* Bottom Safe Area */}
            <SafeAreaView
                edges={['bottom']}
                style={{ backgroundColor: '#FFFFFF' }}
            />
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
            height: 8,
        },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 8,
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
        bottom: -3,
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        // marginTop: 10,
    },

    footerText: {
        color: Colors.subtitleColor,
        fontSize: 14,
        fontFamily: fonts.name.regular,
    },

    loginText: {
        color: Colors.APP_COLOR,
        fontFamily: fonts.name.semibold,
        marginLeft: 6,
        fontSize: 14,
    },
});