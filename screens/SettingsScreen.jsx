import React, { useEffect, useState } from "react";

import { View, Image, Text, StyleSheet, Button, Linking } from "react-native";
import MyText from "../utils/myText";
import { dark } from "../utils/colors";
import { useAuthContext } from "../contexts/AuthContext";

const SettingsScreen = () => {
  const [microsoftLink, setMicrosoftLink] = useState([]);
  const [refresh, setRefresh] = useState(false); // TODO: use this to refresh the buttons
  const { dispatchAPI } = useAuthContext();

  const getLoginButtons = async () => {
    const { data } = await dispatchAPI("GET", "/microsoft-login");
    setMicrosoftLink(data.authorization_url);
  };

  useEffect(() => {
    getLoginButtons();
  }, [refresh]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Connect to Microsoft"
          onPress={() => {
            Linking.openURL(microsoftLink);
          }}
        />
        <Button
          title="Refresh"
          onPress={() => {
            setRefresh(!refresh);
          }}
        />
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
