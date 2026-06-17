import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/auth/login/LoginScreen';
import ForgotPassword from '../screens/auth/forgot-password/ForgotPasswordScreen';
import Registration from '../screens/auth/register/RegisterScreen';
import Verification from '../screens/auth/verification/VerificationScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Register" component={Registration} />
      <Stack.Screen name="Verification" component={Verification} />
    </Stack.Navigator>
  );
}
