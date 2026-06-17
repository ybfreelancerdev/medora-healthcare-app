import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import _firebaseDb from '../../constants/firebaseDb';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '../../context/AuthContext';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function DeleteAccountScreen({ navigation }: any) {
  const { userData, logout }: any = useAuth();
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const reasons = [
    'Privacy concerns',
    'Found another app',
    'Too many notifications',
    'Temporary leave',
    'Other',
  ];

  const deleteAccount = async () => {
    try {
      await firestore()
        .collection(_firebaseDb.users)
        .doc(userData.id)
        .update({
          isActive: false,
          isDeleted: true,
          deletedAt: firestore.FieldValue.serverTimestamp(),
        });

      logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFF5F5"
      />

      <SafeAreaView
        edges={['top']}
        style={{
          backgroundColor: '#FFF5F5',
        }}
      />

      <LinearGradient
        colors={[
          '#FFF5F5',
          '#FEF2F2',
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
            Delete Account
          </Text>

          <View style={{ width: 45 }} />
        </View>

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={50}
          extraHeight={120}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: 30,
          }}
        >

          {/* Warning Card */}
          <View style={styles.warningCard}>
            <View
              style={
                styles.warningIcon
              }
            >
              <MaterialIcons
                name="delete-forever"
                size={40}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.warningTitle}>
              Delete Your Account
            </Text>

            <Text
              style={
                styles.warningSubtitle
              }
            >
              This action is permanent.
              All your appointments,
              reports, prescriptions,
              and account data will be
              permanently removed.
            </Text>
          </View>

          {/* Reasons */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Why are you leaving?
            </Text>

            <View
              style={styles.reasonWrap}
            >
              {reasons.map(item => {

                const selected =
                  reason === item;

                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.8}
                    style={[
                      styles.reasonButton,
                      selected && {
                        backgroundColor:
                          '#FEE2E2',
                        borderColor:
                          '#DC2626',
                      },
                    ]}
                    onPress={() =>
                      setReason(item)
                    }
                  >
                    <Text
                      style={[
                        styles.reasonText,
                        selected && {
                          color:
                            '#DC2626',
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Confirmation */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Confirmation
            </Text>

            <Text style={[styles.confirmLabel, { marginTop: 0 }]}>
              Type DELETE to confirm
            </Text>

            <TextInput
              value={confirmText}
              onChangeText={
                setConfirmText
              }
              placeholder="Type DELETE"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={
              confirmText !==
              'DELETE'
            }
            onPress={deleteAccount}
            style={[
              styles.deleteButton,
              confirmText !==
              'DELETE' && {
                opacity: 0.5,
              },
            ]}
          >
            <MaterialIcons
              name="delete-outline"
              size={22}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.deleteText
              }
            >
              Delete My Account
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footerText}>
            If you only want to take a
            break, you can simply logout
            instead of deleting your
            account.
          </Text>
        </KeyboardAwareScrollView>
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

  warningCard: {
    marginTop: 10,
    borderRadius: 30,
    backgroundColor: '#DC2626',
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  warningIcon: {
    width: 50,
    height: 50,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  warningTitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: fonts.name.bold,
  },

  warningSubtitle: {
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 12,
    color: '#FEE2E2',
    fontFamily: fonts.name.medium,
  },

  card: {
    marginTop: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  reasonWrap: {
    marginTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  reasonButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 10,
    marginBottom: 10,
  },

  reasonText: {
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.medium,
  },

  confirmLabel: {
    marginTop: 15,
    marginBottom: 10,
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  input: {
    height: 50,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 15,
    color: Colors.titleColor,
    fontSize: 14,
    fontFamily: fonts.name.medium,
  },

  deleteButton: {
    height: 50,
    borderRadius: 22,
    backgroundColor: '#DC2626',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: fonts.name.semibold,
  },

  footerText: {
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: fonts.name.medium,
  },
});