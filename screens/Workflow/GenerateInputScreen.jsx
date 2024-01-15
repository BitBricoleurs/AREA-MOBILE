import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { dark, statusColorMap } from "../../utils/colors";
import IconComponent from "../../utils/iconComponent";
import MyText from "../../utils/myText";
import { useAuthContext } from "../../contexts/AuthContext";
import { useWorkflowContext } from "../../contexts/WorkflowContext";
import TypingAnimation from "../../components/dotsAnim";

const GenerateInputScreen = ({ navigation }) => {
  const { dispatchAPI, SERVER_URL, token } = useAuthContext();
  const { parseWorkflow } = useWorkflowContext();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const getWorkflow = async () => {
    console.log("get workflow", SERVER_URL, token);
    const response = await fetch(`${SERVER_URL}/ai/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });
    console.log(response);
    const json_workflow = await response.json();
    console.log(json_workflow);
    return json_workflow;
  };

  const handlePress = async () => {
    setLoading(true);
    Keyboard.dismiss();
    const data = await getWorkflow();
    console.log(data);
    parseWorkflow(data);
    setLoading(false);
    navigation.navigate("Workflow");
    return;
  };

  const animatedStyle = {
    opacity: pulseAnim,
  };

  useEffect(() => {
    if (loading) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );

      animation.start();

      return () => animation.stop();
    }
  }, [loading, pulseAnim]);

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
              {loading ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Animated.Text
                    style={[styles.floatingButtonText, animatedStyle]}
                  >
                    Doing magic stuff...
                  </Animated.Text>
                  <TypingAnimation />
                </View>
              ) : (
                <MyText
                  style={[
                    styles.floatingButtonText,
                    prompt.length === 0 && { opacity: 0.5 },
                  ]}
                >
                  Generate
                </MyText>
              )}
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
