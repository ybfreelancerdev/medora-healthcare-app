import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import FirebaseService from '../../services/firebase.service';
import Loading from '../../components/Loading';
import { showCustom } from '../../services/message.service';
import { useAuth } from '../../context/AuthContext';
import _firebaseDb from '../../constants/firebaseDb';

const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

export default function ScheduleAvailabilityScreen({
    navigation,
}: any) {
    const { userData }: any = useAuth();
    const doctorId = userData.id;
    const [availability, setAvailability] =
        useState(
            weekDays.map(day => ({
                day,
                enabled: false,
                startTime: '',
                endTime: '',
            })),
        );
    const defaultAvailability =
        weekDays.map(day => ({
            day,
            enabled: false,
            startTime: '09:00 AM',
            endTime: '07:00 PM',
        }));
    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');

    // FETCH AVAILABILITY
    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability =
        async () => {
            try {
                setLoading(true);

                const response = await FirebaseService.get(_firebaseDb.doctor_availability, doctorId);

                if (response.success && response.data) {
                    const data: any = response.data;

                    setAvailability(data.availability || defaultAvailability);
                }

            } catch (error) {
                console.log(
                    'Fetch Availability Error:',
                    error,
                );
            } finally {
                setLoading(false);
            }
        };

    // FORMAT TIME
    const formatTime = (
        date: Date,
    ) => {
        return date.toLocaleTimeString(
            'en-US',
            {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            },
        );
    };

    // TOGGLE DAY
    const toggleDay = (
        day: string,
    ) => {
        setAvailability(prev =>
            prev.map(item =>
                item.day === day
                    ? {
                        ...item,
                        enabled:
                        !item.enabled,
                    }
                    : item,
            ),
        );
    };

    // OPEN PICKER
    const openPicker = (
        day: string,
        mode: 'start' | 'end',
    ) => {
        setSelectedDay(day);
        setPickerMode(mode);
        setShowPicker(true);
    };

    // CHANGE TIME
    const onChangeTime = (
        event: any,
        selectedDate?: Date,
    ) => {
        setShowPicker(false);
        if (!selectedDate) {
            return;
        }

        const formattedTime = formatTime(selectedDate);

        setAvailability(prev =>
            prev.map(item => {
                if (
                    item.day === selectedDay
                ) {

                    return {
                        ...item,
                        [pickerMode ===
                            'start'
                            ? 'startTime'
                            : 'endTime']:
                            formattedTime,
                    };
                }
                return item;
            }),
        );
    };

    // SAVE AVAILABILITY
    const handleSave = async () => {
        try {

            // ENABLED DAYS
            const enabledDays = availability.filter(item => item.enabled);

            // MINIMUM 5 DAYS VALIDATION
            if (enabledDays.length < 5) {
                showCustom('Please select minimum 5 working days.');
                return;
            }

            // CHECK EMPTY TIME
            const invalidDay = enabledDays.find(
                    item =>
                        !item.startTime ||
                        !item.endTime,
                );
            if (invalidDay) {
                showCustom(`Please add time slot for ${invalidDay.day}.`);
                return;
            }

            setLoading(true);

            const response =
                await FirebaseService.insert(_firebaseDb.doctor_availability,
                    {
                        availability,
                    },
                    doctorId,
                );

            if (response.success) {
                console.log(
                    'Availability Saved',
                );
                showCustom('Availability Saved');
            }

        } catch (error) {
            console.log(
                'Save Error:',
                error,
            );

        } finally {
            setLoading(false);
        }
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

            <Loading visible={loading} />

            <LinearGradient
                colors={[
                    '#F5F9FF',
                    '#EEF6FF',
                    '#FFFFFF',
                ]}
                style={styles.container}
            >

                {/* HEADER */}
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
                            color={
                                Colors.titleColor
                            }
                        />
                    </TouchableOpacity>

                    <Text
                        style={styles.headerTitle}
                    >
                        Schedule
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleSave}
                        style={styles.headerButton}
                    >
                        <Ionicons
                            name="checkmark"
                            size={22}
                            color={
                                Colors.APP_COLOR
                            }
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={
                        false
                    }
                    contentContainerStyle={{
                        paddingBottom: 10,
                    }}
                >

                    {availability.map(
                        (item, index) => {

                            return (
                                <View
                                    key={index}
                                    style={styles.dayCard}
                                >

                                    {/* TOP ROW */}
                                    <View
                                        style={
                                            styles.dayHeader
                                        }
                                    >
                                        <View>
                                            <Text
                                                style={
                                                    styles.dayTitle
                                                }
                                            >
                                                {item.day}
                                            </Text>

                                            <Text
                                                style={
                                                    styles.daySubtitle
                                                }
                                            >
                                                {item.enabled
                                                    ? 'Available'
                                                    : 'Unavailable'}
                                            </Text>
                                        </View>

                                        <Switch
                                            value={
                                                item.enabled
                                            }
                                            onValueChange={() =>
                                                toggleDay(
                                                    item.day,
                                                )
                                            }
                                            trackColor={{
                                                false:
                                                    '#E5E7EB',
                                                true:
                                                    '#BFDBFE',
                                            }}
                                            thumbColor={
                                                item.enabled
                                                    ? Colors.APP_COLOR
                                                    : '#FFFFFF'
                                            }
                                        />
                                    </View>

                                    {/* TIME SLOT */}
                                    {item.enabled && (
                                        <>
                                            <View
                                                style={
                                                    styles.timeRow
                                                }
                                            >

                                                {/* START TIME */}
                                                <TouchableOpacity
                                                    activeOpacity={
                                                        0.8
                                                    }
                                                    style={
                                                        styles.timeButton
                                                    }
                                                    onPress={() =>
                                                        openPicker(
                                                            item.day,
                                                            'start',
                                                        )
                                                    }
                                                >
                                                    <Ionicons
                                                        name="time-outline"
                                                        size={18}
                                                        color={
                                                            Colors.APP_COLOR
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.timeText
                                                        }
                                                    >
                                                        {item.startTime ||
                                                            'Start Time'}
                                                    </Text>
                                                </TouchableOpacity>

                                                <Text
                                                    style={
                                                        styles.toText
                                                    }
                                                >
                                                    to
                                                </Text>

                                                {/* END TIME */}
                                                <TouchableOpacity
                                                    activeOpacity={
                                                        0.8
                                                    }
                                                    style={
                                                        styles.timeButton
                                                    }
                                                    onPress={() =>
                                                        openPicker(
                                                            item.day,
                                                            'end',
                                                        )
                                                    }
                                                >
                                                    <Ionicons
                                                        name="time-outline"
                                                        size={18}
                                                        color={
                                                            Colors.APP_COLOR
                                                        }
                                                    />

                                                    <Text
                                                        style={
                                                            styles.timeText
                                                        }
                                                    >
                                                        {item.endTime ||
                                                            'End Time'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                    )}
                                </View>
                            );
                        },
                    )}
                </ScrollView>

            </LinearGradient>

            {/* TIME PICKER */}
            {showPicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="time"
                    is24Hour={false}
                    display="spinner"
                    onChange={onChangeTime}
                />
            )}

            <SafeAreaView
                edges={['bottom']}
                style={{
                    backgroundColor:
                        '#FFFFFF',
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
        paddingHorizontal: 20,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:
            'space-between',
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

    dayCard: {
        marginTop: 15,
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },

    dayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    dayTitle: {
        fontSize: 16,
        color: Colors.titleColor,
        fontFamily: fonts.name.bold,
    },

    daySubtitle: {
        fontSize: 12,
        color: Colors.subtitleColor,
        fontFamily: fonts.name.medium,
    },

    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },

    timeButton: {
        flex: 1,
        height: 50,
        borderRadius: 18,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    timeText: {
        marginLeft: 5,
        fontSize: 14,
        color: Colors.titleColor,
        fontFamily: fonts.name.semibold,
    },

    toText: {
        marginHorizontal: 12,
        fontSize: 12,
        color: Colors.subtitleColor,
        fontFamily: fonts.name.medium,
    },
});