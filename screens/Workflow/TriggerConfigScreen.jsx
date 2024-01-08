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

import TimeEntry from "../../components/form/timeEntry";
import ChoiceEntry from "../../components/form/choiceEntry";
import ChoiceTextEntry from "../../components/form/choiceTextEntry";
import TextArrayEntry from "../../components/form/textArrayEntry";
import TextEntry from "../../components/form/textEntry";
import ChoicePicker from "../../components/form/picker";
import { useWorkflowContext } from "../../contexts/WorkflowContext";

import services from "../../jsons/triggers.json";

const TriggerConfigScreen = ({ route, navigation }) => {
  const { serviceName, triggerName, previousPage } = route.params;
  const { trigger, setTrigger, editable } = useWorkflowContext();
  const [triggerJson, setTriggerJson] = useState({});
  const [requirementsMet, setRequirementsMet] = useState(true);
  const [service, setService] = useState(null);
  const [triggerIndex, setTriggerIndex] = useState(0);
  const [fromWorkflow, setFromWorkflow] = useState(false);

  const sectionDispatch = (section, index) => {
    switch (section.name) {
      case "timeEntry":
        return (
          <TimeEntry
            data={section}
            key={index}
            object={trigger}
            setObject={setTrigger}
            editable={editable}
          />
        );
      case "choice":
        return (
          <ChoiceEntry
            data={section}
            key={index}
            object={trigger}
            setObject={setTrigger}
            editable={editable}
          />
        );
      case "choiceTextEntry":
        return (
          <ChoiceTextEntry
            data={section}
            key={index}
            object={trigger}
            setObject={setTrigger}
            editable={editable}
          />
        );
      case "textArrayEntry":
        return (
          <TextArrayEntry
            data={section}
            key={index}
            object={trigger}
            setObject={setTrigger}
            editable={editable}
          />
        );
      case "textEntry":
        return (
          <TextEntry
            data={section}
            key={index}
            object={trigger}
            setObject={setTrigger}
            editable={editable}
          />
        );
      case "picker":
        return (
          <ChoicePicker
            data={section}
            key={index}
            object={trigger}
            setObject={setTrigger}
            editable={editable}
          />
        );
      default:
        return null;
    }
  };

  const checkRequirements = () => {
    // TODO handle oneOf, true false and multi with different depth levels
    // const triggerData = service?.triggers[triggerIndex];

    // if (!triggerData) {
    //   return false;
    // }

    // for (const section of triggerData?.sections) {
    //   const paramValue =
    //     trigger?.params && trigger?.params[section.variableName];
    //   if (section.required === "true") {
    //     if (!paramValue || paramValue === "") {
    //       return false;
    //     }
    //   } else if (section.required === "multi") {
    //     const multiRequiredSections = triggerData.sections.filter(
    //       (s) => s.required === "multi"
    //     );
    //     const isAnyMultiRequiredFilled = multiRequiredSections.some(
    //       (s) => trigger?.params && trigger?.params[s.variableName]
    //     );
    //     if (!isAnyMultiRequiredFilled) {
    //       return false;
    //     }
    //   }
    // }
    return true;
  };

  useEffect(() => {
    const serviceIndex = services.findIndex(
      (service) => service.name === serviceName
    );
    setService(services[serviceIndex]);
    console.log(serviceIndex);
    const triggerIndex = services[serviceIndex]?.triggers.findIndex(
      (trigger) => trigger.name === triggerName
    );
    setTriggerIndex(triggerIndex);
  }, []);

  useEffect(() => {
    if (service) {
      setTriggerJson(service.triggers[triggerIndex]);
    }
  }, [service]);

  useEffect(() => {
    if (route.params?.fromWorkflow) {
      setFromWorkflow(route.params.fromWorkflow);
    } else {
      setFromWorkflow(false);
    }
  }, [route.params]);

  useEffect(() => {
    setRequirementsMet(checkRequirements());
  }, [trigger]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          fromWorkflow && { paddingBottom: 12 },
        ]}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.navigate(previousPage)}
              style={styles.backButton}
            >
              <IconComponent name="arrow-left" style={styles.arrow} />
            </Pressable>
            <View style={styles.title}>
              <IconComponent name={service?.name} style={styles.icon} />
              <MyText style={styles.titleText}>
                {(service && service?.triggers[triggerIndex]?.name) || ""}
              </MyText>
            </View>
            <View style={{ width: 34 }} />
          </View>
        </View>
        <View style={styles.body}>
          <MyText style={styles.whenText}>When</MyText>
          {triggerJson &&
            triggerJson?.sections?.map((section, index) => {
              return (
                <View style={styles.section} key={index}>
                  {section?.sectionTitle && (
                    <MyText style={styles.sectionTitle}>
                      {section?.sectionTitle}
                    </MyText>
                  )}
                  <View style={styles.blockContainer}>
                    {section?.block?.map((blockItems, index2) => {
                      return sectionDispatch(blockItems, index2);
                    })}
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
      {!fromWorkflow && (
        <Pressable
          style={[
            styles.floatingButton,
            !requirementsMet && {
              backgroundColor: dark.secondary,
              borderWidth: 2,
              borderColor: dark.outline,
            },
          ]}
          onPress={() => navigation.navigate("Workflow")}
          disabled={!requirementsMet}
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
      )}
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
  section: {
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    color: dark.white,
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 12,
  },
  blockContainer: {
    backgroundColor: dark.secondary,
    borderRadius: 10,
  },
  floatingButton: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 32,
    backgroundColor: dark.purple,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Outfit_700Bold",
  },
});
