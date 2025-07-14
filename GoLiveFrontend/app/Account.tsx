import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import userService from "../services/userService";
import SuccessToast from "../components/SuccessToast";
import { useHeaderHeight } from '@react-navigation/elements';

export default function Account() {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const headerHeight = useHeaderHeight();

  const handleBack = () => {
    router.back();
  };

  const handleDeleteAccount = () => {
    router.push("ConfirmDeleteAccount");
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
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          >
            <Icon name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.topBarTitleContainer}>
            <Text style={styles.topBarTitle}>Account</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>My Subscriptions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Log out of Amazon Prime</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Disable Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteAccount}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: '#ff4d4f' }]}>Permanently Delete Account</Text>
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
    paddingTop: 10,
    marginTop: 10,
  },
  button: {
    width: '100%',
    backgroundColor: "#2A2929",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: '#ff4d4f',
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  backBtn: {
    padding: 12,
    zIndex: 1,
    position: 'relative',
    left: 10,
  },
});
