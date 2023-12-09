import { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";
import { useWorkflowContext } from "../../contexts/WorkflowContext";

const TimeEntry = ({ data }) => {
  const [time, setTime] = useState(new Date());
  const { trigger, setTrigger } = useWorkflowContext();

  const timeTo24h = (dateTime) => {
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      if (minutes === 0) {
        minutes = "00";
      } else {
        minutes = `0${minutes}`;
      }
    }
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (e, selectedTime) => {
    setTime(selectedTime);
  };

  useEffect(() => {
    const newTime = timeTo24h(time);
    const newParams = {
      ...trigger.params,
      [data.variableName]: newTime,
    };
    const newTrigger = {
      ...trigger,
      params: newParams,
    };
    setTrigger(newTrigger);
  }, [time]);

  return (
    <View style={styles.container}>
      {data?.sectionTitle && (
        <MyText style={styles.sectionTitle}>{data.sectionTitle}</MyText>
      )}
      <View style={styles.timeContainer}>
        <MyText style={styles.timeText}>{data.label}</MyText>
        {Platform.OS === "android" ? (
          <TouchableOpacity
            onPress={() => {
              DateTimePickerAndroid.open({
                value: time,
                mode: "time",
                display: "spinner",
                is24Hour: true,
                onChange: handleTimeChange,
              });
            }}
            style={styles.adroidTimePicker}
          >
            <MyText style={styles.timeText}>{timeTo24h(time)}</MyText>
          </TouchableOpacity>
        ) : (
          <>
            {time && (
              <DateTimePicker
                value={time}
                mode="time"
                display="inline"
                textColor={dark.white}
                themeVariant="dark"
                onChange={handleTimeChange}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default TimeEntry;

const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: dark.secondary,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: dark.white,
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 12,
  },
  timeText: {
    fontSize: 16,
    color: dark.white,
  },
  adroidTimePicker: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: dark.outline,
  },
});
