import auth from '@react-native-firebase/auth';
import FirebaseService from '../../services/firebase.service';
import firebaseErrorHandler from '../../utils/firebaseErrorHandler';
import _firebaseDb from '../../constants/firebaseDb';

class AuthService {
    // REGISTER
    async register(values: any) {
        try {
            const response = await auth().createUserWithEmailAndPassword(
                values.email,
                values.password,
            );
            // Send verification email 
            await response.user.sendEmailVerification();

            // Save user in Firestore 
            await FirebaseService.insert(
                _firebaseDb.users,
                {
                    uid: response.user.uid,
                    email: values.email,
                    provider: 'email',
                    role: null,
                    onboardingCompleted: false,
                    approvalStatus: null,
                    profileImage: '',
                    isActive: true, 
                    createdAt: new Date(),
                },
                response.user.uid,
            );

            return {
                success: true,
                user: response.user,
            };
        } catch (error: any) {
            return {
                success: false,
                message: firebaseErrorHandler(error),
            };
        }
    }

    // LOGIN
    async login(
        email: string,
        password: string,
    ) {
        try {
            const response = await auth().signInWithEmailAndPassword(
                email,
                password,
            );

            await response.user.reload();

            const updatedUser:any = auth().currentUser;
            // Check verification 
            if (!updatedUser?.emailVerified) { 
                return { 
                    success: false, 
                    emailNotVerified: true, 
                    message: 'Please verify your email', 
                }; 
            }
            // Check verification 
            if (updatedUser?.isDeleted) { 
                return { 
                    success: false, 
                    emailNotVerified: false, 
                    message: 'This account has been deleted. Contact to administrator...', 
                }; 
            }

            // Get Firebase Token 
            const token = await response.user.getIdToken();

            return {
                success: true,
                user: response.user,
                token
            };
        } catch (error: any) {
            return {
                success: false,
                message: firebaseErrorHandler(error),
            };
        }
    }

    // LOGOUT
    async logout() {
        try {
            await auth().signOut();

            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                message: firebaseErrorHandler(error),
            };
        }
    }

    // FORGOT PASSWORD
    async forgotPassword(email: string) {
        try {
            await auth().sendPasswordResetEmail(email);

            return {
                success: true,
                message: 'Password reset email sent successfully',
            };
        } catch (error: any) {
            return {
                success: false,
                message: firebaseErrorHandler(error),
            };
        }
    }

    // RESEND EMAIL VERIFICATION
    async resendVerificationEmail() {
        try {
            await auth().currentUser?.sendEmailVerification();

            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                message: firebaseErrorHandler(error),
            };
        }
    }

    // CHECK EMAIL VERIFIED
    async checkEmailVerification() {
        try {
            const user = auth().currentUser;

            if (!user) { 
                return { 
                    success: false, 
                    verified: false, 
                    message: 'User session expired', 
                }; 
            }

            await user?.reload();

            const updatedUser = auth().currentUser;

            return {
                success: true,
                verified: updatedUser?.emailVerified,
            };
        } catch (error: any) {
            return {
                success: false,
                message: firebaseErrorHandler(error),
            };
        }
    }
}

export default new AuthService();