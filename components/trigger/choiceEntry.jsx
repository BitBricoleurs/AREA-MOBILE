import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import MyText from "../../utils/myText";
import { dark } from "../../utils/colors";
import IconComponent from "../../utils/iconComponent";
import Weekdays from "./weekdays";
import Calendar from "./calendar";
import { useWorkflowContext } from "../../contexts/WorkflowContext";

const ChoiceEntry = ({ data }) => {
  const { trigger, setTrigger } = useWorkflowContext();
  const [selectedChoice, setSelectedChoice] = useState(1);

  const displayRevealComponent = () => {
    switch (data?.options[selectedChoice]?.reveal) {
      case "Calendar":
        return <Calendar update={selectedChoice} />;
      case "Weekdays":
        return <Weekdays />;
      default:
        return null;
    }
  };

  const handleChoicePress = (index) => {
    let newIndex = index;
    if (data.required === "true" && index === selectedChoice) {
      return;
    } else if (data.required === "multi" && index === selectedChoice) {
      delete trigger.params[data.variableName];
      newIndex = null;
    }
    const variableNames = data.options.map((option) => option.variableName);
    const triggerParams = trigger.params || {};
    const newParams = Object.keys(triggerParams).reduce((acc, key) => {
      if (
        !variableNames.includes(key) ||
        key === data.options[index].variableName
      ) {
        acc[key] = trigger?.params[key];
      }
      return acc;
    }, {});

    if (
      data.required === "true" ||
      (data.required === "multi" && index !== selectedChoice)
    ) {
      if (data.options[index].variableName) {
        newParams[data.options[index].variableName] =
          data.options[index].label.toLowerCase();
      }

      newParams[data.variableName] = data.options[index].label.toLowerCase();
    }
    setTrigger({
      ...trigger,
      params: newParams,
    });

    setSelectedChoice(newIndex);
  };

  useEffect(() => {
    handleChoicePress(0);
  }, []);

  return (
    <>
      <View style={styles.choiceContainer}>
        {data?.options &&
          data?.options?.map((option, index) => {
            return (
              <View key={index} style={{}}>
                {index !== 0 && (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: dark.outline,
                    }}
                  />
                )}
                <TouchableOpacity
                  style={styles.choice}
                  onPress={() => handleChoicePress(index)}
                >
                  <View style={styles.triggerInfo}>
                    <MyText
                      style={[
                        styles.triggerName,
                        index === selectedChoice && { color: dark.purple },
                      ]}
                    >
                      {option?.label}
                    </MyText>
                  </View>
                  {index === selectedChoice && (
                    <IconComponent name="check" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
      </View>
      {displayRevealComponent()}
    </>
  );
};

export default ChoiceEntry;

const styles = StyleSheet.create({
  choiceContainer: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    paddingLeft: 16,
  },
  choice: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
  },
  triggerInfo: {
    flex: 1,
  },
  triggerName: {
    fontSize: 16,
    color: dark.white,
  },
  triggerEg: {
    fontSize: 12,
    color: dark.white,
    opacity: 0.5,
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
