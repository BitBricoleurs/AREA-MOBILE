import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";

import MyText from "../../utils/myText";
import IconComponent from "../../utils/iconComponent";
import { dark } from "../../utils/colors";

import TimeEntry from "../../components/trigger/timeEntry";
import ChoiceEntry from "../../components/trigger/choiceEntry";
import ChoiceTextEntry from "../../components/trigger/textEntry";
import TextArrayEntry from "../../components/trigger/textArrayEntry";
import { useWorkflowContext } from "../../contexts/WorkflowContext";

const TriggerConfigScreen = ({ route, navigation }) => {
  const { service, triggerIndex } = route.params;
  const { trigger } = useWorkflowContext();
  const [triggerJson, setTriggerJson] = useState({});
  const [requirementsMet, setRequirementsMet] = useState(true);

  const sectionDispatch = (section, index) => {
    switch (section.name) {
      case "timeEntry":
        return <TimeEntry data={section} key={index} />;
      case "choice":
        return <ChoiceEntry data={section} key={index} />;
      case "choiceTextEntry":
        return <ChoiceTextEntry data={section} key={index} />;
      case "textArrayEntry":
        return <TextArrayEntry data={section} key={index} />;
      default:
        return null;
    }
  };

  const checkRequirements = () => {
    const triggerData = service.triggers[triggerIndex];

    for (const section of triggerData.sections) {
      const paramValue =
        trigger?.params && trigger?.params[section.variableName];
      if (section.required === "true") {
        if (!paramValue || paramValue === "") {
          return false;
        }
      } else if (section.required === "multi") {
        const multiRequiredSections = triggerData.sections.filter(
          (s) => s.required === "multi"
        );
        const isAnyMultiRequiredFilled = multiRequiredSections.some(
          (s) => trigger?.params && trigger?.params[s.variableName]
        );
        if (!isAnyMultiRequiredFilled) {
          return false;
        }
      }
      return true;
    }
  };

  useEffect(() => {
    if (service) {
      setTriggerJson(service.triggers[triggerIndex]);
    }
  }, [service, triggerIndex]);

  useEffect(() => {
    setRequirementsMet(checkRequirements());
  }, [trigger]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <IconComponent name="arrow-left" style={styles.arrow} />
            </Pressable>
            <View style={styles.title}>
              <IconComponent name={service?.name} style={styles.icon} />
              <MyText style={styles.titleText}>
                {service?.triggers[triggerIndex].name}
              </MyText>
            </View>
            <View style={{ width: 34 }} />
          </View>
        </View>
        <View style={styles.body}>
          <MyText style={styles.whenText}>When</MyText>
          {triggerJson &&
            triggerJson?.sections?.map((section, index) => {
              return sectionDispatch(section, index);
            })}
        </View>
      </ScrollView>
      <Pressable
        style={[
          styles.floatingButton,
          !requirementsMet && {
            backgroundColor: dark.secondary,
            borderWidth: 2,
            borderColor: dark.outline,
          },
        ]}
        onPress={() => {}}
        disabled={requirementsMet}
      >
        <MyText
          style={[
            styles.floatingButtonText,
            !requirementsMet && { opacity: 0.5 },
          ]}
        >
          Next
        </MyText>
      </Pressable>
    </SafeAreaView>
  );
};

export default TriggerConfigScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    backgroundColor: dark.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  backButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    color: dark.white,
  },
  icon: {
    width: 34,
    height: 34,
    resizeMode: "contain",
    marginRight: 8,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
  whenText: {
    fontSize: 24,
    color: dark.white,
    marginBottom: 8,
  },
  floatingButton: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: dark.purple,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  floatingButtonText: {
    color: "white", // Text color
    fontSize: 24, // Text size
  },
});
