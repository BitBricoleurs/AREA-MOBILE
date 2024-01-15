import React, { useEffect, useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";

import MyText from "../../utils/myText";
import { dark, colorMap } from "../../utils/colors";
import IconComponent from "../../utils/iconComponent";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import { useNavigation } from "@react-navigation/native";
import VariableBox from "../variableBox";
import { findUnusedIntID } from "../../utils/uniqueId";

let timer = null;
const TIMEOUT = 250;
const debounce = (onSingle, onDouble) => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
    onDouble();
  } else {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      onSingle();
    }, TIMEOUT);
  }
};

const TriggerHeader = ({ onFocus }) => {
  const [actionVariables, setActionVariables] = useState([]);
  const { trigger, variables, setVariables, editable, workflow, mode } =
    useWorkflowContext();
  const navigation = useNavigation();

  const onSingleTap = () => {
    navigation.navigate("TriggerConfigFromWorkflow", {
      serviceName: trigger?.service,
      triggerName: trigger?.trigger,
      fromWorkflow: true,
      previousPage: "Workflow",
    });
  };

  const onDoubleTap = () => {
    if (!editable) return;
    const newVariable = {
      id: findUnusedIntID(variables),
      output: "",
      name: "",
      refer: 0,
      user_defined: true,
    };
    setVariables([...variables, newVariable]);
  };

  const onPress = () => {
    debounce(onSingleTap, onDoubleTap);
  };

  useEffect(() => {
    const actionVariables = variables.filter(
      (variable) => variable.user_defined === true && variable.refer === 0
    );
    setActionVariables(actionVariables);
  }, [variables]);

  return (
    <>
      <Pressable
        style={[
          styles.trigger,
          { backgroundColor: colorMap[trigger?.service] },
        ]}
        onPress={onPress}
      >
        <View style={styles.triggerServiceIcon}>
          <IconComponent name={trigger?.service} style={styles.serviceIcon} />
        </View>
        <View style={{ flex: 1 }}>
          <MyText style={styles.triggerText}>{trigger?.trigger}</MyText>
        </View>
        <IconComponent name="chevron-right" style={styles.chevronIcon} />
      </Pressable>
      {actionVariables.map((variable) => (
        <View style={{ width: "100%", alignItems: "center" }} key={variable.id}>
          <View
            style={{ height: 8, width: 1, backgroundColor: dark.outline }}
          />
          <VariableBox id={variable.id} nodeId={0} onFocus={onFocus} />
        </View>
      ))}
      {(editable || workflow[0]) && (
        <View
          style={{
            height: 22,
            width: 1,
            backgroundColor: dark.outline,
          }}
        />
      )}
    </>
  );
};

export default TriggerHeader;

const styles = StyleSheet.create({
  trigger: {
    height: 72,
    backgroundColor: "#32A9E7",
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  triggerServiceIcon: {
    width: 48,
    height: 48,
    borderRadius: 100,
    backgroundColor: dark.white,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceIcon: {
    width: 42,
    height: 42,
    resizeMode: "contain",
  },
  triggerText: {
    fontSize: 18,
    color: dark.white,
    marginHorizontal: 16,
  },
  chevronIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    marginHorizontal: 8,
    margin: 12,
  },
});
