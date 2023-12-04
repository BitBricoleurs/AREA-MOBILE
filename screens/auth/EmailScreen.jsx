import { View, Image, Text, StyleSheet, Pressable, TextInput, Keyboard, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import MyText from '../../utils/myText';
import { dark } from '../../utils/colors';

const EmailScreen = ({navigation}) => {
  const [email, setEmail] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  console.log(email);

  const handleOnPress = () => {
    Keyboard.dismiss();
    emailRegex.test(email) ? console.log("Email is valid") : console.log("Email is invalid");
    navigation.navigate("Password", { email: email});
  }

  return (
    <SafeAreaView style={styles.container}>
       <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
        <View style={styles.header}>
          <View style={{justifyContent: "flex-start", alignItems: "flex-start" }}>
            <Image source={require('../../assets/arrow.png')} style={styles.arrow} />
          </View>
          <View style={{justifyContent: "center", alignItems: "center" }}>
            <MyText style={styles.text}>Enter your email</MyText>
          </View>
        </View>
        <View style={styles.body}>
          <TextInput
            style={styles.input}
            placeholder="Your email"
            placeholderTextColor={dark.outline}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize='none'
          />
        </View>
        <Pressable style={styles.button} onPress={() => handleOnPress()}>
          <MyText style={[styles.text, {color: dark.primary}]}>Next</MyText>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default EmailScreen;

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
});