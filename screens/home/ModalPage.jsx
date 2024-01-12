import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";

import MyText from "../../utils/myText";
import WorkflowCard from "../../components/home/workflowCard";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import { dark } from "../../utils/colors";
import { SuccessCard } from "../../components/analytics/successRate";
import { UsageCard } from "../../components/analytics/workflowUsage";
import IconComponent from "../../utils/iconComponent";
import WorkflowCardHorizontal from "../../components/home/workflowCardHorizontal";

const ListViewModalPage = ({ navigation, route }) => {
  const { data, title } = route.params;

  console.log(data);

  const renderItem = ({ item }) => {
    switch (title) {
      case "Usage":
        return <UsageCard item={item} data={data} />;
      case "Success rate":
        return <SuccessCard item={item} />;
      case "Workflow runs":
        return <WorkflowCardHorizontal item={item} />;
      default:
        return <MyText>Default</MyText>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <MyText style={styles.sectionTitle}>{title}</MyText>
        <Pressable
          style={styles.iconContainer}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <IconComponent name={"close"} style={styles.icon} />
        </Pressable>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ListViewModalPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: dark.text,
    marginBottom: 10,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    flex: 1,
    margin: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
});
