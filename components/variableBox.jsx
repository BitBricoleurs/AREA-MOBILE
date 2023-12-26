import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import MyText from "../utils/myText";
import { dark } from "../utils/colors";
import { useWorkflowContext } from "../contexts/WorkflowContext";
import IconComponent from "../utils/iconComponent";

const VariableBox = ({ id, nodeId, onFocus }) => {
  const inputRef = useRef(null);
  const [variable, setVariable] = useState({});
  const { variables, setVariables, deleteVariable } = useWorkflowContext();

  const handleFocus = () => {
    inputRef.current.measure((x, y, width, height, pageX, pageY) => {
      onFocus(nodeId, nodeId, pageY, ["variable", id]);
    });
  };

  const handleChange = (text, param) => {
    setVariable({
      ...variable,
      [param]: text,
    });
    const newVariables = [...variables];
    const index = variables.findIndex((variable) => variable.id === id);
    newVariables[index] = {
      ...variable,
      [param]: text,
    };
    setVariables(newVariables);
  };

  useEffect(() => {
    const variableToDisplay = variables.find((variable) => variable.id === id);
    console.log("'variable'", variableToDisplay);

    setVariable(variableToDisplay ? variableToDisplay : {});
  }, [variables]);

  return (
    <Pressable style={styles.container}>
      <LinearGradient
        colors={["#FFA43E", "#FF3A3A"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradient}
      >
        <View style={styles.config}>
          <MyText style={styles.text}>Set</MyText>
          <TextInput
            editable
            style={styles.input}
            placeholder="value"
            placeholderTextColor={"#969696"}
            onFocus={handleFocus}
            ref={inputRef}
            value={variable?.output}
            // onChangeText={(text) => handleChange(text, "output")}
            autoCapitalize="none"
          />
          <MyText style={styles.text}>as</MyText>
          <TextInput
            style={styles.input}
            placeholder="name"
            placeholderTextColor={"#969696"}
            value={variable?.name}
            onChangeText={(text) => handleChange(text, "name")}
            autoCapitalize="none"
          />
        </View>
        <Pressable
          style={styles.iconContainer}
          onPress={() => deleteVariable(id)}
        >
          <IconComponent name="close" style={styles.icon} />
        </Pressable>
      </LinearGradient>
    </Pressable>
  );
};

export default VariableBox;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 8,
    paddingLeft: 12,
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 8,
    paddingLeft: 12,
    paddingVertical: 4,
  },
  text: {
    color: dark.white,
    fontSize: 16,
    marginRight: 12,
  },
  input: {
    width: "auto",
    height: 30,
    backgroundColor: dark.secondary,
    borderRadius: 8,
    marginRight: 12,
    paddingHorizontal: 10,
    color: dark.white,
    fontSize: 16,
    fontFamily: "Outfit_500Medium",
    marginVertical: 4,
  },
  config: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  iconContainer: {
    width: 36,
    justifyContent: "center",
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: dark.white,
  },
});
