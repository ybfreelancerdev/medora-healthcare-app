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
import { capitalizeFirstLetter, getMessageTime, getNotificationTime, getStatusStyle } from '../../constants';

export default function TransactionHistoryScreen({ navigation }: any) {

  //const [transactions] = useState(transactionsData);
  const { userData }: any = useAuth();
  const [isLoading, setisLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const fetchTransactions = async () => {
    setisLoading(true);
    const response = await FirebaseService.getPaymentHistory(userData?.id, userData?.role || '', 5);
    if (response.success) {
      console.log(response, 'response.data');
      setTransactions(response.data || []);
      setTotalAmount(response.totalAmount || 0);
    }
    setisLoading(false);
  };

  const renderTransaction = ({ item }: any) => {
    const statusStyle = getStatusStyle(item?.appointment?.status === 'pending' ? item?.appointment?.status : item.paymentStatus);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.transactionCard}
      >
        <View style={styles.contentContainer}>
          {/* Row 1 */}
          <View style={styles.topRow}>
            <Text style={styles.patientName}>
              {item?.appointment?.patient?.fullName}
            </Text>

            <Text
              style={[
                styles.amount,
                {
                  color: statusStyle.textColor,
                },
              ]}
            >
              {/* {isCredit ? '+' : '-'} */}
              {capitalizeFirstLetter(item.paymentStatus)}
            </Text>
          </View>

          {/* Row 2 */}
          <View style={styles.bottomRow}>
            <Text style={styles.consultationText}>
              {item.paymentMethod}
            </Text>
            <Text style={styles.consultationText}>
              {item.doctorFee}
            </Text>
          </View>

          {/* Row 3 */}
          <View style={styles.bottomRow}>
            <Text style={styles.dateText}>
              {getNotificationTime(item.createdAt)}
            </Text>

            <Text style={styles.timeText}>
              {getMessageTime(item.createdAt)}
            </Text>
          </View>
        </View>
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
            Transactions
          </Text>

          <View style={{width: 45}} />
        </View>

        {/* Summary Card */}
        {!isLoading && (
          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryLabel}>
                Total Earnings
              </Text>

              <Text style={styles.summaryAmount}>
                ₹{totalAmount}
              </Text>
            </View>
          </View>
        )}

        {/* List */}
        {isLoading ?
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Colors.APP_COLOR} />
          </View>
          :
          <FlatList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={renderTransaction}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingTop: 15,
            }}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <MaterialIcons
                  name="receipt-long"
                  size={70}
                  color="#CBD5E1"
                />

                <Text style={styles.emptyTitle}>
                  No Transactions Yet
                </Text>

                <Text style={styles.emptySubtitle}>
                  Your earnings history will appear here.
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

  summaryCard: {
    marginTop: 15,
    marginHorizontal: 20,
    backgroundColor: Colors.APP_COLOR,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLabel: {
    marginTop: 5,
    fontSize: 14,
    color: '#DBEAFE',
    fontFamily: fonts.name.medium,
  },

  summaryAmount: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: fonts.name.bold,
  },

  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  contentContainer: {
    flex: 1,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  patientName: {
    flex: 1,
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  amount: {
    fontSize: 14,
    fontFamily: fonts.name.bold,
  },

  consultationText: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.semibold,
  },

  bottomRow: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateText: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: fonts.name.medium,
  },

  timeText: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: fonts.name.medium,
  },

  emptyContainer: {
    marginTop: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },
});