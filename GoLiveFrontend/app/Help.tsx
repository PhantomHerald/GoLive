import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { router } from "expo-router";
import React from "react";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function HelpPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0e0e10" }}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        >
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.topBarTitleContainer}>
          <Text style={styles.topBarTitle}>Help & FAQ</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.question}>How do I start a stream?</Text>
        <Text style={styles.answer}>Go to the Create tab and follow the instructions to start streaming live.</Text>
        <Text style={styles.question}>How do I reset my password?</Text>
        <Text style={styles.answer}>Go to Account settings and select 'Change Password'.</Text>
        <Text style={styles.question}>How do I report a user?</Text>
        <Text style={styles.answer}>Tap the three dots on their content and select 'Report'.</Text>
        <Text style={styles.question}>Need more help?</Text>
        <Text style={styles.answer}>Contact support at support@golive.com.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    position: 'relative',
    backgroundColor: "#0e0e10",
    marginTop:40,
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
  question: {
    color: "#BF94FE",
    fontSize: 18,
    fontWeight: "bold",
  },
  answer: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
}); 