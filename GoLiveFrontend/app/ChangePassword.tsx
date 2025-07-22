import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, KeyboardAvoidingView, Alert, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import SuccessToast from "@/components/SuccessToast";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import userService from "@/services/userService";

export default function ChangePassword() {
  const params = useLocalSearchParams();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleBack = () => {
    if (params.from === "Account") {
      router.replace("/Account");
    } else {
      router.back();
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await userService.changePassword(currentPassword, newPassword);
      setShowSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0e0e10" }}>
      <SuccessToast
        message="Password changed successfully!"
        visible={showSuccess}
        onHide={() => setShowSuccess(false)}
        top={70}
      />
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headingText}>Change Password</Text>
        <View style={styles.placeholder} />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={[styles.label, { marginTop: 8 }]}>Current Password</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                placeholderTextColor="#888"
                secureTextEntry={!showCurrent}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowCurrent((v) => !v)} style={styles.eyeBtn}>
                <Icon name={showCurrent ? "eye-off-outline" : "eye-outline"} size={22} color="#888" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => router.push({ pathname: '/(auth)/Forgotpassword', params: { from: '/ChangePassword' } }) } style={{ alignSelf: 'flex-start', marginTop: 2 }}>
              <Text style={{ color: "#006eff", marginBottom: 15, fontSize: 15, fontWeight: "500" }}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={{ height: 8 }} />
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#888"
                secureTextEntry={!showNew}
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowNew((v) => !v)} style={styles.eyeBtn}>
                <Icon name={showNew ? "eye-off-outline" : "eye-outline"} size={22} color="#888" />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#888"
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowConfirm((v) => !v)} style={styles.eyeBtn}>
                <Icon name={showConfirm ? "eye-off-outline" : "eye-outline"} size={22} color="#888" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleChangePassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={[styles.buttonText, { fontWeight: "500", textAlign: "center", textAlignVertical: "center" }]}>Change Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    backgroundColor: "#0e0e10",
  },
  backBtn: {
    padding: 4,
    borderRadius: 20,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    flex: 1,
    fontSize: 20,
  },
  placeholder: {
    width: 40,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28282E',
    borderRadius: 8,
    marginBottom: 8,
    height: 50,
    paddingHorizontal: 10,
    width: '100%',
  },
  eyeBtn: {
    padding: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 16,
    height: 50,
  },
  button: {
    backgroundColor: "#006eff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 32,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
}); 