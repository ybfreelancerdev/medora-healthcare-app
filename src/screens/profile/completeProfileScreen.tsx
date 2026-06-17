import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import FirebaseService from '../../services/firebase.service';
import { showCustom } from '../../services/message.service';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '../../context/AuthContext';
import AppDropdown from '../../components/AppDropdown';
import _firebaseDb from '../../constants/firebaseDb';
import { _default_profileAvatar } from '../../constants';
import _fileUploadService from '../../services/fileUpload.service';

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

export default function CompleteProfileScreen({ navigation }: any) {
    const { fetchUserData }: any = useAuth();
    const [isLoading, setisLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | ''>('');
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [profileImage, setProfileImage] = useState<any>(null);
    const formikRef = useRef<any>(null);

    useEffect(() => {
        fetchCities();
        fetchCategories();
    }, []);

    const initValue = {
        profileImage: '',
        fullName: '',
        gender: '',
        address: '',
        city: '',
        ...(selectedRole === "patient" && {
            height: '',
            weight: '',
            age: '',
            diseases: [],
        }),
        ...(selectedRole === "doctor" && {
            specialization: '',
            description: '',
            experience: '',
            qualification: '',
            clinicName: '',
            licenseNumber: '',
            rating: 0,
            ratingCount: 0,
            totalRating: 0,
            fees: {
                clinicVisit: 0,
                onlineChat: 0
            }
        }),
    }

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

    const handleSubmitProfile = async (values: any) => {
        try {
            if (isLoading) {
                return;
            }
            setisLoading(true);

            const uid = auth()?.currentUser?.uid;

            if (!uid) {
                showCustom('User session expired');
                return;
            }
            // const upload = await _fileUploadService.uploadFileToFirebase(
            //     profileImage,
            //     `users/${uid}/profileImage`
            // );
            if(profileImage) {
                values.profileImage = profileImage.base64;
            }

            const payload = {
                uid,
                role: selectedRole,
                onboardingCompleted: true,
                approvalStatus:
                    selectedRole === 'doctor'
                        ? 'pending'
                        : null,
            };

            await FirebaseService.update(
                _firebaseDb.users,
                uid,
                payload,
            );

            //store doctor and patient details
            await FirebaseService.insert(
                selectedRole === "doctor" ?
                    _firebaseDb.doctors
                    :
                    _firebaseDb.patients,
                {
                    ...values,
                    fcmToken: '',
                    ...(selectedRole === "doctor" && {
                        rating: 0,
                        ratingCount: 0,
                        totalRating: 0,
                        patients: 0
                    }),
                },
                uid,
            );

            await fetchUserData(uid);

            showCustom('Profile completed successfully');
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
                <Formik
                    innerRef={formikRef}
                    initialValues={initValue}
                    validationSchema={
                        selectedRole === 'patient'
                            ? patientSchema
                            : doctorSchema
                    }
                    onSubmit={handleSubmitProfile}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                    }) => (

                        <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            enableOnAndroid={true}
                            extraScrollHeight={50}
                            extraHeight={120}
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingBottom: 30,
                            }}
                        >
                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.title}>
                                    Complete Profile
                                </Text>

                                <Text style={styles.subtitle}>
                                    Select your role and
                                    complete your profile
                                    details
                                </Text>
                            </View>

                            {/* Role Selection */}
                            <View style={styles.roleRow}>
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    style={[
                                        styles.roleCard,
                                        selectedRole ===
                                        'patient' &&
                                        styles.activeRoleCard,
                                    ]}
                                    onPress={() =>
                                        setSelectedRole(
                                            'patient',
                                        )
                                    }
                                >
                                    <View
                                        style={[
                                            styles.roleIcon,
                                            {
                                                backgroundColor:
                                                    '#DBEAFE',
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name="person"
                                            size={30}
                                            color="#2563EB"
                                        />
                                    </View>

                                    <Text style={styles.roleTitle}>
                                        Patient
                                    </Text>

                                    {/* <Text style={styles.roleText}>
                                        Book appointments
                                        and manage health
                                        records
                                    </Text> */}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    style={[
                                        styles.roleCard,
                                        selectedRole ===
                                        'doctor' &&
                                        styles.activeRoleCard,
                                    ]}
                                    onPress={() =>
                                        setSelectedRole(
                                            'doctor',
                                        )
                                    }
                                >
                                    <View
                                        style={[
                                            styles.roleIcon,
                                            {
                                                backgroundColor:
                                                    '#CCFBF1',
                                            },
                                        ]}
                                    >
                                        <MaterialCommunityIcons
                                            name="doctor"
                                            size={30}
                                            color="#0F766E"
                                        />
                                    </View>

                                    <Text style={styles.roleTitle}>
                                        Doctor
                                    </Text>

                                    {/* <Text style={styles.roleText}>
                                        Manage patients
                                        and consultations
                                    </Text> */}
                                </TouchableOpacity>
                            </View>

                            {/* Form Card */}
                            {!!selectedRole && (
                                <View style={styles.formCard}>
                                    {/* Profile Image */}
                                    <View style={styles.profileSection}>
                                        <View style={styles.imageWrapper}>
                                            <Image
                                                source={
                                                    profileImage ?
                                                    {uri: profileImage.base64}
                                                    :
                                                    _default_profileAvatar
                                                }
                                                style={styles.profileImage}
                                            />

                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={pickProfilePicture}
                                                style={styles.cameraButton}>
                                                <Ionicons
                                                    name="camera"
                                                    size={18}
                                                    color="#FFFFFF"
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        <Text style={styles.changePhotoText}>
                                            Profile Photo
                                        </Text>
                                    </View>

                                    <AppInput
                                        label="Full Name"
                                        placeholder="Enter full name"
                                        value={values.fullName}
                                        onChangeText={handleChange('fullName')}
                                        onBlur={handleBlur('fullName')}
                                        error={errors.fullName}
                                        touched={touched.fullName}
                                    />

                                    {/* Gender */}
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
                                    {selectedRole ===
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
                                    {selectedRole ===
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

                                    <AppButton
                                        title="Complete Profile"
                                        onPress={handleSubmit}
                                        loading={isLoading}
                                        disabled={isLoading}
                                        style={{
                                            marginTop: 25,
                                        }}
                                    />
                                </View>
                            )}
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
        alignItems: 'center',
        paddingHorizontal: 24,
    },

    title: {
        fontSize: 20,
        color: Colors.titleColor,
        fontFamily: fonts.name.bold,
    },

    subtitle: {
        fontSize: 14,
        lineHeight: 24,
        textAlign: 'center',
        color: Colors.subtitleColor,
        fontFamily: fonts.name.medium,
    },

    roleRow: {
        marginTop: 15,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    roleCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        padding: 15,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },

    activeRoleCard: {
        borderColor: Colors.APP_COLOR,
        backgroundColor: '#F8FBFF',
    },

    roleIcon: {
        width: 60,
        height: 60,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },

    roleTitle: {
        marginTop: 10,
        fontSize: 16,
        color: Colors.titleColor,
        fontFamily: fonts.name.bold,
    },

    roleText: {
        fontSize: 12,
        lineHeight: 22,
        textAlign: 'center',
        color: Colors.subtitleColor,
        fontFamily: fonts.name.medium,
    },

    formCard: {
        marginTop: 15,
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 20,
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
        marginTop: 15,
    },

    inputTitle: {
        marginBottom: 5,
        fontSize: 14,
        color: Colors.Form_InputLableCOLOR,
        fontFamily: fonts.name.medium,
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
        width: 20,
        height: 20,
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
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.APP_COLOR,
    },

    genderText: {
        marginLeft: 10,
        fontSize: 14,
        color: Colors.titleColor,
        fontFamily: fonts.name.medium,
    },

    activeGenderText: {
        color: Colors.APP_COLOR,
    },

    errorText: {
        marginTop: 4,
        fontSize: 12,
        color: '#EF4444',
        fontFamily: fonts.name.regular,
    },

    label: {
        marginTop: 18,
        marginBottom: 12,
        fontSize: 14,
        color: Colors.Form_InputLableCOLOR,
        fontFamily: fonts.name.medium,
    },

    radioActive: {
        borderColor: Colors.APP_COLOR,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    profileSection: {
        alignItems: 'center',
        marginBottom: 10,
    },

    imageWrapper: {
        position: 'relative'
    },

    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
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
        fontSize: 12,
        color: Colors.APP_COLOR,
        fontFamily: fonts.name.semibold,
    },
});