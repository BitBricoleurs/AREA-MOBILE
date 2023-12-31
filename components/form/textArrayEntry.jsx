import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import IconComponent from "../../utils/iconComponent";

const TextArrayEntry = ({
  data,
  object,
  setObject,
  nodeId,
  previousNodeId,
  onFocus,
  editable,
}) => {
  const [selected, setSelected] = useState(false);
  const [emailEntries, setEmailEntries] = useState([""]);
  const inputRefs = useRef([]);
  const { variables } = useWorkflowContext();

  const updateObjectParams = (newEntries) => {
    setObject({
      ...object,
      params: {
        ...object.params,
        [data.variableName]: newEntries,
      },
    });
  };

  const handleSelectPress = () => {
    setSelected(!selected);
    const element = data.type === "condition" ? "conditions" : "params";

    if (!selected === false) {
      let newElementData;
      if (element === "params") {
        newElementData = { ...object.params };
        delete newElementData[data.variableName];
      } else {
        const variableId = variables.find(
          (variable) => variable.name === data.variableName
        ).id;
        newElementData = object.conditions.filter(
          (condition) => condition.key !== variableId
        );
      }
      setObject({
        ...object,
        [element]: newElementData,
      });
    }
  };

  const handleChange = (text, index) => {
    const updatedEntries = [...emailEntries];
    updatedEntries[index] = text;

    if (index === emailEntries.length - 1 && text.trim() !== "") {
      updatedEntries.push("");
    }
    if (text === "") {
      updatedEntries.splice(index, 1);
    }
    if (handleEmpty(updatedEntries)) {
      return;
    }
    setEmailEntries(updatedEntries);
    updateObjectParams(updatedEntries);
  };

  const handleEmpty = (entries) => {
    if ((entries.length === 1 && entries[0] === "") || entries.length === 0) {
      const newParams = { ...object.params };
      delete newParams[data.variableName];
      setObject({
        ...object,
        params: newParams,
      });
      setEmailEntries([""]);
      return true;
    }
    return false;
  };

  const handleFocus = (index) => {
    const currentInput = inputRefs.current[index].current;
    currentInput.measure((x, y, width, height, pageX, pageY) => {
      onFocus(previousNodeId, nodeId, pageY, [data.variableName, index]);
    });
  };

  const handleRemoveEntry = (index) => {
    const updatedEntries = emailEntries.filter((_, i) => i !== index);
    if (handleEmpty(updatedEntries)) {
      return;
    }
    setEmailEntries(updatedEntries);
    updateObjectParams(updatedEntries);
  };

  useEffect(() => {
    inputRefs.current = emailEntries.map(
      (_, i) => inputRefs.current[i] || React.createRef()
    );
  }, [emailEntries]);

  useEffect(() => {
    if (object.params && object.params[data.variableName]) {
      setEmailEntries(object.params[data.variableName]);
    }
  }, [object.params]);

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={handleSelectPress}
        disabled={!editable}
      >
        <MyText style={styles.text}>{data.label}</MyText>
        {selected && <IconComponent name="check" style={styles.checkIcon} />}
      </TouchableOpacity>
      {selected && (
        <>
          <View style={{ height: 1, backgroundColor: dark.outline }} />
          {emailEntries.map((entry, index) => (
            <View key={index} style={styles.inputRow}>
              <View style={styles.inputLine}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => handleChange(text, index)}
                  value={entry}
                  placeholder={data.placeholder}
                  placeholderTextColor={dark.outline}
                  onFocus={() => handleFocus(index)}
                  ref={inputRefs.current[index]}
                  editable={editable}
                />
                {index < emailEntries.length - 1 && (
                  <TouchableOpacity
                    onPress={() => handleRemoveEntry(index)}
                    style={{ alignSelf: "center" }}
                    disabled={!editable}
                  >
                    <IconComponent
                      name="minus"
                      style={[styles.checkIcon, { tintColor: dark.white }]}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {index !== emailEntries.length - 1 && (
                <View style={{ height: 1, backgroundColor: dark.outline }} />
              )}
            </View>
          ))}
        </>
      )}
    </View>
  );
};

export default TextArrayEntry;

TextArrayEntry.defaultProps = {
  nodeId: null,
  previousNodeId: null,
  onFocus: () => {},
};

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: "space-between",
    backgroundColor: dark.secondary,
    flex: 1,
    borderRadius: 8,
    paddingLeft: 16,
  },
  selectButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 48,
  },
  text: {
    color: dark.white,
    fontSize: 16,
    fontFamily: "Outfit_500Medium",
  },
  textInput: {
    fontFamily: "Outfit_500Medium",
    height: 48,
    flex: 1,
    color: dark.white,
  },
  inputRow: {
    marginLeft: 8,
  },
  inputLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 48,
  },
  checkIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginHorizontal: 8,
    margin: 12,
    tintColor: dark.purple,
  },
});
