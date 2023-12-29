import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Pressable,
  Switch,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { dark, colorMap, statusColorMap } from "../../utils/colors";
import IconComponent from "../../utils/iconComponent";
import MyText from "../../utils/myText";

const WorkflowInfoScreen = ({ navigation, route }) => {
  const [loadingData, setLoadingData] = useState(false);
  const [toggle, setToggle] = useState(false);
  const { parseWorkflow, trigger, workflow, variables, workflowInfo } =
    useWorkflowContext();
  const { dispatchAPI } = useAuthContext();
  const { id } = route.params || {};

  const getWorkflow = async () => {
    const { data } = await dispatchAPI("GET", `/get-workflow/${id}`);
    return data;
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Delete workflow",
      "Are you sure you want to delete this workflow ?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {}, // TODO : delete workflow
          style: "destructive",
        },
      ]
    );
  };

  const onToggleSwitch = async () => {
    setToggle(!toggle);
    const response = await dispatchAPI("POST", `/toggle-workflow/${id}`);
    console.log(response);
    if (response.status > 399) {
      setToggle(toggle);
    }
  };

  const loadData = async () => {
    setLoadingData(true);
    const workflow = await getWorkflow();
    parseWorkflow(workflow);
    setToggle(workflow.is_active);
    setLoadingData(false);
  };

  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, []);

  return (
    <View style={styles.container}>
      {loadingData ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={dark.white} />
        </View>
      ) : (
        <>
          <View
            style={[
              styles.header,
              { backgroundColor: colorMap[trigger.service] },
            ]}
          >
            <SafeAreaView />
            <View style={styles.logoContainer}>
              <Pressable
                style={styles.backButton}
                onPress={() => navigation.navigate("Home")}
              >
                <IconComponent name="arrow-left" style={styles.backIcon} />
              </Pressable>
              <View style={styles.logo}>
                <IconComponent
                  name={trigger.service || ""}
                  style={styles.icon}
                />
              </View>
              <View style={{ width: 24 }} />
            </View>
            <MyText style={styles.titleText} numberOfLines={2}>
              {workflowInfo?.name || ""}
            </MyText>
            <MyText style={styles.byYou}>by you</MyText>
          </View>
          <View style={styles.body}>
            <View style={styles.inputContainer}>
              <MyText style={styles.description}>
                {workflowInfo?.description || ""}
              </MyText>
            </View>
            <View style={styles.activate}>
              <MyText style={styles.activateText}>Activate workflow</MyText>
              <Switch
                trackColor={{
                  false: dark.outline,
                  true: colorMap[trigger.service],
                }}
                thumbColor={dark.white}
                ios_backgroundColor={dark.outline}
                onValueChange={onToggleSwitch}
                value={toggle}
              />
            </View>
          </View>
          <Pressable
            style={[
              styles.button,
              { bottom: 140, backgroundColor: colorMap[trigger.service] },
            ]}
          >
            <MyText style={styles.buttonText}>View workflow</MyText>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              { bottom: 80, backgroundColor: colorMap[trigger.service] },
            ]}
          >
            <MyText style={styles.buttonText}>View activity</MyText>
          </Pressable>
          <Pressable
            style={[styles.button, { bottom: 20, backgroundColor: dark.white }]}
            onPress={handleDeletePress}
          >
            <MyText
              style={[styles.buttonText, { color: statusColorMap["failure"] }]}
            >
              Delete workflow
            </MyText>
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
  },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  backButton: {
    resizeMode: "contain",
    justifyContent: "center",
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    backgroundColor: dark.white,
    borderRadius: 100,
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  titleText: {
    marginTop: 12,
    fontSize: 24,
    color: dark.white,
  },
  byYou: {
    fontSize: 16,
    color: dark.white,
    marginTop: 4,
  },
  body: {
    flex: 2,
    backgroundColor: dark.primary,
    padding: 20,
  },
  description: {
    height: "auto",
    flexWrap: "wrap",
    fontSize: 17,
    color: dark.white,
    fontFamily: "Outfit_500Medium",
  },
  activate: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  activateText: {
    fontSize: 14,
    color: dark.white,
    fontFamily: "Outfit_500Medium",
  },
  button: {
    position: "absolute",
    left: 20,
    right: 20,
    borderRadius: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 17,
    color: dark.white,
    fontFamily: "Outfit_500Medium",
  },
});

export default WorkflowInfoScreen;
