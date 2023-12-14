import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Animated,
  Modal,
  TouchableOpacity,
  Platform,
  Keyboard,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

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

const ActionBox = ({ nodeId, previousNodeId, onFocus }) => {
  console.log(nodeId);
  const { workflow, setWorkflow } = useWorkflowContext();
  const [unfold, setUnfold] = useState(false);
  const [actionForm, setActionForm] = useState({});
  const [currentOption, setCurrentOption] = useState(0);
  const [currentAction, setCurrentAction] = useState({});
  const [showModal, setShowModal] = useState(false);
  const pickerRef = useRef();
  const rotateAnim = useState(new Animated.Value(0))[0];

  const sectionDispatch = (section, index) => {
    // console.log("sectionDispatch", section);
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
            nodeId={previousNodeId}
            onFocus={onFocus}
          />
        );
      case "textArrayEntry":
        return (
          <TextArrayEntry
            data={section}
            key={index}
            object={currentAction}
            setObject={setCurrentAction}
            nodeId={previousNodeId}
            onFocus={onFocus}
          />
        );
      case "basicTextEntry":
        return (
          <TextEntry
            data={section}
            key={index}
            object={currentAction}
            setObject={setCurrentAction}
            nodeId={previousNodeId}
            onFocus={onFocus}
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
                      <View key={fieldIndex}>
                        {fieldIndex !== 0 && (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: dark.outline,
                              marginLeft: 16,
                            }}
                          />
                        )}
                        {sectionDispatch(field, fieldIndex)}
                      </View>
                    );
                  })}
              </View>
            ))
          : null}
      </>
    );
  };

  const renderForm = () => {
    return (
      <>
        {actionForm.options && (
          <>
            <Pressable
              style={styles.optionSelectButton}
              onPress={() => {
                setShowModal(true);
                // Platform.OS === "android" && pickerRef.current.focus();
              }}
            >
              <MyText style={styles.optionText}>
                {actionForm.options[currentOption].name}
              </MyText>
            </Pressable>
            <Modal visible={showModal} transparent={true} animationType="slide">
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setShowModal(false)}
              />
              <View style={[styles.modalContent, { paddingTop: 8 }]}>
                {Platform.OS === "ios" ? (
                  <Picker
                    ref={pickerRef}
                    selectedValue={currentOption}
                    onValueChange={(itemValue, itemIndex) => {
                      setCurrentOption(itemValue);
                      setShowModal(false);
                    }}
                    style={styles.picker}
                    itemStyle={styles.pickerStyleType}
                  >
                    {actionForm.options.map((option, index) => (
                      <Picker.Item
                        label={option.name}
                        value={index}
                        key={index}
                      />
                    ))}
                  </Picker>
                ) : (
                  <>
                    {actionForm.options.map((option, index) => (
                      <>
                        <TouchableOpacity
                          key={index}
                          style={styles.optionSelectButton}
                          onPress={() => {
                            setCurrentOption(index);
                            setShowModal(false);
                          }}
                        >
                          <MyText style={styles.optionText}>
                            {option.name}
                          </MyText>
                        </TouchableOpacity>
                        {index !== actionForm.options.length - 1 && (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: dark.outline,
                              marginLeft: 16,
                            }}
                          />
                        )}
                      </>
                    ))}
                  </>
                )}
              </View>
            </Modal>
          </>
        )}
        {actionForm.sections && renderSections(actionForm.sections)}
        {actionForm.options &&
          renderSections(actionForm.options[currentOption].sections)}
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
      {unfold && <View style={styles.formContainer}>{renderForm()}</View>}
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
  optionSelectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 48,
    backgroundColor: dark.secondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 22,
    color: dark.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)", // This adds a semi-transparent overlay
  },
  modalContent: {
    backgroundColor: dark.secondary, // Replace 'dark.white' with your theme's white color
    borderRadius: 8,
    paddingBottom: 8,
  },
  pickerStyleType: {
    color: dark.white,
  },
});
