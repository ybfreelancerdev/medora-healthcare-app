import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import store from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { CustomToast } from './src/services/CustomToast';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
          <Toast
            config={{
              custom: props => <CustomToast {...props} />,
            }}
          />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}