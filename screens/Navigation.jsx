import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { dark } from "../utils/colors";

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
      <AuthStack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Connect"
        component={EmailScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Password"
        component={PasswordScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

const MainStack = () => {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused
              ? require("../assets/tabbarIcons/dashboard-filled.png")
              : require("../assets/tabbarIcons/dashboard.png");
          } else if (route.name === "Create") {
            iconName = require("../assets/tabbarIcons/create.png");
          } else if (route.name === "Settings") {
            iconName = focused
              ? require("../assets/tabbarIcons/settings-filled.png")
              : require("../assets/tabbarIcons/settings.png");
          }
          return <Image style={{ width: 30, height: 30 }} source={iconName} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 90,
          borderTopWidth: 0.5,
          backgroundColor: dark.primary,
        },
      })}
    >
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <MainTab.Screen name="Settings" component={SettingsScreen} />
    </MainTab.Navigator>
  );
};

const Navigation = () => {
  const { isLoggedIn } = useAuthContext();

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        {isLoggedIn ? <MainStack /> : <Authentification />}
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default Navigation;
