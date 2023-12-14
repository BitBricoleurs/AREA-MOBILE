import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import MyText from "../../utils/myText";
import { dark } from "../../utils/colors";
import IconComponent from "../../utils/iconComponent";
import Weekdays from "./weekdays";
import Calendar from "./calendar";
import { useWorkflowContext } from "../../contexts/WorkflowContext";

const ChoiceEntry = ({ data, object, setObject }) => {
  const [selectedChoice, setSelectedChoice] = useState(1);

  const displayRevealComponent = () => {
    switch (data?.options[selectedChoice]?.reveal) {
      case "Calendar":
        return (
          <Calendar
            update={selectedChoice}
            object={object}
            setObject={setObject}
          />
        );
      case "Weekdays":
        return <Weekdays object={object} setObject={setObject} />;
      default:
        return null;
    }
  };

  const handleChoicePress = (index) => {
    let newIndex = index;
    if (data.required === "true" && index === selectedChoice) {
      return;
    } else if (data.required === "multi" && index === selectedChoice) {
      delete object.params[data.variableName];
      newIndex = null;
    }
    const variableNames = data.options.map((option) => option.variableName);
    const objectParams = object.params || {};

    const newParams = Object.keys(objectParams).reduce((acc, key) => {
      if (
        !variableNames.includes(key) ||
        key === data.options[index].variableName
      ) {
        acc[key] = object?.params[key];
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
    setObject({
      ...object,
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
                  <View style={styles.objectInfo}>
                    <MyText
                      style={[
                        styles.objectName,
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
  objectInfo: {
    flex: 1,
  },
  objectName: {
    fontSize: 16,
    color: dark.white,
  },
  objectEg: {
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
