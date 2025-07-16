import { Colors } from "@/constants/Colors";
import Layout from "@/constants/Layout";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyles = () => {
    const baseStyle: StyleProp<ViewStyle> = [
      styles.button,
      styles[`${size}Button`],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
    ];

    switch (variant) {
      case "primary":
        return [...baseStyle, styles.primaryButton];
      case "secondary":
        return [...baseStyle, styles.secondaryButton];
      case "outline":
        return [...baseStyle, styles.outlineButton];
      case "ghost":
        return [...baseStyle, styles.ghostButton];
      default:
        return [...baseStyle, styles.primaryButton];
    }
  };

  const getTextStyles = () => {
    const baseStyle: StyleProp<TextStyle> = [
      styles.buttonText,
      styles[`${size}Text`],
    ];

    switch (variant) {
      case "primary":
        return [...baseStyle, styles.primaryText];
      case "secondary":
        return [...baseStyle, styles.secondaryText];
      case "outline":
        return [...baseStyle, styles.outlineText];
      case "ghost":
        return [...baseStyle, styles.ghostText];
      default:
        return [...baseStyle, styles.primaryText];
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" ? Colors.neutral[100] : Colors.primary.main
          }
        />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[getTextStyles(), icon && styles.textWithIcon, textStyle]}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Layout.borderRadius.sm,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  primaryButton: {
    backgroundColor: Colors.primary.main,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary.main,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontWeight: Layout.fontWeight.medium,
    textAlign: "center",
  },
  primaryText: {
    color: Colors.neutral[100],
  },
  secondaryText: {
    color: Colors.neutral[100],
  },
  outlineText: {
    color: Colors.primary.main,
  },
  ghostText: {
    color: Colors.primary.main,
  },
  smButton: {
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.md,
  },
  mdButton: {
    paddingVertical: 14,
    paddingHorizontal: Layout.spacing.lg,
    height: 50,
  },
  lgButton: {
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xl,
  },
  smText: {
    fontSize: Layout.fontSize.xs,
  },
  mdText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lgText: {
    fontSize: Layout.fontSize.md,
  },
  textWithIcon: {
    marginLeft: Layout.spacing.sm,
  },
});

export default Button;
