import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { router } from "expo-router";
import React from "react";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function PrivacyPage() {
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
          <Text style={styles.topBarTitle}>Privacy Policy</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>1. Data Collection</Text>
        <Text style={styles.text}>When you use GoLive, we collect various types of data to ensure a high-quality user experience and reliable service delivery. 
          This includes the information you voluntarily provide, such as your name, email address, username, and profile details when signing up or updating your account. 
          We also collect data based on your usage of the platform — for example, when you start or join a livestream, interact through chats, follow other users, or engage with in-app content. 
          Additionally, we may gather technical data such as your device type, operating system, app version, IP address, and general location. This helps us understand how the app is used, identify issues, and make improvements. 
          All collected data is stored securely and used in accordance with our privacy principles.</Text>
        <Text style={styles.sectionTitle}>2. Use of Data</Text>
        <Text style={styles.text}>The data we collect is essential to operating and improving the GoLive platform. It enables us to provide core services, such as creating user accounts, enabling live video streams, delivering push notifications, and maintaining smooth communication features like chat and follow systems. 
          Beyond this, we analyze the data to understand how our users engage with the app — helping us personalize your experience, recommend relevant content, and introduce new features based on community needs. 
          We also use your information to troubleshoot problems, monitor system performance, and ensure platform security. From time to time, we may use your contact information to send important service updates, offers, or news — but you always have the choice to opt out of non-essential communication.</Text>
        <Text style={styles.sectionTitle}>3. Sharing</Text>
        <Text style={styles.text}>At GoLive, protecting your data is a top priority. We do not sell, rent, or trade your personal information to advertisers or third parties. However, to provide a seamless and efficient experience, we may share limited data with carefully selected service providers who support our platform. 
          These include cloud hosting services, streaming infrastructure providers, analytics tools, and customer support solutions. Each partner is required to handle your data responsibly and comply with strict confidentiality and security standards. 
          We may also share information when required by law, or if it's necessary to investigate violations of our terms of service, prevent fraud, or ensure the safety of the GoLive community.</Text>
        <Text style={styles.sectionTitle}>4. Security</Text>
        <Text style={styles.text}>We take data security seriously at GoLive and implement a range of measures to protect your personal information from unauthorized access, misuse, or disclosure. 
          Our infrastructure is built with strong encryption protocols, secure authentication mechanisms, and continuous monitoring to detect and prevent suspicious activity. 
          We limit access to your data to only those employees or partners who need it to perform their job functions and require them to follow strict privacy and confidentiality agreements. 
          While no system can guarantee 100% protection, we are committed to continuously improving our security practices and responding swiftly to any potential threats. Your trust in GoLive is important to us, and we work hard to maintain it every day.</Text>
        <Text style={styles.sectionTitle}>5. User Rights</Text>
        <Text style={styles.text}>As a GoLive user, you have important rights concerning your personal data. You have the right to access the information we hold about you and request corrections if the data is inaccurate or incomplete. 
          You may also request that we delete your account and any associated data, subject to any legal obligations we may have to retain certain information. 
          Additionally, you can opt out of receiving promotional communications at any time. If you wish to exercise any of these rights, you can contact our support team directly through the app or via our help center. 
          We are committed to responding to your requests in a timely and respectful manner.</Text>
        <Text style={styles.sectionTitle}>6. Cookies & Tracking</Text>
        <Text style={styles.text}>GoLive may use cookies and similar tracking technologies to enhance your user experience. These tools help us remember your preferences, understand user behavior, and measure the effectiveness of our features and content. 
          For example, we may track which streams are most watched or how long users spend in chat rooms. Some tracking may also be conducted through third-party analytics providers. 
          You have control over your tracking settings and may choose to disable certain cookies through your device or browser settings. Please note that disabling cookies may affect the performance or functionality of certain features within the app.</Text>
        <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
        <Text style={styles.text}>GoLive is not intended for children under the age of 13, and we do not knowingly collect personal information from anyone in that age group. 
          If you are a parent or guardian and believe that your child has provided us with personal data without your consent, please contact us immediately so we can take appropriate action. 
          If we become aware that we have unintentionally collected information from a user under 13, we will promptly delete such data from our systems. We encourage parents to monitor their children’s use of digital services and guide them toward safe and responsible online behavior.</Text>
        <Text style={styles.sectionTitle}>8. International Data Transfers</Text>
        <Text style={styles.text}>As GoLive may be used across multiple countries, your information may be transferred to — and stored on — servers located outside your country of residence. 
          These locations may have different data protection laws than your own. However, regardless of where your data is processed, we ensure that it is handled securely and in accordance with this privacy policy. 
          Where required by law, we implement contractual protections and standard safeguards to ensure your data is adequately protected during cross-border transfers. By using GoLive, you consent to the transfer of your data to other jurisdictions as necessary to provide our services.</Text>
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