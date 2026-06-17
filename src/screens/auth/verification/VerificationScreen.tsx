import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '../../../components/AppButton';
import fonts from '../../../constants/fonts';
import * as Colors from '../../../styles/colors';
import firebaseAuthService from '../auth.service';
import { showCustom } from '../../../services/message.service';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function VerificationScreen({ navigation }: any) {
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        setLoading(true);
        try {
            const response = await firebaseAuthService.checkEmailVerification();
            if (response.success && response.verified) {
                showCustom( 'Email verified successfully');
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }
            else {
                showCustom('Email not verified yet');
            }
        } catch (error:any) {
            showCustom(error.message)
        }
        finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        try {
            const response = await firebaseAuthService.resendVerificationEmail();
            if (response.success) {
                showCustom( 'Verification email sent again');
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }
            else {
                showCustom(response.message);
            }
        } catch (error:any) {
            showCustom(error.message);
        }
    };

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F5F9FF"
            />

            {/* Top Safe Area */}
            <SafeAreaView
                edges={['top']}
                style={{ backgroundColor: '#F5F9FF' }}
            />

            <LinearGradient
                colors={['#F5F9FF', '#EEF6FF', '#FFFFFF']}
                style={styles.container}
            >
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            name="email-check-outline"
                            size={56}
                            color={Colors.APP_COLOR}
                        />
                    </View>

                    <Text style={styles.title}>
                        Verify Your Email
                    </Text>

                    <Text style={styles.description}>
                        We’ve sent a verification link to your email
                        address. Please verify your email to continue
                        using Medora.
                    </Text>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>
                            Didn’t receive the email?
                        </Text>

                        <Text style={styles.infoText}>
                            Check your spam folder or resend the
                            verification email.
                        </Text>
                    </View>

                    <AppButton
                        title="Continue"
                        onPress={handleContinue}
                        loading={loading}
                        style={{ marginTop: 30 }}
                    />

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.resendButton}
                        onPress={handleResendVerification}
                    >
                        <Text style={styles.resendText}>
                            Resend Verification Email
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.backButton}
                        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
                    >
                        <Text style={styles.backText}>
                            Back to Login
                        </Text>
                    </TouchableOpacity>
                </View>
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

    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 60,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
        borderWidth: 1, 
        borderColor: '#DBEAFE',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 8, },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
    },

    title: {
        fontSize: 20,
        fontFamily: fonts.name.bold,
        color: Colors.titleColor,
        textAlign: 'center',
    },

    description: {
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
        color: Colors.subtitleColor,
        fontFamily: fonts.name.regular,
    },

    infoCard: {
        marginTop: 30,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },

    infoTitle: {
        fontSize: 14,
        fontFamily: fonts.name.semibold,
        color: Colors.titleColor,
        marginBottom: 8,
    },

    infoText: {
        fontSize: 14,
        lineHeight: 22,
        color: Colors.subtitleColor,
        fontFamily: fonts.name.regular,
    },

    resendButton: {
        marginTop: 20,
        alignItems: 'center',
    },

    resendText: {
        fontSize: 14,
        color: Colors.APP_COLOR,
        fontFamily: fonts.name.semibold,
    },

    backButton: {
        marginTop: 15,
        alignItems: 'center',
    },

    backText: {
        fontSize: 14,
        color: Colors.subtitleColor,
        fontFamily: fonts.name.medium,
    },
});