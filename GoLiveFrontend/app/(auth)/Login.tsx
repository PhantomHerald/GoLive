import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLoginAndNavigate = () => {
    alert("Logged in!");
    router.replace("/Home");
  };
  const forgotpassword = () => {
    router.replace("/Forgotpassword");
  };
  const handleback = () => {
    router.replace("/onboarding");
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={handleback}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
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
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
});
