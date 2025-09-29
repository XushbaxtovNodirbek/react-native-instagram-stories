import { StyleSheet } from "react-native";
import { WIDTH, HEIGHT } from "../../core/constants";

export default StyleSheet.create({
  container: {
    borderRadius: 25.5,
    overflow: "hidden",
    width: WIDTH,
    marginTop: 23,
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 3,
  },
});
