import React, {
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import {
    SafeAreaView,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../constants/fonts';
import * as Colors from '../styles/colors';
import FirebaseService from '../services/firebase.service';
import _firebaseDb from '../constants/firebaseDb';

export default function CategoriesModal({
    visible,
    onClose,
    onSelectCategory,
    selectedCategory
}: any) {

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (visible) {
            fetchCategories();
        }
    }, [visible]);

    // FETCH CATEGORIES 
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await FirebaseService.getCollection(_firebaseDb.categories);

            if (response.success) {
                setCategories(response.data,);
            }
        } catch (error) {
            console.log('Categories Error:', error,);
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories =
        useMemo(() => {
            return categories.filter(
                (item: any) =>
                    item.title
                        .toLowerCase()
                        .includes(
                            search.toLowerCase(),
                        ),
            );
        }, [
            search,
            categories,
        ]);

    const renderCategory = ({
        item,
    }: any) => {
        const isSelected = selectedCategory?.id === item.id;
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={[
                    styles.categoryCard,
                    isSelected && styles.selectedCategoryCard,
                ]}
                onPress={() => {
                    onSelectCategory(item);
                    onClose();
                }}
            >
                <View style={
                        styles.iconContainer
                    }>
                    <MaterialCommunityIcons
                        name={item.icon}
                        size={28}
                        color={
                            Colors.APP_COLOR
                        }
                    />
                </View>

                <Text style={styles.categoryText}>
                    {item.title}
                </Text>

                {isSelected ? (
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#94A3B8"
                    />
                ) : (
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#94A3B8"
                    />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            statusBarTranslucent
        >
            <SafeAreaView
                style={styles.container}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={
                            styles.headerButton
                        }
                        onPress={onClose}
                    >
                        <Ionicons
                            name="close"
                            size={24}
                            color={
                                Colors.titleColor
                            }
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Categories
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={
                            styles.headerButton
                        }
                        onPress={() => {
                            onSelectCategory(null);
                            onClose();
                        }}
                    >
                        <Ionicons
                            name="refresh"
                            size={24}
                            color={
                                Colors.titleColor
                            }
                        />
                    </TouchableOpacity>
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
                        onChangeText={
                            setSearch
                        }
                        placeholder="Search category..."
                        placeholderTextColor="#94A3B8"
                        style={styles.input}
                    />
                </View>

                {/* Categories */}
                { loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={Colors.APP_COLOR} />
                    <Text style={styles.loadingText}> Loading Categories... </Text>
                </View>
                ) : (
                <FlatList
                    data={filteredCategories}
                    keyExtractor={(item: any) => item.id}
                    renderItem={renderCategory}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow:1,
                        paddingBottom: 0,
                        paddingHorizontal: 20,
                        marginTop: 10,
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
                                No Categories Found
                            </Text>
                        </View>
                    )}
                />
                )}
            </SafeAreaView>
        </Modal>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#F8FAFC',
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

        searchContainer: {
            height: 50,
            marginTop: 15,
            marginBottom: 10,
            marginHorizontal: 20,
            borderRadius: 18,
            backgroundColor: '#FFFFFF',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 18,
            borderWidth: 1,
            borderColor: '#E2E8F0',
        },

        input: {
            flex: 1,
            marginLeft: 12,
            color: Colors.titleColor,
            fontSize: 14,
            fontFamily: fonts.name.medium,
        },

        loaderContainer: { 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
        }, 
        
        loadingText: { 
            marginTop: 12, 
            fontSize: 14, 
            color: Colors.subtitleColor, 
            fontFamily: fonts.name.medium, 
        },

        categoryCard: {
            backgroundColor: '#FFFFFF',
            borderRadius: 22,
            paddingVertical: 15,
            paddingHorizontal: 20,
            marginBottom: 15,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 3,
        },

        selectedCategoryCard: { 
            borderWidth: 1, 
            borderColor: '#BFDBFE', 
            backgroundColor: '#EFF6FF', 
        },

        selectedIconContainer: { 
            backgroundColor: Colors.APP_COLOR, 
        }, 
        
        selectedCategoryText: { 
            color: Colors.APP_COLOR, 
        },

        iconContainer: {
            width: 50,
            height: 50,
            borderRadius: 18,
            backgroundColor: '#EFF6FF',
            justifyContent: 'center',
            alignItems: 'center',
        },

        categoryText: {
            flex: 1,
            marginLeft: 15,
            fontSize: 14,
            color: Colors.titleColor,
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