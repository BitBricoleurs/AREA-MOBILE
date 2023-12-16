import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import ActionBox from "./actionBox";

const ActionSection = ({ nodeId, previousNodeId, onFocus }) => {
  return (
    <>
      <ActionBox
        nodeId={nodeId}
        previousNodeId={previousNodeId}
        onFocus={onFocus}
      />
      {/* //TODO: find variables related to the id */}
    </>
  );
};

export default ActionSection;

const styles = StyleSheet.create({});
