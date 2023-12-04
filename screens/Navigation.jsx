// import { Image, Pressable, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LandingScreen from "./auth/LandingScreen";
import EmailScreen from "./auth/EmailScreen";
import PasswordScreen from "./auth/PasswordScreen";
import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";
import { useAuthContext } from "../contexts/AuthContext";

const MainTab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

const Authentification = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }}/>
      <AuthStack.Screen name="Connect" component={EmailScreen} options={{ headerShown: false }}/>
      <AuthStack.Screen name="Password" component={PasswordScreen} options={{ headerShown: false }}/>
    </AuthStack.Navigator>
  );
}

const MainStack = () => {
  return (
    <MainTab.Navigator>
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Settings" component={SettingsScreen} />
    </MainTab.Navigator>
  );
}

const Navigation = () => {
  const { isLoggedIn } = useAuthContext();

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        {isLoggedIn ? (
          <MainStack />
        ) : (
            <Authentification />
        )}
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default Navigation;