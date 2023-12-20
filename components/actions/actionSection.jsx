import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { useWorkflowContext } from "../../contexts/WorkflowContext";
import { dark } from "../../utils/colors";

import VariableBox from "../variableBox";
import ActionBox from "./actionBox";

const ActionSection = ({ nodeId, previousNodeId, onFocus }) => {
  const [actionVariables, setActionVariables] = useState([]);
  const { variables } = useWorkflowContext();

  useEffect(() => {
    const actionVariables = variables.filter(
      (variable) => variable.user_defined === true && variable.refer === nodeId
    );
    setActionVariables(actionVariables);
  }, [variables]);

  return (
    <>
      <ActionBox
        nodeId={nodeId}
        previousNodeId={previousNodeId}
        onFocus={onFocus}
      />
      {actionVariables.map((variable) => (
        <View style={{ width: "100%", alignItems: "center" }} key={variable.id}>
          <View
            style={{ height: 8, width: 1, backgroundColor: dark.outline }}
          />
          <VariableBox id={variable.id} nodeId={nodeId} onFocus={onFocus} />
        </View>
      ))}
    </>
  );
};

export default ActionSection;

const styles = StyleSheet.create({});
