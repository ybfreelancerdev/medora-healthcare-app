import React, { useCallback, useState } from 'react';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import FirebaseService from '../../services/firebase.service';
import { capitalizeFirstLetter, getMessageTime, getNotificationTime, getStatusStyle } from '../../constants';

export default function DoctorWalletScreen({ navigation }: any) {
  const { userData }: any = useAuth();
  const [isLoading, setisLoading] = useState(false);
  const [allStats, setAllStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
      fetchTransactions();
    }, [])
  );

  const fetchStats = async () => {
    setisLoading(true);
    const response = await FirebaseService.getDoctorAllStats(userData?.id);
    if (response.success) {
      setAllStats(response.data);
    }
    setisLoading(false);
  };

  const fetchTransactions = async () => {
    setisLoading(true);
    const response = await FirebaseService.getPaymentHistory(userData?.id, userData?.role || '', 5);
    if (response.success) {
      console.log(response.data, 'response.data')
      setTransactions(response.data || []);
    }
    setisLoading(false);
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
            Earnings
          </Text>

          <View style={{width: 45}}/>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            marginHorizontal: 20,
          }}
        >
          {/* Wallet Card */}
          <LinearGradient
            colors={['#2563EB', '#1D4ED8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1}}
            style={styles.walletCard}
          >
            <View style={styles.walletTop}>
              <View>
                <Text style={styles.walletLabel}>
                  Total Balance
                </Text>

                <Text style={styles.walletAmount}>
                  ₹{allStats?.totalAmount}
                </Text>
              </View>

              <View style={styles.walletIconContainer}>
                <MaterialIcons
                  name="wallet"
                  size={28}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <View style={styles.walletBottom}>
              <View>
                <Text style={styles.walletSmallLabel}>
                  This Month
                </Text>

                <Text style={styles.walletSmallValue}>
                  ₹{allStats?.currentMonthAmount}
                </Text>
              </View>

              {/* <View>
                <Text style={styles.walletSmallLabel}>
                  Consultations
                </Text>

                <Text style={styles.walletSmallValue}>
                  {allStats?.totalCompletedAppointments}
                </Text>
              </View> */}
            </View>
          </LinearGradient>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statsCard}>
              <View
                style={[
                  styles.statsIcon,
                  {
                    backgroundColor:
                      '#DCFCE7',
                  },
                ]}
              >
                <MaterialIcons
                  name="trending-up"
                  size={24}
                  color="#16A34A"
                />
              </View>

              <Text style={styles.statsValue}>
                ₹{allStats?.currentWeekAmount}
              </Text>

              <Text style={styles.statsLabel}>
                Weekly Earnings
              </Text>
            </View>

            <View style={styles.statsCard}>
              <View
                style={[
                  styles.statsIcon,
                  {
                    backgroundColor:
                      '#DBEAFE',
                  },
                ]}
              >
                <MaterialIcons
                  name="calendar-month"
                  size={24}
                  color="#2563EB"
                />
              </View>

              <Text style={styles.statsValue}>
                {allStats?.totalCompletedAppointments}
              </Text>

              <Text style={styles.statsLabel}>
                Total Appointments
              </Text>
            </View>
          </View>

          {/* Withdraw Button */}
          {/* <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DoctorWithdrawEarnings')}
            style={styles.withdrawButton}
          >
            <MaterialIcons
              name="payments"
              size={22}
              color="#FFFFFF"
            />

            <Text style={styles.withdrawText}>
              Withdraw Earnings
            </Text>
          </TouchableOpacity> */}

          {/* Transactions */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Recent Transactions
            </Text>

            <TouchableOpacity activeOpacity={0.8} 
            onPress={() => navigation.navigate(
                'TransactionHistory',
            )}>
              <Text style={styles.viewAllText}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {transactions.map(item => {
            const statusStyle = getStatusStyle(item?.appointment?.status === 'pending' ? item?.appointment?.status : item.paymentStatus);
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={styles.transactionCard}
              >
                <View
                  style={[
                    styles.transactionIcon,
                    {
                      backgroundColor: statusStyle.backgroundColor,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={item.paymentStatus === 'paid' ? 'south-west' : 'schedule'}
                    size={22}
                    color={statusStyle.textColor}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.patientName}>
                    {item?.appointment?.patient?.fullName}
                  </Text>

                  <Text style={styles.transactionTime}>
                    {getNotificationTime(item.createdAt)} • {getMessageTime(item.createdAt)}
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: 'flex-end',
                  }}
                >
                  <Text style={styles.amount}>
                    {item.doctorFee}
                  </Text>

                  <Text
                    style={[
                      styles.status,
                      {
                        color: statusStyle.textColor,
                      },
                    ]}
                  >
                    {capitalizeFirstLetter(item.paymentStatus)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
    flex: 1
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
    elevation: 4,
  },

  headerTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  walletCard: {
    borderRadius: 32,
    padding: 20,
  },

  walletTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  walletLabel: {
    fontSize: 14,
    color: '#DBEAFE',
    fontFamily: fonts.name.medium,
  },

  walletAmount: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: fonts.name.bold,
  },

  walletIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  walletBottom: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  walletSmallLabel: {
    fontSize: 12,
    color: '#BFDBFE',
    fontFamily: fonts.name.medium,
  },

  walletSmallValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: fonts.name.bold,
  },

  statsRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statsCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  statsIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsValue: {
    marginTop: 5,
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  statsLabel: {
    fontSize: 12,
    lineHeight: 20,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  withdrawButton: {
    height: 50,
    borderRadius: 22,
    backgroundColor: Colors.APP_COLOR,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  withdrawText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: fonts.name.semibold,
  },

  sectionHeader: {
    marginTop: 30,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  viewAllText: {
    fontSize: 12,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.semibold,
  },

  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  transactionIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  patientName: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  transactionTime: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  amount: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  status: {
    fontSize: 12,
    fontFamily: fonts.name.semibold,
  },
});