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

const ChoiceTextEntry = ({ data }) => {
  const { trigger, setTrigger } = useWorkflowContext();
  const [selected, setSelected] = useState(false);
  const inputHeight = useRef(new Animated.Value(0)).current;

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
          <View style={{ height: 1, backgroundColor: dark.outline }} />
        )}
        <Animated.View style={{ height: inputHeight }}>
          {selected && (
            <TextInput
              style={[styles.textInput, { height: "100%" }]} // Remove height from textInput style and use it here
              onChangeText={handleChange}
              placeholder={data.placeholder}
              placeholderTextColor={"#969696"}
            />
          )}
        </Animated.View>
      </View>
    </View>
  );
};

export default ChoiceTextEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 6,
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
