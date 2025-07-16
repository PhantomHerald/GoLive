import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import userService from "../services/userService";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import SuccessToast from "@/components/SuccessToast";

export default function ConfirmDeleteAccount() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password.");
      return;
    }
    if (deleted) {
      Alert.alert("Account Deleted", "This account has already been deleted.");
      return;
    }
    Alert.alert(
      "Permanently Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await userService.deleteAccount(password);
              setShowSuccess(true);
              setDeleted(true);
              setTimeout(() => {
                setShowSuccess(false);
                router.replace("/(auth)/Login");
              }, 2000);
            } catch (error: any) {
              Alert.alert("Error", error.message || "Incorrect password or failed to delete account.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <SuccessToast
        message="Account deleted successfully!"
        visible={showSuccess}
        onHide={() => setShowSuccess(false)}
        top={70}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}>
            <Icon name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.topBarTitleContainer}>
            <Text style={styles.topBarTitle}>Delete Account</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.container}>
          <Text style={styles.label}>Enter password to permanently delete this account:</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.deleteButton, (loading || deleted) && { opacity: 0.6 }]}
            onPress={handleDelete}
            disabled={loading || deleted}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  label: {
    color: "white",
    fontSize: 17,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#222",
    color: "white",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  deleteButton: {
    width: "100%",
    backgroundColor: "#ff4d4f",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: 'space-between',
    position: 'relative',
  },
  topBarTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  backBtn: {
    padding: 12,
    zIndex: 1,
    position: 'relative',
    left: 0,
  },
});