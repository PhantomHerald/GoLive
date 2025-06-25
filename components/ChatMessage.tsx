import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type ChatMessageProps = {
  username: string;
  message: string;
  badges: string[];
  time: Date;
};

export function ChatMessage({ username, message, badges, time }: ChatMessageProps) {
  const { theme } = useTheme();

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'subscriber':
        return theme.colors.secondary;
      case 'moderator':
        return theme.colors.success;
      case 'vip':
        return theme.colors.accent;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.messageHeader}>
        {badges.length > 0 && (
          <View style={styles.badgesContainer}>
            {badges.map((badge, index) => (
              <View 
                key={index} 
                style={[
                  styles.badge, 
                  { backgroundColor: getBadgeColor(badge) }
                ]}
              >
                <Text style={styles.badgeText}>
                  {badge.charAt(0).toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        )}
        <Text style={[styles.username, { color: theme.colors.primary }]}>
          {username}
        </Text>
      </View>
      <Text style={[styles.message, { color: theme.colors.text }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  badgesContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  badge: {
    width: 16,
    height: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  username: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
});