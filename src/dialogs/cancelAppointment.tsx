import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import fonts from '../constants/fonts';
import * as Colors from '../styles/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelAppointmentModal({
  visible,
  onClose,
  onConfirm,
}: Props) {

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons
              name="close"
              size={34}
              color="#DC2626"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            Cancel Appointment?
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            Are you sure you want to cancel this appointment?
            This action cannot be undone.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.keepButton}
              onPress={onClose}
            >
              <Text style={styles.keepText}>
                Keep
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cancelButton}
              onPress={onConfirm}
            >
              <Text style={styles.cancelText}>
                Yes, Cancel
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: 'center',
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
    textAlign: 'center',
  },

  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
    color: Colors.subtitleColor,
    fontFamily: fonts.name.regular,
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 30,
  },

  keepButton: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  keepText: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  cancelText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: fonts.name.semibold,
  },
});