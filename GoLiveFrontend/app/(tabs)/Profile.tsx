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
  ChevronDown, ChevronRight,
  CreditCard,
  Heart,
  LogOut,
  Moon,
  Settings,
  Shield,
  User,
  HelpCircle,
  FileText,
  Lock,
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
  Button as RNButton,
} from "react-native";
import { router } from "expo-router";
import SuccessToast from "@/components/SuccessToast";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile } from "@/services/userService";

const TAB_BAR_HEIGHT = 48;

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
    marginRight: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
    borderRadius: 0,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    height: TAB_BAR_HEIGHT,
    backgroundColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#006eff",
    backgroundColor: "transparent",
  },
  tabText: {
    color: Colors.text.secondary,
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
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
  tabBarScroll: {
    backgroundColor: "#0e0e10",
    width: "100%",
    zIndex: 10,
    height: TAB_BAR_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  tabBarScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 8,
    height: TAB_BAR_HEIGHT,
  },
  tabContentText: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.md,
    textAlign: "center",
    marginTop: Layout.spacing.md,
  },
});

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<
    "Home" | "About" | "Clips" | "Videos"
  >("Home");
  const [darkMode, setDarkMode] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { user, loading, refetchUser } = useAuth();
  const [error, setError] = useState("");
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  useEffect(() => {
    setSettingsExpanded(false);
  }, [activeTab]);

  useFocusEffect(
    React.useCallback(() => {
      // On focus: do nothing
      return () => {
        // On blur (navigating away from Profile tab):
        setSettingsExpanded(false);
      };
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

  // Type user as UserProfile | null for correct property access
  const typedUser = user as UserProfile | null;

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
      {!typedUser && loading ? (
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>Loading...</Text>
      ) : (
      <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 40, backgroundColor: "transparent" }}
          stickyHeaderIndices={[2]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profilesection}>
          <View style={styles.avatarcontainer}>
            <Avatar
                source={typedUser?.avatar ? { uri: typedUser.avatar } : {}}
              size="xl"
              borderColor="primary"
            />
          </View>
          <Text style={styles.displayname}>
              {typedUser?.displayName || typedUser?.username || ""}
          </Text>
            <Text style={styles.username}>{typedUser?.username || ""}</Text>
          <View style={styles.statscontainer}>
            <TouchableOpacity
              onPress={() => router.push("/followers")}
              style={styles.statitem}
            >
              <Text style={styles.statNumber}>{typedUser?.followers ?? 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity
              onPress={() => router.push("/following")}
              style={styles.statitem}
            >
              <Text style={styles.statNumber}>{typedUser?.following ?? 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
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
              <Text style={styles.bioText}>{typedUser?.bio || ""}</Text>
          </View>
        </View>
        <Separator horizontal color={Colors.neutral[800]} />
          {/* Sticky, horizontally scrollable tab bar as a direct child */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabBarScroll}
            contentContainerStyle={styles.tabBarScrollContent}
          >
          <TouchableOpacity
            style={[styles.tab, activeTab === "Home" && styles.activeTab]}
            onPress={() => setActiveTab("Home")}
          >
              <Text style={[styles.tabText, activeTab === "Home" && styles.activeTabText]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "About" && styles.activeTab]}
            onPress={() => setActiveTab("About")}
          >
              <Text style={[styles.tabText, activeTab === "About" && styles.activeTabText]}>Following</Text>
          </TouchableOpacity>
          </ScrollView>
          {/* Separator below tab bar, not above */}
        <Separator horizontal color={Colors.neutral[800]} />
          {/* Tab content below (unchanged) */}
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
              <TouchableOpacity
                style={[styles.settingItem, { justifyContent: 'space-between' }]}
                onPress={() => setSettingsExpanded((prev) => !prev)}
                activeOpacity={0.7}
              >
              <Text style={styles.sectionTitle}>Settings</Text>
                {settingsExpanded ? (
                  <ChevronDown size={24} color={Colors.neutral[600]} />
                ) : (
                  <ChevronRight size={24} color={Colors.neutral[600]} />
                )}
              </TouchableOpacity>
              {settingsExpanded && (
              <View style={styles.settingsList}>
                  {/* All settings items go here, unchanged */}
                <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/NotificationSettings')}>
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
                <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/BitsPayments')}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <CreditCard size={20} color={Colors.neutral[600]} />
                    </View>
                    <Text style={styles.settingText}>Bits & Payments</Text>
                  </View>
                  <ChevronRight size={20} color={Colors.neutral[600]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/PrivacySettings')}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Shield size={20} color={Colors.neutral[600]} />
                    </View>
                    <Text style={styles.settingText}>Privacy Settings</Text>
                  </View>
                  <ChevronRight size={20} color={Colors.neutral[600]} />
                </TouchableOpacity>
                  <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/Help')}>
                    <View style={styles.settingLeft}>
                      <View style={styles.settingIcon}>
                        <HelpCircle size={20} color={Colors.neutral[600]} />
                      </View>
                      <Text style={styles.settingText}>Help & FAQ</Text>
                    </View>
                    <ChevronRight size={20} color={Colors.neutral[600]} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/Terms')}>
                    <View style={styles.settingLeft}>
                      <View style={styles.settingIcon}>
                        <FileText size={20} color={Colors.neutral[600]} />
                      </View>
                      <Text style={styles.settingText}>Terms of Service</Text>
                    </View>
                    <ChevronRight size={20} color={Colors.neutral[600]} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/Privacy')}>
                    <View style={styles.settingLeft}>
                      <View style={styles.settingIcon}>
                        <Lock size={20} color={Colors.neutral[600]} />
                      </View>
                      <Text style={styles.settingText}>Privacy Policy</Text>
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
              )}
            </View>
            {/* Test Buttons Section */}
            <View style={{ marginTop: 32, alignItems: "center" }}>
              <Text style={{ color: Colors.text.secondary, marginBottom: 8, fontWeight: "bold" }}>Test Buttons</Text>
              <RNButton title="Test Error State" onPress={() => router.push("/TestError")} />
              <RNButton title="Test Offline State" onPress={() => router.push("/TestOffline")} />
              <RNButton title="Test Empty State" onPress={() => router.push("/TestEmpty")} />
            </View>
          </>
        ) : null}
          {activeTab === "About" ? (
            <Text style={styles.tabContentText}>Following content goes here.</Text>
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
