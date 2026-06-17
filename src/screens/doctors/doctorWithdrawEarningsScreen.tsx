import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';

export default function DoctorWithdrawEarningsScreen({
  navigation,
}: any) {

  const [amount, setAmount] =
    useState('');

  const availableBalance = 24580;

  const bankAccounts = [
    {
      id: '1',
      bank: 'HDFC Bank',
      account: '**** 4587',
      primary: true,
    },

    {
      id: '2',
      bank: 'ICICI Bank',
      account: '**** 8741',
      primary: false,
    },
  ];

  const [selectedBank, setSelectedBank] =
    useState(bankAccounts[0]);

  const quickAmounts = [
    '500',
    '1000',
    '5000',
    '10000',
  ];

  const handleWithdraw = () => {

    if (!amount) {
      return;
    }

    navigation.navigate(
      'WithdrawalSuccess',
      {
        amount,
      },
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
            Withdraw Earnings
          </Text>

          <View
            style={{width: 45}}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom: 15,
          }}
        >
          {/* Balance Card */}
          <LinearGradient
            colors={[
              '#2563EB',
              '#1D4ED8',
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={styles.balanceCard}
          >
            <View
              style={
                styles.balanceTopRow
              }
            >
              <View>
                <Text
                  style={
                    styles.balanceLabel
                  }
                >
                  Available Balance
                </Text>

                <Text
                  style={
                    styles.balanceAmount
                  }
                >
                  ₹
                  {availableBalance.toLocaleString()}
                </Text>
              </View>

              <View
                style={
                  styles.walletIconContainer
                }
              >
                <Ionicons
                  name="wallet"
                  size={28}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <Text
              style={styles.balanceInfo}
            >
              Withdraw your earnings
              securely to your bank
              account.
            </Text>
          </LinearGradient>

          {/* Withdraw Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Enter Amount
            </Text>

            <View
              style={
                styles.amountInputContainer
              }
            >
              <Text
                style={styles.currency}
              >
                ₹
              </Text>

              <TextInput
                value={amount}
                onChangeText={
                  setAmount
                }
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
                style={
                  styles.amountInput
                }
              />
            </View>

            {/* Quick Amounts */}
            <View
              style={
                styles.quickAmountRow
              }
            >
              {quickAmounts.map(
                item => {

                  const active =
                    amount === item;

                  return (
                    <TouchableOpacity
                      key={item}
                      activeOpacity={
                        0.8
                      }
                      style={[
                        styles.quickAmountButton,
                        active &&
                          styles.activeQuickButton,
                      ]}
                      onPress={() =>
                        setAmount(
                          item,
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.quickAmountText,
                          active &&
                            styles.activeQuickText,
                        ]}
                      >
                        ₹{item}
                      </Text>
                    </TouchableOpacity>
                  );
                },
              )}
            </View>
          </View>

          {/* Bank Accounts */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Select Bank Account
            </Text>

            {bankAccounts.map(
              item => {

                const active =
                  selectedBank.id ===
                  item.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    style={[
                      styles.bankCard,
                      active &&
                        styles.activeBankCard,
                    ]}
                    onPress={() =>
                      setSelectedBank(
                        item,
                      )
                    }
                  >
                    <View
                      style={
                        styles.bankLeft
                      }
                    >
                      <View
                        style={
                          styles.bankIconContainer
                        }
                      >
                        <FontAwesome5
                          name="university"
                          size={18}
                          color={
                            Colors.APP_COLOR
                          }
                        />
                      </View>

                      <View>
                        <Text
                          style={
                            styles.bankName
                          }
                        >
                          {item.bank}
                        </Text>

                        <Text
                          style={
                            styles.bankAccount
                          }
                        >
                          {
                            item.account
                          }
                        </Text>
                      </View>
                    </View>

                    {active && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={
                          Colors.APP_COLOR
                        }
                      />
                    )}
                  </TouchableOpacity>
                );
              },
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.addBankButton}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={Colors.APP_COLOR}
              />

              <Text
                style={
                  styles.addBankText
                }
              >
                Add New Bank Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <View
              style={
                styles.summaryRow
              }
            >
              <Text
                style={
                  styles.summaryLabel
                }
              >
                Withdrawal Amount
              </Text>

              <Text
                style={
                  styles.summaryValue
                }
              >
                ₹
                {amount || '0'}
              </Text>
            </View>

            <View
              style={
                styles.summaryRow
              }
            >
              <Text
                style={
                  styles.summaryLabel
                }
              >
                Processing Fee
              </Text>

              <Text
                style={
                  styles.summaryValue
                }
              >
                ₹0
              </Text>
            </View>

            <View
              style={
                styles.divider
              }
            />

            <View
              style={
                styles.summaryRow
              }
            >
              <Text
                style={
                  styles.totalLabel
                }
              >
                You Will Receive
              </Text>

              <Text
                style={
                  styles.totalAmount
                }
              >
                ₹
                {amount || '0'}
              </Text>
            </View>
          </View>

          {/* Withdraw Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.withdrawButton}
            onPress={handleWithdraw}
          >
            <MaterialIcons
              name="account-balance-wallet"
              size={22}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.withdrawButtonText
              }
            >
              Withdraw Earnings
            </Text>
          </TouchableOpacity>
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
    flex: 1,
  },

  header: {
    marginTop: 10,
    marginBottom: 5,
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

  balanceCard: {
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 30,
    padding: 20,
  },

  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  balanceLabel: {
    fontSize: 14,
    color: '#DBEAFE',
    fontFamily: fonts.name.medium,
  },

  balanceAmount: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: fonts.name.bold,
  },

  walletIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  balanceInfo: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 20,
    color: '#DBEAFE',
    fontFamily: fonts.name.medium,
  },

  card: {
    marginTop: 20,
    marginHorizontal: 20,
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
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  amountInputContainer: {
    marginTop: 15,
    height: 50,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  currency: {
    fontSize: 16,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.bold,
  },

  amountInput: {
    flex: 1,
    marginLeft: 5,
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  quickAmountRow: {
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  quickAmountButton: {
    width: '23%',
    height: 40,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeQuickButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: Colors.APP_COLOR,
  },

  quickAmountText: {
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  activeQuickText: {
    color: Colors.APP_COLOR,
  },

  bankCard: {
    marginTop: 15,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  activeBankCard: {
    backgroundColor: '#EFF6FF',
    borderColor: Colors.APP_COLOR,
  },

  bankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bankIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  bankName: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  bankAccount: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  addBankButton: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },

  addBankText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.semibold,
  },

  summaryCard: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  summaryValue: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 15,
  },

  totalLabel: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  totalAmount: {
    fontSize: 16,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.bold,
  },

  withdrawButton: {
    height: 50,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 22,
    backgroundColor: Colors.APP_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  withdrawButtonText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: fonts.name.semibold,
  },
});