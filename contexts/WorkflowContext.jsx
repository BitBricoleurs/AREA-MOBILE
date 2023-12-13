import { useContext, useState, createContext } from "react";

const WorkflowContext = createContext();

export const WorkflowContextProvider = ({ children }) => {
  const [trigger, setTrigger] = useState({});
  const [workflow, setWorkflow] = useState([]);
  const [variables, setVariables] = useState([]);

  console.log("trigger: ", trigger);
  console.log("workflow: ", workflow);
  console.log("variables: ", variables);

  return (
    <WorkflowContext.Provider
      value={{
        trigger,
        setTrigger,
        workflow,
        setWorkflow,
        variables,
        setVariables,
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
