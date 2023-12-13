import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Pressable, Animated } from "react-native";

import actions from "../../jsons/actions";
import { dark, colorMap } from "../../utils/colors";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import IconComponent from "../../utils/iconComponent";
import MyText from "../../utils/myText";

import TimeEntry from "../form/timeEntry";
import ChoiceEntry from "../form/choiceEntry";
import ChoiceTextEntry from "../form/choiceTextEntry";
import TextArrayEntry from "../form/textArrayEntry";
import TextEntry from "../form/textEntry";

const ActionBox = ({ nodeId }) => {
  console.log(nodeId);
  const { workflow, setWorkflow } = useWorkflowContext();
  const [unfold, setUnfold] = useState(false);
  const [actionForm, setActionForm] = useState({});
  const [currentAction, setCurrentAction] = useState({});
  const contentRef = useRef();
  const rotateAnim = useState(new Animated.Value(0))[0];

  const sectionDispatch = (section, index) => {
    console.log("sectionDispatch", section);
    switch (section.name) {
      case "timeEntry":
        return (
          <TimeEntry
            data={section}
            key={index}
            object={currentAction}
            setObject={setCurrentAction}
          />
        );
      case "choice":
        return (
          <ChoiceEntry
            data={section}
            key={index}
            object={currentAction}
            setObject={setCurrentAction}
          />
        );
      case "choiceTextEntry":
        return (
          <ChoiceTextEntry
            data={section}
            key={index}
            object={currentAction}
            setObject={setCurrentAction}
          />
        );
      case "textArrayEntry":
        return (
          <TextArrayEntry
            data={section}
            key={index}
            object={currentAction}
            setObject={setCurrentAction}
          />
        );
      case "basicTextEntry":
        return (
          <TextEntry
            data={section}
            key={index}
            object={currentAction}
            setObject={setCurrentAction}
          />
        );
      default:
        return null;
    }
  };

  const renderSections = (sections) => {
    return (
      <>
        {sections
          ? sections.map((section, index) => (
              <View
                key={index}
                style={[
                  {
                    flex: 1,
                    backgroundColor: dark.secondary,
                    borderRadius: 8,
                  },
                  index !== sections.length - 1 && { marginBottom: 8 },
                ]}
              >
                {section?.block &&
                  section.block.map((field, fieldIndex) => {
                    return (
                      <>
                        {fieldIndex !== 0 && (
                          <View
                            style={{ height: 1, backgroundColor: dark.outline }}
                          />
                        )}
                        {sectionDispatch(field, fieldIndex)}
                      </>
                    );
                  })}
              </View>
            ))
          : null}
      </>
    );
  };

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
      <Pressable style={styles.trigger} onPress={() => setUnfold(!unfold)}>
        <View style={styles.triggerServiceIcon}>
          <IconComponent
            name={currentAction?.service}
            style={styles.serviceIcon}
          />
        </View>
        <View style={{ flex: 1 }}>
          <MyText style={styles.triggerText}>{currentAction?.action}</MyText>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <IconComponent name="chevron-right" style={styles.chevronIcon} />
        </Animated.View>
      </Pressable>
      {unfold && (
        <View ref={contentRef} style={styles.formContainer}>
          {renderSections(actionForm?.sections)}
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
  },
  trigger: {
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  triggerServiceIcon: {
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
  formContainer: {
    // backgroundColor: dark.secondary,
    borderRadius: 8,
    marginTop: 8,
  },
});
