import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import currentlyRunningWorkflow from "./file.json";

import { useAuthContext } from "../../contexts/AuthContext";
import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";
import WorkflowCard from "../../components/home/workflowCard";
import IconComponent from "../../utils/iconComponent";

const WorkflowsContent = ({ refresh, setRefreshing, workflows }) => {
  const { dispatchAPI } = useAuthContext();
  const [workflowExecutions, setWorkflowExecutions] = useState([]);
  const [shortExec, setShortExec] = useState([]);
  const navigation = useNavigation();

  const getMargin = (index) => {
    if (index === 0) {
      return { marginLeft: 20 };
    } else if (index === shortExec.length - 1) {
      return { marginLeft: 10, marginRight: 20 };
    }
    return { marginLeft: 10 };
  };

  const getWorkflowExecutions = async () => {
    try {
      const { data } = await dispatchAPI("GET", "/workflow-executions");
      return data.workflow;
    } catch (error) {
      console.error("Failed to get workflow executions:", error);
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      const data = await getWorkflowExecutions();
      if (!data || data.length === 0) {
        return;
      }
      setWorkflowExecutions(data);
      setShortExec(data.slice(0, 5));
    })();
  }, [refresh]);

  return (
    <View style={{ flex: 1 }}>
      {shortExec && shortExec.length > 0 && (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: 20,
            }}
          >
            <MyText style={styles.title}>Recently finished</MyText>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
              onPress={() => {
                navigation.navigate("HomeStack", {
                  screen: "ModalPage",
                  params: { data: workflowExecutions, title: "Workflow runs" },
                });
              }}
            >
              <MyText
                style={{ color: dark.text, fontSize: 16, marginRight: 4 }}
              >
                See more
              </MyText>
              <IconComponent name="chevron-right" style={styles.chevronIcon} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <FlatList
              data={shortExec}
              nestedScrollEnabled={true}
              keyExtractor={(item) => item.id}
              horizontal={true}
              scrollEnabled={shortExec.length > 1}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <WorkflowCard
                  workflow={item}
                  status={item.status === "Success" ? "success" : "failure"}
                  mode={shortExec.length < 2 ? "large" : "small"}
                  style={getMargin(index)}
                />
              )}
            />
          </View>
        </>
      )}
      {workflows && workflows?.length > 0 && (
        <>
          <MyText style={[styles.title, { marginHorizontal: 20 }]}>
            Your Workflows
          </MyText>
          {workflows.map((pair, index) => (
            <View key={index} style={styles.row}>
              {pair.map((item) => (
                <View style={styles.item} key={item.id}>
                  <WorkflowCard workflow={item} mode={"small"} />
                </View>
              ))}
            </View>
          ))}
        </>
      )}
    </View>
  );
};

export default WorkflowsContent;

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: dark.text,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  item: {
    alignItems: "space-between",
    justifyContent: "center",
  },
  chevronIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
});
