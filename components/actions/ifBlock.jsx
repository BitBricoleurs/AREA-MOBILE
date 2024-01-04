import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useWorkflowContext } from "../../contexts/WorkflowContext";

import MyText from "../../utils/myText";
import { dark } from "../../utils/colors";
import RenderNode from "../renderNode";
import AddActionButton from "../addActionButton";

const ConditionBlock = ({ nodeId, previousNodeId, handleFocus }) => {
  const { workflow, handleRecursiveDelete, setWorkflow } = useWorkflowContext();
  const conditionOptions = [
    "is",
    "is not",
    "contains",
    "does not contain",
    "starts with",
    "ends with",
  ];
  const [conditionNode, setConditionNode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentOption, setCurrentOption] = useState(3);
  const pickerRef = useRef();
  const keyRef = useRef();
  const valueRef = useRef();

  const handleLongPress = () => {
    Alert.alert(
      "Delete Condition",
      "This will delete the condition and all the actions inside. Are you sure ?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleRecursiveDelete(nodeId),
          style: "destructive",
        },
      ]
    );
  };

  const updateCondition = (key, value) => {
    setConditionNode({
      ...conditionNode,
      [key]: value,
    });

    const newWorkflow = workflow.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          [key]: value,
        };
      }
      return node;
    });

    setWorkflow(newWorkflow);
  };

  const handlePickerChange = (itemValue) => {
    setCurrentOption(itemValue);
    setShowModal(false);
    setConditionNode({
      ...conditionNode,
      condition_type: conditionOptions[itemValue],
    });
  };

  const conditionTypeModal = () => {
    return (
      <Modal visible={showModal} transparent={true} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        />
        <View style={[styles.modalContent, { paddingTop: 8 }]}>
          {Platform.OS === "ios" ? (
            <Picker
              ref={pickerRef}
              selectedValue={currentOption}
              onValueChange={(itemValue, itemIndex) => {
                handlePickerChange(itemValue);
              }}
              style={styles.picker}
              itemStyle={styles.pickerStyleType}
            >
              {conditionOptions.map((option, index) => (
                <Picker.Item label={option} value={index} key={index} />
              ))}
            </Picker>
          ) : (
            <>
              {conditionOptions.map((option, index) => (
                <>
                  <TouchableOpacity
                    key={index}
                    style={styles.optionSelectButton}
                    onPress={() => {
                      handlePickerChange(index);
                    }}
                  >
                    <MyText style={styles.optionText}>{option}</MyText>
                  </TouchableOpacity>
                  {index !== conditionOptions.length - 1 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: dark.outline,
                        marginLeft: 16,
                      }}
                    />
                  )}
                </>
              ))}
            </>
          )}
        </View>
      </Modal>
    );
  };

  useEffect(() => {
    const node = workflow.find((node) => node.id === nodeId);
    setCurrentOption(conditionOptions.indexOf(node.type_condition));
    setConditionNode(node);
  }, [workflow]);

  const onFocus = (type) => {
    let ref = type === "key" ? keyRef : valueRef;
    ref.current.measure((x, y, width, height, pageX, pageY) => {
      handleFocus(previousNodeId, nodeId, pageY, [type, nodeId]);
    });
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.conditionBlock} onLongPress={handleLongPress}>
        <View style={styles.config}>
          <MyText style={styles.text}>If</MyText>
          <TextInput
            editable
            style={styles.input}
            placeholder="value"
            placeholderTextColor={"#969696"}
            autoCapitalize="none"
            ref={keyRef}
            onFocus={() => onFocus("key")}
            value={conditionNode?.key}
            onChangeText={(text) => updateCondition("key", text)}
          />
          <Pressable
            style={styles.conditionTypeButton}
            onPress={() => setShowModal(!showModal)}
          >
            <MyText style={styles.conditionText}>
              {conditionOptions[currentOption]}
            </MyText>
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="value"
            placeholderTextColor={"#969696"}
            autoCapitalize="none"
            ref={valueRef}
            onFocus={() => onFocus("value")}
            value={conditionNode?.value}
            onChangeText={(text) => updateCondition("value", text)}
          />
        </View>
      </Pressable>
      <View style={styles.renderBlock}>
        {conditionNode?.next_id_success > 0 ? (
          <>
            <View
              style={{ height: 12, width: 1, backgroundColor: dark.outline }}
            />
            <RenderNode
              nodeId={conditionNode?.next_id_success}
              nodeOutputId={previousNodeId}
              previousNodeId={nodeId}
              handleFocus={handleFocus}
            />
          </>
        ) : (
          <AddActionButton nodeId={nodeId} type="success" />
        )}
      </View>
      <View style={styles.thenContainer}>
        <MyText style={styles.thenText}>Otherwise</MyText>
      </View>
      <View style={styles.renderBlock}>
        {conditionNode?.next_id_fail > 0 ? (
          <>
            <View
              style={{ height: 12, width: 1, backgroundColor: dark.outline }}
            />
            <RenderNode
              nodeId={conditionNode?.next_id_fail}
              nodeOutputId={previousNodeId}
              previousNodeId={nodeId}
              handleFocus={handleFocus}
            />
          </>
        ) : (
          <AddActionButton nodeId={nodeId} type="failure" />
        )}
      </View>
      <View style={styles.thenContainer}>
        <MyText style={styles.thenText}>End if</MyText>
      </View>
      {showModal && conditionTypeModal()}
    </View>
  );
};

export default ConditionBlock;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
  conditionBlock: {
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: dark.secondary,
    paddingVertical: 4,
    paddingLeft: 16,
  },
  text: {
    fontSize: 16,
    color: dark.white,
    marginRight: 12,
  },
  input: {
    width: "auto",
    height: 30,
    backgroundColor: dark.outline,
    borderRadius: 8,
    marginRight: 12,
    paddingHorizontal: 10,
    color: dark.white,
    fontSize: 16,
    fontFamily: "Outfit_500Medium",
    marginVertical: 4,
  },
  conditionTypeButton: {
    backgroundColor: dark.outline,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 4,
    marginRight: 12,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "auto",
  },
  conditionText: {
    color: dark.white,
    fontSize: 16,
  },
  config: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  thenContainer: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  thenText: {
    color: dark.white,
    fontSize: 16,
    marginRight: 12,
  },
  renderBlock: {
    marginLeft: 16,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  modalContent: {
    backgroundColor: dark.secondary,
    borderRadius: 8,
    paddingBottom: 8,
  },
  pickerStyleType: {
    color: dark.white,
  },
});
