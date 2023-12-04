import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { useFonts, Outfit_500Medium } from '@expo-google-fonts/outfit';
import * as SplashScreen from 'expo-splash-screen';

import { AuthContextProvider } from './contexts/AuthContext';
import MyText from './utils/myText';
import {dark} from './utils/colors';
import Navigation from './screens/Navigation';
import CustomSplashScreen from './screens/splashscreen/CustomSplashScreen';


export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Outfit_500Medium,
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded) {
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      }
    }

    prepare();
  }, [fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return <CustomSplashScreen />;
  }

  return (
    <AuthContextProvider>
      <Navigation />
    
    </AuthContextProvider>
  );
}
