import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from "react-native";
import { dark, statusColorMap } from "../../utils/colors";
import MyText from "../../utils/myText";
import IconComponent from "../../utils/iconComponent";
import { useAuthContext } from "../../contexts/AuthContext";

const ActivityScreen = ({ navigation, route }) => {
  const { id } = route.params || {};
  const [loadingData, setLoadingData] = useState(false);
  const [runs, setRuns] = useState([]);
  const { dispatchAPI } = useAuthContext();

  // const runs = Array.from({ length: 23 }, (_, index) => index).reverse();

  const getWorkflowRuns = async () => {
    const { data } = await dispatchAPI("GET", `/workflow-executions/${id}`);
    console.log(data);
    return data;
  };

  const getData = async () => {
    setLoadingData(true);
    const runs = await getWorkflowRuns();
    setRuns(runs);
    setLoadingData(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
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
          <MyText style={styles.headerText}>Activity</MyText>
        </View>
        <View style={{ width: 24 }} />
      </View>
      {runs?.executions?.lenght === 0 ? (
        <FlatList
          data={runs || []}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          refreshing={loadingData}
          onRefresh={getData}
          inverted={true}
          renderItem={({ item }) => (
            <Pressable style={styles.run}>
              <MyText style={styles.runText}>Run #{item}</MyText>
              <View style={styles.runDetails}>
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: statusColorMap["success"] },
                  ]}
                />
                <IconComponent name="chevron-right" style={styles.icon} />
              </View>
            </Pressable>
          )}
        />
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <MyText style={{ color: dark.text }}>
            This workflow has no runs yet.
          </MyText>
        </View>
      )}
    </View>
  );
};

export default ActivityScreen;

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
    backgroundColor: dark.secondary,
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
