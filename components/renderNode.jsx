import { useEffect, useState } from "react";
import { View } from "react-native";
import { dark } from "../utils/colors";
import { useWorkflowContext } from "../contexts/WorkflowContext";
import ActionSection from "./actions/actionSection";
import AddActionButton from "./addActionButton";
import ConditionBlock from "./actions/ifBlock";

const RenderNode = ({ nodeId, previousNodeId, handleFocus, nodeOutputId }) => {
  const [node, setNode] = useState(null);
  const { workflow } = useWorkflowContext();

  const nodeDispatch = (node, previousNodeId, nodeOutputId) => {
    if (!node) return null;
    switch (node.type) {
      case "action":
        return (
          <ActionSection
            nodeId={node.id}
            previousNodeId={previousNodeId}
            nodeOutputId={nodeOutputId}
            onFocus={handleFocus}
          />
        );

      case "condition":
        return (
          <ConditionBlock
            nodeId={node.id}
            handleFocus={handleFocus}
            previousNodeId={previousNodeId}
          />
        );
      case "delay":
        return <View style={{ flex: 1 }} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const node = workflow.find((node) => node.id === nodeId);
    setNode(node);
  }, [workflow, nodeId]);

  return node === null ? null : (
    <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
      {nodeDispatch(node, previousNodeId, nodeOutputId)}
      {node?.next_id && node.next_id > 0 && (
        <>
          <View
            style={{ height: 12, width: 1, backgroundColor: dark.outline }}
          />
          <RenderNode
            nodeId={node.next_id}
            nodeOutputId={node.id}
            previousNodeId={node.id}
            handleFocus={handleFocus}
          />
        </>
      )}
      {node?.next_id && node.next_id < 0 && (
        <AddActionButton nodeId={node.id} />
      )}
    </View>
  );
};

export default RenderNode;
