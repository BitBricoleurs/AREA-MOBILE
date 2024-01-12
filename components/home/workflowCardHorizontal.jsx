import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { dark, statusColorMap } from "../../utils/colors";
import IconComponent from "../../utils/iconComponent";
import MyText from "../../utils/myText";

const WorkflowCardHorizontal = ({ item }) => {
  const navigation = useNavigation();

  const getColor = (status) => {
    if (success_rate >= 90) {
      return statusColorMap["success"];
    } else if (success_rate >= 70) {
      return statusColorMap["running"];
    } else {
      return statusColorMap["failure"];
    }
  };

  return (
    <Pressable
      key={item.id}
      style={styles.workflowItem}
      onPress={() => {
        navigation.navigate("HomeStack", {
          screen: "WorkflowInfoScreen",
          params: { id: item.id },
        });
      }}
    >
      <View style={styles.left}>
        <View style={styles.iconContainer}>
          <IconComponent name={item?.service || ""} style={styles.icon} />
        </View>
        <MyText
          style={{ color: dark.text, fontSize: 16 }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.name}
        </MyText>
      </View>
      <View style={styles.right}>
        <View style={styles.startTime}>
          <MyText style={{ color: dark.text, fontSize: 16 }}>
            {
              // start time in this format: 12:34
              item.start_time.slice(11, 16)
            }
          </MyText>
        </View>
        <View style={styles.duration}>
          <MyText style={{ color: dark.text, fontSize: 16 }}>
            {
              // item duration from seconds to minutes in this format: 1m24s
              Math.floor(item.duration / 60) + "m" + (item.duration % 60) + "s"
            }
          </MyText>
        </View>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: statusColorMap[item.status] },
          ]}
        />
      </View>
    </Pressable>
  );
};

export default WorkflowCardHorizontal;

const styles = StyleSheet.create({
  workflowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
    paddingHorizontal: 8,
    height: 52,
    backgroundColor: dark.secondary,
    borderStartEndRadius: 8,
    borderBottomEndRadius: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: dark.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    width: "45%",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "40%",
  },
  startTime: {
    alignItems: "center",
    justifyContent: "center",
  },
  duration: {
    alignItems: "center",
    justifyContent: "center",
  },
  chevronIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  statusIndicator: {
    width: 13,
    height: 13,
    borderRadius: 100,
    marginRight: 4,
  },
});
