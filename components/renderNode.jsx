import { useEffect, useState } from "react";
import { View } from "react-native";
import { dark } from "../utils/colors";
import { useWorkflowContext } from "../contexts/WorkflowContext";
import ActionSection from "./actions/actionSection";
import AddActionButton from "./addActionButton";

const RenderNode = ({ nodeId, previousNodeId, handleFocus }) => {
  const [node, setNode] = useState(null);
  const { workflow } = useWorkflowContext();

  const nodeDispatch = (node, previousNodeId) => {
    if (!node) return null;
    switch (node.type) {
      case "action":
        return (
          <ActionSection
            nodeId={node.id}
            previousNodeId={previousNodeId}
            onFocus={handleFocus}
          />
        );

      case "condition":
        return <View style={{ flex: 1 }} />;
      case "delay":
        return <View style={{ flex: 1 }} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const node = workflow.find((node) => node.id === nodeId);
    setNode(node);
  }, [workflow]);

  return node === null ? null : (
    <View
      key={node.id}
      style={{ flex: 1, width: "100%", alignItems: "center" }}
    >
      {nodeDispatch(node, previousNodeId)}
      {node.next_id > 0 && (
        <>
          <View
            style={{ height: 12, width: 1, backgroundColor: dark.outline }}
          />
          <RenderNode
            nodeId={node.next_id}
            previousNodeId={node.id}
            handleFocus={handleFocus}
          />
        </>
      )}
      {node.next_id < 0 && (
        <>
          <View
            style={{ height: 22, width: 1, backgroundColor: dark.outline }}
          />
          <AddActionButton nodeId={node.id} />
        </>
      )}
    </View>
  );
};

export default RenderNode;
