import { router } from "expo-router";
import { Mail, Phone } from "lucide-react-native";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams } from "expo-router";

type ForgotPasswordParams = { from?: string };

export default function Forgotpassword() {
  const params = useLocalSearchParams<ForgotPasswordParams>();

  const contactsupport = () => {
    router.replace("/Contactsupport");
  };

  const handleback = () => {
    if (typeof params.from === 'string') {
      router.replace(params.from as any); // Type assertion to bypass the type error for dynamic routes
    } else {
      router.replace("/(auth)/Login");
    }
  };

  const handleContinue = () => {
    // TODO: Implement password reset logic
    console.log("Continue button pressed");
  };
  
  const [useemailclicked, setUseEmailClicked] = useState(true);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={handleback}>
            <Icon name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.troubleText}>Trouble logging in?</Text>
          <View style={styles.placeholder} />
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ height: "100%", padding: 20 }}>
              <Text
                style={{
                  fontSize: 50,
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "left",
                  marginTop: 20,
                  paddingLeft: 10,
                }}
              >
                Getting back {"\n"}into your {"\n"}account
              </Text>
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  paddingLeft: 10,
                  fontSize: 20,
                  paddingTop: 10,
                }}
              >
                Tell us some information{"\n"} about your account
              </Text>
              {useemailclicked ? (
                <>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      paddingLeft: 10,
                      fontSize: 20,
                    }}
                  >
                    {"\n"} Email
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { marginBottom: 0, marginLeft: 10, marginTop: 10 },
                    ]}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                  />
                  <View style={{ paddingLeft: 20, paddingTop: 30 }}>
                    <TouchableOpacity onPress={() => setUseEmailClicked(false)}>
                      <View style={styles.optionContainer}>
                        <Phone size={24} color="#888" />
                        <Text style={styles.optionText}>Use phone instead</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      paddingLeft: 10,
                      fontSize: 20,
                    }}
                  >
                    {"\n"} Phone
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { marginBottom: 0, marginLeft: 10, marginTop: 10 },
                    ]}
                    placeholder="Phone"
                    placeholderTextColor="#888"
                    keyboardType="phone-pad"
                  />
                  <View style={{ paddingLeft: 20, paddingTop: 30 }}>
                    <TouchableOpacity onPress={() => setUseEmailClicked(true)}>
                      <View style={styles.optionContainer}>
                        <Mail size={24} color="#888" />
                        <Text style={styles.optionText}>Use email instead</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <TouchableOpacity onPress={contactsupport}>
                <Text style={{ color: "#006eff", fontSize: 18 }}>
                  {"\n"} Having problems with your email or {"\n"} phone?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#2A2929",
                  borderRadius: 10,
                  padding: 10,
                  marginTop: 50,
                  alignItems: "center",
                }}
                onPress={handleContinue}
              >
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: "#28282E",
    borderRadius: 8,
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 16,
    marginBottom: 16,
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
  troubleText: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
});
