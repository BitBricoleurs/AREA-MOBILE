import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SERVER_URL } from "@env";
import MyText from "../../utils/myText";
import { dark } from "../../utils/colors";
import { useAuthContext } from "../../contexts/AuthContext";

const AuthScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirm, setConfirm] = useState("");
  const { method } = route.params;
  const { dispatchAPI } = useAuthContext();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleOnPress = async () => {
    setLoading(true);
    Keyboard.dismiss();
    if (method === "register") {
      if (
        email === "" ||
        password === "" ||
        fullName === "" ||
        confirm === ""
      ) {
        console.warn("Please fill in all fields");
        return;
      }
      if (!emailRegex.test(email)) {
        console.warn("Please enter a valid email");
        return;
      }
      try {
        const response = await dispatchAPI("REGISTER", "/register", {
          email: email,
          password: password,
          fullName: fullName,
        });
        const res = await dispatchAPI("LOGIN", "/login", {
          email: email,
          password: password,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      if (email === "" || password === "") {
        console.warn("Please fill in all fields");
        return;
      }
      const response = await dispatchAPI("LOGIN", "/login", {
        email: email,
        password: password,
      });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable
            style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../../assets/arrow.png")}
              style={styles.arrow}
            />
          </Pressable>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <MyText style={styles.text}>
              {method === "login" ? "Sign In" : "Create your account"}
            </MyText>
          </View>
        </View>
        <View style={styles.body}>
          {method === "register" && (
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor={dark.outline}
              onChangeText={setFullName}
              value={fullName}
              autoCapitalize="words"
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Your email"
            placeholderTextColor={dark.outline}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={dark.outline}
            onChangeText={setPassword}
            value={password}
            autoCapitalize="none"
            secureTextEntry={true}
          />
          {method === "register" && (
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor={dark.outline}
              onChangeText={setConfirm}
              value={confirm}
              autoCapitalize="none"
              secureTextEntry={true}
            />
          )}
        </View>
        <Pressable
          style={styles.button}
          onPress={() => handleOnPress()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={dark.primary} />
          ) : (
            <MyText style={[styles.text, { color: dark.primary }]}>Next</MyText>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
    padding: 20,
  },
  arrow: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    tintColor: dark.white,
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: dark.text,
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
  button: {
    padding: 12,
    backgroundColor: dark.white,
    borderRadius: 100,
  },
});
