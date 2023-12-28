import { useState, useEffect } from "react";
import {
  useFonts,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import * as SplashScreen from "expo-splash-screen";
import { LogBox } from "react-native";

import { AuthContextProvider, useAuthContext } from "./contexts/AuthContext";
import Navigation from "./screens/Navigation";
import CustomSplashScreen from "./screens/splashscreen/CustomSplashScreen";

LogBox.ignoreLogs(["Require cycle:"]);

function Initializer() {
  const { attemptLogin } = useAuthContext();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await attemptLogin();
        setAppIsReady(true);
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return <CustomSplashScreen />;
  }

  return <Navigation />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  if (!fontsLoaded) {
    return <CustomSplashScreen />;
  }

  return (
    <AuthContextProvider>
      <Initializer />
    </AuthContextProvider>
  );
}
