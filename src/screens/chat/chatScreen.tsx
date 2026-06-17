import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { _default_profileAvatar, getMessageDateLabel, getDrName, getLastSeenText, getMessageTime } from '../../constants';
import firestore from '@react-native-firebase/firestore';
import _firebaseDb from '../../constants/firebaseDb';
import Loading from '../../components/Loading';
import FirebaseService from '../../services/firebase.service';

export default function ChatScreen({
  navigation,
  route,
}: any) {

  const appointment:any = route?.params?.appointment;
  const chatId = `${appointment.doctorId}_${appointment.patientId}_${appointment.bookingId}`;
  const { userData }: any = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [lastSeenText, setLastSeenText] = useState('');
  const flatListRef = useRef<any>(null);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore().collection(_firebaseDb.chats).doc(chatId)
        .collection(_firebaseDb.messages)
        .orderBy('createdAt', 'asc')
        .onSnapshot(snapshot => {
          const data = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));

          const chatData:any = [];
          let lastDate = '';
          data.forEach(
            (message: any) => {
              const currentDate =
                getMessageDateLabel(
                  message.createdAt,
                );

              if (
                currentDate !== lastDate
              ) {

                chatData.push({
                  id: `date-${currentDate}`,
                  type: 'date',
                  title: currentDate,
                });

                lastDate =
                  currentDate;
              }

              chatData.push(message);
            },
          );
          console.log(chatData, 'message data')
          setMessages(chatData);
          markMessagesAsRead();
        });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    const userId = userData.role === 'doctor'
        ? appointment.patientId
        : appointment.doctorId;

    const collection = userData.role === 'doctor'
        ? _firebaseDb.patients
        : _firebaseDb.doctors;

    const unsubscribe = firestore().collection(collection).doc(userId)
        .onSnapshot(doc => {
          const data = doc.data();
          setUserInfo(data);

          console.log(
            'Online:',
            data?.isOnline,
          );
        });

    return () => unsubscribe();

  }, []);

  useEffect(() => {
    const updateStatus = () => {

      setLastSeenText(
        getLastSeenText(
          userInfo,
        ),
      );
    };

    updateStatus();

    const interval =
      setInterval(
        updateStatus,
        60000, // 1 minute
      );

    return () =>
      clearInterval(
        interval,
      );

  }, [userInfo]);

  useEffect(() => {
    firestore().collection(_firebaseDb.chats).doc(chatId)
      .set(
        {
          activeUsers: { [userData.id]: true },
        },
        {
          merge: true,
        },
      );

    return () => {
      firestore().collection(_firebaseDb.chats).doc(chatId)
        .set(
          {
            activeUsers: { [userData.id]: false },
          },
          {
            merge: true,
          },
        );
    };

  }, [chatId]);

  const markMessagesAsRead = async () => {
    try {
      const snapshot = await firestore().collection(_firebaseDb.chats).doc(chatId)
          .collection(_firebaseDb.messages)
          .where(
            'receiverId',
            '==',
            userData.id,
          )
          .where(
            'read',
            '==',
            false,
          )
          .get();

      if (snapshot.empty) {
        return;
      }

      const batch = firestore().batch();

      snapshot.docs.forEach(
        doc => {
          batch.update(
            doc.ref,
            {
              read: true,
              readAt: firestore.FieldValue.serverTimestamp(),
            },
          );
        },
      );

      await batch.commit();
    } catch (error) {
      console.log(
        'Read Error:',
        error,
      );
    }
  };

  const handleSend = async () => {
    if (!text.trim()) {
      return;
    }

    try {

      const receiverId = userData.role === 'doctor'
        ? appointment.patientId
        : appointment.doctorId;

      const senderName = userData.role === 'doctor'
        ? getDrName(appointment?.doctor?.fullName)
        : appointment?.patient?.fullName

      const message = {
        message: text.trim(),
        senderId: userData?.id,
        receiverId,
        type: 'text',
        read: false,
        readAt: null,
        senderRole: userData?.role,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore()
        .collection(_firebaseDb.chats)
        .doc(chatId)
        .collection(_firebaseDb.messages)
        .add(message);

      await firestore()
        .collection(_firebaseDb.chats)
        .doc(chatId)
        .set(
          {
            doctorId: appointment.doctorId,
            patientId: appointment.patientId,
            appointmentId: appointment.id,
            bookingId: appointment.bookingId,
            lastMessage: text.trim(),
            lastMessageAt: firestore.FieldValue.serverTimestamp(),
            createdAt: firestore.FieldValue.serverTimestamp(),
          },
          {
            merge: true,
          },
        );

        // CHECK IF RECEIVER IS INSIDE CHAT
        const roomDoc = await firestore().collection(_firebaseDb.chats).doc(chatId).get();
        const roomData = roomDoc.data();
        const isReceiverActive = roomData?.activeUsers?.[receiverId];
        
        if (!isReceiverActive) {
          console.log(
            'Send Push Notification Here',
          );

          await FirebaseService.insert(_firebaseDb.notifications, {
            userId: receiverId,
            title: 'New Message',
            body: `${senderName} sent you a message`,
            type: 'chat',
            chatId,
            appointmentId: appointment?.id,
            read: false,
          });
        }

      setText('');
    } catch (error) {
      console.log(
        'Send Message Error:',
        error,
      );
    }
  };

  const renderMessage = (item: any) => {
    const isUser = item.senderId === userData?.id;

    return (
      <View
        style={[
          styles.messageWrapper,
          isUser &&
          styles.userMessageWrapper,
        ]}
      >
        {!isUser && (
          <Image
            source={
              (userData?.role === 'patient' ?
                appointment?.doctor?.profileImage
                :
                appointment?.patient?.profileImage) ?
                {
                  uri: (userData?.role === 'patient' ?
                    appointment?.doctor?.profileImage
                    :
                    appointment?.patient?.profileImage)
                }
                :
                _default_profileAvatar
            }
            style={styles.avatar}
          />
        )}

        <View
          style={[
            styles.messageContainer,
            isUser
              ? styles.userMessage
              : styles.doctorMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser &&
              styles.userMessageText,
            ]}
          >
            {item.message}
          </Text>
          
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Text
              style={[
                styles.messageTime,
                isUser &&
                styles.userMessageTime,
              ]}
            >
              {getMessageTime(item.createdAt)}
            </Text>

            {isUser && (
              <MaterialCommunityIcons
                name={
                  item.read
                    ? 'check-all'
                    : 'check'
                }
                size={14}
                color={
                  item.read
                    ? '#4FC3F7' // blue
                    : '#9CA3AF' // gray
                }
                style={{
                  marginLeft: 5,
                }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderDateSeparator = (item: any) => (
    <View
      style={styles.dateContainer}
    >
      <Text
        style={styles.dateText}
      >
        {item.title}
      </Text>
    </View>
  );

  const loadPrecriptionDetails = async (prescriptionId:any) => {
    try {
      setisLoading(true);
      const doc = await firestore().collection(_firebaseDb.prescriptions)
        .doc(prescriptionId)
        .get();

      const prescriptionDetail:any = doc.data();

      const payload = {
        diagnosis: prescriptionDetail.diagnosis, 
        tests: prescriptionDetail.recommendedTests,
        notes: prescriptionDetail.doctorNotes,
        medicines: prescriptionDetail.medicines,
      };

      navigation.navigate(
        'PrescriptionPreview',
        {
          prescriptionData: payload,
          appointment
        },
      );
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setisLoading(false);
    }
  }

  const renderPrescriptionMessage = (item: any) => {
    const isUser = item.senderId === userData?.id;
    console.log(item, 'prescription item');
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.messageWrapper,
          isUser &&
          styles.userMessageWrapper,
        ]}
        onPress={() =>
          loadPrecriptionDetails(item.prescriptionId)
        }
      >
        {!isUser && (
          <Image
            source={
              appointment?.doctor?.profileImage ?
                { uri: appointment?.doctor?.profileImage }
                :
                _default_profileAvatar
            }
            style={styles.avatar}
          />
        )}

        <View
          style={[
            styles.messageContainer,
            isUser
              ? styles.userMessage
              : styles.doctorMessage,
          ]}
        >
          <View style={styles.prescriptionHeader}>
            <MaterialCommunityIcons
              name="prescription"
              size={22}
              color={isUser ? '#fff' : Colors.APP_COLOR}
            />

            <Text style={[
              styles.prescriptionTitle,
              isUser &&
              styles.userMessageText]}>
              Prescription Shared
            </Text>
          </View>

          <Text style={[styles.viewText,
            isUser && styles.userMessageText
          ]}>
            Tap to view full prescription
          </Text>
          
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Text style={styles.messageTime}>
              {getMessageTime(item.createdAt)}
            </Text>
            {isUser && (
              <MaterialCommunityIcons
                name={
                  item.read
                    ? 'check-all'
                    : 'check'
                }
                size={14}
                color={
                  item.read
                    ? '#4FC3F7' // blue
                    : '#9CA3AF' // gray
                }
                style={{
                  marginLeft: 5,
                }}
              />
            )}
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
      
      <Loading visible={isLoading} />

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

          <View style={styles.headerCenter}>
            {/* <Image
              source={{
                uri:
                  doctor?.image ||
                  'https://i.pravatar.cc/300',
              }}
              style={styles.headerImage}
            /> */}

            <View>
              {userData.role === 'patient' ?
                <Text style={styles.headerName}>
                  {getDrName(appointment?.doctor?.fullName)}
                </Text>
                :
                <Text style={styles.headerName}>
                  {appointment?.patient?.fullName}
                </Text>
              }

              <Text style={[styles.headerStatus, {color: userInfo?.isOnline ? '#16A34A' : Colors.subtitleColor}]}>
                {lastSeenText}
              </Text>
            </View>
          </View>
          
          {userData?.role === 'doctor' && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.headerButton}
              onPress={() => {
                navigation.navigate('PrescriptionBuilder', {
                  appointment
                });
              }}
            >
              <MaterialIcons
                name="medication"
                size={22}
                color={Colors.APP_COLOR}
              />
            </TouchableOpacity>
          )}
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
          keyboardVerticalOffset={
            Platform.OS === 'ios'
              ? 10 : 0
          }
        >
          {/* Chat Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({
                animated: true,
              })
            }
            keyExtractor={item => item.id}
            renderItem={({ item }: any) => {
              if (item.type === 'date') {
                return renderDateSeparator(
                  item,
                );
              }

              if (item.type === 'prescription') {
                return renderPrescriptionMessage(
                  item,
                );
              }

              return renderMessage(item);
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
            keyboardShouldPersistTaps="handled"
          />

          {/* Input */}

          <View style={styles.inputContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Prescription')}
            >
              <MaterialIcons
                name="attach-file"
                size={24}
                color="#6B7280"
              />
            </TouchableOpacity>

            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type message..."
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              multiline
            />

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sendButton}
              onPress={handleSend}
            >
              <Ionicons
                name="send"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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

  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },

  headerImage: {
    width: 50,
    height: 50,
    borderRadius: 18,
    marginRight: 12,
  },

  headerName: {
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  headerStatus: {
    fontSize: 10,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  prescriptionCard: {
    maxWidth: '80%',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  prescriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  prescriptionTitle: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  diagnosisText: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    lineHeight: 22,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  medicineText: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  viewText: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.semibold,
  },

  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },

  userMessageWrapper: {
    justifyContent: 'flex-end',
  },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: 14,
    marginRight: 10,
  },

  messageContainer: {
    maxWidth: '80%',
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  doctorMessage: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  userMessage: {
    backgroundColor: Colors.APP_COLOR,
    borderBottomRightRadius: 8,
  },

  messageText: {
    fontSize: 12,
    lineHeight: 20,
    color: Colors.titleColor,
    fontFamily: fonts.name.medium,
  },

  userMessageText: {
    color: '#FFFFFF',
  },

  messageTime: {
    marginTop: 5,
    fontSize: 10,
    color: '#9CA3AF',
    alignSelf: 'flex-end',
    fontFamily: fonts.name.medium,
  },

  userMessageTime: {
    color: '#DBEAFE',
  },

  inputContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  input: {
    flex: 1,
    maxHeight: 50,
    marginHorizontal: 12,
    color: Colors.titleColor,
    fontSize: 12,
    fontFamily: fonts.name.medium,
  },

  sendButton: {
    width: 35,
    height: 35,
    borderRadius: 14,
    backgroundColor: Colors.APP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },

  dateText: {
    backgroundColor: '#E5E7EB',
    color: '#374151',
    fontSize: 11,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
    fontFamily: fonts.name.medium,
  },
});