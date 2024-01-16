import { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import IconComponent from "../../utils/iconComponent";

const TextEntry = ({
  data,
  object,
  setObject,
  nodeId,
  previousNodeId,
  onFocus,
  editable,
  replacePlaceholders,
}) => {
  const { variables } = useWorkflowContext();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (text) => {
    if (!focused) return;
    const element = data.type === "condition" ? "conditions" : "params";
    let elementData = element === "params" ? {} : [];
    if (text === "") {
      if (element === "params") {
        elementData = { ...object.params };
        delete elementData[data.variableName];
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

  const handleFocus = () => {
    setFocused(true);
    inputRef.current.measure((x, y, width, height, pageX, pageY) => {
      onFocus(previousNodeId, nodeId, pageY, [data.variableName, -1]);
    });
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        onChangeText={handleChange}
        value={
          focused
            ? object?.params?.[data.variableName]
            : replacePlaceholders(object.params[data.variableName])
        }
        placeholder={data.placeholder}
        placeholderTextColor={"#969696"}
        multiline={true}
        numberOfLines={4}
        onFocus={handleFocus}
        onBlur={() => setFocused(false)}
        ref={inputRef}
        editable={editable}
      />
    </View>
  );
};

export default TextEntry;

TextEntry.defaultProps = {
  nodeId: null,
  previousNodeId: null,
  onFocus: () => {},
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    height: "auto",
    paddingHorizontal: 16,
    justifyContent: "center",
    marginVertical: 10,
  },
  input: {
    color: dark.white,
    fontSize: 16,
    fontFamily: "Outfit_500Medium",
  },
});
