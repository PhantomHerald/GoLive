import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Circle, SwitchCamera, Video, ZoomIn, ZoomOut } from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SuccessToast from "@/components/SuccessToast";
import { useIsFocused } from "@react-navigation/native";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [recordpressed, setrecordpressed] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const recordingIntervalRef = useRef<number | null>(null);
  const isFocused = useIsFocused();

  // Timer effect for recording, now also depends on isFocused
  useEffect(() => {
    if (recordpressed && isFocused) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    };
  }, [recordpressed, isFocused]);

  // Reset timer only when recording stops
  useEffect(() => {
    if (!recordpressed) {
      setRecordingTime(0);
    }
  }, [recordpressed]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const toggleRecording = () => {
    const newValue = !recordpressed;
    setrecordpressed(newValue);
    if (newValue) {
      setToastMessage("Live session started");
      setShowSuccessToast(true);
    } else {
      setToastMessage("Live session ended");
      setShowSuccessToast(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, height: "70%" }}>
      <SuccessToast
        message={toastMessage}
        visible={showSuccessToast}
        onHide={() => setShowSuccessToast(false)}
      />
      <View style={styles.container}>
        {isFocused && permission.granted && (
          <CameraView 
            style={styles.camera} 
            facing={facing}
          >
            {/* Recording Timer */}
            {recordpressed && (
              <View style={styles.timerContainer}>
                <View style={styles.timerBackground}>
                  <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
                </View>
              </View>
            )}

            {/* Recording Indicator */}
            <View style={styles.recordingIndicator}>
              {recordpressed && <Circle color="red" fill={"red"} size={10} />}
            </View>

            {/* Camera Controls */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <SwitchCamera size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.recordButton}
                onPress={toggleRecording}
              >
                <Video
                  size={24}
                  color={recordpressed ? "red" : "white"}
                  fill={recordpressed ? "red" : "white"}
                />
              </TouchableOpacity>
            </View>
          </CameraView>
        )}
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
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  button: {
    padding: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 35,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  timerContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  timerBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  recordingIndicator: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    padding: 8,
    zIndex: 10,
  },
  recordButton: {
    padding: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 35,
  },
});
