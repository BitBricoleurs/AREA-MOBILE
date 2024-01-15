import { useContext, useState, createContext, useEffect } from "react";
import { useAuthContext } from "./AuthContext";

const WorkflowContext = createContext();

export const WorkflowContextProvider = ({ children }) => {
  const { dispatchAPI } = useAuthContext();
  const [workflowInfo, setWorkflowInfo] = useState({});
  const [trigger, setTrigger] = useState({});
  const [workflow, setWorkflow] = useState([]);
  const [variables, setVariables] = useState([]);
  const [lastUnfolded, setLastUnfolded] = useState(0);
  const [lastNodeId, setLastNodeId] = useState(0);
  const [editable, setEditable] = useState(true);
  const [mode, setMode] = useState("create");
  const [triggers, setTriggers] = useState([]);
  const [actions, setActions] = useState([]);

  // console.log("trigger: ", JSON.stringify(trigger, null, 2));
  // console.log("workflow: ", JSON.stringify(workflow, null, 2));
  // console.log("variables: ", JSON.stringify(variables, null, 2));

  console.log(mode);

  const getForms = async () => {
    const response2 = await dispatchAPI("GET", "/get-triggers");
    setTriggers(response2.data);
    console.log("triggers: ", JSON.stringify(response2.data, null, 2));
  };

  const getActions = async () => {
    const response = await dispatchAPI("GET", "/get-actions");
    setActions(response.data);
    console.log("actions: ", JSON.stringify(response.data, null, 2));
  };

  const getNode = (nodeId) => {
    return workflow.find((node) => node.id === nodeId);
  };

  const handleDeleteVariable = (variableId) => {
    const newVariables = variables.filter(
      (variable) => variable.id !== variableId
    );
    let workflowString = JSON.stringify(workflow);

    const regex = new RegExp(`\\$\\{${variableId}\\}`, "g");
    workflowString = workflowString.replace(regex, "");

    const newWorkflow = JSON.parse(workflowString);
    setWorkflow(newWorkflow);
    setVariables(newVariables);
  };

  const handleDeleteNode = (nodeId, previousNodeId, thisworkflow) => {
    const currentAction = getNode(nodeId);
    const id = currentAction.next_id > 0 ? currentAction.next_id : -1;
    let newWorkflow = thisworkflow ? [...thisworkflow] : [...workflow];

    if (previousNodeId === 0) {
      setTrigger({
        ...trigger,
        next_id: id,
      });
    } else {
      newWorkflow = newWorkflow.map((node) => {
        if (node.id === previousNodeId) {
          if (node.type === "condition") {
            return node.next_id_success === nodeId
              ? { ...node, next_id_success: id }
              : { ...node, next_id_fail: id };
          } else {
            return {
              ...node,
              next_id: id,
            };
          }
        }
        return node;
      });
    }

    const index = newWorkflow.findIndex((node) => node.id === nodeId);
    newWorkflow.splice(index, 1);

    const variableIds = variables
      .filter((variable) => variable.refer === nodeId)
      .map((variable) => variable.id);

    const newVariables = variables.filter(
      (variable) => variable.refer !== nodeId
    );

    let workflowString = JSON.stringify(newWorkflow);
    variableIds.forEach((id) => {
      const regex = new RegExp(`\\$\\{${id}\\}`, "g");
      workflowString = workflowString.replace(regex, "");
    });
    newWorkflow = JSON.parse(workflowString);

    setVariables(newVariables);
    setWorkflow(newWorkflow);
    return newWorkflow;
  };

  const recursiveDelete = (nodeId, thisworkflow) => {
    const node = getNode(nodeId);
    if (node.next_id > 0) {
      thisworkflow = recursiveDelete(node.next_id, thisworkflow);
    }
    if (node.next_id_success > 0) {
      thisworkflow = recursiveDelete(node.next_id_success, thisworkflow);
    }
    if (node.next_id_fail > 0) {
      thisworkflow = recursiveDelete(node.next_id_fail, thisworkflow);
    }
    return handleDeleteNode(nodeId, node.previous_id, thisworkflow);
  };

  const handleRecursiveDelete = (nodeId) => {
    let newWorkflow = recursiveDelete(nodeId, workflow);
    setWorkflow(newWorkflow);
  };

  const jsonifyWorkflow = () => {
    const triggerToSend = {
      ...trigger,
      type_action: trigger.trigger,
    };
    delete triggerToSend.trigger;
    const actionsToSend = workflow.map((action) => {
      const actionToSend = {
        ...action,
        type_action: action.action,
      };
      delete actionToSend.action;
      return actionToSend;
    });
    const json = {
      name_workflow: workflowInfo.name || "Nom du Workflow",
      description: workflowInfo.description || "Description du Workflow",
      workflow: [triggerToSend, ...actionsToSend],
      variables: [...variables],
    };
    return json;
  };

  const parseWorkflow = (workflow) => {
    const triggerObject = workflow.workflow.find(
      (action) => action.type === "trigger"
    );
    const trigger = {
      ...triggerObject,
      trigger: triggerObject.type_trigger,
    };
    delete trigger.type_trigger;
    const actionsToParse = workflow.workflow.slice(1);
    const actions = actionsToParse.map((action) => {
      const actionToParse = {
        ...action,
        action: action.type_action,
      };
      delete actionToParse.type_action;
      return actionToParse;
    });
    const variables = workflow.variables;
    const workflowInfo = {
      name: workflow.name_workflow,
      description: workflow.description,
      id: workflow.id,
      is_active: workflow.is_active,
    };
    setWorkflowInfo(workflowInfo);
    setTrigger(trigger);
    setWorkflow(actions);
    setVariables(variables);
  };

  useEffect(() => {
    (async () => {
      await getActions();
    })();
  }, [triggers]);

  return (
    <WorkflowContext.Provider
      value={{
        triggers,
        actions,
        workflowInfo,
        setWorkflowInfo,
        trigger,
        setTrigger,
        workflow,
        setWorkflow,
        variables,
        setVariables,
        lastUnfolded,
        setLastUnfolded,
        editable,
        setEditable,
        mode,
        setMode,
        lastNodeId,
        setLastNodeId,
        deleteNode: handleDeleteNode,
        deleteVariable: handleDeleteVariable,
        handleRecursiveDelete,
        parseWorkflow,
        jsonifyWorkflow,
        getForms,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflowContext = () => {
  const context = useContext(WorkflowContext);
  if (context === undefined)
    throw new Error("Context must be used within a context provider");
  return context;
};
