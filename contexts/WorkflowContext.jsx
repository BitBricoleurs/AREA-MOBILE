import { useContext, useState, createContext } from "react";

const WorkflowContext = createContext();

export const WorkflowContextProvider = ({ children }) => {
  const [workflowInfo, setWorkflowInfo] = useState({});
  const [trigger, setTrigger] = useState({});
  const [workflow, setWorkflow] = useState([]);
  const [variables, setVariables] = useState([]);

  console.log("trigger: ", trigger);
  console.log("workflow: ", workflow);
  console.log("variables: ", variables);

  const getNode = (nodeId) => {
    return workflow.find((node) => node.id === nodeId);
  };

  const handleDeleteNode = (nodeId, previousNodeId) => {
    const currentAction = getNode(nodeId);
    const id = currentAction.next_id > 0 ? currentAction.next_id : -1;
    let newWorkflow = [...workflow];

    if (previousNodeId === 0) {
      setTrigger({
        ...trigger,
        next_id: id,
      });
    } else {
      newWorkflow = newWorkflow.map((node) => {
        if (node.id === previousNodeId) {
          return {
            ...node,
            next_id: id,
          };
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

  return (
    <WorkflowContext.Provider
      value={{
        workflowInfo,
        setWorkflowInfo,
        trigger,
        setTrigger,
        workflow,
        setWorkflow,
        variables,
        setVariables,
        deleteNode: handleDeleteNode,
        jsonifyWorkflow,
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
