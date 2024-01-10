import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Touchable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { dark, statusColorMap } from "../../utils/colors";
import IconComponent from "../../utils/iconComponent";
import MyText from "../../utils/myText";
import { useAuthContext } from "../../contexts/AuthContext";
import { useWorkflowContext } from "../../contexts/WorkflowContext";

const GenerateInputScreen = ({ navigation }) => {
  const { dispatchAPI } = useAuthContext();
  const { parseWorkflow } = useWorkflowContext();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    const { data } = await dispatchAPI("POST", "/generate", {
      prompt,
    });
    parseWorkflow(data);
    setLoading(false);
    navigation.navigate("Workflow");
    return;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <SafeAreaView />
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <IconComponent name="arrow-left" style={styles.arrow} />
              </Pressable>
              <View style={styles.title}>
                <IconComponent name={"System"} style={styles.icon} />
                <MyText style={styles.titleText}>Generate Workflow</MyText>
              </View>
              <View style={{ width: 34 }} />
            </View>
          </View>
          <View style={styles.body}>
            <TextInput
              placeholder="Prompt"
              placeholderTextColor={"#969696"}
              style={styles.formInput}
              multiline={true}
              onChangeText={(text) => setPrompt(text)}
            />
            <Pressable
              style={[
                styles.floatingButton,
                prompt.length === 0 && {
                  backgroundColor: dark.secondary,
                  borderWidth: 2,
                  borderColor: dark.outline,
                },
              ]}
              onPress={() => handlePress()}
              disabled={prompt.length === 0}
            >
              <MyText
                style={[
                  styles.floatingButtonText,
                  prompt.length === 0 && { opacity: 0.5 },
                ]}
              >
                Generate
              </MyText>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerContainer: {
    backgroundColor: dark.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
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
  },
  formInput: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    width: "100%",
    padding: 16,
    color: dark.white,
    fontSize: 16,
    paddingTop: 16,
    fontFamily: "Outfit_500Medium",
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

export default GenerateInputScreen;
