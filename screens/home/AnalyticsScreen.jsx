import { View, Text } from "react-native";
import WorkflowUsage from "../../components/analytics/workflowUsage";
import SuccessRate from "../../components/analytics/successRate";

const AnalyticsContent = ({ refresh }) => {
  return (
    <>
      <WorkflowUsage refresh={refresh} />
      <SuccessRate refresh={refresh} />
    </>
  );
};

export default AnalyticsContent;
