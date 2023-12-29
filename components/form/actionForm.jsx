import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Modal,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";

import TimeEntry from "./timeEntry";
import ChoiceEntry from "./choiceEntry";
import ChoiceTextEntry from "./choiceTextEntry";
import TextArrayEntry from "./textArrayEntry";
import TextEntry from "./textEntry";
import DateRange from "./dateRange";

const ActionForm = ({
  actionForm,
  currentAction,
  setCurrentAction,
  nodeId,
  previousNodeId,
  onFocus,
  editable,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [currentOption, setCurrentOption] = useState(0);
  const pickerRef = useRef();

  const handlePickerChange = (itemValue) => {
    setCurrentOption(itemValue);
    setShowModal(false);
    setCurrentAction({
      ...currentAction,
      params: {
        option: actionForm.options[itemValue].name.toLowerCase(),
      },
    });
  };

  useEffect(() => {
    if (!actionForm?.options) return;

    if (currentAction.params && currentAction.params.option) {
      const findCurrentOption = actionForm?.options?.findIndex(
        (option) => option.name.toLowerCase() === currentAction.params.option
      );
      setCurrentOption(findCurrentOption);
    } else {
      setCurrentAction({
        ...currentAction,
        params: {
          ...currentAction.params,
          option: actionForm.options[0].name.toLowerCase(),
        },
      });
    }
  }, [actionForm, currentAction]);

  const sectionDispatch = (section, index) => {
    switch (section.name) {
      case "timeEntry":
        return (
          <TimeEntry
            data={section}
            key={index}
            object={currentAction}
            setObject={setCurrentAction}
            editable={editable}
          />
        );
      case "choice":
        return (
          <ChoiceEntry
            data={section}
            key={index}
            object={currentAction}
            setObject={setCurrentAction}
            editable={editable}
          />
        );
      case "choiceTextEntry":
        return (
          <ChoiceTextEntry
            data={section}
            key={index}
            object={currentAction}
            setObject={setCurrentAction}
            previousNodeId={previousNodeId}
            nodeId={nodeId}
            onFocus={onFocus}
            editable={editable}
          />
        );
      case "textArrayEntry":
        return (
          <TextArrayEntry
            data={section}
            key={index}
            object={currentAction}
            setObject={setCurrentAction}
            previousNodeId={previousNodeId}
            nodeId={nodeId}
            onFocus={onFocus}
            editable={editable}
          />
        );
      case "basicTextEntry":
        return (
          <TextEntry
            data={section}
            key={index}
            object={currentAction}
            setObject={setCurrentAction}
            previousNodeId={previousNodeId}
            nodeId={nodeId}
            onFocus={onFocus}
            editable={editable}
          />
        );
      case "dateRange":
        return (
          <DateRange
            data={section}
            key={index}
            object={currentAction}
            setObject={setCurrentAction}
            editable={editable}
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

  return (
    <>
      {actionForm.options && (
        <>
          <Pressable
            style={styles.optionSelectButton}
            onPress={() => {
              setShowModal(true);
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
                    handlePickerChange(itemValue);
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
                        <MyText style={styles.optionText}>{option.name}</MyText>
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

export default ActionForm;

const styles = StyleSheet.create({
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
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  modalContent: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    paddingBottom: 8,
  },
  pickerStyleType: {
    color: dark.white,
  },
});
