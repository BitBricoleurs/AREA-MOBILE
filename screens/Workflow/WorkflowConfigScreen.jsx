import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MyText from "../../utils/myText";
import { dark, colorMap } from "../../utils/colors";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import { useAuthContext } from "../../contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import IconComponent from "../../utils/iconComponent";

import * as FileSystem from "expo-file-system";

const WorkflowConfigScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { trigger, workflowInfo, setWorkflowInfo, jsonifyWorkflow, mode } =
    useWorkflowContext();
  const { dispatchAPI } = useAuthContext();

  const handleChangeText = (text, param) => {
    setWorkflowInfo({
      ...workflowInfo,
      [param]: text,
    });
  };

  useEffect(() => {
    if (workflowInfo?.name === undefined || workflowInfo?.name === "") {
      setWorkflowInfo({
        ...workflowInfo,
        name: "Worflow",
      });
    }
  }, []);

  const handleCreateWorkflowPress = async () => {
    setLoading(true);
    const workflow = jsonifyWorkflow();
    console.log(workflow);
    const payload = {
      name_workflow: workflow.name_workflow,
      description: workflow.description,
      variables: workflow.variables,
      workflow: workflow.workflow,
    };

    const fileInfo = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + "yourfilename.json"
    );
    if (!fileInfo.exists) {
      await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory, {
        intermediates: true,
      });
    }

    const fileUri = FileSystem.documentDirectory + "yourfilename.json";
    FileSystem.writeAsStringAsync(fileUri, JSON.stringify(payload))
      .then(() => {
        console.log("File written successfully!");
      })
      .catch((error) => {
        console.error("Error writing file:", error);
      });

    if (mode === "edit") {
      const response = await dispatchAPI(
        "PUT",
        `/edit-workflow/${workflowInfo.id}`,
        {
          name_workflow: workflow.name_workflow,
          description: workflow.description,
          variables: workflow.variables,
          workflow: workflow.workflow,
        }
      );
      if (response.status === 200) {
        navigation.navigate("Home", { refresh: true });
      }
    } else {
      const { data } = await dispatchAPI("POST", "/create-workflow", {
        name_workflow: workflow.name_workflow,
        description: workflow.description,
        variables: workflow.variables,
        workflow: workflow.workflow,
      });
      if (data?.workflow_id) {
        navigation.navigate("Home", { refresh: true });
      }
    }
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
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
              onPress={() => navigation.goBack()}
            >
              <IconComponent name="arrow-left" style={styles.backIcon} />
            </Pressable>
            <View style={styles.logo}>
              <IconComponent name={trigger.service} style={styles.icon} />
            </View>
            <View style={{ width: 24 }} />
          </View>
          <TextInput
            style={styles.titleText}
            placeholder="Workflow name"
            onChangeText={(text) => handleChangeText(text, "name")}
            value={workflowInfo?.name || ""}
          />
          <MyText style={styles.byYou}>by you</MyText>
        </View>
        <View style={styles.body}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor={dark.white}
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => handleChangeText(text, "description")}
              value={workflowInfo?.description || ""}
            />
          </View>
          <Pressable
            style={styles.addActionButton}
            onPress={handleCreateWorkflowPress}
            disabled={loading}
          >
            <LinearGradient
              colors={["#BE76FC", "#5F14D8"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.addActionButtonGradient}
            >
              {loading ? (
                <ActivityIndicator size="small" color={dark.white} />
              ) : (
                <MyText style={styles.addActionText}>
                  {mode === "edit" ? "Update" : "Create"} workflow
                </MyText>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default WorkflowConfigScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
  },
  header: {
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
  inputContainer: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    height: "auto",
    fontSize: 16,
    color: dark.white,
    fontFamily: "Outfit_500Medium",
  },
  addActionButton: {
    height: 48,
    width: "100%",
    marginHorizontal: 20,
    borderRadius: 100,
    position: "absolute",
    bottom: 24,
  },
  addActionButtonGradient: {
    height: 48,
    flex: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  addActionText: {
    fontSize: 18,
    color: dark.white,
    fontFamily: "Outfit_600SemiBold",
    marginLeft: 8,
  },
});
