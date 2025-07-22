import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Platform, ScrollView, KeyboardAvoidingView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import Avatar from "@/components/ui/Avatar";
import userService from "@/services/userService";
import SuccessToast from "@/components/SuccessToast";
import { useLocalSearchParams } from "expo-router";

const mockProfile = {
  avatar: require("@/assets/images/adaptive-icon.png"),
  displayName: "Streamer123",
  username: "streamer123",
  bio: "Welcome to my channel!",
};

export default function EditProfile() {
  const params = useLocalSearchParams();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(mockProfile.avatar);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [bioHeight, setBioHeight] = useState(80);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await userService.getCurrentUser();
      setDisplayName(user.displayName || user.username || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      // setAvatar(user.avatar || mockProfile.avatar); // Uncomment if avatar is supported
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (params.from) {
      router.replace(params.from);
    } else {
      router.back();
    }
  };

  // Placeholder for image picker
  const handleChangeAvatar = () => {
    // TODO: Implement image picker
    alert("Image picker coming soon!");
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await userService.updateProfile({ displayName, username, bio });
      setShowSuccess(true);
      await fetchProfile();
      setTimeout(() => {
        setShowSuccess(false);
        router.replace("/(tabs)/Profile");
      }, 1200); // Shorten toast duration to avoid state update after navigation
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const confirmSave = () => {
    Alert.alert(
      "Confirm Changes",
      "Are you sure you want to apply these changes to your profile?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: handleSave },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0e0e10" }}>
      <SuccessToast
        message="Profile updated successfully!"
        visible={showSuccess}
        onHide={() => setShowSuccess(false)}
        top={70}
      />
      {error ? (
        <Text style={{ color: "#ff4d4f", textAlign: "center", marginTop: 10 }}>{error}</Text>
      ) : null}
      {loading ? (
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>Making changes...</Text>
      ) : (
        <>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Icon name="arrow-left" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headingText}>Edit Profile</Text>
            <View style={styles.placeholder} />
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: 20 }]} showsVerticalScrollIndicator={false}>
              <View style={styles.avatarSection}>
                <Avatar source={avatar} size="xl" borderColor="primary" />
                <TouchableOpacity style={styles.changeAvatarBtn} onPress={handleChangeAvatar}>
                  <Text style={styles.changeAvatarText}>Change Profile Photo</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.formSection}>
                <Text style={styles.label}>Display Name</Text>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Display Name"
                  placeholderTextColor="#888"
                />
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Username"
                  placeholderTextColor="#888"
                />
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.bioInput, { minHeight: 80, height: bioHeight }]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell viewers about yourself"
                  placeholderTextColor="#888"
                  multiline
                  numberOfLines={4}
                  maxLength={160}
                  onContentSizeChange={e => setBioHeight(Math.max(80, e.nativeEvent.contentSize.height))}
                  textAlignVertical="top"
                />
              </View>
              <TouchableOpacity style={[styles.saveBtn, { height: 50 }]} onPress={confirmSave} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={[styles.saveBtnText, { fontWeight: "500", textAlign: "center", textAlignVertical: "center" }]}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: "#0e0e10",
    // Remove marginTop and marginLeft to match other pages
  },
  backBtn: {
    padding: 4,
    borderRadius: 20,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    flex: 1,
    fontSize: 20,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  changeAvatarBtn: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#18181b',
    borderRadius: 20,
  },
  changeAvatarText: {
    color: '#BF94FE',
    fontWeight: '600',
    fontSize: 15,
  },
  formSection: {
    width: '100%',
    marginBottom: 32,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    marginTop: 16,
    textAlign: 'left',
  },
  input: {
    backgroundColor: '#28282E',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    height: 50,
    marginBottom: 8,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#006eff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    width: '100%',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 18,
  },
}); 