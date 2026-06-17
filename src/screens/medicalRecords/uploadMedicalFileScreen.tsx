import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Image,
    ScrollView,
} from 'react-native';
import * as Yup from 'yup';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '../../constants/fonts';
import * as Colors from '../../styles/colors';
import { Formik } from 'formik';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';

export default function UploadMedicalFileScreen({
    navigation,
    route,
}: any) {

    const type = route?.params?.type || 'Report';
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const formikRef = useRef<any>(null);
    const initialValues = {
        title: '',
        description: ''
    };

    const validationSchema = Yup.object({
        title: Yup.string()
            .required('Title is required'),

        description: Yup.string()
            .required('Description is required'),
    });

    const handlePickDocument = () => {
        setSelectedFile({
            name: 'blood_report_april_2026.pdf',
            size: '2.4 MB',
            type: 'PDF',
        });
    };

    const handlePickImage = () => {
        setSelectedFile({
            name: 'scan_image.jpg',
            size: '1.1 MB',
            type: 'Image',
        });
    };

    const handleCamera = () => {
        setSelectedFile({
            name: 'captured_report.jpg',
            size: '1.8 MB',
            type: 'Camera',
        });
    };

    const handleUpload = async (values: any) => {
        const payload = {
            title: values.title,
            description: values.description,
            file: selectedFile,
            type,
        };

        navigation.goBack();
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
                        Upload {type}
                    </Text>

                    <View style={{ width: 45 }} />
                </View>
                <Formik
                    innerRef={formikRef}
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async values => {
                        handleUpload(values);
                    }}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        touched,
                        errors,
                    }) => (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 24,
                                paddingBottom: 15,
                            }}
                        >
                            {/* Upload Card */}
                            <View style={styles.uploadCard}>
                                <View style={styles.uploadIconContainer}>
                                    <MaterialCommunityIcons
                                        name="file-document-outline"
                                        size={40}
                                        color={Colors.APP_COLOR}
                                    />
                                </View>

                                <Text style={styles.uploadTitle}>
                                    Upload Medical {type}
                                </Text>

                                <Text style={styles.uploadSubtitle}>
                                    Upload reports, prescriptions,
                                    scans, or any medical documents
                                    securely.
                                </Text>

                                {/* Upload Options */}
                                <View style={styles.optionContainer}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.optionButton}
                                        onPress={handlePickDocument}
                                    >
                                        <Ionicons
                                            name="document-text-outline"
                                            size={22}
                                            color={Colors.APP_COLOR}
                                        />

                                        <Text style={styles.optionText}>
                                            PDF
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.optionButton}
                                        onPress={handlePickImage}
                                    >
                                        <Ionicons
                                            name="image-outline"
                                            size={22}
                                            color={Colors.APP_COLOR}
                                        />

                                        <Text style={styles.optionText}>
                                            Gallery
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.optionButton}
                                        onPress={handleCamera}
                                    >
                                        <Ionicons
                                            name="camera-outline"
                                            size={22}
                                            color={Colors.APP_COLOR}
                                        />

                                        <Text style={styles.optionText}>
                                            Camera
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* File Preview */}
                            {selectedFile && (
                                <View style={styles.fileCard}>
                                    <View style={styles.fileLeft}>
                                        <View style={styles.fileIconContainer}>
                                            <Ionicons
                                                name="document"
                                                size={26}
                                                color={Colors.APP_COLOR}
                                            />
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <Text
                                                numberOfLines={1}
                                                style={styles.fileName}
                                            >
                                                {selectedFile.name}
                                            </Text>

                                            <Text style={styles.fileSize}>
                                                {selectedFile.size}
                                            </Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() =>
                                            setSelectedFile(null)
                                        }
                                    >
                                        <Ionicons
                                            name="close-circle"
                                            size={24}
                                            color="#EF4444"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Form Card */}
                            <View style={styles.formCard}>
                                <Text style={styles.sectionTitle}>
                                    File Information
                                </Text>

                                <AppInput
                                    label="Title"
                                    value={values.title}
                                    containerStyle={{ marginTop: 15 }}
                                    onChangeText={handleChange('title')}
                                    onBlur={handleBlur('title')}
                                    placeholder="Enter report title"
                                    error={errors.title}
                                    touched={touched.title}
                                />

                                <AppInput
                                    label="Description"
                                    value={values.description}
                                    multiline
                                    numberOfLines={4}
                                    containerStyle={{ marginTop: 15 }}
                                    onChangeText={handleChange('description')}
                                    onBlur={handleBlur('description')}
                                    placeholder="Add notes or details..."
                                    error={errors.description}
                                    touched={touched.description}
                                />
                            </View>


                            {/* Security Card */}
                            <View style={styles.securityCard}>
                                <View style={styles.securityHeader}>
                                    <Ionicons
                                        name="shield-checkmark-outline"
                                        size={22}
                                        color="#16A34A"
                                    />

                                    <Text style={styles.securityTitle}>
                                        Secure Medical Storage
                                    </Text>
                                </View>

                                <Text style={styles.securityText}>
                                    Your medical files are securely
                                    encrypted and only accessible to
                                    you and your healthcare provider.
                                </Text>
                            </View>

                            {/* Upload Button */}
                            <AppButton
                                title={`Upload ${type}`}
                                style={{ marginTop: 20 }}
                                icon="cloud-upload"
                                onPress={handleSubmit}
                                // loading={loading}
                            />
                        </ScrollView>
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

    uploadCard: {
        marginTop: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        padding: 20,
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

    uploadIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    uploadTitle: {
        marginTop: 15,
        fontSize: 18,
        color: Colors.titleColor,
        fontFamily: fonts.name.bold,
    },

    uploadSubtitle: {
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
        color: Colors.subtitleColor,
        fontFamily: fonts.name.medium,
    },

    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },

    optionButton: {
        width: '31%',
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    optionText: {
        marginTop: 5,
        fontSize: 12,
        color: Colors.titleColor,
        fontFamily: fonts.name.semibold,
    },

    fileCard: {
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },

    fileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    fileIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 18,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    fileName: {
        fontSize: 12,
        color: Colors.titleColor,
        fontFamily: fonts.name.medium,
    },

    fileSize: {
        fontSize: 10,
        color: Colors.subtitleColor,
        fontFamily: fonts.name.medium,
    },

    formCard: {
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
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

    sectionTitle: {
        fontSize: 16,
        color: Colors.titleColor,
        fontFamily: fonts.name.bold,
    },

    securityCard: {
        marginTop: 20,
        backgroundColor: '#ECFDF5',
        borderRadius: 24,
        padding: 15,
    },

    securityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    securityTitle: {
        marginLeft: 10,
        fontSize: 14,
        color: '#166534',
        fontFamily: fonts.name.bold,
    },

    securityText: {
        fontSize: 12,
        lineHeight: 22,
        color: '#166534',
        fontFamily: fonts.name.medium,
    },
});