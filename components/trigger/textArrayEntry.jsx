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

const TextArrayEntry = ({ data }) => {
  const { trigger, setTrigger } = useWorkflowContext();
  const [selected, setSelected] = useState(false);
  const [emailEntries, setEmailEntries] = useState([""]);
  const inputHeight = useRef(new Animated.Value(0)).current;

  const updateTriggerParams = (newEntries) => {
    const emails = newEntries.filter((entry) => entry.trim() !== "");
    setTrigger({
      ...trigger,
      params: {
        ...trigger.params,
        [data.variableName]: emails,
      },
    });
  };

  const handleSelectPress = () => {
    setSelected(!selected);
    if (!selected === false) {
      const newParams = { ...trigger.params };
      delete newParams[data.variableName];
      setTrigger({
        ...trigger,
        params: newParams,
      });
      return;
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
    updateTriggerParams(updatedEntries);
  };

  const handleEmpty = (entries) => {
    if (entries.length === 1 && entries[0] === "") {
      const newParams = { ...trigger.params };
      delete newParams[data.variableName];
      setTrigger({
        ...trigger,
        params: newParams,
      });
      setEmailEntries([""]);
      return true;
    }
    return false;
  };

  const handleRemoveEntry = (index) => {
    const updatedEntries = emailEntries.filter((_, i) => i !== index);
    if (handleEmpty(updatedEntries)) {
      return;
    }
    setEmailEntries(updatedEntries);
    updateTriggerParams(updatedEntries);
  };

  useEffect(() => {
    Animated.timing(inputHeight, {
      toValue: selected ? 48 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [selected, inputHeight]);

  return (
    <View style={styles.container}>
      {data?.sectionTitle && (
        <MyText style={styles.sectionTitle}>{data.sectionTitle}</MyText>
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={handleSelectPress}
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
                    placeholder="Email"
                    placeholderTextColor={dark.outline}
                  />
                  {index < emailEntries.length - 1 && (
                    <TouchableOpacity
                      onPress={() => handleRemoveEntry(index)}
                      style={{ alignSelf: "center" }}
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
    </View>
  );
};

export default TextArrayEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.secondary,
    borderRadius: 10,
    marginVertical: 10,
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