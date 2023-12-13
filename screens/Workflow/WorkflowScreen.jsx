import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  Pressable,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { dark, colorMap } from "../../utils/colors";
import MyText from "../../utils/myText";
import IconComponent from "../../utils/iconComponent";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import ActionSection from "../../components/actions/actionSection";

const WorkflowScreen = ({ navigation }) => {
  const options = ["if", "loop", "delay", "end", "variable"];
  const { trigger, workflow } = useWorkflowContext();

  const nodeDispatch = (node) => {
    switch (node.type) {
      case "action":
        return <ActionSection nodeId={node.id} />;
      case "condition":
        return <View style={{ flex: 1 }} />;
      case "delay":
        return <View style={{ flex: 1 }} />;
      default:
        return null;
    }
  };

  const renderNode = (nodeId) => {
    const node = workflow.find((n) => n.id === nodeId);
    if (!node) return null;

    return (
      <View key={node.id} style={{ flex: 1, width: "100%" }}>
        {nodeDispatch(node)}
        {node.next_id > 0 && renderNode(node.next_id)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Pressable
              onPress={() =>
                navigation.navigate("TriggerConfig", {
                  previousPage: "ChooseTrigger",
                  fromWorkflow: false,
                })
              }
              style={styles.backButton}
            >
              <IconComponent name="arrow-left" style={styles.arrow} />
            </Pressable>
            <View style={styles.title}>
              <MyText style={styles.titleText}>New workflow</MyText>
            </View>
            <View style={{ width: 34 }} />
          </View>
        </View>
        <View style={styles.workflowContainer}>
          <Pressable
            style={[
              styles.trigger,
              { backgroundColor: colorMap[trigger?.serviceName] },
            ]}
            onPress={() =>
              navigation.navigate("TriggerConfigFromWorkflow", {
                serviceName: trigger?.serviceName,
                triggerName: trigger?.trigger,
                fromWorkflow: true,
                previousPage: "Workflow",
              })
            }
          >
            <View style={styles.triggerServiceIcon}>
              <IconComponent
                name={trigger?.serviceName}
                style={styles.serviceIcon}
              />
            </View>
            <View style={{ flex: 1 }}>
              <MyText style={styles.triggerText}>{trigger?.trigger}</MyText>
            </View>
            <IconComponent name="chevron-right" style={styles.chevronIcon} />
          </Pressable>
          <View
            style={{
              height: 22,
              width: 2,
              backgroundColor: dark.outline,
            }}
          />
          {workflow[0] ? renderNode(workflow[0].id) : null}
          <View
            style={{ height: 22, width: 2, backgroundColor: dark.outline }}
          />
          <Pressable
            style={styles.addActionButton}
            onPress={() => navigation.navigate("Actions")}
          >
            <LinearGradient
              colors={["#BE76FC", "#5F14D8"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.addActionButtonGradient}
            >
              <IconComponent name="plus" style={styles.plusIcon} />
              <MyText style={styles.addActionText}>Add action</MyText>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.options}>
        <ScrollView
          style={styles.optionsScrollView}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {options.map((option, index) => (
            <Pressable
              key={index}
              style={[
                styles.option,
                index === options.length - 1 && { marginRight: 24 },
              ]}
            >
              <MyText style={styles.optionText}>{option}</MyText>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default WorkflowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    backgroundColor: dark.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  backButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    color: dark.white,
  },

  workflowContainer: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  trigger: {
    height: 72,
    backgroundColor: "#32A9E7",
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  triggerServiceIcon: {
    width: 48,
    height: 48,
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
  triggerText: {
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
  addActionButton: {
    height: 48,
    width: "100%",
    borderRadius: 100,
  },
  addActionButtonGradient: {
    height: 48,
    flex: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  addActionText: {
    fontSize: 18,
    color: dark.white,
    fontFamily: "Outfit_600SemiBold",
    marginLeft: 8,
  },
  plusIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  options: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: dark.primary,
  },
  optionsScrollView: {
    paddingHorizontal: 12,
  },
  option: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    marginRight: 12,
  },
  optionText: {
    fontSize: 18,
    marginHorizontal: 24,
    marginVertical: 8,
    color: dark.white,
  },
});
