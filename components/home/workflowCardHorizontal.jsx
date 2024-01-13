import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { dark, statusColorMap } from "../../utils/colors";
import IconComponent from "../../utils/iconComponent";
import MyText from "../../utils/myText";

const WorkflowCardHorizontal = ({ item }) => {
  const navigation = useNavigation();

  function formatDuration(durationStr) {
    // Split the duration string into hours, minutes, seconds, and microseconds
    const [hours, minutes, rest] = durationStr.split(":");
    const [seconds] = rest.split(".");

    // Convert hours to minutes and add to the existing minutes
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);

    // Format the output string
    return `${totalMinutes}m${parseInt(seconds)}s`;
  }

  return (
    <Pressable
      key={item.id}
      style={styles.workflowItem}
      onPress={() => {
        navigation.goBack();
        navigation.navigate("HomeStack", {
          screen: "Logs",
          params: { log_id: item.id },
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
              item.startTime.slice(11, 16)
            }
          </MyText>
        </View>
        <View style={styles.duration}>
          <MyText style={{ color: dark.text, fontSize: 16 }}>
            {
              // item duration from seconds to minutes in this format: 1m24s
              formatDuration(item.duration)
            }
          </MyText>
        </View>
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor:
                statusColorMap[
                  item.status === "Success" ? "success" : "failure"
                ],
            },
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
    flex: 2,
  },
  duration: {
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
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
    marginLeft: 8,
  },
});
