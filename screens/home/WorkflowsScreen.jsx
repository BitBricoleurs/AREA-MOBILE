import { dark } from "../../utils/colors";

import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useAuthContext } from "../../contexts/AuthContext";

import currentlyRunningWorkflow from "./file.json";
import MyText from "../../utils/myText";
import WorkflowCard from "../../components/home/workflowCard";

const WorkflowsContent = ({ refresh, setRefreshing, workflows }) => {
  const { dispatchAPI } = useAuthContext();
  const [currentlyRunning, setCurrentlyRunning] = useState([]);

  useEffect(() => {
    const arr = [];
    arr.push(currentlyRunningWorkflow);
    setCurrentlyRunning(arr);
  }, []);

  return (
    // Your Workflows content here
    <View style={{ flex: 1 }}>
      {currentlyRunning.length > 0 && (
        <>
          <MyText style={styles.sectionTitle}>Currently Running</MyText>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <WorkflowCard workflow={currentlyRunning[0]} status={"running"} />
            {/* <WorkflowCard workflow={currentlyRunning[0]} status={"running"} /> */}
          </View>
        </>
      )}
      {workflows.length > 0 && (
        <>
          <MyText style={styles.sectionTitle}>Your Workflows</MyText>
          {workflows.map((pair, index) => (
            <View key={index} style={styles.row}>
              {pair.map((item) => (
                <View style={styles.item} key={item.id}>
                  <WorkflowCard workflow={item} />
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
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: dark.text,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  item: {
    alignItems: "space-between",
    justifyContent: "center",
    width: "48.3%",
  },
});
