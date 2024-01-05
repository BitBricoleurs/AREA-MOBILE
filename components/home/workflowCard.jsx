import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { dark, statusColorMap } from "../../utils/colors";
import IconComponent from "../../utils/iconComponent";
import MyText from "../../utils/myText";

const WorkflowCard = ({ workflow, status }) => {
  console.log("workflow", workflow);
  const navigation = useNavigation();
  // console.error(workflow);
  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigation.navigate("HomeStack", {
          screen: "WorkflowInfoScreen",
          params: { id: workflow.id },
        })
      }
    >
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <IconComponent name={workflow?.service || ""} style={styles.icon} />
        </View>
        {status !== "none" && (
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: statusColorMap[status] },
            ]}
          />
        )}
      </View>
      <View style={styles.titleContainer}>
        <MyText style={styles.titleText} numberOfLines={2} ellipsizeMode="tail">
          {workflow.name || "Untitled Workflow"}
        </MyText>
      </View>
    </Pressable>
  );
};

export default WorkflowCard;

WorkflowCard.defaultProps = {
  workflow: {},
  status: "none",
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 120,
    backgroundColor: dark.secondary,
    borderRadius: 15,
    padding: 10,
    marginBottom: 12,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "space-between",
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 100,
    backgroundColor: dark.white,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 6,
    paddingLeft: 6,
  },
  titleText: {
    fontSize: 18,
    color: dark.white,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 13,
    height: 13,
    borderRadius: 100,
    position: "absolute",
    top: 6,
    right: 6,
  },
});
