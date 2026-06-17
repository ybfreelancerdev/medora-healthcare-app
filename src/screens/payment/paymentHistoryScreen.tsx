import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import FirebaseService from '../../services/firebase.service';
import { capitalizeFirstLetter, getDrName, getStatusStyle } from '../../constants';
import { downloadReceiptPDF } from '../../services/pdf.service';
import { showCustom } from '../../services/message.service';

export default function PaymentHistoryScreen({ navigation }: any) {
  const { userData }: any = useAuth();
  const [isLoading, setisLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const fetchTransactions = async () => {
    setisLoading(true);
    const response = await FirebaseService.getPaymentHistory(userData?.id, userData?.role || '');
    if (response.success) {
      setTransactions(response.data || []);
      console.log(response.data, 'response.data');
    }
    setisLoading(false);
  };

  const downloadReceipt = async (item:any) => {
    console.log(item, 'receipt item')
    const result = await downloadReceiptPDF(item);
    if(result.success) {
      showCustom(`Receipt downloaded at download folder`);
    }
    else {
      showCustom(result.message);
    }
  }

  const renderPaymentItem = ({ item }: any) => {
    const statusStyle = getStatusStyle(item.paymentStatus)

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.paymentCard}
      >
        {/* Top */}
        <View style={styles.topRow}>
          <View
            style={styles.iconContainer}
          >
            <MaterialIcons
              name="payments"
              size={26}
              color={
                Colors.APP_COLOR
              }
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.doctorName}>
              {getDrName(item?.appointment?.doctor?.fullName)}
            </Text>

            <Text
              style={styles.specialist}
            >
              {item?.appointment?.doctor?.specialization}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusStyle.backgroundColor,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: statusStyle.textColor,
                },
              ]}
            >
              {capitalizeFirstLetter(item.paymentStatus)}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Payment Info */}
        <View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Amount
            </Text>

            <Text style={styles.amount}>
              {item.amount}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Payment Method
            </Text>

            <Text style={styles.value}>
              {item.paymentMethod}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Date
            </Text>

            <Text style={styles.value}>
              {item.createdAt?.toDate()?.toDateString()}
            </Text>
          </View>
        </View>

        {/* Receipt Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.receiptButton}
          onPress={() => downloadReceipt(item)}
        >
          <Ionicons
            name="document-text-outline"
            size={18}
            color={
              Colors.APP_COLOR
            }
          />

          <Text
            style={styles.receiptText}
          >
            Download Receipt
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
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
            Payment History
          </Text>

          <View style={{ width: 45 }} />
        </View>

        {/* Payment List */}
        {isLoading ?
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Colors.APP_COLOR} />
          </View>
          :
          <FlatList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={
              renderPaymentItem
            }
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 24,
              paddingTop: 10,
            }}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="wallet-outline"
                  size={70}
                  color="#CBD5E1"
                />

                <Text style={styles.emptyTitle}>
                  No Payments Found
                </Text>

                <Text style={styles.emptySubtitle}>
                  Your payment history
                  will appear here.
                </Text>
              </View>
            )}
          />
        }
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

  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  doctorName: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  specialist: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 10,
    fontFamily: fonts.name.medium,
  },

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: fonts.name.medium,
    marginBottom: 5,
  },

  amount: {
    fontSize: 12,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.bold,
  },

  value: {
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  receiptButton: {
    marginTop: 5,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  receiptText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.semibold,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
    lineHeight: 22,
  },
});