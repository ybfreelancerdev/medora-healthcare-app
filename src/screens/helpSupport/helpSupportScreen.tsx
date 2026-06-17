import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';

const supportOptions = [
  {
    id: '1',
    title: 'Call Support',
    subtitle:
      'Talk directly with our executive',
    icon: 'call-outline',
    type: 'Ionicons',
    color: '#16A34A',
    bg: '#DCFCE7',
  },
  {
    id: '2',
    title: 'Email Support',
    subtitle:
      'support@medora.app',
    icon: 'mail-outline',
    type: 'Ionicons',
    color: '#9333EA',
    bg: '#F3E8FF',
  },
];

const faqData = [
  {
    id: '1',
    question:
      'How can I cancel an appointment?',
    answer:
      'Go to Appointments > Open Appointment > Tap Cancel.',
  },
  {
    id: '2',
    question:
      'How do I upload medical reports?',
    answer:
      'Open Records > Reports > Tap Upload button.',
  },
  {
    id: '3',
    question:
      'How can I chat with doctor?',
    answer:
      'Open Appointment Details and tap Open Chat.',
  },
  {
    id: '4',
    question:
      'Where can I view prescriptions?',
    answer:
      'Go to Records > Prescriptions section.',
  },
];

export default function HelpSupportScreen({
  navigation,
}: any) {

  const [expandedId, setExpandedId] =
    useState('');

  const renderSupportIcon = (
    item: any,
  ) => {

    if (
      item.type === 'Ionicons'
    ) {
      return (
        <Ionicons
          name={item.icon}
          size={24}
          color={item.color}
        />
      );
    }

    return (
      <MaterialCommunityIcons
        name={item.icon}
        size={24}
        color={item.color}
      />
    );
  };

  const renderFAQItem = ({
    item,
  }: any) => {

    const expanded =
      expandedId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.faqCard}
        onPress={() =>
          setExpandedId(
            expanded
              ? ''
              : item.id,
          )
        }
      >
        <View style={styles.faqTop}>
          <Text style={styles.faqQuestion}>
            {item.question}
          </Text>

          <Ionicons
            name={
              expanded
                ? 'chevron-up'
                : 'chevron-down'
            }
            size={20}
            color={
              Colors.titleColor
            }
          />
        </View>

        {expanded && (
          <Text style={styles.faqAnswer}>
            {item.answer}
          </Text>
        )}
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
            Help & Support
          </Text>

          <View style={{ width: 45 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
        >
        <View style={{ paddingHorizontal: 20 }}>
            {/* Support Banner */}
            <View style={styles.bannerCard}>
                <View
                    style={
                        styles.bannerIcon
                    }
                >
                    <MaterialIcons
                        name="support-agent"
                        size={32}
                        color="#FFFFFF"
                    />
                </View>

                <Text style={styles.bannerTitle}>
                    Need Help?
                </Text>

                <Text
                    style={
                        styles.bannerSubtitle
                    }
                >
                    Our support team is
                    available 24/7 to assist
                    you.
                </Text>
            </View>

            {/* Support Options */}
            <Text style={styles.sectionTitle}>
                Contact Support
            </Text>

            {supportOptions.map(item => (
                <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    style={
                        styles.supportCard
                    }
                >
                    <View
                        style={[
                            styles.supportIcon,
                            {
                                backgroundColor:
                                    item.bg,
                            },
                        ]}
                    >
                        {renderSupportIcon(
                            item,
                        )}
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text
                            style={
                                styles.supportTitle
                            }
                        >
                            {item.title}
                        </Text>

                        <Text
                            style={
                                styles.supportSubtitle
                            }
                        >
                            {item.subtitle}
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#94A3B8"
                    />
                </TouchableOpacity>
            ))}
        </View>
          {/* FAQ */}
            <View style={{ marginHorizontal: 20 }}>
                <Text style={[ styles.sectionTitle, {marginTop: 5, marginBottom: 5} ]}>
                    Frequently Asked Questions
                </Text>
            </View>

        <FlatList
            scrollEnabled={false}
            data={faqData}
            keyExtractor={item => item.id }
            renderItem={renderFAQItem}
            contentContainerStyle={{marginTop:5}}
        />
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

  searchContainer: {
    height: 50,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: Colors.titleColor,
    fontSize: 14,
    fontFamily: fonts.name.medium,
  },

  bannerCard: {
    marginTop: 5,
    borderRadius: 30,
    backgroundColor: Colors.APP_COLOR,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  bannerIcon: {
    width: 50,
    height: 50,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bannerTitle: {
    marginTop: 5,
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: fonts.name.bold,
  },

  bannerSubtitle: {
    textAlign: 'center',
    lineHeight: 22,
    color: '#E0E7FF',
    fontSize: 12,
    fontFamily: fonts.name.medium,
  },

  sectionTitle: {
    marginTop: 15,
    marginBottom: 10,
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },

  supportIcon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  supportTitle: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  supportSubtitle: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  faqCard: {
    // marginTop:5,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },

  faqTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  faqQuestion: {
    flex: 1,
    marginRight: 10,
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  faqAnswer: {
    marginTop: 5,
    lineHeight: 22,
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },
});