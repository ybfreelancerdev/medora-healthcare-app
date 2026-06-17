const firebaseErrorHandler = (error: any) => {
  switch (error.code) {

    // AUTH ERRORS
    case 'auth/email-already-in-use':
      return 'Email already exists';

    case 'auth/invalid-email':
      return 'Invalid email address';

    case 'auth/user-not-found':
      return 'User not found';

    case 'auth/wrong-password':
      return 'Incorrect password';

    case 'auth/weak-password':
      return 'Password is too weak';

    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later';

    case 'auth/network-request-failed':
      return 'No internet connection';

    case 'auth/invalid-credential':
      return 'Invalid login credentials';

    case 'auth/user-disabled':
      return 'This account has been disabled';

    // FIRESTORE ERRORS
    case 'permission-denied':
      return 'Permission denied';

    case 'unavailable':
      return 'Server unavailable';

    case 'not-found':
      return 'Record not found';

    // DEFAULT
    default:
      return error?.message || 'Something went wrong';
  }
};

export default firebaseErrorHandler;