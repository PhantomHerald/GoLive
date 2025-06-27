import { router } from "expo-router";
import { Mail, Phone } from "lucide-react-native";
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

export default function Forgotpassword() {
  const contactsupport = () => {
    router.replace("/Contactsupport");
  };
  const [useemailclicked, setUseEmailClicked] = useState(false);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View>
        <Text
          style={{
            fontWeight: "bold",
            color: "white",
            alignItems: "center",
            textAlign: "center",
            padding: 10,
          }}
        >
          Trouble logging in?
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          height: "100%",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 50,
            color: "white",
            fontWeight: "bold",
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
              placeholderTextColor="black"
              keyboardType="email-address"
            />
            <View style={{ paddingLeft: 20, paddingTop: 30 }}>
              <TouchableOpacity onPress={() => setUseEmailClicked(false)}>
                <Text style={{ color: "white", fontSize: 20 }}>
                  <Phone size={24} color="white" /> Use phone instead
                </Text>
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
              placeholderTextColor="black"
              keyboardType="phone-pad"
            />
            <View style={{ paddingLeft: 20, paddingTop: 30 }}>
              <TouchableOpacity onPress={() => setUseEmailClicked(true)}>
                <Text style={{ color: "white", fontSize: 20 }}>
                  <Mail size={24} color="white" /> Use email instead
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <TouchableOpacity onPress={contactsupport}>
          <Text style={{ color: "white", fontSize: 18 }}>
            {"\n"} Having problems with your email or {"\n"} phone?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#2A2929",
            borderRadius: 10,
            padding: 10,
            marginTop: 70,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
});
