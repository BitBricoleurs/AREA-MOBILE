import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";

import { dark } from "../../utils/colors";
import { useWorkflowContext } from "../../contexts/WorkflowContext";

const Calendar = ({ update }) => {
  const todaysDate = new Date();
  const [date, setDate] = useState(todaysDate.toISOString().split("T")[0]);
  const { trigger, setTrigger } = useWorkflowContext();

  const onChange = (newDate) => {
    setDate(newDate.split(" ")[0]);
  };

  useEffect(() => {
    const newParams = {
      ...trigger.params,
      date: date,
    };
    setTrigger({
      ...trigger,
      params: newParams,
    });
  }, [date, update]);

  return (
    <View style={styles.container}>
      <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode={"date"}
        display="default"
        minimumDate={todaysDate - 1000 * 60 * 60 * 24}
        onValueChange={onChange}
        calendarTextStyle={{
          color: dark.white,
          fontFamily: "Outfit_500Medium",
        }}
        selectedTextStyle={{
          color: dark.white,
          fontFamily: "Outfit_500Medium",
        }}
        weekDaysTextStyle={{
          color: dark.white,
          fontFamily: "Outfit_500Medium",
        }}
        headerButtonStyle={{
          color: dark.primary,
        }}
        headerButtonColor="white"
        headerTextStyle={{
          color: dark.white,
          fontFamily: "Outfit_500Medium",
        }}
        monthContainerStyle={{
          backgroundColor: dark.secondary,
        }}
        yearContainerStyle={{
          backgroundColor: dark.secondary,
        }}
        selectedItemColor={dark.purple}
      />
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: dark.secondary,
    borderRadius: 8,
    padding: 16,
  },
  dateText: {
    color: dark.white,
    fontSize: 16,
  },
});
