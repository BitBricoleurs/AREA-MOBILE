import { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, View, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";
import { useWorkflowContext } from "../../contexts/WorkflowContext";

const TimeEntry = ({ data, object, setObject, editable }) => {
  const [time, setTime] = useState(() => {
    const hour = new Date();
    return hour;
  });

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
    const newTime = timeTo24h(time);
    const newParams = {
      ...object.params,
      [data.variableName]: newTime,
    };
    const newTrigger = {
      ...object,
      params: newParams,
    };
    setObject(newTrigger);
  };

  useEffect(() => {
    const hour = new Date();
    setTime(hour);
    const time_ = timeTo24h(hour);
    setObject({
      ...object,
      params: {
        ...object.params,
        [data.variableName]: time_,
      },
    });
  }, []);

  return (
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
          disabled={!editable}
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
              disabled={!editable}
            />
          )}
        </>
      )}
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
