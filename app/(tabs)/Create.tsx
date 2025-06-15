import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Circle, SwitchCamera, Video } from "lucide-react-native";
import { useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [recordpressed, setrecordpressed] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <SafeAreaView style={{ flex: 1, height: "70%" }}>
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            {recordpressed && <Circle color="red" fill={"red"} />}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <SwitchCamera size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                const newValue = !recordpressed;
                setrecordpressed(newValue);
                if (newValue) {
                  alert("Recording started. Live session started");
                } else {
                  alert("Recording stopped. Live session ended");
                }
              }}
            >
              <Video
                size={24}
                color={recordpressed ? "red" : "white"}
                fill={recordpressed ? "red" : "white"}
              />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    height: "70%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
