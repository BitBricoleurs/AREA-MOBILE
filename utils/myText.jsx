import { Text } from "react-native";

export default (props) => {
  const defaultStyle = {
    fontFamily: "Outfit_500Medium",
  };
  const incomingStyle =
    props.style instanceof Array ? props.style : [props.style];
  return <Text {...props} style={[defaultStyle, ...incomingStyle]} />;
};
