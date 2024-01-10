import { useState, useEffect } from "react";
import {
  useFonts,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import * as SplashScreen from "expo-splash-screen";
import { LogBox } from "react-native";
import * as Linking from "expo-linking";

import { AuthContextProvider, useAuthContext } from "./contexts/AuthContext";
import Navigation from "./screens/Navigation";
import CustomSplashScreen from "./screens/splashscreen/CustomSplashScreen";

LogBox.ignoreLogs(["Require cycle:"]);
const prefix = Linking.createURL("/");

function Initializer({ linking }) {
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

  return <Navigation linking={linking} />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        AuthScreen: "login",
      },
    },
  };

  useEffect(() => {
    const handleDeepLink = (event) => {
      console.log("Received deeplink:", event.url);
      let data = Linking.parse(event.url);
      if (data.path === "login" && data.queryParams.token) {
        const userToken = data.queryParams.token;
        console.log("Received token:", userToken);
        // attemptLoginWithToken(userToken);
      }
    };

    Linking.addEventListener("url", handleDeepLink);

    return () => {
      Linking.removeEventListener("url", handleDeepLink);
    };
  }, []);

  if (!fontsLoaded) {
    return <CustomSplashScreen />;
  }

  return (
    <AuthContextProvider>
      <Initializer linking={linking} />
    </AuthContextProvider>
  );
}
