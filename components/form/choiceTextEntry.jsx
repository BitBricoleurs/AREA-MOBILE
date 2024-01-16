import { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";

import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import IconComponent from "../../utils/iconComponent";

const ChoiceTextEntry = ({
  data,
  object,
  setObject,
  nodeId,
  previousNodeId,
  onFocus,
  editable,
  replacePlaceholders,
}) => {
  const [selected, setSelected] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputHeight = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);
  const { variables } = useWorkflowContext();

  const handleSelectPress = () => {
    setSelected(!selected);
    const element = data.type === "condition" ? "conditions" : "params";
    let elementData = element === "params" ? {} : [];
    if (!selected === false) {
      if (element === "params") {
        elementData = { ...object.params };
        delete elementData[data.variableName];
      } else {
        const variableId = variables.find(
          (variable) => variable.name === data.variableName
        ).id;
        elementData = [...object.conditions];
        const index = elementData.findIndex(
          (condition) => condition.key === variableId
        );
        elementData.splice(index, 1);
      }
      setObject({
        ...object,
        [element]: elementData,
      });
    }
  };

  const handleChange = (text) => {
    if (!focused) return;
    let element = data.type === "condition" ? "conditions" : "params";
    let elementData = element === "params" ? {} : [];
    if (text === "") {
      if (element === "params") {
        elementData = { ...object.params };
        elementData[data.variableName];
      } else {
        const variableId = variables.find(
          (variable) => variable.name === data.variableName
        ).id;
        elementData = [...object.conditions];
        const index = elementData.findIndex(
          (condition) => condition.key === variableId
        );
        elementData.splice(index, 1);
      }
    } else {
      if (element === "params") {
        elementData = {
          ...object.params,
          [data.variableName]: text,
        };
      } else {
        const variableId = variables.find(
          (variable) => variable.name === data.variableName
        ).id;
        elementData = [...object.conditions];

        const conditionIndex = elementData.findIndex(
          (condition) => condition.key === variableId
        );

        if (conditionIndex !== -1) {
          elementData[conditionIndex] = {
            ...elementData[conditionIndex],
            value: text,
          };
        } else {
          elementData.push({
            key: variableId,
            type: data.conditionType,
            value: text,
          });
        }
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

  useEffect(() => {
    if (object.params && object.params[data.variableName]) {
      setSelected(true);
    }
  }, [object]);

  useEffect(() => {
    Animated.timing(inputHeight, {
      toValue: selected ? 48 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [selected, inputHeight]);

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
        <View style={{ height: 1, backgroundColor: dark.outline }} />
      )}
      <Animated.View style={{ height: inputHeight }}>
        {selected && (
          <TextInput
            style={[styles.textInput, { height: "100%" }]} // Remove height from textInput style and use it here
            onChangeText={handleChange}
            placeholder={data.placeholder}
            placeholderTextColor={"#969696"}
            onFocus={handleFocus}
            ref={inputRef}
            editable={editable}
            onBlur={() => setFocused(false)}
            value={
              focused
                ? object?.params?.[data.variableName]
                : replacePlaceholders(object.params[data.variableName])
            }
          />
        )}
      </Animated.View>
    </View>
  );
};

export default ChoiceTextEntry;

ChoiceTextEntry.defaultProps = {
  nodeId: null,
  previousNodeId: null,
  onFocus: () => {},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
  },
  inputContainer: {
    justifyContent: "space-between",
    backgroundColor: dark.secondary,
    flex: 1,
    borderRadius: 8,
    paddingLeft: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: dark.white,
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 12,
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
    color: dark.white,
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
