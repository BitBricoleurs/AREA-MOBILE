import { View, Image, Text, StyleSheet, Pressable, TextInput, Keyboard, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from '../../contexts/AuthContext';
import MyText from '../../utils/myText';
import { dark } from '../../utils/colors';

const PasswordScreen = ({route}) => {
  const { email } = route.params;
  const { dispatchAPI } = useAuthContext();
  const [password, setPassword] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // test if email exists
  }, [email]);

  const handleOnPress = () => {
    Keyboard.dismiss();
    if (userExists) {
      dispatchAPI("LOGIN", { email: email, password: password });
      console.log("Login");
    } else {
      dispatchAPI("REGISTER", { email: email, password: password });
      console.log("Register");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
       <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
        <View style={styles.header}>
          <View style={{justifyContent: "flex-start", alignItems: "flex-start" }}>
            <Image source={require('../../assets/arrow.png')} style={styles.arrow} />
          </View>
          <View style={{justifyContent: "center", alignItems: "center" }}>
            <MyText style={styles.text}>{userExists ? "Welcome back!\nEnter your password" : "Create your password" }</MyText>
          </View>
        </View>
        <View style={styles.body}>
          <TextInput
            style={styles.input}
            placeholder="Your password"
            placeholderTextColor={dark.outline}
            onChangeText={setPassword}
            value={password}
            keyboardType="email-address"
            secureTextEntry={true}
            autoCapitalize='none'
          />
          <Pressable style={styles.forgotPassword} onPress={() => console.log("Forgot password")}>
            <MyText style={styles.forgotText}>Forgot password?</MyText>
          </Pressable>
        </View>
        <Pressable style={styles.button} onPress={() => handleOnPress()}>
          <MyText style={[styles.text, {color: dark.primary}]}>{userExists ? "Sign in" : "Create account"}</MyText>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default PasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
    padding: 20,
  },
  arrow: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    tintColor: dark.white,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
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
  },
  button: {
    padding: 12,
    backgroundColor: dark.white,
    borderRadius: 100,
  },
  forgotPassword: {
    marginTop: 8,
  },
  forgotText: {
    fontSize: 16,
    color: dark.outline,
    textDecorationLine: "underline",
  },
});