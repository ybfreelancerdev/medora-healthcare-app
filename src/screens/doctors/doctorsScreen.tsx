import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    StatusBar,
    TextInput,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CategoriesModal from '../../dialogs/categories';
import FirebaseService from '../../services/firebase.service';
import _firebaseDb from '../../constants/firebaseDb';
import { _default_profileAvatar, getDrName } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export default function DoctorsScreen({ navigation, route }: any) {
    const { category } = route.params || {};
    const { userData }: any = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [filterVisibled, setfilterVisibled] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [doctors, setDoctors] = useState<any>([]);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (category) {
                setSelectedCategory(category);
            } else {
                setSelectedCategory(null);
            }
            fetchDoctors();
        }, [category])
    );

    const fetchDoctors = async () => {
        setisLoading(true);
        const response = await FirebaseService.getDoctors(_firebaseDb.doctors, userData.city);
        if (response.success) {
            setDoctors(response.data);
        }
        setisLoading(false);
    };

    const filteredDoctors = useMemo(() => {
        return doctors.filter((item:any) => {

            const matchCategory =
                selectedCategory === null
                    ? true
                    : item.specialization === selectedCategory.title;

            const matchSearch =
                item.fullName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                item.specialization
                    .toLowerCase()
                    .includes(search.toLowerCase());

            return matchCategory && matchSearch;
        });

    }, [selectedCategory, search, doctors]);

    const onRefresh = async () => {
        setRefreshing(true);
        navigation.setParams({
            category: undefined,
        });
        setSelectedCategory(null);
        await fetchDoctors();
        setRefreshing(false);
    };

    const renderDoctor = ({ item }: any) => {
        return (
            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.doctorCard}
                onPress={() =>
                    navigation.navigate(
                        'DoctorDetails',
                        {
                            doctor: item,
                        },
                    )
                }
            >
                <View style={styles.topSection}>
                    <Image
                        source={item.profileImage ? {uri: item.profileImage} : _default_profileAvatar}
                        style={styles.doctorImage}
                    />

                    <View style={{ flex: 1 }}>
                        <Text style={styles.doctorName}>
                            {getDrName(item.fullName)}
                        </Text>

                        <Text style={styles.specialistText}>
                            {item.specialization}
                        </Text>

                        <View style={styles.ratingContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons
                                    name="star"
                                    size={14}
                                    style={{marginTop: -3}}
                                    color="#D97706"
                                />

                                <Text style={[styles.ratingText, { marginLeft: 4 }]}>
                                    {item.rating}
                                </Text>
                            </View>

                            <View style={styles.dot} />

                            <Text style={styles.patientText}>
                                {item.patients} Patients
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={[styles.infoCard, {marginRight: 10}]}>
                        <Text style={styles.infoLabel}>
                            Experience
                        </Text>

                        <Text style={styles.infoValue}>
                            {item.experience} {item.experience > 1 ? 'years': 'year'}
                        </Text>
                    </View>

                    <View style={[styles.infoCard, {marginLeft: 10}]}>
                        <Text style={styles.infoLabel}>
                            Consultation
                        </Text>

                        <Text style={styles.infoValue}>
                            Online
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.bookButton}
                    onPress={() => navigation.navigate('AppointmentBooking', {doctor: item})}
                >
                    <Text style={styles.bookButtonText}>
                        Book Appointment
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

            <CategoriesModal
                visible={filterVisibled}
                onClose={() => setfilterVisibled(false)}
                onSelectCategory={(item: any) => {
                    setSelectedCategory(item)
                }}
                selectedCategory={selectedCategory}
            />

            {/* Top Safe Area */}
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
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>
                        Doctors
                    </Text>
                </View>

                {/* Search */}
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 15, marginHorizontal: 20}}>
                    <View style={styles.searchContainer}>
                        <Ionicons
                            name="search"
                            size={20}
                            color="#9CA3AF"
                        />

                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Search doctors..."
                            placeholderTextColor="#9CA3AF"
                            style={styles.searchInput}
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setfilterVisibled(true)}
                        style={[styles.filterButton, selectedCategory && styles.activeFilterButton]}>
                        <MaterialIcons
                            name="filter-list"
                            size={24}
                            color={selectedCategory ? '#2563EB' : '#111827'}
                        />
                    </TouchableOpacity>
                    {selectedCategory && (<View style={styles.activeDot} />)}
                </View>

                <View style={{ flex: 1 }}>
                    {isLoading ?
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <ActivityIndicator size="large" color={Colors.APP_COLOR}/>
                        </View>
                        :
                        <FlatList
                            data={filteredDoctors}
                            keyExtractor={item => item.id}
                            renderItem={renderDoctor}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingHorizontal: 20,
                                paddingTop: 5,
                            }}
                            ListEmptyComponent={() => (
                                <View style={
                                    styles.emptyContainer
                                }>
                                    <Ionicons
                                        name="search-outline"
                                        size={60}
                                        color="#CBD5E1"
                                    />
                                    <Text style={
                                        styles.emptyTitle
                                    }>
                                        No Doctors Found
                                    </Text>
                                </View>
                            )}
                        />
                    }
                </View>
            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    headerContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitle: {
        fontSize: 16,
        color: Colors.titleColor,
        fontFamily: fonts.name.bold,
    },

    filterButton: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        marginLeft: 15,
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

    activeFilterButton: { 
        backgroundColor: '#EFF6FF', 
        borderWidth: 1, 
        borderColor: '#BFDBFE', 
    }, 
    
    activeDot: { 
        width: 10, 
        height: 10, 
        borderRadius: 5, 
        backgroundColor: '#2563EB', 
        position: 'absolute', 
        top: 10, 
        right: 10, 
    },

    searchContainer: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.05,
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

    categoryButton: {
        height: 40,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },

    activeCategory: {
        backgroundColor: Colors.APP_COLOR,
    },

    categoryText: {
        color: Colors.titleColor,
        fontSize: 12,
        fontFamily: fonts.name.medium,
    },

    activeCategoryText: {
        color: '#FFFFFF',
    },

    doctorCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },

    topSection: {
        flexDirection: 'row',
    },

    doctorImage: {
        width: 70,
        height: 70,
        borderRadius: 20,
        marginRight: 16,
    },

    doctorName: {
        fontSize: 14,
        color: Colors.titleColor,
        fontFamily: fonts.name.bold,
    },

    specialistText: {
        fontSize: 12,
        color: Colors.subtitleColor,
        fontFamily: fonts.name.medium,
    },

    ratingContainer: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },

    ratingText: {
        fontSize: 10,
        color: '#D97706',
        fontFamily: fonts.name.semibold,
    },

    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 8,
    },

    patientText: {
        fontSize: 12,
        color: Colors.subtitleColor,
        fontFamily: fonts.name.medium,
    },

    infoRow: {
        flexDirection: 'row',
        marginTop: 10,
    },

    infoCard: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },

    infoLabel: {
        fontSize: 10,
        color: Colors.subtitleColor,
        fontFamily: fonts.name.medium,
    },

    infoValue: {
        fontSize: 12,
        color: Colors.titleColor,
        fontFamily: fonts.name.semibold,
    },

    bookButton: {
        height: 50,
        borderRadius: 18,
        backgroundColor: Colors.APP_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },

    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: fonts.name.semibold,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyTitle: {
        marginTop: 10,
        fontSize: 14,
        color: Colors.subtitleColor,
        fontFamily: fonts.name.semibold,
    },
});