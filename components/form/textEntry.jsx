import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import IconComponent from "../../utils/iconComponent";

const TextEntry = ({ data, object, setObject }) => {
  const { variables } = useWorkflowContext();

  const handleChange = (text) => {
    const element = data.type === "parameter" ? "params" : "conditions";
    let elementData = data.type === "parameter" ? {} : [];
    if (text === "") {
      if (element === "params") {
        elementData = { ...object.params };
        elementData[data.variableName];
      } else {
        const variableId = variables.find(
          (variable) => variable.name === data.variableName
        )?.id;
        if (variableId === undefined) {
          console.warn("No corresponding variableId");
          return;
        }
        elementData = [...object.conditions];
        const index = elementData.findIndex(
          (condition) => condition.key === variableId
        );
        elementData.splice(index, 1);
      }
    } else {
      if (element === "params") {
        elementData = { ...object.params, [data.variableName]: text };
      } else {
        const variableId = variables.find(
          (variable) => variable.name === data.variableName
        )?.id;
        if (variableId === undefined) {
          console.warn("No corresponding variableId");
          return;
        }
        elementData = [...object.conditions];
        const index = elementData.findIndex(
          (condition) => condition.key === variableId
        );
        elementData[index] = {
          ...elementData[index],
          value: text,
        };
      }
    }
    setObject({
      ...object,
      [element]: elementData,
    });
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        onChangeText={handleChange}
        value={object?.params?.[data.variableName]}
        placeholder={data.placeholder}
        placeholderTextColor={"#969696"}
        multiline={true}
        numberOfLines={4}
      />
    </View>
  );
};

export default TextEntry;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
  },
  input: {
    color: dark.white,
    fontSize: 16,
    fontFamily: "Outfit_500Medium",
  },
});
