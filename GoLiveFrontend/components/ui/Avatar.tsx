import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type BorderColor = "primary" | "secondary" | "white" | "none";

type AvatarProps = {
  source: ImageSourcePropType;
  size?: AvatarSize;
  borderColor?: BorderColor;
  isLive?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Avatar({
  source,
  size = "md",
  borderColor = "none",
  isLive = false,
  style,
}: AvatarProps) {
  const getBorderColor = () => {
    switch (borderColor) {
      case "primary":
        return Colors.primary.main;
      case "secondary":
        return Colors.secondary.main;
      case "white":
        return Colors.neutral[100];
      case "none":
      default:
        return "transparent";
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.avatarContainer,
          styles[`${size}Container`],
          { borderColor: getBorderColor() },
          borderColor !== "none" && styles.withBorder,
        ]}
      >
        <Image
          source={source}
          style={[styles.avatar, styles[`${size}Avatar`]]}
        />
      </View>
      {isLive && (
        <View style={[styles.liveIndicator, styles[`${size}Indicator`]]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  avatarContainer: {
    borderRadius: Layout.borderRadius.circle,
    overflow: "hidden",
  },
  withBorder: {
    borderWidth: 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  liveIndicator: {
    position: "absolute",
    backgroundColor: Colors.error.main,
    borderRadius: Layout.borderRadius.circle,
    borderWidth: 2,
    borderColor: Colors.background.default,
  },
  xsContainer: {
    width: 24,
    height: 24,
  },
  smContainer: {
    width: 32,
    height: 32,
  },
  mdContainer: {
    width: 40,
    height: 40,
  },
  lgContainer: {
    width: 56,
    height: 56,
  },
  xlContainer: {
    width: 80,
    height: 80,
  },
  xsAvatar: {
    width: 24,
    height: 24,
  },
  smAvatar: {
    width: 32,
    height: 32,
  },
  mdAvatar: {
    width: 40,
    height: 40,
  },
  lgAvatar: {
    width: 56,
    height: 56,
  },
  xlAvatar: {
    width: 80,
    height: 80,
  },
  xsIndicator: {
    width: 8,
    height: 8,
    right: 0,
    bottom: 0,
    borderWidth: 1,
  },
  smIndicator: {
    width: 10,
    height: 10,
    right: 0,
    bottom: 0,
    borderWidth: 1.5,
  },
  mdIndicator: {
    width: 12,
    height: 12,
    right: 0,
    bottom: 0,
    borderWidth: 1.5,
  },
  lgIndicator: {
    width: 14,
    height: 14,
    right: 0,
    bottom: 0,
    borderWidth: 2,
  },
  xlIndicator: {
    width: 16,
    height: 16,
    right: 4,
    bottom: 4,
    borderWidth: 2,
  },
});

export default Avatar;
