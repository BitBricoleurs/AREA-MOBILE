import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";

const ChoicePicker = ({ data, object, setObject, editable }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentOption, setCurrentOption] = useState(0);

  console.log(data);

  const handlePickerChange = (itemValue) => {
    index = data.options.findIndex((option) => option.value === itemValue);
    setCurrentOption(index);
    setShowModal(false);
    setObject({
      ...object,
      params: {
        ...object.params,
        [data.variableName]: itemValue,
      },
    });
  };

  useEffect(() => {
    if (!data?.options) return;

    if (object.params && object.params[data.variableName]) {
      const findCurrentOption = data?.options?.findIndex(
        (option) => option.value === object.params[data.variableName]
      );
      setCurrentOption(findCurrentOption);
    } else {
      setObject({
        ...object,
        params: {
          ...object.params,
          [data.variableName]: data.options[0].value,
        },
      });
    }
  }, []);

  return (
    <>
      <Pressable style={styles.container} onPress={() => setShowModal(true)}>
        <MyText style={styles.label}>
          {data.options[currentOption].name || ""}
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
              selectedValue={currentOption}
              onValueChange={(itemValue, itemIndex) => {
                handlePickerChange(itemValue);
              }}
              style={styles.picker}
              itemStyle={styles.pickerStyleType}
            >
              {data.options.map((option, index) => (
                <Picker.Item
                  label={option.name}
                  value={option.value}
                  key={index}
                />
              ))}
            </Picker>
          ) : (
            <>
              {data.options.map((option, index) => (
                <>
                  <TouchableOpacity
                    key={index}
                    style={styles.optionSelectButton}
                    onPress={() => {
                      handlePickerChange(option.value);
                      setShowModal(false);
                    }}
                  >
                    <MyText style={styles.optionText}>{option.name}</MyText>
                  </TouchableOpacity>
                  {index !== data.options.length - 1 && (
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
  );
};

export default ChoicePicker;

const styles = StyleSheet.create({
  container: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    height: "auto",
    paddingHorizontal: 16,
    justifyContent: "center",
    marginVertical: 10,
  },
  label: {
    color: dark.white,
    fontSize: 16,
    paddingVertical: 4,
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
