import { View, Image, Text, Button, StyleSheet, Pressable } from "react-native";
import MyText from "../../utils/myText";
import { dark } from "../../utils/colors";
import { useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";

const LandingScreen = ({ navigation }) => {
  const { attemptLogin } = useAuthContext();
  const authServices = ["Create an account", "Sign in"];

  const handleConnectionType = (service) => {
    navigation.navigate("Auth", {
      method: service === "Sign in" ? "login" : "register",
    });
  };

  useEffect(() => {
    attemptLogin();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
