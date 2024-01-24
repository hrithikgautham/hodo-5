import React from 'react'
import "./firebase"
import { TamaguiProvider, } from 'tamagui'
import config from './tamagui.config';
import useFonts from './src/hooks/fonts';
import { FONTS, } from './src/constants/fonts';
import { NotificationsProvider } from './src/hooks/notifications';
import { AuthProvider, } from './src/hooks/auth';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, } from "react-native-safe-area-context"
import { Provider, } from 'react-redux'
import { store } from './store';
import Main from './Main';

const App = () => {
  const fontsLoaded = useFonts(FONTS);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <TamaguiProvider config={config}>
        <AuthProvider>
          <NavigationContainer>
            <SafeAreaProvider>
              <NotificationsProvider>
                <Main />
              </NotificationsProvider>
            </SafeAreaProvider>
          </NavigationContainer>
        </AuthProvider>
      </TamaguiProvider>
    </Provider>
  )
}

export default App