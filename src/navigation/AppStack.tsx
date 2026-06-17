import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppTabs from './AppTabs';
import DoctorDetailsScreen from '../screens/doctors/doctorDetailsScreen';
import AppointmentBookingScreen from '../screens/appointment/appointmentBookingScreen';
import PaymentScreen from '../screens/payment/paymentScreen';
import BookingSuccessScreen from '../screens/appointment/bookingSuccessScreen';
import AppointmentDetailsScreen from '../screens/appointment/appointmentDetailsScreen';
import PrescriptionScreen from '../screens/prescription/prescriptionScreen';
import PrescriptionBuilderScreen from '../screens/prescription/prescriptionBuilderScreen';
import PrescriptionPreviewScreen from '../screens/prescription/prescriptionPreviewScreen';
import UploadMedicalFileScreen from '../screens/medicalRecords/uploadMedicalFileScreen';
import ReportDetailsScreen from '../screens/medicalRecords/recordDetailScreen';
import EditProfileScreen from '../screens/profile/editProfileScreen';
import ChangePasswordScreen from '../screens/profile/changePasswordScreen';
import NotificationsScreen from '../screens/notifications/notificationsScreen';
import PaymentHistoryScreen from '../screens/payment/paymentHistoryScreen';
import HelpSupportScreen from '../screens/helpSupport/helpSupportScreen';
import PrivacyPolicyScreen from '../screens/privacyPolicy/privacyPolicyScreen';
import SettingsScreen from '../screens/settings/settingsScreen';
import DeleteAccountScreen from '../screens/profile/deleteAccountScreen';
import PatientDetailsScreen from '../screens/patients/patientsDetailsScreen';
import ScheduleAvailabilityScreen from '../screens/doctors/scheduleAvailabilityScreen';
import DoctorWalletScreen from '../screens/doctors/doctorWalletScreen';
import TransactionHistoryScreen from '../screens/payment/transactionHistoryScreen';
import DoctorWithdrawEarningsScreen from '../screens/doctors/doctorWithdrawEarningsScreen';
import ChatScreen from '../screens/chat/chatScreen';
import AppointmentRatingReviewScreen from '../screens/appointment/appointmentRatingReviewScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Main">
      <Stack.Screen name="Main" component={AppTabs} options={{ headerShown: false }}/>
      <Stack.Screen name="DoctorDetails" component={DoctorDetailsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="AppointmentBooking" component={AppointmentBookingScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Prescription" component={PrescriptionScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="PrescriptionBuilder" component={PrescriptionBuilderScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="PrescriptionPreview" component={PrescriptionPreviewScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="UploadMedicalFile" component={UploadMedicalFileScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} initialParams={{hideBackBtn: false}}/>
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="ScheduleAvailability" component={ScheduleAvailabilityScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="DoctorWallet" component={DoctorWalletScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="DoctorWithdrawEarnings" component={DoctorWithdrawEarningsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="RatingReview" component={AppointmentRatingReviewScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}
