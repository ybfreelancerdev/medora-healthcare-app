import { Alert, Dimensions, Platform, StatusBar } from "react-native";
import DeviceInfo from 'react-native-device-info';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height; //44 is the header height in ParentWrapper
export const PLATFORM_IOS = Platform.OS == 'ios' ? true : false;
export const PAGE_SIZE = 20;
export const RPI_CompID = 1060;
export const PHOTOIcon_Height = 150;
export const PHOTOIcon_Width = 150;
export const PHOTO_Height = 480;
export const PHOTO_Width = 360;

export const _LOGO = require('../../assets/logo.png');
export const _SPLASH = require('../../assets/splash_screen.png');
export const _default_profileAvatar = require('../../assets/profile_avatar.png');
// export const _EVENT = require('../../assets/event.png');

// API endpoint
//export const SERVER_BASE = 'https://taza360.com/Rhino360Api';
export const SERVER_BASE = 'http://10.0.2.2:5124/api';
//Session Keys
export const tokenSessionKey = 'auth-token';
export const loginCredentialKey = 'user-Credential';
export const userSessionKey = 'auth-user';
export const roleSessionKey = 'auth-role';
export const OnBoardingKey = 'ONBOARDING_DONE';


export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  d.setUTCHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1); // 👈 Add 1 day
  return d.toISOString().split('T')[0];
};

export function getStatusBarHeight(skipAndroid?:any) {
  const { height, width } = Dimensions.get('window');

  const isIPhoneXOrNewer = Platform.OS === 'ios' && (
    DeviceInfo.hasNotch() || // Check for a notch
    (height === 812 || height === 896 || width === 812 || width === 896) 
  );

  return Platform.select({
    ios: isIPhoneXOrNewer ? 44 : 20, 
    android: skipAndroid ? 0 : StatusBar.currentHeight, 
    default: 0, 
  });
}

export function showAlertMessage(title:string, message?:string) {
  Alert.alert(
    title,
    message,
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    {
      cancelable: false,
    },
  );
}

export function GetPropertyMenuList(StatusId:number, TypeId:number, CompID:number, RPI_CompID:number, IsAssignedByTAZA: boolean) {
  const strings = [];
  if (StatusId === 1) {
    strings.push("ACCEPT/REJECT NEW INSPECTION");
  }

  strings.push("Upload Photos");
  strings.push("View Photos");

  if (TypeId === 7) {
    strings.push("Details");
    strings.push("Features");
    strings.push("Security");
    strings.push("Marketing");
    strings.push("Utilities");
    strings.push("Maintenance");
    strings.push("Repair Costs");
    strings.push("Property General Notes");
  }

  if (TypeId === 8) {
    strings.push("HUD General Information");
    strings.push("HUD Exterior");
    strings.push("HUD Interior");
    strings.push("HUD Safety");
    strings.push("HUD Ready To close");
    strings.push("HUD Ready To List");
    strings.push("HUD Signature");
  }

  if (TypeId === 9) {
    strings.push("EZ Weekly Exterior");
    strings.push("EZ Weekly Interior");
  }

  if (TypeId === 7 || TypeId === 9) {
    strings.push("Property Occupancy");
    strings.push("Property HOA");
  }

  if (TypeId === 10) {
    strings.push("Exterior Inspection Details");
  }

  if (CompID !== RPI_CompID) {
    strings.push("Preview Report");
    strings.push("Transfer to RhinoREO");
    strings.push("Duplicate Report");
  }

  if (!IsAssignedByTAZA) {
    strings.push("Submit Report");
  }

  strings.push("Email Photos & Report");

  return strings;
}

export const commonvalues = [
  { label: 'Unknown', value: 'Unknown' },
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
  { label: 'NA', value: 'NA' }
];
export const Conditionvalues = [
  { label: 'Unknown', value: 'Unknown' },
  { label: 'Good', value: 'Good' },
  { label: 'Poor', value: 'Poor' },
  { label: 'Damaged', value: 'Damaged' },
  { label: 'Missing', value: 'Missing' },
  { label: 'NA', value: 'NA' }
];
export const extInspectionvalues = [
  { label: 'Unknown', value: 'Unknown' },
  { label: 'Excellect', value: 'Excellect' },
  { label: 'Good', value: 'Good' },
  { label: 'Average', value: 'Average' },
  { label: 'Poor', value: 'Poor' },
];
export const Paymentvalues = [
  { label: 'Unknown', value: 'Unknown' },
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
  { label: 'Semi-Annually', value: 'Semi-Annually' },
  { label: 'Annually', value: 'Annually' },
  { label: 'Other', value: 'Other' }
];
export const InspTypes = [
  { label: 'Routine inspection', value: 'Routine' },
  { label: 'Initial inspection', value: 'Initial' },
  { label: 'Ready to list inspection', value: 'List' },
  { label: 'Ready to close inspection', value: 'Close' },
  { label: 'Other', value: 'Other' },
];

