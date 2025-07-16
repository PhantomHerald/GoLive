import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import SuccessToast from "@/components/SuccessToast";
import userService from "@/services/userService";
import { Colors } from "@/constants/Colors";

export default function ChangeEmail() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the current user profile to get the current email
    userService.getCurrentUser().then(user => setCurrentEmail(user.email)).catch(() => setCurrentEmail(""));
  }, []);

  const handleBack = () => router.back();

  const handleSendVerification = async () => {
    if (!newEmail.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await userService.changeEmail(newEmail.trim(), password);
      setShowSuccess(true);
      setCurrentEmail(newEmail.trim());
      setNewEmail("");
      setPassword("");
    } catch (err: any) {
      let msg = err.message || "Failed to change email";
      if (msg.toLowerCase().includes("password")) {
        Alert.alert("Incorrect Password", "The password you entered is incorrect.");
      } else if (msg.toLowerCase().includes("already in use")) {
        Alert.alert("Email In Use", "The new email address is already in use.");
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background.default }}>
      <SuccessToast
        message="Email changed successfully!"
        visible={showSuccess}
        onHide={() => setShowSuccess(false)}
        top={70}
      />
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.heading}>Change Email</Text>
        <View style={{ width: 40 }} />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.container}>
          <Text style={styles.label}>Current Email</Text>
          <View style={styles.inputRow}>
            <Icon name="email-outline" size={22} color="#888" style={styles.icon} />
            <TextInput
              style={[styles.input, { color: '#fff' }]}
              value={currentEmail}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>
          <Text style={styles.label}>New Email</Text>
          <View style={styles.inputRow}>
            <Icon name="email-edit-outline" size={22} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter new email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={newEmail}
              onChangeText={setNewEmail}
              editable={!loading}
            />
          </View>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <Icon name="lock-outline" size={22} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#888"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPass((v) => !v)} style={styles.eyeBtn}>
              <Icon name={showPass ? "eye-off-outline" : "eye-outline"} size={22} color="#888" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendVerification}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Save Change</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.default,
  },
  backBtn: {
    padding: 4,
    borderRadius: 20,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    flex: 1,
    fontSize: 20,
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28282E",
    borderRadius: 8,
    marginBottom: 8,
    height: 50,
    paddingHorizontal: 10,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 16,
    height: 50,
  },
  eyeBtn: {
    padding: 8,
  },
  button: {
    backgroundColor: "#9147FF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 32,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  error: {
    color: Colors.error.main,
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
}); 