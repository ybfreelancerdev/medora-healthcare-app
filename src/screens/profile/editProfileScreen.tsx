import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { useAuth } from '../../context/AuthContext';
import FirebaseService from '../../services/firebase.service';
import _firebaseDb from '../../constants/firebaseDb';
import AppDropdown from '../../components/AppDropdown';
import _fileUploadService from '../../services/fileUpload.service';
import auth from '@react-native-firebase/auth';
import { showCustom } from '../../services/message.service';
import { _default_profileAvatar } from '../../constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const patientSchema = Yup.object().shape({
    fullName: Yup.string().required(
        'Full name is required',
    ),
    gender: Yup.string().required(
        'Gender is required',
    ),
    address: Yup.string().required(
        'Address is required',
    ),
    city: Yup.string().required(
        'City is required',
    ),
    height: Yup
        .string()
        .required("Height is required")
        .matches(
            /^[0-9](\.[0-9])?$/,
            "Height must be like 5 or 5.9"
        ),
    weight: Yup
        .number()
        .typeError("Weight must be a number")
        .required("Weight is required")
        .min(1, "Weight must be greater than 0")
        .max(300, "Enter a valid weight"),
    age: Yup
        .number()
        .typeError("Age must be a number")
        .required("Age is required")
        .min(0, "Age cannot be negative")
        .max(120, "Enter a valid age"),
    diseases: Yup.array()
        .of(Yup.string().trim().required("Invalid diseases")),
});

const doctorSchema = Yup.object().shape({
    fullName: Yup.string().required(
        'Full name is required',
    ),
    gender: Yup.string().required(
        'Gender is required',
    ),
    address: Yup.string().required(
        'Address is required',
    ),
    city: Yup.string().required(
        'City is required',
    ),
    specialization: Yup.string().required(
        'Specialization is required',
    ),
    description: Yup.string().required(
        'Description is required',
    ),
    experience: Yup
        .number()
        .typeError("Experience must be a number")
        .required("Experience is required")
        .min(0, "Cannot be negative"),
    qualification: Yup.string().required(
        'Qualification is required',
    ),
    clinicName: Yup.string().required(
        'Clinic name is required',
    ),
    licenseNumber: Yup.string().required(
        'License number is required',
    ),
    fees: Yup.object().shape({
        clinicVisit: Yup
        .number()
        .typeError("Visit fee must be a number")
        .required("Visit fee is required")
        .min(0, "Cannot be negative"),

        onlineChat: Yup
        .number()
        .typeError("Online chat fee must be a number")
        .required("Online chat fee is required")
        .min(0, "Cannot be negative"),
    }),
});

