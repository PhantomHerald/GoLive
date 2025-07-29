import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import {
  Circle,
  SwitchCamera,
  Video,
  ZoomIn,
  ZoomOut,
} from "lucide-react-native";
import React, { useState, useEffect, useRef } from "react";
import { Modal, Pressable, ActivityIndicator } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SuccessToast from "@/components/SuccessToast";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { environment } from "@/config/environment";

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

function Create() {
  const [showModal, setShowModal] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [recordpressed, setrecordpressed] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const recordingIntervalRef = useRef<number | null>(null);
  const isFocused = useIsFocused();
  // Store previous tab route
  const prevRouteRef = useRef<string | null>(null);
  const [muxStreamKey, setMuxStreamKey] = useState<string | null>(null);
  const [muxPlaybackId, setMuxPlaybackId] = useState<string | null>(null);
  const [muxStreamId, setMuxStreamId] = useState<string | null>(null);
  const [muxLoading, setMuxLoading] = useState(false);
  const [muxError, setMuxError] = useState<string | null>(null);
  const { token: authToken } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      // Save the previous route when this tab is focused
      // @ts-ignore: router.history is not officially typed in expo-router
      prevRouteRef.current = (router as any)?.history?.entries?.[(router as any)?.history?.index - 1]?.pathname || null;
      setShowModal(true);
      setShowCamera(false);
    }, [])
  );

  // Timer effect for recording, now also depends on isFocused
  useEffect(() => {
    if (recordpressed && isFocused) {
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        window.clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }

    return () => {
      if (recordingIntervalRef.current) {
        window.clearInterval(recordingIntervalRef.current);
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
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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

  // Handler for Upload
  const handleUpload = async () => {
    setShowModal(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setToastMessage("Media Uploaded Successfully");
      setShowSuccessToast(true);
    }
  };

  const handleGoLiveMux = async () => {
    setMuxLoading(true);
    setMuxError(null);
    try {
      if (!authToken) throw new Error("Not authenticated");
      const token = `Bearer ${authToken}`;
      const res = await fetch(`${environment.API_BASE_URL}/api/streams/mux`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify({ title: "My MUX Stream" }),
      });
      if (!res.ok) throw new Error("Failed to create MUX stream");
      const data = await res.json();
      setMuxStreamKey(data.streamKey);
      setMuxPlaybackId(data.muxPlaybackId);
      setMuxStreamId(data.muxStreamId);
      setShowCamera(false);
    } catch (e: any) {
      setMuxError(e.message || "Unknown error");
    } finally {
      setMuxLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, height: "70%" }}>
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowModal(false);
          // If modal is closed by tapping outside, revert to previous tab
          const validTabs = ["/Home", "/Browse", "/Activity", "/Profile"] as const;
          type TabRoute = typeof validTabs[number];
          if (prevRouteRef.current && (validTabs as readonly string[]).includes(prevRouteRef.current)) {
            router.replace(prevRouteRef.current as TabRoute);
          } else {
            router.replace("/Home"); // fallback
          }
        }}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setShowModal(false);
            // If modal is closed by tapping outside, revert to previous tab
            const validTabs = ["/Home", "/Browse", "/Activity", "/Profile"] as const;
            type TabRoute = typeof validTabs[number];
            if (prevRouteRef.current && (validTabs as readonly string[]).includes(prevRouteRef.current)) {
              router.replace(prevRouteRef.current as TabRoute);
            } else {
              router.replace("/Home"); // fallback
            }
          }}
        >
          <View
            style={{
              backgroundColor: "#18181b",
              borderRadius: 20,
              padding: 32,
              minWidth: 250,
              alignItems: "center",
            }}
            // Prevent closing when pressing inside the modal
            onStartShouldSetResponder={() => true}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 24,
              }}
            >
              Create
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#006eff",
                borderRadius: 10,
                paddingVertical: 14,
                paddingHorizontal: 32,
                marginBottom: 16,
                width: 180,
                alignItems: "center",
              }}
              onPress={handleGoLiveMux}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
                Go Live
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#28282E",
                borderRadius: 10,
                paddingVertical: 14,
                paddingHorizontal: 32,
                width: 180,
                alignItems: "center",
              }}
              onPress={handleUpload}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
                Upload
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      <SuccessToast
        message={toastMessage}
        visible={showSuccessToast}
        onHide={() => setShowSuccessToast(false)}
        top={70}
      />
      {muxStreamKey && (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>MUX Stream Created!</Text>
          <Text style={{ color: '#fff', marginBottom: 4 }}>RTMP URL:</Text>
          <Text selectable style={{ color: '#00e', marginBottom: 8 }}>rtmps://global-live.mux.com:443/app</Text>
          <Text style={{ color: '#fff', marginBottom: 4 }}>Stream Key:</Text>
          <Text selectable style={{ color: '#00e', marginBottom: 8 }}>{muxStreamKey}</Text>
          <Text style={{ color: '#fff', marginBottom: 4 }}>Playback HLS URL:</Text>
          <Text selectable style={{ color: '#00e', marginBottom: 8 }}>https://stream.mux.com/{muxPlaybackId}.m3u8</Text>
          <Text style={{ color: '#fff', marginTop: 12, fontSize: 16 }}>
            Use a compatible RTMP app or dev client to push your camera stream to the above RTMP URL and stream key.
          </Text>
        </View>
      )}
      {muxLoading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 24 }} />}
      {muxError && <Text style={{ color: 'red', marginTop: 12 }}>{muxError}</Text>}
      <View style={styles.container}>
        {isFocused && permission.granted && showCamera && (
          <CameraView style={styles.camera} facing={facing}>
            {/* Recording Timer */}
            {recordpressed && (
              <View style={styles.timerContainer}>
                <View style={styles.timerBackground}>
                  <Text style={styles.timerText}>
                    {formatTime(recordingTime)}
                  </Text>
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

export default Create;
