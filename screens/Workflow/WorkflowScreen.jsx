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

import actions from "../../jsons/actions.json";
import triggers from "../../jsons/triggers.json";

import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";
import IconComponent from "../../utils/iconComponent";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import { useAuthContext } from "../../contexts/AuthContext";
import TriggerHeader from "../../components/trigger/triggerHeader";
import { findUnusedIntID } from "../../utils/uniqueId";
import RenderNode from "../../components/renderNode";
import AddActionButton from "../../components/addActionButton";

const WorkflowScreen = ({ navigation, route }) => {
  const { id } = route.params || {};
  const options = ["if", "delay", "variable"];
  const {
    trigger,
    setTrigger,
    workflow,
    setWorkflow,
    variables,
    setVariables,
    lastUnfolded,
    lastNodeId,
    editable,
    setEditable,
    mode,
    setMode,
    parseWorkflow,
  } = useWorkflowContext();
  const { dispatchAPI } = useAuthContext();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [scrollViewOffset, setScrollViewOffset] = useState(0);
  const [focusedNode, setFocusedNode] = useState(null);
  const [focusedParam, setFocusedParam] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [prevOutputs, setPrevOutputs] = useState([]);

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
    variables.forEach((variable) => {
      if (variable.user_defined) {
        outputs.push(variable);
      }
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
    let newVariables = [...variables];
    const variableAlreadyExists = newVariables.find(
      (v) =>
        v.output === variable.output &&
        v.refer === variable.refer &&
        v.user_defined === variable.user_defined
    );
    if (variableAlreadyExists) {
      id = variableAlreadyExists.id;
    } else {
      id = findUnusedIntID(newVariables);
      newVariables = [...newVariables, { ...variable, id: id }];
      setVariables(newVariables);
    }
    if (focusedParam[0] === "variable") {
      let variableToUpdate = variables.find((v) => v.id === focusedParam[1]);
      if (!variableToUpdate) return;
      variableToUpdate = {
        ...variableToUpdate,
        output: variable.output,
        name: variableToUpdate?.name ? variableToUpdate.name : variable.name,
      };
      newVariables = newVariables.map((v) => {
        if (v.id === focusedParam[1]) {
          return variableToUpdate;
        }
        return v;
      });
      setVariables(newVariables);
      return;
    } else if (focusedParam[0] === "key" || focusedParam[0] === "value") {
      const newWorkflow = workflow.map((node) => {
        if (node.id === focusedNode) {
          node[focusedParam[0]] = `${
            node[focusedParam[0]] ? node[focusedParam[0]] : ""
          }\${${id}}`;
          return node;
        }
        return node;
      });
      setWorkflow(newWorkflow);
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
        const ifBlock = {
          id: findUnusedIntID(workflow),
          type: "condition",
          type_condition: "contains",
          next_id_success: -1,
          next_id_failure: -1,
        };
        const newWorkflow = [...workflow];
        if (workflow.length !== 0) {
          const updateIdIndex = newWorkflow.findIndex(
            (node) => node.id === lastNodeId
          );
          newWorkflow[updateIdIndex] = {
            ...newWorkflow[updateIdIndex],
            next_id: ifBlock.id,
          };
        } else {
          setTrigger({
            ...trigger,
            next_id: ifBlock.id,
          });
        }
        setWorkflow([...newWorkflow, ifBlock]);
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
              onPress={async () => {
                if (mode === "create") {
                  navigation.navigate("TriggerConfig", {
                    previousPage: "ChooseTrigger",
                    fromWorkflow: false,
                  });
                } else if (mode === "view") {
                  navigation.goBack();
                } else if (mode === "edit") {
                  setMode("view");
                  setEditable(false);
                  const { data } = await dispatchAPI(
                    "GET",
                    `/get-workflow/${id}`
                  );
                  parseWorkflow(data);
                }
              }}
              style={styles.backButton}
            >
              {mode === "create" || mode === "view" ? (
                <IconComponent
                  name={mode === "create" ? "arrow-left" : "close"}
                  style={styles.arrow}
                />
              ) : (
                <MyText style={{ color: dark.red, fontSize: 16 }}>
                  Cancel
                </MyText>
              )}
            </Pressable>
            <View style={styles.title}>
              <MyText style={styles.titleText}>New workflow</MyText>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 44,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (mode === "create" || mode === "edit") {
                    navigation.navigate("WorkflowConfig");
                  } else {
                    setMode("edit");
                    setEditable(true);
                  }
                }}
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
                  {mode === "create" || mode === "edit" ? "Next" : "Edit"}
                </MyText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.workflowContainer}>
          <TriggerHeader onFocus={handleFocus} />
          {workflow[0] ? (
            <RenderNode
              nodeId={workflow[0].id}
              nodeOutputId={0}
              previousNodeId={0}
              handleFocus={handleFocus}
            />
          ) : (
            <AddActionButton nodeId={0} />
          )}
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
      {editable && (
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
      )}
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
    width: 44,
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
