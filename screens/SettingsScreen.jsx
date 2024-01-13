import React, { useEffect, useState } from "react";

import {
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
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
    variableName: "openai_token",
  },
];

const JiraFields = [
  {
    name: "Username",
    variableName: "jira_username",
  },
  {
    name: "Jira token",
    variableName: "jira_token",
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
  const [settings, setSettings] = useState({});
  const [githubLink, setGithubLink] = useState("");
  const [refresh, setRefresh] = useState(false); // TODO: use this to refresh the buttons
  const { dispatchAPI } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const getLoginButtons = async () => {
    const { data } = await dispatchAPI("GET", "/microsoft-login");
    if (data.authorization_url) {
      setMicrosoftLink(data.authorization_url);
    }
    const data2 = await dispatchAPI("GET", "/github-login");
    if (data2.authorization_url) {
      setGithubLink(data2.authorization_url);
    }
  };

  const getSettings = async () => {
    const { data } = await dispatchAPI("GET", "/check-settings");
    setSettings(data);
  };

  const _handlePressButtonAsync = async (url) => {
    if (url === "") return;
    let result = await WebBrowser.openBrowserAsync(url);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getSettings();
      await getLoginButtons();
      setLoading(false);
    })();
  }, [refresh]);

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      style={styles.container}
    >
      <View style={{ flex: 1, backgroundColor: dark.primary }}>
        <SafeAreaView />
        <View style={styles.customHeader}>
          <MyText style={styles.headerText}>Settings</MyText>
        </View>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        ) : (
          <View style={styles.buttonContainer} behavior="padding">
            <ServiceForm
              service="Openai"
              fields={OpenaiFields}
              endpoint={"/openai-login"}
              data={{
                openai_token: settings?.settings?.openai_token,
              }}
              postSubmit={() => setRefresh(!refresh)}
            />
            <ServiceForm
              service="Jenkins"
              fields={JenkinsFields}
              endpoint={""}
              data={{
                jenkins_token: settings?.settings?.jenkins_token,
              }}
              postSubmit={() => setRefresh(!refresh)}
            />
            <ServiceForm
              service="Jira"
              fields={JiraFields}
              endpoint={"/jira-login"}
              data={{
                jira_username: settings?.settings?.jira_username,
                jira_token: settings?.settings?.jira_token,
              }}
              postSubmit={() => setRefresh(!refresh)}
            />
            <Pressable
              onPress={() => _handlePressButtonAsync(githubLink)}
              style={[styles.button, { backgroundColor: "#000000" }]}
            >
              <IconComponent name="Github" style={{ height: 45, width: 45 }} />
              <MyText style={styles.text}>Link Github account</MyText>
            </Pressable>
            <Pressable
              onPress={() => _handlePressButtonAsync(microsoftLink)}
              style={[styles.button, { backgroundColor: "#FFFFFF" }]}
            >
              <MyText style={[styles.text, { color: "#000000" }]}>
                Link Microsoft account
              </MyText>
            </Pressable>
            <Pressable
              style={styles.logoutButton}
              onPress={() => dispatchAPI("LOGOUT")}
            >
              <MyText style={[styles.text, { color: "#FFFFFF" }]}>
                Log out
              </MyText>
            </Pressable>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 20,
    paddingBottom: 146,
    marginHorizontal: 20,
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
