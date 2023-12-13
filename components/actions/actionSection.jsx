import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import ActionBox from "./actionBox";

const ActionSection = ({ nodeId }) => {
  return (
    <>
      <ActionBox nodeId={nodeId} />
      {/* //TODO: find variables related to the id */}
    </>
  );
};

export default ActionSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  example: {
    fontSize: 16,
  },
});
