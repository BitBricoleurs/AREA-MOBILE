import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { dark } from "../utils/colors";
import { useAuthContext } from "../contexts/AuthContext";
import { WorkflowContextProvider } from "../contexts/WorkflowContext";

import LandingScreen from "./auth/LandingScreen";
import AuthScreen from "./auth/AuthScreen";
import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";
import ChooseTriggerScreen from "./Workflow/ChooseTriggerScreen";
import TriggerConfigScreen from "./Workflow/TriggerConfigScreen";
import WorkflowScreen from "./Workflow/WorkflowScreen";
import ActionsScreen from "./Workflow/ActionsScreen";
import WorkflowConfigScreen from "./Workflow/WorkflowConfigScreen";

const MainTab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const WorkflowStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

const Blank = () => {
  return <View />;
};

const Authentification = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

const Workflow = () => {
  return (
    <WorkflowContextProvider>
      <WorkflowStack.Navigator>
        <WorkflowStack.Screen
          name="ChooseTrigger"
          component={ChooseTriggerScreen}
          options={{ headerShown: false }}
        />
        <WorkflowStack.Screen
          name="TriggerConfig"
          component={TriggerConfigScreen}
          options={{
            headerShown: false,
          }}
        />
        <WorkflowStack.Screen
          name="Workflow"
          component={WorkflowScreen}
          options={{ headerShown: false }}
        />
        <WorkflowStack.Screen
          name="Actions"
          component={ActionsScreen}
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <WorkflowStack.Screen
          name="TriggerConfigFromWorkflow"
          component={TriggerConfigScreen}
          options={{
            headerShown: false,
          }}
        />
        <WorkflowStack.Screen
          name="WorkflowConfig"
          component={WorkflowConfigScreen}
          options={{
            headerShown: false,
          }}
        />
      </WorkflowStack.Navigator>
    </WorkflowContextProvider>
  );
};

const MainStack = () => {
  const navigation = useNavigation();
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
        keyboardHidesTabBar: true,
        tabBarStyle: {
          height: 90,
          borderTopWidth: 0.5,
          backgroundColor: dark.primary,
        },
        style: {
          position: "absolute",
        },
      })}
    >
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <MainTab.Screen
        name="Create"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Workflow");
          },
        }}
        component={Blank}
        options={{ headerShown: false }}
      />
      <MainTab.Screen name="Settings" component={SettingsScreen} />
    </MainTab.Navigator>
  );
};

const App = () => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Main"
        component={MainStack}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="Workflow"
        component={Workflow}
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
    </AppStack.Navigator>
  );
};

const Navigation = () => {
  const { isLoggedIn } = useAuthContext();

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        {isLoggedIn ? <App /> : <Authentification />}
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default Navigation;
