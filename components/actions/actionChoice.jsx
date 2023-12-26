import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useWorkflowContext } from "../../contexts/WorkflowContext";

import MyText from "../../utils/myText";
import IconComponent from "../../utils/iconComponent";
import { dark } from "../../utils/colors";
import { findUnusedIntID } from "../../utils/uniqueId";

const ActionChoice = ({ service, prevNodeId, type }) => {
  const navigation = useNavigation();
  const { setWorkflow, workflow, trigger, setTrigger, setLastNodeId } =
    useWorkflowContext();

  const handleActionPress = (index) => {
    const updatedWorkflow = [...workflow];
    const id = findUnusedIntID(workflow);
    setLastNodeId(id);
    const newAction = {
      id: id,
      action: service.actions[index].name,
      type: "action",
      service: service.name,
      next_id: -1,
      params: {},
      details_action: "",
    };
    if (workflow.length !== 0) {
      const prevNode = workflow.find((node) => node.id === prevNodeId);
      const prevNodeIndex = workflow.indexOf(prevNode);
      switch (type) {
        case "failure":
          updatedWorkflow[prevNodeIndex].next_id_fail = newAction.id;
          break;
        case "success":
          updatedWorkflow[prevNodeIndex].next_id_success = newAction.id;
          break;
        default:
          updatedWorkflow[prevNodeIndex].next_id = newAction.id;
          break;
      }
    } else {
      setTrigger({
        ...trigger,
        next_id: newAction.id,
      });
    }

    setWorkflow([...updatedWorkflow, newAction]);
    navigation.navigate("Workflow");
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <IconComponent name={service.name} style={styles.icon} />
        <MyText style={styles.titleText}>{service.name} actions</MyText>
      </View>
      <View style={styles.actionsContainer}>
        {service?.actions &&
          service.actions.map((action, index) => (
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
                style={styles.action}
                onPress={() => handleActionPress(index)}
              >
                <IconComponent name={action.icon} style={styles.actionIcon} />
                <View style={styles.actionInfo}>
                  <MyText style={styles.actionName}>{action.name}</MyText>
                  <MyText style={styles.actionEg}>E.g. "{action.eg}"</MyText>
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

export default ActionChoice;

ActionChoice.defaultProps = {
  type: "none",
};

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
  actionsContainer: {
    flex: 1,
    backgroundColor: dark.secondary,
    borderRadius: 8,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
  },
  actionIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginHorizontal: 8,
    margin: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionName: {
    fontSize: 16,
    color: dark.white,
  },
  actionEg: {
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
