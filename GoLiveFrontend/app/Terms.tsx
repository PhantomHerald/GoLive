import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { router } from "expo-router";
import React from "react";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function TermsPage() {
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
          <Text style={styles.topBarTitle}>Terms of Service</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>By accessing or using GoLive, you agree to be bound by these Terms and Conditions. 
          These terms apply to all users of the platform, including streamers, viewers, and creators. 
          Your use of the app signifies your understanding and acceptance of all current terms, including any changes we may make. 
          If you disagree with any portion of these terms, you should discontinue your use of GoLive. Continued use of the platform after updates constitutes your acceptance of the revised terms.</Text>
        <Text style={styles.sectionTitle}>2. User Conduct</Text>
        <Text style={styles.text}>You agree to use GoLive in a lawful, respectful, and responsible manner. 
          You must not engage in behavior that is abusive, hateful, discriminatory, violent, or otherwise harmful to other users or the platform itself. 
          Activities such as harassment, impersonation, spamming, spreading misinformation, or introducing malware are strictly prohibited. 
          You may not use GoLive for illegal activities or violate any laws while using the service. 
          We reserve the right to investigate and take appropriate action, including suspending or banning accounts, if these terms are violated.</Text>
        <Text style={styles.sectionTitle}>3. Content</Text>
        <Text style={styles.text}>You are solely responsible for any content you stream, post, or share through GoLive. 
          This includes live broadcasts, videos, images, chat messages, and other media. 
          You must ensure that your content does not infringe upon intellectual property rights, violate privacy laws, or include harmful or illegal material. 
          By sharing content on GoLive, you grant us a limited, non-exclusive license to use, display, and distribute that content within the app for the purpose of providing our services. 
          GoLive retains the right to remove content that violates our community guidelines or applicable laws.</Text>
        <Text style={styles.sectionTitle}>4. Changes to Terms</Text>
        <Text style={styles.text}>GoLive may revise these Terms and Conditions from time to time. 
          Any changes will be made available through the app or our website, and the "last updated" date will be revised accordingly. 
          While we may notify users of major updates, you are responsible for checking the terms periodically. 
          Your continued use of GoLive following any changes signifies your acceptance of the updated terms. 
          If at any time you do not agree with the terms, you should stop using the service.</Text>
        <Text style={styles.sectionTitle}>5. Account Termination</Text>
        <Text style={styles.text}>We reserve the right to suspend or terminate your account at our discretion, with or without notice, if we believe you have violated these terms or pose a threat to the GoLive community. 
          You may also choose to delete your account at any time via the app settings or by contacting our support team. 
          Upon termination, your access to your account and any content you have uploaded may be removed, though we may retain some data as required by law or for legitimate business purposes, as outlined in our Privacy Policy.</Text>
        <Text style={styles.sectionTitle}>6. License to Use the App</Text>
        <Text style={styles.text}>Subject to your compliance with these Terms and Conditions, GoLive grants you a limited, non-transferable, revocable license to download, install, and use the app on your personal device for your individual, non-commercial use. 
          You may not copy, distribute, modify, reverse engineer, or create derivative works based on any part of the app unless expressly permitted in writing. 
          All rights not expressly granted to you under these terms remain with GoLive and its licensors.</Text>
        <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
        <Text style={styles.text}>To the fullest extent permitted by law, GoLive and its affiliates will not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the app. 
          This includes but is not limited to damages related to loss of data, loss of income, service interruptions, or unauthorized access to your account. 
          While we strive to provide a reliable service, we do not guarantee that GoLive will be error-free, uninterrupted, or completely secure at all times.</Text>
        <Text style={styles.sectionTitle}>8. Governing Law</Text>
        <Text style={styles.text}>These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction in which GoLive operates, without regard to conflict of law principles. 
          Any disputes or claims arising from the use of GoLive shall be resolved through negotiation or in courts located in that jurisdiction, unless otherwise agreed. 
          By using GoLive, you consent to the exclusive jurisdiction of these courts for any legal matters related to your use of the platform.</Text>
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
    marginTop: 40,
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
  sectionTitle: {
    color: "#BF94FE",
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
}); 