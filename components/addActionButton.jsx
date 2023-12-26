import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import IconComponent from "../utils/iconComponent";
import MyText from "../utils/myText";
import { dark } from "../utils/colors";

const AddActionButton = ({ nodeId }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      style={styles.addActionButton}
      onPress={() => navigation.navigate("Actions", { prevNodeId: nodeId })}
    >
      <LinearGradient
        colors={["#BE76FC", "#5F14D8"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.addActionButtonGradient}
      >
        <IconComponent name="plus" style={styles.plusIcon} />
        <MyText style={styles.addActionText}>Add action</MyText>
      </LinearGradient>
    </Pressable>
  );
};

export default AddActionButton;

const styles = StyleSheet.create({
  addActionButton: {
    height: 48,
    width: "100%",
    borderRadius: 100,
  },
  addActionButtonGradient: {
    height: 48,
    flex: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  addActionText: {
    fontSize: 18,
    color: dark.white,
    fontFamily: "Outfit_600SemiBold",
    marginLeft: 8,
  },
  plusIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
