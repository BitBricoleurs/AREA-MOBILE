import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, Animated, Alert } from "react-native";

import { dark, colorMap } from "../../utils/colors";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import IconComponent from "../../utils/iconComponent";
import MyText from "../../utils/myText";

import ActionForm from "../form/actionForm";

const ActionBox = ({ nodeId, previousNodeId, onFocus, nodeOutputId }) => {
  const {
    workflow,
    setWorkflow,
    deleteNode,
    setLastUnfolded,
    editable,
    actions,
  } = useWorkflowContext();
  const [unfold, setUnfold] = useState(false);
  const [actionForm, setActionForm] = useState({});
  const [currentAction, setCurrentAction] = useState({});
  const rotateAnim = useState(new Animated.Value(0))[0];

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const handleLongPress = () => {
    Alert.alert(
      "Delete action",
      "Are you sure you want to delete this action ?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteNode(nodeId, previousNodeId),
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: unfold ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [unfold]);

  const findAction = (serviceName, actionName) => {
    const service = actions.find((s) => s.name === serviceName);
    if (!service) return null;

    return service.actions.find((a) => a.name === actionName);
  };

  console.log("actionForm", actionForm);

  const handleUnfold = () => {
    setUnfold(!unfold);
    if (!unfold) {
      setLastUnfolded(nodeId);
    }
  };

  useEffect(() => {
    const actionElement = workflow.find((node) => node.id === nodeId);
    setCurrentAction(actionElement);

    const action = findAction(actionElement.service, actionElement.action);
    if (action) {
      setActionForm(action);
    }
  }, []);

  useEffect(() => {
    const updateWorkflow = () => {
      const newWorkflow = workflow.map((node) => {
        if (node.id === nodeId && currentAction !== node) {
          return {
            ...currentAction,
          };
        }
        return node;
      });
      setWorkflow(newWorkflow);
    };
    if (currentAction && Object.keys(currentAction).length !== 0) {
      updateWorkflow();
    }
  }, [currentAction]);

  useEffect(() => {
    const actionElement = workflow.find((node) => node.id === nodeId);
    setCurrentAction(actionElement);
  }, [workflow]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorMap[currentAction.service] },
      ]}
    >
      <Pressable
        style={styles.action}
        onPress={() => handleUnfold()}
        onLongPress={() => {
          editable && handleLongPress();
        }}
      >
        <View style={styles.actionServiceIcon}>
          <IconComponent
            name={currentAction?.service}
            style={[
              styles.serviceIcon,
              currentAction.service === "Openai" && { tintColor: "#000000" },
            ]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <MyText style={styles.actionText}>{currentAction?.action}</MyText>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <IconComponent name="chevron-right" style={styles.chevronIcon} />
        </Animated.View>
      </Pressable>
      {unfold && (
        <View style={styles.formContainer}>
          <ActionForm
            actionForm={actionForm}
            currentAction={currentAction}
            setCurrentAction={setCurrentAction}
            previousNodeId={nodeOutputId}
            nodeId={nodeId}
            onFocus={onFocus}
            editable={editable}
          />
        </View>
      )}
    </View>
  );
};

export default ActionBox;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 8,
    padding: 8,
    // marginBottom: 12,
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
  formContainer: {
    // backgroundColor: dark.secondary,
    borderRadius: 8,
    marginTop: 8,
  },
});
