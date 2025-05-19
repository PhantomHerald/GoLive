import { StyleSheet } from "react-native";

import { Text } from "react-native";
export default function create() {
  return <Text style={styles.Text}> open camera</Text>;
}

const styles = StyleSheet.create({
  Text: {
    color: "white",
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 20,
    padding: 30,
  },
});
