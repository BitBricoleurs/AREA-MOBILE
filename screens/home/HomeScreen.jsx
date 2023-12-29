import MyText from "../../utils/myText";
import { colorMap, dark } from "../../utils/colors";

import React, { useRef, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Platform,
  StatusBar,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { chunkData } from "../../utils/helpers";
import { useAuthContext } from "../../contexts/AuthContext";

import WorkflowsContent from "./WorkflowsScreen";

const AnalyticsContent = () => {
  return (
    // Your Analytics content here
    <View style={{ flex: 1 }}>
      <Text style={{ color: "#FFF" }}>Analytics Content</Text>
    </View>
  );
};

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [workflows, setWorkflows] = useState([]);
  const [width, setWidth] = useState(3);
  const [refreshing, setRefreshing] = useState(false);
  const { dispatchAPI } = useAuthContext();

  const indicatorPosition = useRef(new Animated.Value(0)).current;

  const getWorkflowIds = async () => {
    try {
      const { data } = await dispatchAPI("GET", "/get-user-workflows-ids");
      return data?.workflow_ids;
    } catch (error) {
      console.error("Failed to get workflow IDs:", error);
      // Handle error appropriately
      return [];
    }
  };

  const getWorkflow = async (workflowId) => {
    const { data } = await dispatchAPI("GET", `/get-workflow/${workflowId}`);
    return data;
  };

  const fetchData = async () => {
    const ids = await getWorkflowIds();
    if (ids && ids.length === 0) {
      return;
    }

    // const workflowPromises = ids.map((id) => getWorkflow(id));
    const workflowPromises = ids.map(async (id) => {
      const workflowData = await getWorkflow(id);
      // Combine the workflow data with its id
      return { ...workflowData, id };
    });
    const workflowsData = await Promise.all(workflowPromises);
    setWorkflows(chunkData(workflowsData, 2));
  };

  const handleWidth = (e) => {
    const layout = e.nativeEvent.layout;
    setWidth(layout.width);
  };

  const handleTabPress = (tabIndex) => {
    setActiveTab(tabIndex);
    Animated.spring(indicatorPosition, {
      toValue: (tabIndex * width) / 2 + (width / 4 - 75 / 2),
      useNativeDriver: false,
    }).start();
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const initialPosition = (0 * width) / 2 + (width / 4 - 75 / 2);
    indicatorPosition.setValue(initialPosition);
  }, [width]);

  useEffect(() => {
    if (workflows.length === 0) {
      fetchData().catch(console.error);
    }
  }, [workflows.length]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: dark.primary,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
        stickyHeaderIndices={[1]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#39F0BA"}
          />
        }
      >
        <MaskedView
          style={styles.logoContainer}
          maskElement={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MyText style={styles.logoText}>BotButler</MyText>
            </View>
          }
        >
          <LinearGradient
            colors={["#BE76FC", "#5F14D8"]}
            start={[0, 0]}
            end={[1, 1]}
            style={{ width: "95%", height: "95%", margin: 8 }}
          />
        </MaskedView>
        <View style={styles.tabBar}>
          <View
            style={{ flex: 1, flexDirection: "row" }}
            onLayout={handleWidth}
          >
            <TouchableOpacity
              onPress={() => handleTabPress(0)}
              style={[styles.tab, activeTab === 0 && styles.activeTab]}
            >
              <MyText
                style={[
                  styles.tabText,
                  activeTab === 0 && styles.activeTabText,
                ]}
              >
                Workflows
              </MyText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleTabPress(1)}
              style={[styles.tab, activeTab === 1 && styles.activeTab]}
            >
              <MyText
                style={[
                  styles.tabText,
                  activeTab === 1 && styles.activeTabText,
                ]}
              >
                Analytics
              </MyText>
            </TouchableOpacity>
          </View>
          <Animated.View
            style={[
              styles.indicator,
              {
                transform: [
                  {
                    translateX: indicatorPosition,
                  },
                ],
              },
            ]}
          />
        </View>
        <View style={styles.body}>
          {activeTab === 0 ? (
            <WorkflowsContent
              refresh={refreshing}
              setRefreshing={setRefreshing}
              workflows={workflows}
            />
          ) : (
            <AnalyticsContent />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "red",
  },
  logoText: {
    fontSize: 44,
    fontWeight: "bold",
  },
  tabBar: {
    paddingVertical: 16,
    marginBottom: 16,
    width: "100%",
    backgroundColor: dark.primary,
  },
  tab: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 8,
  },
  tabText: {
    color: dark.white,
    fontSize: 22,
  },
  activeTabText: {
    color: "#39F0BA",
  },
  indicator: {
    backgroundColor: "#39F0BA",
    height: 4,
    width: 75,
    borderRadius: 100,
    position: "absolute",
    bottom: 0,
    borderRadius: 100,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default HomeScreen;