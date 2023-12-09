import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import IconComponent from "../../utils/iconComponent";

const TextEntry = ({ data }) => {
  const { trigger, setTrigger } = useWorkflowContext();

  const handleChange = (text) => {
    if (text === "") {
      const newParams = { ...trigger.params };
      delete newParams[data.variableName];
      setTrigger({
        ...trigger,
        params: newParams,
      });
      return;
    }
    const newParams = {
      ...trigger.params,
      [data.variableName]: text,
    };
    setTrigger({
      ...trigger,
      params: newParams,
    });
  };

  return (
    <View style={styles.container}>
      {data?.sectionTitle && (
        <MyText style={styles.sectionTitle}>{data.sectionTitle}</MyText>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={handleChange}
          value={trigger?.params?.[data.variableName]}
          placeholder={data.placeholder}
          placeholderTextColor={"#969696"}
          multiline={true}
          numberOfLines={4}
        />
      </View>
    </View>
  );
};

export default TextEntry;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: dark.white,
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 12,
  },
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
