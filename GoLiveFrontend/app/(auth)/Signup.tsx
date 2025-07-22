import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import authService from "../../services/authService";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import SuccessToast from "@/components/SuccessToast";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("US");
  const [useemailclicked, setUseEmailClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const clearAllInputs = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setMonth("");
    setDay("");
    setYear("");
    setPhone("");
    setShowPass(false);
  };

  const handleSigninAndNavigate = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Check if all date of birth fields are filled
    if (!month.trim() || !day.trim() || !year.trim()) {
      Alert.alert("Error", "Please fill in all date of birth fields");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.signup({
        username: username.trim(),
        email: email.trim(),
        password: password,
        birthMonth: month ? parseInt(month) : undefined,
        birthDay: day ? parseInt(day) : undefined,
        birthYear: year ? parseInt(year) : undefined,
      });

      if (response.token) {
        // Show success toast
        setShowSuccessToast(true);
        // Auto-navigate after 2.5 seconds (toast shows for 2 seconds)
        setTimeout(() => {
          router.replace("/(tabs)/Home");
        }, 2500);
      } else {
        Alert.alert("Error", "Signup failed. Please try again.");
        clearAllInputs(); // Clear all inputs on failure
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      Alert.alert("Error", error.message || "Signup failed. Please try again.");
      clearAllInputs(); // Clear all inputs on error
    } finally {
      setLoading(false);
    }
  };

  const handleback = () => {
    router.replace("/onboarding");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "", padding: 10 }}>
        <SuccessToast
          message="Account created successfully!"
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
            <Text style={styles.title}>Join Twitch today</Text>
            <View style={styles.placeholder} />
          </View>
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
              editable={!loading}
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
                editable={!loading}
              />
              <TextInput
                style={[styles.input, styles.dobInput]}
                placeholder="Day"
                placeholderTextColor="#aaa"
                value={day}
                onChangeText={setDay}
                keyboardType="numeric"
                maxLength={2}
                editable={!loading}
              />
              <TextInput
                style={[styles.input, styles.dobInput]}
                placeholder="Year"
                placeholderTextColor="#aaa"
                value={year}
                onChangeText={setYear}
                keyboardType="numeric"
                maxLength={4}
                editable={!loading}
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
                    editable={!loading}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setUseEmailClicked(false)}
                  style={{ width: "auto", alignSelf: "flex-start" }}
                  disabled={loading}
                >
                  <Text
                    style={[styles.emailInstead, loading && { opacity: 0.5 }]}
                  >
                    Use email instead
                  </Text>
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
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setUseEmailClicked(true)}
                  style={{ width: "auto", alignSelf: "flex-start" }}
                  disabled={loading}
                >
                  <Text
                    style={[styles.emailInstead, loading && { opacity: 0.5 }]}
                  >
                    Use phone instead
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* Terms */}
            <Text style={styles.terms}>
              By tapping Sign Up, you are agreeing to Twitch's{" "}
              <Text style={styles.link}>Terms of Services</Text> and are
              acknowledging our <Text style={styles.link}>Privacy Notice</Text>{" "}
              applies.
            </Text>

            {/* Sign up button */}
            <TouchableOpacity
              style={[styles.signupBtn, loading && styles.signupBtnDisabled]}
              onPress={handleSigninAndNavigate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={[styles.signupBtnText, { fontWeight: "600", textAlign: "center", textAlignVertical: "center" }]}>Sign up</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    justifyContent: "space-between",
  },
  backBtn: {
    padding: 4,
    borderRadius: 20,
    width: 40,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
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
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 16,
    height: 50,
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
    color: "#006eff",
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
    color: "#006eff",
    textDecorationLine: "underline",
  },
  signupBtn: {
    backgroundColor: "#006eff",
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
  signupBtnDisabled: {
    backgroundColor: "#555",
  },
  placeholder: {
    width: 40,
  },
});
