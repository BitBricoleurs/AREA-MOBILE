import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "react-native-ui-datepicker";

import MyText from "../../utils/myText";
import { dark } from "../../utils/colors";
import IconComponent from "../../utils/iconComponent";
import Weekdays from "./weekdays";
import Calendar from "./calendar";
import { useWorkflowContext } from "../../contexts/WorkflowContext";

const ChoiceEntry = ({ data }) => {
  const { trigger, setTrigger } = useWorkflowContext();
  const [selectedChoice, setSelectedChoice] = useState(0);

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
    if (index === selectedChoice) {
      return;
    }
    const variableNames = data.options.map((option) => option.variableName);

    const newParams = Object.keys(trigger.params).reduce((acc, key) => {
      if (
        !variableNames.includes(key) ||
        key === data.options[index].variableName
      ) {
        acc[key] = trigger.params[key];
      }
      return acc;
    }, {});

    if (data.options[index].variableName) {
      newParams[data.options[index].variableName] =
        data.options[index].label.toLowerCase();
    }

    newParams[data.variableName] = data.options[index].label.toLowerCase();

    setTrigger({
      ...trigger,
      params: newParams,
    });

    setSelectedChoice(index);
  };

  useEffect(() => {
    handleChoicePress(0);
  }, []);

  return (
    <View style={styles.container}>
      {data?.sectionTitle && (
        <MyText style={styles.sectionTitle}>{data.sectionTitle}</MyText>
      )}
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
    </View>
  );
};

export default ChoiceEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
  },
  sectionTitle: {
    fontSize: 16,
    color: dark.white,
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 12,
  },
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
    width: 18,
    height: 18,
    resizeMode: "contain",
    marginHorizontal: 8,
    margin: 12,
    tintColor: dark.purple,
  },
});
