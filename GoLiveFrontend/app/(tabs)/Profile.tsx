import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import { mockUsers } from "@/data/mockdata";
import authService from "@/services/authService";
import { useEffect } from "react";
import userService from "@/services/userService";
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
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { router } from "expo-router";
import SuccessToast from "@/components/SuccessToast";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<
    "Home" | "About" | "Clips" | "Videos"
  >("Home");
  const [darkMode, setDarkMode] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const profile = await userService.getCurrentUser();
      setUser(profile);
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await authService.logout();
              // Show success toast
              setShowSuccessToast(true);
              // Redirect to login page after 2.5 seconds (toast shows for 2 seconds)
              setTimeout(() => {
                router.replace("/(auth)/Login");
              }, 2500);
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0e0e10",
        ...Platform.select({
          android: { marginTop: 30 },
          default: {},
        }),
      }}
    >
      {error ? (
        <Text style={{ color: "#ff4d4f", textAlign: "center", marginTop: 10 }}>{error}</Text>
      ) : null}
      {loading ? (
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>Loading...</Text>
      ) : (
      <ScrollView
        style={[
          styles.content,
          {
            marginBottom: 40,
            backgroundColor: "transparent",
            ...Platform.select({
              android: { marginBottom: 0 },
              ios: { marginBottom: 40 },
            }),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profilesection}>
          <View style={styles.avatarcontainer}>
            <Avatar
                source={user?.avatar ? { uri: user.avatar } : {}}
              size="xl"
              borderColor="primary"
            />
          </View>
          <Text style={styles.displayname}>
              {user?.displayName || user?.username || ""}
          </Text>
            <Text style={styles.username}>{user?.username || ""}</Text>
          <View style={styles.statscontainer}>
            <View style={styles.statitem}>
                <Text style={styles.statNumber}>{user?.followers ?? 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statitem}>
                <Text style={styles.statNumber}>{user?.following ?? 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.buttonContainer,
                {
                  backgroundColor: Colors.primary.dark,
                  borderRadius: 8,
                  padding: 10,
                  marginRight: 8,
                  justifyContent: "center",
                  alignContent: "center",
                  alignSelf: "center",
                },
              ]}
              onPress={() => {
                  router.push("/EditProfile");
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
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bioContainer}>
              <Text style={styles.bioText}>{user?.bio || ""}</Text>
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
            </View>
            <Separator horizontal color={Colors.neutral[800]} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Settings</Text>

              <View style={styles.settingsList}>
                <TouchableOpacity style={styles.settingItem} onPress={() => console.log("Notifications Pressed")}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Settings size={20} color={Colors.neutral[600]} />
                    </View>
                    <Text style={styles.settingText}>Notifications</Text>
                  </View>
                  <ChevronRight size={20} color={Colors.neutral[600]} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/Account')}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <User size={20} color={Colors.neutral[600]} />
                    </View>
                    <Text style={styles.settingText}>Account</Text>
                  </View>
                  <ChevronRight size={20} color={Colors.neutral[600]} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={() => console.log("Subscriptions Pressed")}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Heart size={20} color={Colors.neutral[600]} />
                    </View>
                    <Text style={styles.settingText}>Subscriptions</Text>
                  </View>
                  <ChevronRight size={20} color={Colors.neutral[600]} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={() => console.log("Bits & Payments Pressed")}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <CreditCard size={20} color={Colors.neutral[600]} />
                    </View>
                    <Text style={styles.settingText}>Bits & Payments</Text>
                  </View>
                  <ChevronRight size={20} color={Colors.neutral[600]} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={() => console.log("Privacy Pressed")}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Shield size={20} color={Colors.neutral[600]} />
                    </View>
                    <Text style={styles.settingText}>Privacy</Text>
                  </View>
                  <ChevronRight size={20} color={Colors.neutral[600]} />
                </TouchableOpacity>

                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Moon size={20} color={Colors.neutral[600]} />
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

                <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <LogOut size={20} color={Colors.error.light} />
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
      )}
      <SuccessToast
        message="Log out successful!"
        visible={showSuccessToast}
        onHide={() => setShowSuccessToast(false)}
        top={70}
      />
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
    height: 57,
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
