import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginAndNavigate = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter both username/email and password.");
      return;
    }
    // Demo login for development without backend
    if (email === "gerald" && password === "iamadmin") {
      setError("");
      router.replace("/Home");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const data = await response.json();
      if (data.token) {
        setError("");
        router.replace("/Home");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
    setLoading(false);
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
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={handleback}>
            <Icon name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back </Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
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
          <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={25} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity onPress={forgotpassword}>
            <Text
              style={{
                color: "#9147FF",
                textAlign: "right",
                width: "100%",
                marginBottom: 20,
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLoginAndNavigate}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
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
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#9147FF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
});
