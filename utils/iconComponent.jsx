import { Image } from "react-native";
import { icons } from "./iconMap";

export default ({ name, style }) => {
  if (name === undefined) return null;
  const icon = icons[name];
  return icon ? <Image source={icon} style={style} /> : null;
};
