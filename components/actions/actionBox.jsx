import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, Animated } from "react-native";

import actions from "../../jsons/actions";
import { dark, colorMap } from "../../utils/colors";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import IconComponent from "../../utils/iconComponent";
import MyText from "../../utils/myText";

import ActionForm from "../form/actionForm";

const ActionBox = ({ nodeId, previousNodeId, onFocus }) => {
  const { workflow, setWorkflow } = useWorkflowContext();
  const [unfold, setUnfold] = useState(false);
  const [actionForm, setActionForm] = useState({});
  const [currentAction, setCurrentAction] = useState({});
  const rotateAnim = useState(new Animated.Value(0))[0];

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: unfold ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [unfold]);

  useEffect(() => {
    const findAction = (serviceName, actionName) => {
      const service = actions.find((s) => s.name === serviceName);
      if (!service) return null;

      return service.actions.find((a) => a.name === actionName);
    };

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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorMap[currentAction.service] },
      ]}
    >
      <Pressable style={styles.action} onPress={() => setUnfold(!unfold)}>
        <View style={styles.actionServiceIcon}>
          <IconComponent
            name={currentAction?.service}
            style={styles.serviceIcon}
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
            previousNodeId={previousNodeId}
            onFocus={onFocus}
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
    marginBottom: 12,
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
