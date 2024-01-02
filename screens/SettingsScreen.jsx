import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Button,
  Pressable,
  SafeAreaView,
} from "react-native";
import MyText from "../utils/myText";
import IconComponent from "../utils/iconComponent";
import { dark } from "../utils/colors";
import { useAuthContext } from "../contexts/AuthContext";
import * as WebBrowser from "expo-web-browser";
import ServiceForm from "../components/settings/serviceForm";

const OpenaiFields = [
  {
    name: "Api key",
    variableName: "api_key",
  },
];

const JiraFields = [
  {
    name: "Username",
    variableName: "username",
  },
  {
    name: "Api key",
    variableName: "api_key",
  },
];

const JenkinsFields = [
  {
    name: "Api key",
    variableName: "api_key",
  },
];

const SettingsScreen = () => {
  const [microsoftLink, setMicrosoftLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [refresh, setRefresh] = useState(false); // TODO: use this to refresh the buttons
  const { dispatchAPI } = useAuthContext();

  const getLoginButtons = async () => {
    const { data } = await dispatchAPI("GET", "/microsoft-login");
    if (data.authorization_url) {
      setMicrosoftLink(data.authorization_url);
    }
    const { data: data2 } = await dispatchAPI("GET", "/github-login");
    console.log("data2", data2);
    if (data2.authorization_url) {
      setGithubLink(data2.authorization_url);
    }
  };

  const _handlePressButtonAsync = async (url) => {
    if (url === "") return;
    let result = await WebBrowser.openBrowserAsync(url);
  };

  useEffect(() => {
    getLoginButtons();
  }, [refresh]);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.customHeader}>
        <MyText style={styles.headerText}>Settings</MyText>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => _handlePressButtonAsync(githubLink)}
          style={[styles.button, { backgroundColor: "#000000" }]}
        >
          <IconComponent name="Github" style={{ height: 45, width: 45 }} />
          <MyText style={styles.text}>Connect to Github</MyText>
        </Pressable>
        <Pressable
          onPress={() => _handlePressButtonAsync(microsoftLink)}
          style={[styles.button, { backgroundColor: "#FFFFFF" }]}
        >
          <MyText style={[styles.text, { color: "#000000" }]}>
            Connect to Microsoft
          </MyText>
        </Pressable>
        <ServiceForm service="Openai" fields={OpenaiFields} />
        <ServiceForm service="Jenkins" fields={JenkinsFields} />
        <ServiceForm service="Jira" fields={JiraFields} />
        <Pressable
          style={styles.logoutButton}
          onPress={() => dispatchAPI("LOGOUT")}
        >
          <MyText style={[styles.text, { color: "#FFFFFF" }]}>Log out</MyText>
        </Pressable>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
    paddingHorizontal: 20,
  },
  customHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  headerText: {
    fontSize: 24,
    color: dark.white,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
    height: "100%",
    paddingBottom: 146,
    justifyContent: "flex-end",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: dark.secondary,
    borderRadius: 8,
    marginBottom: 10,
    height: 50,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: dark.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: dark.white,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: dark.secondary,
    borderRadius: 8,
    marginBottom: 10,
    height: 50,
  },
});
