import { Text, View, StyleSheet, SafeAreaView, Pressable } from "react-native";

import MyText from "../../utils/myText";
import IconComponent from "../../utils/iconComponent";
import { dark } from "../../utils/colors";

import TimeEntry from "../../components/trigger/timeEntry";
import { useEffect, useState } from "react";

const TriggerConfigScreen = ({ route, navigation }) => {
  const { service, trigger } = route.params;
  const [triggerJson, setTriggerJson] = useState({});
  console.log(service);

  const sectionDispatch = (section, index) => {
    switch (section.name) {
      case "timeEntry":
        return <TimeEntry data={section} key={index} />;
      case "choice":
        return <Text>{section.name}</Text>;
      case "textEntry":
        return <Text>{section.name}</Text>;
      case "textArrayEntry":
        return <Text>{section.name}</Text>;
      default:
        return <Text>{section.name}</Text>;
    }
  };

  useEffect(() => {
    if (service) {
      setTriggerJson(service.triggers[trigger]);
    }
    console.log("TRIGGER", service.triggers[trigger]);
  }, [service, trigger]);

  console.log("TRIGGER2", service.triggers[trigger]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <IconComponent name="arrow-left" style={styles.arrow} />
        </Pressable>
        <View style={styles.title}>
          <IconComponent name={service?.name} style={styles.icon} />
          <MyText style={styles.titleText}>{service?.name}</MyText>
        </View>
        <View style={{ width: 34 }} />
      </View>
      <View style={styles.body}>
        <MyText style={styles.whenText}>When</MyText>
        {triggerJson &&
          triggerJson?.sections?.map((section, index) => {
            return sectionDispatch(section, index);
          })}
      </View>
    </SafeAreaView>
  );
};

export default TriggerConfigScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
