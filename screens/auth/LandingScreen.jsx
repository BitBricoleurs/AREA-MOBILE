import { View, Image, Text, Button, StyleSheet, Pressable } from "react-native";
import MyText from "../../utils/myText";
import { dark } from "../../utils/colors";
import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { useAuthContext } from "../../contexts/AuthContext";
import IconComponent from "../../utils/iconComponent";

const LandingScreen = ({ navigation }) => {
  const authServices = ["Create an account", "Sign in"];
  const { dispatchAPI } = useAuthContext();
  const [github, setGithub] = useState("");

  const handleConnectionType = async (service) => {
    if (service === "Github") {
      if (github === "") return;
      let result = await WebBrowser.openBrowserAsync(github);
      return;
    }
    navigation.navigate("Auth", {
      method: service === "Sign in" ? "login" : "register",
    });
  };

  useEffect(() => {
    (async () => {
      const { data } = await dispatchAPI("GET", "/github-login-link");
      if (data?.authorization_url) {
        setGithub(data.authorization_url);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={{
          position: "absolute",
          top: 60,
          right: 10,
          height: 48,
          width: 48,
        }}
        onPress={() => navigation.navigate("ServerUrl")}
      >
        <IconComponent
          name="settings"
          style={{ tintColor: dark.white, height: 32, width: 32 }}
        />
      </Pressable>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          with: "100%",
        }}
      >
        <View style={{ flex: 6, justifyContent: "flex-end", marginBottom: 24 }}>
          <Image
            source={require("../../assets/logo-color.png")}
            style={styles.logo}
          />
        </View>
        <View style={{ flex: 2 }}>
          <MyText style={styles.logoText}>BotButler</MyText>
        </View>
        <View style={{ flex: 6 }}>
          <MyText style={styles.tagline}>Craft Your Workflow,</MyText>
          <MyText style={styles.tagline}>Automate Your Success</MyText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => handleConnectionType("Github")}
        >
          <MyText style={styles.text}>Continue with Github</MyText>
        </Pressable>
        {authServices.map((service, index) => {
          return (
            <Pressable
              key={index}
              style={styles.button}
              onPress={() => handleConnectionType(service)}
            >
              <MyText style={styles.text}>{service}</MyText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: dark.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 50,
  },
  logoText: {
    fontSize: 44,
    fontWeight: "bold",
    textAlign: "center",
    color: dark.text,
  },
  tagline: {
    fontSize: 22,
    textAlign: "center",
    marginTop: 8,
    color: dark.text,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 24,
  },
  button: {
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: dark.white,
    borderRadius: 100,
    marginBottom: 16,
  },
  text: {
    fontSize: 21,
    fontWeight: "bold",
    color: dark.primary,
  },
});
