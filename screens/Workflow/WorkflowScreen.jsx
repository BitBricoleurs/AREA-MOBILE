import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  Pressable,
  StatusBar,
  Keyboard,
  Animated,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import actions from "../../jsons/actions.json";
import triggers from "../../jsons/triggers.json";

import { dark, colorMap } from "../../utils/colors";
import MyText from "../../utils/myText";
import IconComponent from "../../utils/iconComponent";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import ActionSection from "../../components/actions/actionSection";
import TriggerHeader from "../../components/trigger/triggerHeader";
import { findUnusedIntID } from "../../utils/uniqueId";

const WorkflowScreen = ({ navigation }) => {
  const options = ["if", "delay", "variable"];
  const {
    trigger,
    workflow,
    setWorkflow,
    variables,
    setVariables,
    lastUnfolded,
    lastNodeId,
  } = useWorkflowContext();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [scrollViewOffset, setScrollViewOffset] = useState(0);
  const [focusedNode, setFocusedNode] = useState(null);
  const [focusedParam, setFocusedParam] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [prevOutputs, setPrevOutputs] = useState([]);

  const nodeDispatch = (node, previousNodeId) => {
    switch (node.type) {
      case "action":
        return (
          <ActionSection
            nodeId={node.id}
            previousNodeId={previousNodeId}
            onFocus={handleFocus}
          />
        );
      case "condition":
        return <View style={{ flex: 1 }} />;
      case "delay":
        return <View style={{ flex: 1 }} />;
      default:
        return null;
    }
  };

  const renderNode = (nodeId, prevNodeId) => {
    const node = workflow.find((n) => n.id === nodeId);
    if (!node) return null;

    return (
      <View
        key={node.id}
        style={{ flex: 1, width: "100%", alignItems: "center" }}
      >
        {nodeDispatch(node, prevNodeId)}
        {node.next_id > 0 && (
          <>
            <View
              style={{ height: 12, width: 1, backgroundColor: dark.outline }}
            />
            {renderNode(node.next_id, node.id)}
          </>
        )}
      </View>
    );
  };

  const handleScroll = (event) => {
    setScrollViewOffset(event.nativeEvent.contentOffset.y);
  };

  const getNodeOutputs = (previousNodeId) => {
    if (previousNodeId === null || previousNodeId === undefined) return;
    let elementToFind = [];
    let actionName = "";
    let serviceName = "";
    let service = {};
    if (previousNodeId === 0) {
      actionName = trigger.trigger;
      serviceName = trigger.service;
      service = triggers.find((s) => s.name === serviceName);
      if (!service) return null;
      elementToFind = service.triggers.find((a) => a.name === actionName);
    } else {
      const node = workflow.find((n) => n.id === previousNodeId);
      if (!node) return null;
      actionName = node.action;
      serviceName = node.service;
      service = actions.find((s) => s.name === serviceName);
      if (!service) return null;
      elementToFind = service.actions.find((a) => a.name === actionName);
    }
    if (!elementToFind || !elementToFind?.outputs) return null;
    let outputs = [];
    elementToFind.outputs.forEach((output) => {
      outputs.push({
        name: output.variableName,
        output: output.variableName,
        refer: previousNodeId,
        user_defined: false,
      });
    });
    setPrevOutputs(outputs);
  };

  const handleFocus = (previousNodeId, nodeId, offset, param) => {
    setFocusedParam(param);
    setFocusedNode(nodeId);
    getNodeOutputs(previousNodeId);
    if (offset === null || offset === undefined) return;
    const adjustedPageY = offset + scrollViewOffset - 300;
    scrollViewRef.current.scrollTo({
      x: 0,
      y: adjustedPageY,
      animated: true,
    });
  };

  const handleVariablePress = (variable) => {
    let id = null;
    const variableAlreadyExists = variables.find(
      (v) =>
        v.output === variable.output &&
        v.refer === variable.refer &&
        v.user_defined === variable.user_defined
    );
    if (variableAlreadyExists) {
      id = variableAlreadyExists.id;
    } else {
      id = findUnusedIntID(variables);
      const newVariables = [...variables, { ...variable, id: id }];
      setVariables(newVariables);
    }
    if (focusedParam[0] === "variable") {
      console.log("variable");
      let variableToUpdate = variables.find((v) => v.id === focusedParam[1]);
      if (!variableToUpdate) return;
      variableToUpdate = {
        ...variableToUpdate,
        output: variable.output,
        name: variableToUpdate?.name ? variableToUpdate.name : variable.name,
      };
      const newVariables = variables.map((v) => {
        if (v.id === focusedParam[1]) {
          return variableToUpdate;
        }
        return v;
      });
      setVariables(newVariables);
      return;
    }
    const newWorkflow = workflow.map((node) => {
      if (node.id === focusedNode) {
        const newParams = { ...node.params };
        if (focusedParam[1] === -1) {
          newParams[focusedParam[0]] = `${
            newParams[focusedParam[0]] ? newParams[focusedParam[0]] : ""
          }\${${id}}`;
        } else {
          if (!newParams[focusedParam[0]]) {
            newParams[focusedParam[0]] = [];
          }
          newParams[focusedParam[0]][focusedParam[1]] = `${
            newParams[focusedParam[0]][focusedParam[1]]
              ? newParams[focusedParam[0]][focusedParam[1]]
              : ""
          }\${${id}}`;
        }
        return {
          ...node,
          params: newParams,
        };
      }
      return node;
    });
    console.log("newWorkflow", newWorkflow);
    setWorkflow(newWorkflow);
  };

  const handleOptionPress = (option) => {
    switch (option) {
      case "if":
        console.log("if");
        break;
      case "delay":
        console.log("delay");
        break;
      case "variable":
        const newVariable = {
          id: findUnusedIntID(variables),
          output: "",
          name: "",
          refer: lastUnfolded || lastNodeId,
          user_defined: true,
        };
        setVariables([...variables, newVariable]);
        break;
      default:
        break;
    }
  };

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setKeyboardHeight(0));
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        fadeIn();
      }
    );

    const keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        fadeIn();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        fadeOut();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        fadeOut();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 60 + keyboardHeight }}
        stickyHeaderIndices={[0]}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={10}
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
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("WorkflowConfig")}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                disabled={!workflow[0]}
              >
                <MyText
                  style={[
                    { color: dark.white, fontSize: 18 },
                    !workflow[0] && { opacity: 0.4 },
                  ]}
                >
                  Next
                </MyText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.workflowContainer}>
          <TriggerHeader onFocus={handleFocus} />
          {workflow[0] ? renderNode(workflow[0].id, 0) : null}
          <View
            style={{ height: 22, width: 1, backgroundColor: dark.outline }}
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
      {keyboardHeight > 0 && (
        <Animated.View
          style={[
            styles.outputChoiceView,
            {
              bottom: keyboardHeight,
              opacity: opacity,
            },
          ]}
        >
          <ScrollView
            style={styles.optionsScrollView}
            horizontal={true}
            contentContainerStyle={{
              justifyContent: "center",
              flexGrow: 1,
              paddingRight: prevOutputs.length > 3 ? 24 : 0,
            }}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            {prevOutputs &&
              prevOutputs.map((output, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.option,
                    index !== prevOutputs.length - 1 && { marginRight: 12 },
                  ]}
                  onPress={() => handleVariablePress(output)}
                >
                  <MyText style={styles.optionText}>{output.name}</MyText>
                </Pressable>
              ))}
          </ScrollView>
        </Animated.View>
      )}
      <View style={styles.options}>
        <ScrollView
          style={styles.optionsScrollView}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "center",
            flexGrow: 1,
            paddingRight: options.length > 3 ? 24 : 0,
          }}
        >
          {options.map((option, index) => (
            <Pressable
              key={index}
              style={[
                styles.option,
                index !== options.length - 1 && { marginRight: 12 },
              ]}
              onPress={() => handleOptionPress(option)}
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
    paddingHorizontal: 20,
    alignItems: "center",
  },
  serviceIcon: {
    width: 42,
    height: 42,
    resizeMode: "contain",
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

  outputChoiceView: {
    width: "100%",
    position: "absolute",
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: dark.primary,
  },
  options: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: dark.primary,
    paddingBottom: 24,
  },
  optionsScrollView: {
    paddingHorizontal: 12,
  },
  option: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 18,
    marginHorizontal: 24,
    marginVertical: 8,
    color: dark.white,
  },
});
