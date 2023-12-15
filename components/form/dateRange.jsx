import { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "react-native-ui-datepicker";

import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";

const DateRange = ({ data, object, setObject, nodeId, onFocus }) => {
  const [showModal, setShowModal] = useState(false);
  const [editedValue, setEditedValue] = useState(0);
  const [firstDate, setFirstDate] = useState();
  const [secondDate, setSecondDate] = useState();

  const onChange = (selectedDate) => {
    const currentDate = selectedDate;
    // setShowModal(false);
    if (editedValue === 1) {
      setFirstDate(currentDate);
      setObject({
        ...object,
        params: {
          ...object.params,
          [data.variableNameFirst]: currentDate,
        },
      });
    } else if (editedValue === 2) {
      setSecondDate(currentDate);
      setObject({
        ...object,
        params: {
          ...object.params,
          [data.variableNameSecond]: currentDate,
        },
      });
    }
  };

  const handlePress = (number) => {
    setShowModal(true);
    setEditedValue(number);
  };

  useEffect(() => {
    if (object?.params && object.params[data?.variableNameFirst]) {
      setFirstDate(object.params[data?.variableNameFirst]);
    }
    if (object?.params && object.params[data?.variableNameSecond]) {
      setSecondDate(object.params[data?.variableNameSecond]);
    }
  }, [object]);

  return (
    <View style={styles.inputContainer}>
      <Pressable
        onPress={() => handlePress(1)}
        style={[
          styles.dateInput,
          !object?.params ||
          (object?.params &&
            object.params[data?.variableNameFirst] === undefined)
            ? { backgroundColor: dark.primary }
            : {},
        ]}
      >
        <MyText
          style={[
            styles.text,
            object?.params && object.params[data?.variableNameFirst]
              ? { opacity: 1 }
              : { opacity: 0.5 },
          ]}
        >
          {object?.params?.[data?.variableNameFirst] ?? data.placeholderFirst}
        </MyText>
      </Pressable>
      <View style={styles.middleText}>
        <MyText style={styles.text}>to</MyText>
      </View>
      <Pressable
        onPress={() => handlePress(2)}
        style={[
          styles.dateInput,
          !object?.params ||
          (object?.params &&
            object.params[data?.variableNameSecond] === undefined)
            ? { backgroundColor: dark.primary }
            : {},
        ]}
      >
        <MyText
          style={[
            styles.text,
            object?.params && object.params[data?.variableNameSecond]
              ? { opacity: 1 }
              : { opacity: 0.5 },
          ]}
        >
          {object?.params?.[data?.variableNameSecond] ?? data.placeholderSecond}
        </MyText>
      </Pressable>
      <Modal visible={showModal} transparent={true} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => {
            setShowModal(false), setEditedValue(0);
          }}
        />
        <View style={styles.modalContent}>
          <DateTimePicker
            testID="dateTimePicker"
            value={editedValue === 1 ? firstDate : secondDate}
            mode={"datetime"}
            display="default"
            minimumDate={
              (editedValue === 1 ? firstDate : secondDate) - 1000 * 60 * 60 * 24
            }
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
      </Modal>
    </View>
  );
};

export default DateRange;

DateRange.defaultProps = {
  nodeId: null,
  onFocus: () => {},
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    height: 48,
    padding: 4,
    justifyContent: "center",
    flexDirection: "row",
  },
  dateInput: {
    flex: 3,
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  middleText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: dark.white,
    fontSize: 16,
    fontFamily: "Outfit_500Medium",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    padding: 16,
    paddingBottom: 32,
  },
  pickerStyleType: {
    color: dark.white,
  },
});
