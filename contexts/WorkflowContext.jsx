import { useContext, useState, createContext } from "react";

const WorkflowContext = createContext();

export const WorkflowContextProvider = ({ children }) => {
  const [trigger, setTrigger] = useState({});

  console.log("trigger: ", trigger);

  return (
    <WorkflowContext.Provider
      value={{
        trigger,
        setTrigger,
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
