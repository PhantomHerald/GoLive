import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import authService from "../../services/authService";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import SuccessToast from "@/components/SuccessToast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleLoginAndNavigate = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Hardcoded admin login
      if (email.trim() === "admin" && password === "admin") {
        setShowSuccessToast(true);
        setTimeout(() => {
          router.replace("/(tabs)/Home");
        }, 2500);
        return;
      }
      // Try to login with email/username
      const response = await authService.login({
        email: email.trim(),
        password: password,
      });

      if (response.token) {
        setShowSuccessToast(true);
        setTimeout(() => {
          router.replace("/(tabs)/Home");
        }, 2500);
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
        setPassword("");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Error", error.message || "Login failed. Please try again.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const forgotpassword = () => {
    router.replace("/Forgotpassword");
  };

  const handleback = () => {
    router.replace("/onboarding");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1 }}>
        <SuccessToast
          message="Login successful!"
          visible={showSuccessToast}
          onHide={() => setShowSuccessToast(false)}
          top={70}
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={handleback}>
              <Icon name="arrow-left" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <Text style={styles.title}>Welcome Back </Text>
              <Text
                style={{
                  color: "white",
                  padding: 10,
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                Username
              </Text>
              <View style={styles.inputContainer}>
                <Icon name="email-outline" size={25} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username/Email"
                  placeholderTextColor="#666"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />
              </View>
              <Text
                style={{
                  color: "white",
                  padding: 10,
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                Password
              </Text>
              <View style={styles.inputRow}>
                <Icon name="lock-outline" size={25} style={styles.icon} />
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Password"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPass((v) => !v)}
                  style={styles.eyeBtn}
                  disabled={loading}
                >
                  <Icon
                    name={showPass ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              <View style={{ width: "100%", alignItems: "flex-end" }}>
                <TouchableOpacity onPress={forgotpassword} disabled={loading}>
                  <Text
                    style={{
                      color: "#9147FF",
                      marginBottom: 20,
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLoginAndNavigate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignContent: "center",
    display: "flex",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  backBtn: {
    padding: 4,
    borderRadius: 20,
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: "contain",
    marginBottom: 20,
    borderRadius: 100,
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#28282E",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
    color: "#666",
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#8e36d1",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  buttonDisabled: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#28282E",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  eyeBtn: {
    padding: 4,
    borderRadius: 20,
  },
});
