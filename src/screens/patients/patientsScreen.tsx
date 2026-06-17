import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import FirebaseService from '../../services/firebase.service';
import _firebaseDb from '../../constants/firebaseDb';
import { _default_profileAvatar } from '../../constants';

export default function PatientsScreen({ navigation }: any) {
  const { userData }: any = useAuth();
  const [search, setSearch] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [patientsData, setpatientsData] = useState<any>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setisLoading(true);
    const response = await FirebaseService.getPatientsByDoctorId(userData?.id);
    if (response.success) {
      console.log(response.data, 'response.data')
      setpatientsData(response.data);
    }
    setisLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPatients();
    setRefreshing(false);
  };

  const filteredPatients = useMemo(() => {
    return patientsData.filter(
      (item:any) =>
        item.fullName
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
      );
    }, [search]);

  const renderPatient = ({
    item,
  }: any) => {

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.patientCard}
        onPress={() =>
          navigation.navigate(
            'PatientDetails',
            {
              patient: item,
            },
          )
        }
      >
        <View style={{ flexDirection: 'row' }}>
            <Image 
            source={item.profileImage ? {uri: item.profileImage} : _default_profileAvatar}
            style={styles.patientImage} />
            <View style={{ flex: 1 }}>
                <View style={styles.topRow}>
                    <Text style={styles.patientName}>
                        {item.fullName}
                    </Text>
                </View>
                <View style={styles.topRow}>
                    <Text style={styles.patientInfo}>
                        {item.age} Years
                    </Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {item.gender}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
        
        <View style={{ flex: 1, marginTop: 5 }}>
          <Text style={styles.conditionText}>
            {item.address} - {item.city}
          </Text>
          <View style={[styles.bottomRow, {marginTop: -5}]}>
            <View style={styles.visitRow}>
              <Ionicons
                name="time-outline"
                size={14}
                color="#64748B"
              />
              <Text style={styles.visitText}>
                {item.lastSeen?.toDate()?.toDateString()}
              </Text>
            </View>

            {/* <TouchableOpacity
              activeOpacity={0.8}
              style={styles.chatButton}
            >
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color="#FFFFFF"
              />
            </TouchableOpacity> */}
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
          backgroundColor:
            '#F5F9FF',
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
          <View>
            <Text style={styles.headerTitle}>
            Your Patients
            </Text>

            {/* <Text style={styles.headerSubtitle}>
              Manage your patients
            </Text> */}
          </View>

          <View style={{width: 45}}/>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#94A3B8"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search patients..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>

        {/* List */}
        {isLoading ?
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Colors.APP_COLOR} />
          </View>
          :
          <FlatList
            data={search ? filteredPatients : patientsData}
            keyExtractor={item => item.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={renderPatient}
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 10,
              flexGrow: 1
            }}
            ListEmptyComponent={() => (
              <View
                style={styles.emptyContainer}
              >
                <Ionicons
                  name="people-outline"
                  size={70}
                  color="#CBD5E1"
                />

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No Patients Found
                </Text>

                <Text
                  style={
                    styles.emptySubtitle
                  }
                >
                  Try searching with
                  another keyword
                </Text>
              </View>
            )}
          />
        }
      </LinearGradient>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  headerSubtitle: {
    fontSize: 14,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  headerButton: {
    width: 45,
    height: 45,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
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

  searchContainer: {
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 20,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: Colors.titleColor,
    fontSize: 14,
    fontFamily: fonts.name.medium,
  },

  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 4,
  },

  patientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  patientName: {
    flex: 1,
    fontSize: 16,
    color: Colors.titleColor,
    fontFamily: fonts.name.bold,
  },

  badge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  badgeText: {
    fontSize: 10,
    color: Colors.APP_COLOR,
    fontFamily: fonts.name.semibold,
  },

  patientInfo: {
    fontSize: 12,
    color: Colors.subtitleColor,
    fontFamily: fonts.name.medium,
  },

  conditionText: {
    fontSize: 12,
    color: Colors.titleColor,
    fontFamily: fonts.name.semibold,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  visitText: {
    marginTop: 5,
    marginLeft: 5,
    fontSize: 12,
    color: '#64748B',
    fontFamily: fonts.name.medium,
  },

  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.APP_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});