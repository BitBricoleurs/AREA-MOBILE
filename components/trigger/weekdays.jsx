import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";

import MyText from "../../utils/myText";
import { dark } from "../../utils/colors";
import { useWorkflowContext } from "../../contexts/WorkflowContext";

const Weekdays = () => {
  const [selectedDays, setSelectedDays] = useState([1]);
  const { trigger, setTrigger } = useWorkflowContext();
  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

  const handlePress = (index) => {
    if (selectedDays.includes(index)) {
      if (selectedDays.length === 1) {
        return;
      }
      setSelectedDays(selectedDays.filter((day) => day !== index));
    } else {
      setSelectedDays([...selectedDays, index]);
    }
  };

  useEffect(() => {
    const newParams = {
      ...trigger.params,
      weekdays: selectedDays,
    };
    setTrigger({
      ...trigger,
      params: newParams,
    });
  }, [selectedDays]);

  return (
    <View style={styles.weekdaysContainer}>
      {weekdays.map((weekday, index) => {
        return (
          <Pressable
            key={index}
            style={[
              styles.weekday,
              selectedDays.includes(index) && { backgroundColor: dark.purple },
            ]}
            onPress={() => handlePress(index)}
          >
            <MyText style={styles.weekdayText}>{weekday}</MyText>
          </Pressable>
        );
      })}
    </View>
  );
};

export default Weekdays;

const styles = StyleSheet.create({
  weekdaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    backgroundColor: dark.secondary,
    padding: 16,
    borderRadius: 8,
  },
  weekday: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: dark.outline,
    alignItems: "center",
    justifyContent: "center",
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: dark.text,
  },
});
