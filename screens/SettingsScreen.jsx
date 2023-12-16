import { View, Image, Text, StyleSheet } from "react-native";
import MyText from "../utils/myText";
import { dark } from "../utils/colors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const SettingsScreen = () => {
  const elements = [
    { name: "Profile", icon: "user" },
    { name: "Notifications", icon: "bell" },
    { name: "Privacy", icon: "lock" },
    { name: "Help", icon: "question" },
    { name: "About", icon: "info" },
  ];
  const pressed = useSharedValue(false);
  const offset = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange((event) => {
      offset.value = event.translationX;
    })
    .onFinalize(() => {
      pressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
    backgroundColor: pressed.value ? "#FFE04B" : "#b58df1",
  }));

  return (
    <View style={styles.container}>
      {/* {elements.map((element, index) => ( */}
      <View style={{ width: "100%" }}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.element, animatedStyles]}>
            <MyText style={styles.elementText}>harry</MyText>
          </Animated.View>
        </GestureDetector>
      </View>
      {/* ))} */}
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  element: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: dark.secondary,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
});
