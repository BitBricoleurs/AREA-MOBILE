import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useWorkflowContext } from "../../contexts/WorkflowContext";

import MyText from "../../utils/myText";
import IconComponent from "../../utils/iconComponent";
import { dark } from "../../utils/colors";

const TriggerChoice = ({ service }) => {
  const navigation = useNavigation();
  const { setTrigger, setVariables } = useWorkflowContext();

  const handleTriggerPress = (index) => {
    setTrigger({
      serviceName: service.name,
      trigger: service.triggers[index].name,
      conditions: [],
      params: {},
    });
    const triggerVars = service.triggers[index]?.exposes?.map(
      (variable, index) => {
        return {
          name: variable.variableName,
          type: variable.type,
          parent_id: 0,
          value: null,
          id: index,
        };
      }
    );
    setVariables(triggerVars ? triggerVars : []);
    navigation.navigate("TriggerConfig", {
      serviceName: service.name,
      triggerName: service.triggers[index].name,
      previousPage: "ChooseTrigger",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <IconComponent name={service.name} style={styles.icon} />
        <MyText style={styles.titleText}>{service.name} triggers</MyText>
      </View>
      <View style={styles.triggersContainer}>
        {service?.triggers &&
          service.triggers.map((trigger, index) => (
            <View key={index} style={{ flex: 1 }}>
              {index !== 0 && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: dark.outline,
                    marginLeft: 16 + 24,
                  }}
                />
              )}
              <TouchableOpacity
                style={styles.trigger}
                onPress={() => handleTriggerPress(index)}
              >
                <IconComponent name={trigger.icon} style={styles.triggerIcon} />
                <View style={styles.triggerInfo}>
                  <MyText style={styles.triggerName}>{trigger.name}</MyText>
                  <MyText style={styles.triggerEg}>E.g. "{trigger.eg}"</MyText>
                </View>
                <IconComponent
                  name="chevron-right"
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>
            </View>
          ))}
      </View>
    </View>
  );
};

export default TriggerChoice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 18,
    color: dark.white,
  },
  icon: {
    width: 38,
    height: 38,
    resizeMode: "contain",
    marginHorizontal: 4,
  },
  triggersContainer: {
    flex: 1,
    backgroundColor: dark.secondary,
    borderRadius: 8,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
  },
  triggerIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginHorizontal: 8,
    margin: 12,
  },
  triggerInfo: {
    flex: 1,
  },
  triggerName: {
    fontSize: 16,
    color: dark.white,
  },
  triggerEg: {
    fontSize: 12,
    color: dark.white,
    opacity: 0.5,
  },
  chevronIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    marginHorizontal: 8,
    margin: 12,
  },
});

// propType validation
// triggerChoice.propTypes = {
//   name: PropTypes.string.isRequired,
//   onPress: PropTypes.func.isRequired,
//   style: PropTypes.object,
// };
