import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function Contactsupport() {
  const handleback = () => {
    router.replace("/Forgotpassword");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={handleback}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>We need more {"\n"} information</Text>
        <View>
          <Text style={styles.info}>
            For your security, we need information from you that only you the
            owner of this account will know. This is the best way for us to
            verify that you own this account and get it back to you.
          </Text>
        </View>
        <View>
          <Text style={styles.moreinfo}>
            Please contact our Support team below to get started. They will
            reach out with a response as soon as possible.
          </Text>
        </View>
        <TouchableOpacity
          style={{
            alignContent: "center",
            alignItems: "center",
            backgroundColor: "#2A2929",
            borderRadius: 10,
            paddingVertical: 12,
            paddingHorizontal: 32,
            marginTop: 24,
          }}
          onPress={() => {
            alert("Calling support team");
          }}
        >
          <Text style={styles.buttontext}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    paddingHorizontal: 20,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 40,
    textAlign: "center",
    marginBottom: 24,
  },
  info: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 30,
    textAlign: "left",
    marginBottom: 16,
  },
  moreinfo: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 30,
    textAlign: "left",
    marginBottom: 24,
  },
  buttontext: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backBtn: {
    padding: 5,
  },
});
