import ParallaxScrollView from "@/components/ParallaxScrollView";
import React from "react";
import { Image, StyleSheet } from "react-native";

interface ProfileScreenProps {
  username: string;
  profilePicture: string;
  bio: string;
  followersCount: number;
  onEditProfile: () => void;
  onFollowToggle: () => void;
  isFollowing: boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  username,
  profilePicture,
  bio,
  followersCount,
  onEditProfile,
  onFollowToggle,
  isFollowing,
}) => {
  return (
    <ParallaxScrollView
      headerImage={
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
      }
      headerBackgroundColor={{
        dark: "#18181b",
        light: "#fff",
      }}
    ></ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 5,
  },
  followersCount: {
    fontSize: 14,
    color: "gray",
  },
});

export default ProfileScreen;