export const emailValidation = (email:any) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$/;
    if (regex.test(email) === true) {
        return true;
    }
    else {
        return false;
    }
}

export const getDrName = (name:string)=> {
  if(name === undefined) return '';

  if(name.toLowerCase().includes('dr')) {
    name = name.replaceAll('dr', '');
  } 
  if(name.toLowerCase().includes('dr.')) {
    name = name.replace('dr.', '');
  }
  if(name.toLowerCase().includes('.')) {
    name = name.replace('.', '');
  } 
  return `Dr. ${name}`
}

export const generateTransactionId = () => {
  const timestamp =
    Date.now()
      .toString()
      .slice(-8);

  const random =
    Math.floor(
      100000 + Math.random() * 900000,
    );

  // TOTAL:
  // TRN + 8 + 6 = 17 chars

  return `TRN${timestamp}${random}`;
};

export const generateBookingId = () => {

  const timestamp =
    Date.now()
      .toString()
      .slice(-8);

  const random =
    Math.floor(
      100000 + Math.random() * 900000,
    );

  // EXAMPLE:
  // BKG58234912123456

  return `BKG${timestamp}${random}`;
};

export const capitalizeFirstLetter = (
  text: string,
) => {

  if (!text) {
    return '';
  }

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
};

export const canCancelAppointment = (
  createdAt: any,
) => {

  if (!createdAt) {
    return false;
  }

  const createdDate =
    createdAt.toDate
      ? createdAt.toDate()
      : new Date(createdAt);

  const now = new Date();

  const diffInMinutes =
    (now.getTime() -
      createdDate.getTime()) /
    (1000 * 60);

  return diffInMinutes <= 15;
};

export const getLastSeenText = (user: any) => {
  if (!user) {
    return '';
  }

  if (user.isOnline) {
    return 'Online';
  }

  if (!user.lastSeen) {
    return 'Offline';
  }

  const lastSeen =
    user.lastSeen.toDate();

  const diffMinutes =
    Math.floor(
      (Date.now() -
        lastSeen.getTime()) /
      60000,
    );

  if (diffMinutes < 1) {
    return 'Last seen just now';
  }

  if (diffMinutes < 60) {
    return `Last seen ${diffMinutes} min ago`;
  }

  const diffHours =
    Math.floor(
      diffMinutes / 60,
    );

  if (diffHours < 24) {
    return `Last seen ${diffHours} hr ago`;
  }

  return `Last seen ${lastSeen.toLocaleDateString()}`;
};

export const getMessageDateLabel = (timestamp: any) => {
  if (!timestamp) {
    return '';
  }

  const date =
    timestamp?.toDate
      ? timestamp.toDate()
      : new Date(
          timestamp._seconds * 1000,
        );

  const today = new Date();

  const yesterday =
    new Date();

  yesterday.setDate(
    yesterday.getDate() - 1,
  );

  if (
    date.toDateString() ===
    today.toDateString()
  ) {
    return 'Today';
  }

  if (
    date.toDateString() ===
    yesterday.toDateString()
  ) {
    return 'Yesterday';
  }

  return date.toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  );
};

export const getMessageTime = (timestamp: any) => {
  if (!timestamp) {
    return '';
  }

  const date =
    timestamp?.toDate
      ? timestamp.toDate()
      : new Date(
          timestamp._seconds * 1000,
        );

  return date.toLocaleTimeString(
    'en-IN',
    {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    },
  );
};

export const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return {
        backgroundColor: '#FEF3C7',
        textColor: '#D97706',
      };

    case 'completed':
      return {
        backgroundColor: '#DCFCE7',
        textColor: '#16A34A',
      };

    case 'paid':
      return {
        backgroundColor: '#DCFCE7',
        textColor: '#16A34A',
      };

    case 'cancelled':
      return {
        backgroundColor: '#FEE2E2',
        textColor: '#DC2626',
      };

    case 'confirmed':
      return {
        backgroundColor: '#DBEAFE',
        textColor: '#2563EB',
      };

    default:
      return {
        backgroundColor: '#F3F4F6',
        textColor: '#6B7280',
      };
  }
};

export const getNotificationTime = (timestamp: any) => {
  if (!timestamp) {
    return '';
  }

  const date =
    timestamp?.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

  const now = new Date();

  const diffMs =
    now.getTime() -
    date.getTime();

  const diffMinutes =
    Math.floor(
      diffMs / (1000 * 60),
    );

  const diffHours =
    Math.floor(
      diffMs /
      (1000 * 60 * 60),
    );

  const diffDays =
    Math.floor(
      diffMs /
      (1000 * 60 * 60 * 24),
    );

  // JUST NOW
  if (diffMinutes < 1) {
    return 'Just now';
  }

  // MINUTES
  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  // HOURS
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''
      } ago`;
  }

  // YESTERDAY
  if (diffDays === 1) {
    return 'Yesterday';
  }

  // WITHIN 7 DAYS
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  // OLD DATE
  return date.toLocaleDateString(
    'en-GB',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  );

};

