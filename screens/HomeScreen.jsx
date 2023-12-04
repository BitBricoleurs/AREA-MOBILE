// import { View, Image, Text, StyleSheet, ScrollView } from "react-native";
import MyText from "../utils/myText";
import { dark } from "../utils/colors";

import React, { useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Animated,
} from "react-native";

const WorkflowsContent = () => {
  return (
    // Your Workflows content here
    <View style={{ flex: 1 }}>
      <Text style={{ color: "#FFF" }}>Workflows Content</Text>
    </View>
  );
};

const AnalyticsContent = () => {
  return (
    // Your Analytics content here
    <View style={{ flex: 1 }}>
      <Text style={{ color: "#FFF" }}>Analytics Content</Text>
    </View>
  );
};

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [width, setWidth] = useState(3);

  const indicatorPosition = useRef(new Animated.Value(0)).current;

  const handleWidth = (e) => {
    const layout = e.nativeEvent.layout;
    setWidth(layout.width);
  };

  const handleTabPress = (tabIndex) => {
    setActiveTab(tabIndex);
    Animated.spring(indicatorPosition, {
      toValue: (tabIndex * width) / 2 + (width / 4 - 75 / 2),
      useNativeDriver: false,
    }).start();
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView />
      <View style={styles.logoContainer}>
        <MyText style={styles.logoText}>BotButler</MyText>
      </View>
      <View style={styles.tabBar}>
        <View style={{ flex: 1, flexDirection: "row" }} onLayout={handleWidth}>
          <TouchableOpacity
            onPress={() => handleTabPress(0)}
            style={[styles.tab, activeTab === 0 && styles.activeTab]}
          >
            <MyText
              style={[styles.tabText, activeTab === 0 && styles.activeTabText]}
            >
              Workflows
            </MyText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabPress(1)}
            style={[styles.tab, activeTab === 1 && styles.activeTab]}
          >
            <MyText
              style={[styles.tabText, activeTab === 1 && styles.activeTabText]}
            >
              Analytics
            </MyText>
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [
                {
                  translateX: indicatorPosition,
                },
              ],
            },
          ]}
        />
      </View>
      {activeTab === 0 ? <WorkflowsContent /> : <AnalyticsContent />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary, // Assuming a dark theme from your screenshot
    padding: 20,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#FFF",
    fontSize: 44,
    fontWeight: "bold",
  },
  tabBar: {
    paddingTop: 16,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 8,
  },
  tabText: {
    color: dark.white,
    fontSize: 22,
  },
  activeTabText: {
    color: "#39F0BA", // Active color
  },
  indicator: {
    backgroundColor: "#39F0BA",
    height: 4,
    width: 75,
    borderRadius: 100,
    position: "absolute", // Position absolutely within the tabBar
    bottom: 0, // Positioned at the bottom of the tabBar
    borderRadius: 100,
  },
});

export default HomeScreen;
