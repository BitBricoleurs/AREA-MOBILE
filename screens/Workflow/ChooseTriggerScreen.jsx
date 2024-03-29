import { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  Platform,
  StatusBar,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { dark } from "../../utils/colors";
import MyText from "../../utils/myText";
import TriggerChoice from "../../components/trigger/triggerChoice";
import { useWorkflowContext } from "../../contexts/WorkflowContext";

const ChooseTriggerScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { setMode, setEditable, getForms, triggers } = useWorkflowContext();

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getForms();
      setLoading(false);
    })();

    setMode("create");
    setEditable(true);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color={dark.text} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          stickyHeaderIndices={[1]}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View style={styles.headerContainer}>
            <Pressable
              style={{
                width: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("Home")}
            >
              <MyText style={{ color: dark.red, fontSize: 16 }}>Cancel</MyText>
            </Pressable>
            <View style={styles.titleContainer}>
              <MyText style={styles.title}>Select a trigger</MyText>
            </View>
            <View style={{ width: 50 }} />
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
            <TouchableOpacity
              style={styles.generateButton}
              onPress={() => {
                navigation.navigate("GenerateInput");
              }}
            >
              <MyText style={{ color: dark.text, fontSize: 18 }}>
                Generate
              </MyText>
            </TouchableOpacity>
            {triggers &&
              triggers.map((service, index) => (
                <TriggerChoice key={index} service={service} />
              ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ChooseTriggerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dark.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    backgroundColor: dark.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginVertical: 8,
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
  },
  generateButton: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
});
