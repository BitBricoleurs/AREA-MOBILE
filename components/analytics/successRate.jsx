import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useAuthContext } from "../../contexts/AuthContext";
import MyText from "../../utils/myText";
import { dark, statusColorMap } from "../../utils/colors";

import IconComponent from "../../utils/iconComponent";

const fakeData = [
  { id: 12, name: "Worflow", service: "Teams", success_rate: "2" },
  { id: 14, name: "Hhgggg", service: "Outlook", success_rate: "76" },
  { id: 11, name: "Redirect to main", service: "Outlook", success_rate: "N/A" },
];

export const SuccessCard = ({ item }) => {
  const navigation = useNavigation();

  const getColor = (success_rate) => {
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
      <View
        style={[
          styles.right,
          item.success_rate !== "N/A" && {
            borderWidth: 3,
            borderColor: getColor(item.success_rate),
          },
        ]}
      >
        <MyText style={{ color: dark.text, fontSize: 16 }}>
          {item.success_rate}
          {item.success_rate !== "N/A" && "%"}
        </MyText>
      </View>
    </Pressable>
  );
};

const SuccessRate = ({ refresh }) => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { dispatchAPI } = useAuthContext();
  const navigation = useNavigation();

  const getData = async () => {
    const { data } = await dispatchAPI("GET", "/workflow-success-rate");
    setData(fakeData.sort((a, b) => b.success_rate - a.success_rate));
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getData();
      setLoading(false);
    })();
  }, [refresh]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MyText style={styles.title}>Success rate</MyText>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
          }}
          onPress={() => {
            navigation.navigate("HomeStack", {
              screen: "ModalPage",
              params: { data, title: "Success rate" },
            });
          }}
        >
          <MyText style={{ color: dark.text, fontSize: 16, marginRight: 4 }}>
            See more
          </MyText>
          <IconComponent name="chevron-right" style={styles.chevronIcon} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator
          size="medium"
          color={dark.text}
          style={{ marginTop: 20 }}
        />
      ) : (
        <>
          {data.slice(0, 5).map((item) => (
            <SuccessCard item={item} key={item.id} />
          ))}
        </>
      )}
    </View>
  );
};

export default SuccessRate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: dark.text,
    marginBottom: 10,
  },
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
  },
  right: {
    alignItems: "center",
    marginLeft: 8,
    height: 40,
    marginRight: 4,
    borderRadius: 100,
    aspectRatio: 1,
    justifyContent: "center",
    padding: 4,
  },
  chevronIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
});
