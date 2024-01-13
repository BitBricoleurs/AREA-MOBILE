import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useAuthContext } from "../../contexts/AuthContext";
import MyText from "../../utils/myText";
import { dark } from "../../utils/colors";

import IconComponent from "../../utils/iconComponent";

const { width } = Dimensions.get("window");
const MAX_BAR_WIDTH = width - 40;

const fakeData = [
  { id: 11, name: "bro bor bisu", service: "Outlook", usage_count: 4 },
  { id: 12, name: "Worflow", service: "Jira", usage_count: 6 },
  {
    id: 14,
    name: "Hhgggg zkrg  lkheruoh eiuhb ouht biuhei tuu iurhg ",
    service: "Teams",
    usage_count: 12,
  },
];

export const UsageCard = ({ item, data }) => {
  const navigation = useNavigation();

  const getBarWidth = (count) => {
    if (data[0].usage_count === 0) {
      return MAX_BAR_WIDTH;
    }
    if (count === 0) {
      return 110;
    }
    const maxCount = data.length > 0 ? data[0].usage_count : 1;
    const newWidth = MAX_BAR_WIDTH * (count / maxCount);
    return newWidth < 110 ? 110 : newWidth;
  };

  return (
    <Pressable
      key={item.id}
      style={[styles.workflowItem, { width: getBarWidth(item.usage_count) }]}
      onPress={() => {
        navigation.navigate("HomeStack", {
          screen: "WorkflowInfoScreen",
          params: { id: item.id },
        });
      }}
    >
      <View
        style={[{ width: getBarWidth(item.usage_count) - 90 }, styles.left]}
      >
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
        <MyText style={{ color: dark.text, fontSize: 16 }}>
          {item.usage_count}
        </MyText>
      </View>
    </Pressable>
  );
};

const WorkflowUsage = ({ refresh }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dispatchAPI } = useAuthContext();
  const navigation = useNavigation();

  const getData = async () => {
    const { data } = await dispatchAPI("GET", "/workflow-usage");
    setData(data.sort((a, b) => b.usage_count - a.usage_count));
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
        <MyText style={styles.title}>Usage</MyText>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
          }}
          onPress={() => {
            navigation.goBack();
            navigation.navigate("HomeStack", {
              screen: "ModalPage",
              params: { data, title: "Usage" },
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
            <UsageCard item={item} key={item.id} data={data} />
          ))}
        </>
      )}
    </View>
  );
};

export default WorkflowUsage;

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
    borderStartEndRadius: 100,
    borderBottomEndRadius: 100,
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
    alignItems: "flex-end",
    marginLeft: 8,
    marginRight: 12,
  },
  chevronIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
});
