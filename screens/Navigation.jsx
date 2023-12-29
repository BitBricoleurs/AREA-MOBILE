import { Image, View } from "react-native";
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
import HomeScreen from "./home/HomeScreen";
import SettingsScreen from "./SettingsScreen";
import ChooseTriggerScreen from "./workflow/ChooseTriggerScreen";
import TriggerConfigScreen from "./workflow/TriggerConfigScreen";
import WorkflowScreen from "./workflow/WorkflowScreen";
import ActionsScreen from "./workflow/ActionsScreen";
import WorkflowConfigScreen from "./workflow/WorkflowConfigScreen";
import WorkflowInfoScreen from "./workflowInfo/WorkflowInfoScreen";
import ActivityScreen from "./workflowInfo/ActivityScreen";

const MainTab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const WorkflowStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

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
  );
};

const MainStack = () => {
  const navigation = useNavigation();
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeStack") {
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
        name="HomeStack"
        component={Home}
        options={{ headerShown: false }}
      />
      <MainTab.Screen
        name="Create"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("WorkflowStack");
          },
        }}
        component={Blank}
        options={{ headerShown: false }}
      />
      <MainTab.Screen name="Settings" component={SettingsScreen} />
    </MainTab.Navigator>
  );
};

const Home = () => {
  return (
    <HomeStack.Navigator>
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="WorkflowInfoScreen"
        component={WorkflowInfoScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
};

const App = () => {
  return (
    <WorkflowContextProvider>
      <AppStack.Navigator>
        <AppStack.Screen
          name="Main"
          component={MainStack}
          options={{ headerShown: false }}
        />
        <AppStack.Screen
          name="WorkflowStack"
          component={Workflow}
          options={{ headerShown: false, presentation: "fullScreenModal" }}
        />
      </AppStack.Navigator>
    </WorkflowContextProvider>
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
