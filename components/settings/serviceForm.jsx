import React, { useState } from "react";
import {
  Pressable,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import IconComponent from "../../utils/iconComponent";
import MyText from "../../utils/myText";
import { dark, colorMap } from "../../utils/colors";

const ServiceForm = ({ service, fields, endpoint, navigation }) => {
  const [serviceForm, setServiceForm] = useState([]);
  console.log(fields);

  return (
    <View style={[styles.container, { backgroundColor: colorMap[service] }]}>
      <View style={styles.title}>
        <View style={styles.iconContainer}>
          <IconComponent
            name={service}
            style={[
              styles.icon,
              service === "Openai" && { tintColor: "#000000" },
            ]}
          />
        </View>
        <MyText style={styles.titleText}>{service}</MyText>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.form}>
          {fields &&
            fields.map((field, index) => (
              <TextInput
                placeholder={field.name}
                placeholderTextColor={"#969696"}
                style={[styles.formInput, index !== 0 && { marginTop: 6 }]}
                key={index}
              />
            ))}
        </View>
        <TouchableOpacity
          style={[
            styles.postButton,
            { height: fields.length * 37 + (fields.length - 1) * 6 },
          ]}
        >
          <IconComponent name="arrow-left" style={styles.postIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ServiceForm;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 100,
    backgroundColor: dark.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  formContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  form: {
    marginRight: 6,
    flex: 1,
  },
  formInput: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    marginRight: 12,
    height: 37,
    width: "100%",
    paddingHorizontal: 10,
    color: dark.white,
    fontSize: 16,
    fontFamily: "Outfit_500Medium",
  },
  postButton: {
    backgroundColor: dark.secondary,
    // height: "100%",
    width: 38,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  postIcon: {
    height: 24,
    width: 24,
    tintColor: dark.white,
    transform: [{ rotate: "180deg" }],
  },
});
