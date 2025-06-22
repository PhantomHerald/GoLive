import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("US");
  const [useemailclicked, setUseEmailClicked] = useState(false);
  const handleSigninAndNavigate = () => {
    alert("Signned Up!");
    router.replace("/Home");
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "", padding: 10 }}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Join Twitch today</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPass((v) => !v)}
          style={styles.eyeBtn}
        >
          <Icon
            name={showPass ? "eye-off-outline" : "eye-outline"}
            size={24}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Date of birth</Text>
      <View style={styles.dobRow}>
        <TextInput
          style={[styles.input, styles.dobInput]}
          placeholder="Month"
          placeholderTextColor="#aaa"
          value={month}
          onChangeText={setMonth}
          keyboardType="numeric"
          maxLength={2}
        />
        <TextInput
          style={[styles.input, styles.dobInput]}
          placeholder="Day"
          placeholderTextColor="#aaa"
          value={day}
          onChangeText={setDay}
          keyboardType="numeric"
          maxLength={2}
        />
        <TextInput
          style={[styles.input, styles.dobInput]}
          placeholder="Year"
          placeholderTextColor="#aaa"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          maxLength={4}
        />
      </View>

      {useemailclicked ? (
        <>
          <Text style={styles.label}>Phone number</Text>
          <View style={styles.inputRow}>
            <View style={styles.countryBox}>
              <Text style={{ color: "#fff" }}>US</Text>
            </View>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Phone number"
              placeholderTextColor="#aaa"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          <TouchableOpacity
            onPress={() => setUseEmailClicked(false)}
            style={{ width: "auto", alignSelf: "flex-start" }}
          >
            <Text style={styles.emailInstead}>Use email instead</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="E-mail"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
            />
          </View>
          <TouchableOpacity
            onPress={() => setUseEmailClicked(true)}
            style={{ width: "auto", alignSelf: "flex-start" }}
          >
            <Text style={styles.emailInstead}>Use phone instead</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Terms */}
      <Text style={styles.terms}>
        By tapping Sign Up, you are agreeing to Twitch’s{" "}
        <Text style={styles.link}>Terms of Services</Text> and are acknowledging
        our <Text style={styles.link}>Privacy Notice</Text> applies.
      </Text>

      {/* Sign up button */}
      <TouchableOpacity
        style={styles.signupBtn}
        onPress={handleSigninAndNavigate}
      >
        <Text style={styles.signupBtnText}>Sign up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "black",
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
  card: {
    backgroundColor: "#18181b",
    borderRadius: 28,
    padding: 24,
    marginHorizontal: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "left",
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
    marginTop: 16,
    textAlign: "left",
  },
  input: {
    backgroundColor: "#28282E",
    borderRadius: 8,
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 16 : 14,
    fontSize: 16,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  eyeBtn: {
    padding: 8,
    position: "absolute",
    right: 0,
  },
  dobRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dobInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  countryBox: {
    backgroundColor: "#28282E",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emailInstead: {
    color: "#9147FF",
    fontWeight: "600",
    marginBottom: 16,
    marginTop: 4,
    textAlign: "left",
  },
  terms: {
    color: "#fff",
    fontSize: 13,
    marginBottom: 16,
    marginTop: 8,
    textAlign: "left",
  },
  link: {
    color: "#9147FF",
    textDecorationLine: "underline",
  },
  signupBtn: {
    backgroundColor: "#9147FF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  signupBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
