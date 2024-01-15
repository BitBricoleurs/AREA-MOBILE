import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { dark, colorMap } from "../../utils/colors";
import MyText from "../../utils/myText";
import IconComponent from "../../utils/iconComponent";
import { useAuthContext } from "../../contexts/AuthContext";

const ActionCard = ({ action }) => {
  const [unfolded, setUnfolded] = useState(false);
  const rotateAnim = useState(new Animated.Value(0))[0];

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  function parseJsonString(jsonString) {
    try {
      let parsedData = JSON.parse(jsonString);

      if (parsedData.length > 1 && parsedData[1].error) {
        parsedData[1].error = JSON.parse(parsedData[1].error);
      }

      return JSON.stringify(parsedData, null, 2);
    } catch (e) {
      return jsonString;
    }
  }

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: unfolded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [unfolded]);

  return (
    <View
      style={[
        cardStyles.container,
        { backgroundColor: colorMap[action.service] },
      ]}
    >
      <Pressable
        style={cardStyles.action}
        onPress={() => setUnfolded(!unfolded)}
      >
        <View style={cardStyles.actionServiceIcon}>
          <IconComponent
            name={action?.service}
            style={[
              cardStyles.serviceIcon,
              action.service === "Openai" && { tintColor: "#000000" },
            ]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <MyText style={cardStyles.actionText}>{action?.action_name}</MyText>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <IconComponent name="chevron-right" style={cardStyles.chevronIcon} />
        </Animated.View>
      </Pressable>
      {unfolded && (
        <View style={cardStyles.logContainer}>
          <Text style={cardStyles.logText} selectable>
            {parseJsonString(action.log_details)}
          </Text>
        </View>
      )}
    </View>
  );
};

const cardStyles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 8,
    padding: 8,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  action: {
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionServiceIcon: {
    width: 42,
    height: 42,
    borderRadius: 100,
    backgroundColor: dark.white,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceIcon: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },
  actionText: {
    fontSize: 18,
    color: dark.white,
    marginHorizontal: 16,
  },
  chevronIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    marginHorizontal: 8,
    margin: 12,
  },
  logContainer: {
    backgroundColor: dark.secondary,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  logText: {
    fontFamily: "NotoSansMono_400Regular",
    fontSize: 14,
    color: dark.white,
  },
});

const LogsScreen = ({ navigation, route }) => {
  const { log_id, id } = route.params || {};
  const [refreshing, setRefreshing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [actions, setActions] = useState([]);
  const { dispatchAPI } = useAuthContext();

  const getWorkflowRunLogs = async () => {
    const { data } = await dispatchAPI(
      "GET",
      `/execution-details/${id}/${log_id}`
    );
    return data?.execution_details;
  };

  const getData = async () => {
    setRefreshing(true);
    const runs = await getWorkflowRunLogs();
    setActions(runs);
    setRefreshing(false);
  };

  useEffect(() => {
    (async () => {
      setLoadingData(true);
      const runs = await getWorkflowRunLogs();
      setActions(runs);
      setLoadingData(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.customHeader}>
        <Pressable style={{ width: 24 }} onPress={() => navigation.goBack()}>
          <IconComponent name="arrow-left" style={styles.backIcon} />
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <MyText style={styles.headerText}>Logs</MyText>
        </View>
        <View style={{ width: 24 }} />
      </View>
      {loadingData ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={dark.white} />
        </View>
      ) : (
        <>
          {actions?.length > 0 ? (
            <FlatList
              data={actions || []}
              showsVerticalScrollIndicator={false}
              refreshing={loadingData}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={getData}
                  colors={[dark.white]}
                  progressBackgroundColor={dark.primary}
                />
              }
              renderItem={({ item, index }) => (
                <View key={item.action_id} style={{ justifyContent: "center" }}>
                  <ActionCard action={item} />
                  {index !== actions.length - 1 && (
                    <View
                      style={{
                        height: 8,
                        backgroundColor: dark.outline,
                        width: 1,
                        alignSelf: "center",
                      }}
                    />
                  )}
                </View>
              )}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MyText style={{ color: dark.text }}>
                Unable to retrieve logs
              </MyText>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default LogsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
    paddingHorizontal: 20,
  },
  customHeader: {
    flexDirection: "row",
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    color: dark.white,
  },
  run: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: dark.outline,
    marginVertical: 4,
    borderRadius: 8,
  },
  runText: {
    fontSize: 18,
    color: dark.white,
  },
  runDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginLeft: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 100,
    marginRight: 8,
  },
});
