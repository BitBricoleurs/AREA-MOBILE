import { useEffect, useState } from "react";
import {
  Animated,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";

import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";
import TriggerChoice from "../../components/trigger/triggerChoice";

import services from "../../jsons/triggers.json";

const ChooseTriggerScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} stickyHeaderIndices={[1]}>
        <View style={styles.titleContainer}>
          <MyText style={styles.title}>Select a trigger</MyText>
        </View>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Image
              source={require("../../assets/search.png")}
              style={styles.searchIcon}
            />
            {/* // TODO */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={dark.outline}
              onChangeText={setSearch}
              value={search}
              keyboardType="default"
              autoCapitalize="none"
            />
          </View>
        </View>
        <View style={styles.triggerContainer}>
          {services.map((service, index) => (
            <TriggerChoice key={index} service={service} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChooseTriggerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
  },
  searchBarContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: dark.secondary,
    height: 50,
  },
  searchBar: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: dark.white,
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: dark.white,
    fontSize: 20,
    fontFamily: "Outfit_500Medium",
  },
  triggerContainer: {
    flex: 1,
    marginTop: 16,
  },
});
