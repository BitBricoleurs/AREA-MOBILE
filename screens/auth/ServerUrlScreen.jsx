import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Button,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import MyText from "../../utils/myText";
import { dark } from "../../utils/colors";
import IconComponent from "../../utils/iconComponent";
import { useAuthContext } from "../../contexts/AuthContext";

const ServerUrlScreen = ({ navigation }) => {
  const { SERVER_URL, setSERVER_URL, resetServerUrl } = useAuthContext();
  const [url, setUrl] = useState(SERVER_URL);

  const handleSave = () => {
    setSERVER_URL(url);
    Keyboard.dismiss();
  };

  handleReset = () => {
    setUrl(SERVER_URL);
    resetServerUrl();
  };

  useEffect(() => {
    setUrl(SERVER_URL);
  }, [SERVER_URL]);

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <MyText style={styles.sectionTitle}>Server URL</MyText>
          <Pressable
            style={styles.iconContainer}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <IconComponent name={"close"} style={styles.icon} />
          </Pressable>
        </View>
        <View style={styles.body}>
          <TextInput
            style={styles.input}
            placeholder="Server URL"
            onChangeText={(text) => setUrl(text)}
            autoCapitalize="none"
            autoCorrect={false}
            value={url}
          />
          <Button title="Save" onPress={handleSave} />
          <Button title="Reset" onPress={handleReset} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ServerUrlScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: dark.text,
    marginBottom: 10,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    flex: 1,
    margin: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    color: dark.white,
    fontSize: 18,
    fontFamily: "Outfit_500Medium",
    height: 48,
    width: "100%",
    padding: 12,
    paddingLeft: 24,
    borderWidth: 2,
    borderRadius: 100,
    borderColor: dark.white,
    marginVertical: 8,
  },
});
