import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    position: "absolute",
    left: 8,
    top: 8,
  },
  containerFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatar: {
    borderWidth: 1.5,
    borderColor: "#FFF",
    overflow: "hidden",
  },
  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.58)",
  },
});