export default function EditProfileScreen({ navigation }: any) {
    const { userData, fetchUserData }: any = useAuth();
    const [profileImage, setProfileImage] = useState<any>(null);
    const [isLoading, setisLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const formikRef = useRef<any>(null);
    console.log(userData, 'userData values')

    useEffect(() => {
        fetchCities();
        fetchCategories();
    }, []);
    
    // FETCH Cities 
    const fetchCities = async () => {
        try {
            const response = await FirebaseService.getCollection(_firebaseDb.cities);

            if (response.success) {
                const formattedData =
                    response.data.map(
                        (item: any) => ({
                            label: item.name,
                            value: item.name,
                        }),
                    );
                setCities(formattedData);
            }
        } catch (error) {
            console.log('Cities Error:', error,);
        }
    };

    // FETCH CATEGORIES 
    const fetchCategories = async () => {
        try {
            const response = await FirebaseService.getCollection(_firebaseDb.categories);

            if (response.success) {
                const formattedData =
                    response.data.map(
                        (item: any) => ({
                            label: item.title,
                            value: item.title,
                        }),
                    );
                setCategories(formattedData);
            }
        } catch (error) {
            console.log('Categories Error:', error,);
        }
    };

    const initialValues = {
        profileImage: userData.profileImage,
        fullName: userData.fullName,
        gender: userData.gender,
        address: userData.address,
        city: userData.city,
        ...(userData.role === "patient" && {
            height: userData.height,
            weight: userData.weight,
            age: userData.age,
            diseases: userData?.diseases || [],
        }),
        ...(userData.role === "doctor" && {
            specialization: userData.specialization,
            description: userData.description,
            experience: userData.experience,
            qualification: userData.qualification,
            clinicName: userData.clinicName,
            licenseNumber: userData.licenseNumber,
            fees: {
                clinicVisit: userData.fees.clinicVisit,
                onlineChat: userData.fees.onlineChat
            }
        }),
    };

    const pickProfilePicture = async () => {
        try {
            const files: any = await _fileUploadService.pickImages(false);
            if (!files || !files.length) return;

            const image = files?.[0];
            formikRef.current?.setFieldValue("profileImage", image.uri);
            setProfileImage(image);
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleUpdateProfile = async (values: any) => {
        try {
            setisLoading(true);

            const uid = auth()?.currentUser?.uid;
            if (!uid) {
                showCustom('User session expired');
                return;
            }

            if(profileImage) {
                values.profileImage = profileImage.base64;
            }

            //store doctor and patient details
            await FirebaseService.update(
                userData.role === "doctor" ?
                    _firebaseDb.doctors
                    :
                    _firebaseDb.patients,
                uid,
                {
                    ...values,
                },
            );

            await fetchUserData(uid);
            showCustom('Profile updated successfully');
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
        finally {
            setisLoading(false);
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
                        Edit Profile
                    </Text>

                    <View style={{ width: 45 }} />
                </View>

                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={
                        userData.role === 'patient'
                            ? patientSchema
                            : doctorSchema
                    }
                    onSubmit={handleUpdateProfile}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue
                    }) => (
                        <KeyboardAwareScrollView
                            keyboardShouldPersistTaps="handled"
                            enableOnAndroid={true}
                            extraScrollHeight={50}
                            extraHeight={120}
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingHorizontal: 20,
                                paddingBottom: 30,
                            }}
                        >
                            {/* Profile Image */}
                            <View
                                style={
                                    styles.profileSection
                                }
                            >
                                <View
                                    style={
                                        styles.imageWrapper
                                    }
                                >
                                    <Image
                                        source={
                                            (profileImage || userData?.profileImage) ?
                                                { uri: profileImage?.base64 || userData?.profileImage }
                                                :
                                                _default_profileAvatar
                                        }
                                        style={
                                            styles.profileImage
                                        }
                                    />

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={
                                            styles.cameraButton
                                        }
                                        onPress={pickProfilePicture}
                                    >
                                        <Ionicons
                                            name="camera"
                                            size={18}
                                            color="#FFFFFF"
                                        />
                                    </TouchableOpacity>
                                </View>

                                <Text
                                    style={
                                        styles.changePhotoText
                                    }
                                >
                                    Change Photo
                                </Text>
                            </View>

                            {/* Form Card */}
                            <View style={styles.card}>
                                <AppInput
                                    title="Full Name"
                                    placeholder="Enter full name"
                                    value={values.fullName}
                                    onChangeText={handleChange(
                                        'fullName',
                                    )}
                                    onBlur={handleBlur(
                                        'fullName',
                                    )}
                                    error={errors.fullName}
                                    touched={touched.fullName}
                                    leftIcon="person-outline"
                                />

                                <View style={styles.genderContainer}>
                                    <Text style={styles.inputTitle}>
                                        Gender
                                    </Text>

                                    <View style={styles.genderRow}>
                                        {['Male', 'Female'].map(
                                            item => {

                                                const selected =
                                                    values.gender === item;

                                                return (
                                                    <TouchableOpacity
                                                        key={item}
                                                        activeOpacity={0.8}
                                                        style={[
                                                            styles.genderButton,
                                                            selected &&
                                                            styles.activeGenderButton,
                                                        ]}
                                                        onPress={() =>
                                                            handleChange('gender')(item)
                                                        }
                                                    >
                                                        <View
                                                            style={[
                                                                styles.radioOuter,
                                                                selected &&
                                                                styles.activeRadioOuter,
                                                            ]}
                                                        >
                                                            {selected && (
                                                                <View
                                                                    style={
                                                                        styles.radioInner
                                                                    }
                                                                />
                                                            )}
                                                        </View>

                                                        <Text
                                                            style={[
                                                                styles.genderText,
                                                                selected &&
                                                                styles.activeGenderText,
                                                            ]}
                                                        >
                                                            {item}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            },
                                        )}
                                    </View>

                                    {touched.gender &&
                                        errors.gender && (
                                            <Text style={styles.errorText}>
                                                {errors.gender}
                                            </Text>
                                        )}
                                </View>

                                {/* Patient Fields */}
                                {userData.role ===
                                    'patient' && (
                                        <>
                                            <AppInput
                                                label="Address"
                                                placeholder="Enter full address (House, Street, Area)"
                                                value={values.address}
                                                onChangeText={handleChange(
                                                    'address',
                                                )}
                                                onBlur={handleBlur(
                                                    'address',
                                                )}
                                                error={errors.address}
                                                touched={touched.address}
                                                containerStyle={{ marginTop: 15 }}
                                            />

                                            <AppDropdown
                                                label="City"
                                                placeholder="Select city"
                                                data={cities}
                                                value={cities.find(
                                                    (item: any) =>
                                                        item.value ===
                                                        values.city,
                                                )}
                                                onSelect={(item: any) =>
                                                    setFieldValue(
                                                        'city',
                                                        item.value,
                                                    )}
                                                containerStyle={{ marginTop: 15 }}
                                                error={errors.city}
                                                touched={touched.city}
                                            />

                                            <View style={styles.row}>
                                                <View
                                                    style={{ width: '32%' }}
                                                >
                                                    <AppInput
                                                        label="Height"
                                                        placeholder="5.8 ft"
                                                        value={values.height}
                                                        onChangeText={handleChange(
                                                            'height',
                                                        )}
                                                        onBlur={handleBlur(
                                                            'height',
                                                        )}
                                                        keyboardType='numeric'
                                                        error={errors.height}
                                                        touched={touched.height}
                                                        containerStyle={{ marginTop: 15 }}
                                                    />
                                                </View>

                                                <View
                                                    style={{ width: '32%' }}
                                                >
                                                    <AppInput
                                                        label="Weight"
                                                        placeholder="72 kg"
                                                        value={values.weight}
                                                        onChangeText={handleChange(
                                                            'weight',
                                                        )}
                                                        onBlur={handleBlur(
                                                            'weight',
                                                        )}
                                                        keyboardType='numeric'
                                                        error={errors.weight}
                                                        touched={touched.weight}
                                                        containerStyle={{ marginTop: 15 }}
                                                    />
                                                </View>

                                                <View
                                                    style={{ width: '32%' }}
                                                >
                                                    <AppInput
                                                        label="Age"
                                                        placeholder="25 years"
                                                        value={values.age}
                                                        onChangeText={handleChange(
                                                            'age',
                                                        )}
                                                        onBlur={handleBlur(
                                                            'age',
                                                        )}
                                                        keyboardType='numeric'
                                                        error={errors.age}
                                                        touched={touched.age}
                                                        containerStyle={{ marginTop: 15 }}
                                                    />
                                                </View>
                                            </View>

                                            <AppInput
                                                label="Medical Conditions"
                                                value={values.diseases}
                                                onChangeText={(val: any) => setFieldValue("diseases", val)}
                                                placeholder="Add diseases (press enter or comma)"
                                                type="chips"
                                                error={errors.diseases}
                                                touched={touched.diseases}
                                                containerStyle={{ marginTop: 15 }}
                                            />
                                        </>
                                    )}

                                {/* Doctor Fields */}
                                {userData.role ===
                                    'doctor' && (
                                        <>
                                            <AppInput
                                                label="Experience"
                                                placeholder="5 Years"
                                                value={values.experience}
                                                onChangeText={handleChange(
                                                    'experience',
                                                )}
                                                onBlur={handleBlur(
                                                    'experience',
                                                )}
                                                error={errors.experience}
                                                touched={touched.experience}
                                                containerStyle={{ marginTop: 15 }}
                                            />

                                            <AppInput
                                                label="Qualification"
                                                placeholder="MBBS"
                                                value={
                                                    values.qualification
                                                }
                                                onChangeText={handleChange(
                                                    'qualification',
                                                )}
                                                onBlur={handleBlur(
                                                    'qualification',
                                                )}
                                                error={errors.qualification}
                                                touched={touched.qualification}
                                                containerStyle={{ marginTop: 15 }}
                                            />

                                            <AppInput
                                                label="License Number"
                                                placeholder="Enter license number"
                                                value={
                                                    values.licenseNumber
                                                }
                                                onChangeText={handleChange(
                                                    'licenseNumber',
                                                )}
                                                onBlur={handleBlur(
                                                    'licenseNumber',
                                                )}
                                                error={errors.licenseNumber}
                                                touched={touched.licenseNumber}
                                                containerStyle={{ marginTop: 15 }}
                                            />

                                            <AppDropdown
                                                label="Specialization"
                                                placeholder="Select Specialization"
                                                // icon="person"
                                                data={categories}
                                                value={categories.find(
                                                    (item: any) =>
                                                        item.value ===
                                                        values.specialization,
                                                )}
                                                onSelect={(item: any) =>
                                                    setFieldValue(
                                                        'specialization',
                                                        item.value,
                                                    )}
                                                containerStyle={{ marginTop: 15 }}
                                                error={errors.specialization}
                                                touched={touched.specialization}
                                            />

                                            <AppInput
                                                label="Description"
                                                placeholder="Describe your experience, expertise and treatment approach"
                                                value={values.description}
                                                onChangeText={handleChange('description')}
                                                onBlur={handleBlur('description')}
                                                multiline={true}
                                                numberOfLines={4}
                                                error={errors.description}
                                                touched={touched.description}
                                                containerStyle={{ marginTop: 15 }}
                                            />

                                            <AppInput
                                                label="Clinic/Hospital Name"
                                                placeholder="Medora Clinic/Medora Hospital"
                                                value={values.clinicName}
                                                onChangeText={handleChange(
                                                    'clinicName',
                                                )}
                                                onBlur={handleBlur(
                                                    'clinicName',
                                                )}
                                                error={errors.clinicName}
                                                touched={touched.clinicName}
                                                containerStyle={{ marginTop: 15 }}
                                            />

                                            <AppInput
                                                label="Clinic/Hospital Address"
                                                placeholder="Clinic/Hospital address (Building, Street, Area)"
                                                value={values.address}
                                                onChangeText={handleChange('address')}
                                                onBlur={handleBlur('address')}
                                                error={errors.address}
                                                touched={touched.address}
                                                containerStyle={{ marginTop: 15 }}
                                            />

                                            <AppDropdown
                                                label="City"
                                                placeholder="Select city"
                                                data={cities}
                                                value={cities.find(
                                                    (item: any) =>
                                                        item.value ===
                                                        values.city,
                                                )}
                                                onSelect={(item: any) =>
                                                    setFieldValue(
                                                        'city',
                                                        item.value,
                                                    )}
                                                containerStyle={{ marginTop: 15 }}
                                                error={errors.city}
                                                touched={touched.city}
                                            />

                                            <View style={styles.row}>
                                                <View style={{ width: '48%' }}>
                                                    <AppInput
                                                        label="Visit fee"
                                                        placeholder="500 RS"
                                                        value={values?.fees?.clinicVisit}
                                                        onChangeText={handleChange('fees.clinicVisit')}
                                                        onBlur={handleBlur('fees.clinicVisit')}
                                                        keyboardType='numeric'
                                                        error={errors?.fees?.clinicVisit}
                                                        touched={touched?.fees?.clinicVisit}
                                                        containerStyle={{ marginTop: 15 }}
                                                    />
                                                </View>
                                                <View style={{ width: '48%' }}>
                                                    <AppInput
                                                        label="Online Chat fee"
                                                        placeholder="500 RS"
                                                        value={values?.fees?.onlineChat}
                                                        onChangeText={handleChange('fees.onlineChat')}
                                                        onBlur={handleBlur('fees.onlineChat')}
                                                        keyboardType='numeric'
                                                        error={errors?.fees?.onlineChat}
                                                        touched={touched?.fees?.onlineChat}
                                                        containerStyle={{ marginTop: 15 }}
                                                    />
                                                </View>
                                            </View>
                                        </>
                                    )}
                            </View>

                            {/* Save Button */}
                            <AppButton
                                title="Save Changes"
                                loading={isLoading}
                                disabled={isLoading}
                                onPress={handleSubmit}
                                style={{
                                    marginTop: 25,
                                }}
                            />
                        </KeyboardAwareScrollView>
                    )}
                </Formik>
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

    profileSection: {
        alignItems: 'center',
        marginBottom: 10,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    imageWrapper: {
        position: 'relative',
    },

    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 36,
    },

    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 35,
        height: 35,
        borderRadius: 14,
        backgroundColor: Colors.APP_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },

    changePhotoText: {
        marginTop: 10,
        fontSize: 14,
        color: Colors.APP_COLOR,
        fontFamily: fonts.name.semibold,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },

    genderContainer: {
        marginTop: 10,
    },

    inputTitle: {
        marginBottom: 5,
        fontSize: 12,
        color: Colors.titleColor,
        fontFamily: fonts.name.semibold,
    },

    genderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    genderButton: {
        flex: 1,
        height: 50,
        borderRadius: 18,
        backgroundColor: '#F8FAFC',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    activeGenderButton: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: Colors.APP_COLOR,
    },

    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },

    activeRadioOuter: {
        borderColor: Colors.APP_COLOR,
    },

    radioInner: {
        width: 8,
        height: 8,
        borderRadius: 5,
        backgroundColor: Colors.APP_COLOR,
    },

    genderText: {
        marginLeft: 10,
        fontSize: 12,
        color: Colors.titleColor,
        fontFamily: fonts.name.medium,
    },

    activeGenderText: {
        color: Colors.APP_COLOR,
    },

    errorText: {
        marginTop: 4,
        fontSize: 10,
        color: '#EF4444',
        fontFamily: fonts.name.regular,
    },
});