import { View, Image, Text, StyleSheet } from "react-native";
import MyText from "../utils/myText";
import { dark } from "../utils/colors";

const SettingsScreen = () => {
  return <View style={styles.container}></View>;
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
});
