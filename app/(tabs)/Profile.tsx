import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { mockUsers } from "@/data/mockdata";
import {
  ChevronRight,
  CreditCard,
  Heart,
  LogOut,
  Moon,
  Settings,
  Shield,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<
    "Home" | "About" | "Clips" | "Videos"
  >("Home");
  const [darkMode, setDarkMode] = useState(true);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0e0e10",
        marginBottom: 70,
      }}
    >
      <ScrollView
        style={[styles.content, { paddingBottom: 50 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profilesection}>
          <View style={styles.avatarcontainer}>
            <Avatar
              source={mockUsers[1] ? { uri: mockUsers[1].avatar } : {}}
              size="xl"
              borderColor="primary"
            />
          </View>
          <Text style={styles.displayname}>
            {mockUsers[0] ? mockUsers[0].displayName : ""}
          </Text>
          <Text style={styles.username}>{mockUsers[0].username}</Text>
          <View style={styles.statscontainer}>
            <View style={styles.statitem}>
              <Text style={styles.statNumber}>{mockUsers[0].followers}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statitem}>
              <Text style={styles.statNumber}>{mockUsers[0].following}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.buttonContainer,
                {
                  backgroundColor: "purple",
                  borderRadius: 8,
                  padding: 12,
                  marginRight: 8,
                  justifyContent: "center",
                  alignContent: "center",
                  alignSelf: "center",
                },
              ]}
              onPress={() => {
                console.log("Edit Profile Pressed");
              }}
            >
              <Text
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  color: "#fff",
                  flexDirection: "row",
                  fontSize: Layout.fontSize.md,
                  textAlign: "center",
                }}
              >
                Edit profile
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{mockUsers[0].bio}</Text>
          </View>
        </View>
        <Separator horizontal color={Colors.neutral[800]} />
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Home" && styles.activeTab]}
            onPress={() => setActiveTab("Home")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Home" && styles.activeTabText,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "About" && styles.activeTab]}
            onPress={() => setActiveTab("About")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "About" && styles.activeTabText,
              ]}
            >
              Following
            </Text>
          </TouchableOpacity>
        </View>

        <Separator horizontal color={Colors.neutral[800]} />

        {activeTab === "Home" ? (
          <>
            {/* Prime Gaming */}
            <View style={styles.section}>
              <View style={styles.primeContainer}>
                <View style={styles.primeTextContainer}>
                  <Text style={styles.primeTitle}>Prime Gaming</Text>
                  <Text style={styles.primeSubtitle}>
                    Included with Amazon Prime
                  </Text>
                </View>
                <Image
                  source={{
                    uri: "https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                  }}
                  style={styles.primeImage}
                />
              </View>

              <View style={styles.primeInfo}>
                <Text style={styles.primeInfoText}>
                  Free games and in-game loot each month
                </Text>
                <Button
                  label="Learn More"
                  onPress={() => {}}
                  variant="primary"
                  style={styles.primeButton}
                />
              </View>
            </View>{" "}
            <Separator horizontal color={Colors.neutral[800]} />
            {/* Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Settings</Text>

              <View style={styles.settingsList}>
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Settings size={20} />
                    </View>
                    <Text style={styles.settingText}>Notifications</Text>
                  </View>
                  <ChevronRight size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <User size={20} />
                    </View>
                    <Text style={styles.settingText}>Account</Text>
                  </View>
                  <ChevronRight size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Heart size={20} />
                    </View>
                    <Text style={styles.settingText}>Subscriptions</Text>
                  </View>
                  <ChevronRight size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <CreditCard size={20} />
                    </View>
                    <Text style={styles.settingText}>Bits & Payments</Text>
                  </View>
                  <ChevronRight size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Shield size={20} />
                    </View>
                    <Text style={styles.settingText}>Privacy</Text>
                  </View>
                  <ChevronRight size={20} />
                </TouchableOpacity>

                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Moon size={20} />
                    </View>
                    <Text style={styles.settingText}>Dark Mode</Text>
                  </View>
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{
                      false: Colors.neutral[600],
                      true: Colors.primary.main,
                    }}
                    thumbColor={Colors.neutral[100]}
                  />
                </View>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <LogOut size={20} />
                    </View>
                    <Text
                      style={[styles.settingText, { color: Colors.error.main }]}
                    >
                      Log Out
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  profilesection: {
    flex: 1,
    backgroundColor: "#0e0e10",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Layout.spacing.lg,
  },
  avatarcontainer: {
    marginBottom: Layout.spacing.md,
  },
  displayname: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  username: {
    color: Colors.text.secondary,
    fontSize: Layout.fontSize.md,
    marginBottom: Layout.spacing.md,
  },
  statscontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.md,
  },
  statitem: {
    alignItems: "center",
    paddingHorizontal: Layout.spacing.lg,
  },
  statNumber: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.lg,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statLabel: {
    color: Colors.text.secondary,
    fontSize: Layout.fontSize.sm,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.neutral[700],
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: Layout.spacing.md,
  },
  bioContainer: {
    paddingHorizontal: Layout.spacing.xl,
    width: "100%",
  },
  bioText: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  tab: {
    marginRight: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary.main,
  },
  tabText: {
    color: Colors.text.secondary,
    fontWeight: "500",
    fontSize: Layout.fontSize.md,
  },
  activeTabText: {
    color: Colors.text.primary,
  },
  section: {
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
  },
  sectionTitle: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.lg,
    fontWeight: "bold",
    marginBottom: Layout.spacing.md,
  },
  primeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background.card,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  primeTextContainer: {
    flex: 1,
  },
  primeTitle: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.lg,
    fontWeight: "bold",
    marginBottom: Layout.spacing.xs,
  },
  primeSubtitle: {
    color: Colors.text.secondary,
    fontSize: Layout.fontSize.sm,
  },
  primeImage: {
    width: 60,
    height: 60,
    borderRadius: Layout.borderRadius.sm,
  },
  primeInfo: {
    backgroundColor: Colors.background.card,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    alignItems: "center",
  },
  primeInfoText: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.sm,
    textAlign: "center",
    marginBottom: Layout.spacing.md,
  },
  primeButton: {
    width: 200,
  },
  settingsList: {
    backgroundColor: Colors.background.card,
    borderRadius: Layout.borderRadius.md,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: Layout.spacing.md,
  },
  settingText: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.md,
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: Layout.spacing.md,
  },
});
