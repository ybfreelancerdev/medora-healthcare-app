import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    FlatList,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import _firebaseDb from '../../constants/firebaseDb';
import { _default_profileAvatar } from '../../constants';

export default function DoctorReviewsScreen({ navigation }: any) {
    const { userData }: any = useAuth();
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const averageRating = useMemo(() => {
        if (!reviews.length) {
            return '0.0';
        }

        return (
            reviews.reduce(
                (
                    acc: number,
                    item: any,
                ) =>
                    acc + item.rating,
                0,
            ) / reviews.length
        ).toFixed(1);

    }, [reviews]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const snapshot =
                await firestore()
                    .collection(
                        _firebaseDb.reviews,
                    )
                    .where(
                        'doctorId',
                        '==',
                        userData?.id,
                    )
                    .orderBy(
                        'createdAt',
                        'desc',
                    )
                    .limit(15)
                    .get();

            const reviewsData =
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

            if (!reviewsData.length) {
                setReviews([]);
                return;
            }

            const patientIds =
                reviewsData.map(
                    (item: any) =>
                        item.patientId,
                );

            const patientPromises =
                patientIds.map(
                    async (patientId: string) => {

                        const patient =
                            await firestore()
                                .collection(
                                    _firebaseDb.patients,
                                )
                                .doc(patientId)
                                .get();

                        return {
                            id: patient.id,
                            ...patient.data(),
                        };
                    },
                );

            const patients =
                await Promise.all(
                    patientPromises,
                );

            const patientsMap: any = {};

            patients.forEach(
                (patient: any) => {
                    patientsMap[
                        patient.id
                    ] = patient;
                },
            );

            const finalReviews =
                reviewsData.map(
                    (item: any) => ({
                        ...item,
                        patient:
                            patientsMap[
                            item.patientId
                            ] || null,
                    }),
                );
            setReviews(finalReviews);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const renderReview = ({
        item,
    }: any) => {
        return (
            <View style={styles.reviewCard}>
                <View style={styles.topRow}>
                    <View style={styles.userContainer}>
                        <Image
                            source={
                                item.patient?.profileImage
                                    ? {
                                        uri:
                                            item.patient
                                                .profileImage,
                                    }
                                    : _default_profileAvatar
                            }
                            style={styles.userImage}
                        />

                        <View>
                            <Text style={styles.userName}>
                                {item.patient?.fullName || 'Patient'}
                            </Text>

                            <View style={styles.ratingRow}>
                                {[1, 2, 3, 4, 5].map(
                                    star => (
                                        <Ionicons
                                            key={star}
                                            name={
                                                star <= item.rating
                                                    ? 'star'
                                                    : 'star-outline'
                                            }
                                            size={14}
                                            color="#F59E0B"
                                        />
                                    ),
                                )}

                                <Text
                                    style={
                                        styles.ratingText
                                    }
                                >
                                    {item.rating}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.time}>
                        {getReviewTime(
                            item.createdAt,
                        )}
                    </Text>
                </View>
                {item.review && (
                    <Text style={styles.reviewText}>
                        {item.review}
                    </Text>
                )}
            </View>
        );
    };

    const getReviewTime = (timestamp: any) => {
        if (!timestamp) {
            return '';
        }

        const date =
            timestamp?.toDate
                ? timestamp.toDate()
                : new Date(timestamp);

        const diff =
            Date.now() -
            date.getTime();

        const minutes =
            Math.floor(
                diff / 60000,
            );

        const hours =
            Math.floor(
                diff / 3600000,
            );

        const days =
            Math.floor(
                diff / 86400000,
            );

        if (minutes < 1) {
            return 'Just now';
        }

        if (minutes < 60) {
            return `${minutes} min ago`;
        }

        if (hours < 24) {
            return `${hours} hour ago`;
        }

        if (days === 1) {
            return 'Yesterday';
        }

        if (days < 7) {
            return `${days} days ago`;
        }

        return date.toLocaleDateString(
            'en-GB',
            {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            },
        );
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchReviews();
        setRefreshing(false);
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
                            color={
                                Colors.titleColor
                            }
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Reviews & Ratings
                    </Text>

                    <View
                        style={{ width: 45 }}
                    />
                </View>

                {/* Rating Summary */}
                {reviews.length > 0 && (
                    <View style={styles.summaryCard}>
                        <Text style={styles.averageText}>
                            {averageRating}
                        </Text>

                        <View
                            style={
                                styles.summaryStars
                            }
                        >
                            {[...Array(5)].map(
                                (_, index) => (
                                    <Ionicons
                                        key={index}
                                        name="star"
                                        size={20}
                                        color="#F59E0B"
                                    />
                                ),
                            )}
                        </View>

                        <Text style={styles.totalText}>
                            Based on{' '}
                            {reviews.length}{' '}
                            patient reviews
                        </Text>
                    </View>
                )}

                {/* Reviews List */}
                <FlatList
                    data={reviews}
                    keyExtractor={item =>
                        item.id
                    }
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    renderItem={renderReview}
                    showsVerticalScrollIndicator={
                        false
                    }
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 20,
                        marginTop: 5,
                    }}
                    ListEmptyComponent={() => {
                        if (loading) {
                            return null;
                        }
                        return (
                            <View
                                style={
                                    styles.emptyContainer
                                }
                            >
                                <Ionicons
                                    name="star-outline"
                                    size={50}
                                    color="#CBD5E1"
                                />

                                <Text
                                    style={
                                        styles.emptyTitle
                                    }
                                >
                                    No Reviews Yet
                                </Text>

                                <Text
                                    style={
                                        styles.emptySubtitle
                                    }
                                >
                                    Reviews will appear
                                    here once patients
                                    submit feedback.
                                </Text>
                            </View>
                        );
                    }}
                />
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
        fontSize: 18,
        color: Colors.titleColor,
        fontFamily: fonts.name.bold,
    },

    summaryCard: {
        marginHorizontal: 20,
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        paddingVertical: 15,
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

    averageText: {
        fontSize: 25,
        color: Colors.titleColor,
        fontFamily: fonts.name.bold,
    },

    summaryStars: {
        marginTop: 0,
        flexDirection: 'row',
    },

    totalText: {
        marginTop: 10,
        fontSize: 12,
        color: Colors.subtitleColor,
        fontFamily: fonts.name.medium,
    },

    reviewCard: {
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

    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    userImage: {
        width: 50,
        height: 50,
        borderRadius: 20,
        marginRight: 10,
    },

    userName: {
        fontSize: 14,
        color: Colors.titleColor,
        fontFamily: fonts.name.bold,
    },

    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    ratingText: {
        marginLeft: 6,
        marginTop: 5,
        fontSize: 12,
        color: '#D97706',
        fontFamily: fonts.name.semibold,
    },

    time: {
        fontSize: 10,
        color: '#94A3B8',
        fontFamily: fonts.name.medium,
    },

    reviewText: {
        marginTop: 10,
        fontSize: 12,
        lineHeight: 22,
        color: Colors.subtitleColor,
        fontFamily: fonts.name.medium,
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

    emptySubtitle: {
        //marginTop: 10,
        textAlign: 'center',
        fontSize: 12,
        color: Colors.subtitleColor,
        fontFamily: fonts.name.semibold,
    },
});