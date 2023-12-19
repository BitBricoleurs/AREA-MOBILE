import React, { useEffect, useState } from "react";

import { View, Image, Text, StyleSheet, Button, Linking } from "react-native";
import MyText from "../utils/myText";
import { dark } from "../utils/colors";
import { useAuthContext } from "../contexts/AuthContext";

const SettingsScreen = () => {
  const [microsoftLink, setMicrosoftLink] = useState([]);
  const { dispatchAPI } = useAuthContext();

  const getLoginButtons = async () => {
    const response = await dispatchAPI("GET", "/microsoft-login");
    console.log(response);
    if (typeof response === "string") {
      const parsedResponse = JSON.parse(response);
      setMicrosoftLink(parsedResponse.authorization_url);
    } else {
      // If the response is already an object
      setMicrosoftLink(response.authorization_url);
    }
  };

  useEffect(() => {
    getLoginButtons();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {microsoftLink && (
          <Button
            title="Connect to Microsoft"
            onPress={() => {
              Linking.openURL(microsoftLink);
            }}
          />
        )}
      </View>
      <View style={styles.logoutButtonContainer}>
        <Button title="Log out" onPress={() => dispatchAPI("LOGOUT")} />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});
