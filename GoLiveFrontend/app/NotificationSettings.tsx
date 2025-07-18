import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView, ScrollView } from "react-native";
import { router } from "expo-router";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

export default function NotificationSettings() {
  const [live, setLive] = useState(true);
  const [invites, setInvites] = useState(true);
  const [chat, setChat] = useState(true);
  const [follows, setFollows] = useState(false);
  const [recommendations, setRecommendations] = useState(true);
  const [news, setNews] = useState(false);

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
          <Text style={styles.topBarTitle}>Notification Settings</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        <Text style={styles.sectionTitle}>Push Notifications</Text>
        <View style={styles.container}>
          <View style={styles.tileRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tileLabel}>Live Stream</Text>
              <Text style={styles.tileDescription}>When a channel you follow goes live.</Text>
            </View>
            <Switch
              value={live}
              onValueChange={setLive}
              trackColor={{ false: Colors.neutral[600], true: Colors.primary.main }}
              thumbColor={Colors.neutral[100]}
            />
          </View>
          <View style={styles.tileRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tileLabel}>Invites</Text>
              <Text style={styles.tileDescription}>When someone invites you to a stream, event, or group.</Text>
            </View>
            <Switch
              value={invites}
              onValueChange={setInvites}
              trackColor={{ false: Colors.neutral[600], true: Colors.primary.main }}
              thumbColor={Colors.neutral[100]}
            />
          </View>
          <View style={styles.tileRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tileLabel}>Chat Messages</Text>
              <Text style={styles.tileDescription}>When you receive a new chat message.</Text>
            </View>
            <Switch
              value={chat}
              onValueChange={setChat}
              trackColor={{ false: Colors.neutral[600], true: Colors.primary.main }}
              thumbColor={Colors.neutral[100]}
            />
          </View>
          <View style={styles.tileRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tileLabel}>New Follows</Text>
              <Text style={styles.tileDescription}>When someone new follows your channel.</Text>
            </View>
            <Switch
              value={follows}
              onValueChange={setFollows}
              trackColor={{ false: Colors.neutral[600], true: Colors.primary.main }}
              thumbColor={Colors.neutral[100]}
            />
          </View>
          <View style={styles.tileRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tileLabel}>Recommendations</Text>
              <Text style={styles.tileDescription}>When we recommend a stream or channel for you.</Text>
            </View>
            <Switch
              value={recommendations}
              onValueChange={setRecommendations}
              trackColor={{ false: Colors.neutral[600], true: Colors.primary.main }}
              thumbColor={Colors.neutral[100]}
            />
          </View>
          <View style={styles.tileRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tileLabel}>News & Updates</Text>
              <Text style={styles.tileDescription}>Product news, feature updates, and announcements.</Text>
            </View>
            <Switch
              value={news}
              onValueChange={setNews}
              trackColor={{ false: Colors.neutral[600], true: Colors.primary.main }}
              thumbColor={Colors.neutral[100]}
            />
          </View>
        </View>
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
    marginBottom: 18,
  },
  settingList: {
    backgroundColor: Colors.background.card,
    borderRadius: 8,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background.card,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginBottom: 5,
    width: '10%',
  },
  settingLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background.card,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginBottom: 5,
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#0e0e10",
    paddingHorizontal: 0,
    paddingTop: 0,
    marginTop: 0,
  },
  tileRow: {
    width: '100%',
    backgroundColor: Colors.background.card,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tileLabel: {
    color: '#EFEFF1',
    fontSize: 15,
    fontWeight: '500',
    paddingLeft: 10,
  },
  tileDescription: {
    color: Colors.text.secondary,
    fontSize: 13,
    marginTop: 2,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[800],
    width: '100%',
    marginVertical: 0,
  },
}); 