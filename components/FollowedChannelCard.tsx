import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useFormatNumber } from '@/hooks/useFormatNumber';

type FollowedChannelProps = {
  channel: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isLive: boolean;
    game?: string;
    viewers?: number;
  };
};

export function FollowedChannelCard({ channel }: FollowedChannelProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const { formatNumber } = useFormatNumber();

  const handlePress = () => {
    if (channel.isLive) {
      // Find a stream ID by matching username and game
      router.push(`/stream/stream-${channel.id.split('-')[1]}`);
    } else {
      router.push(`/profile?username=${channel.username}`);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: channel.avatar }} style={styles.avatar} />
        {channel.isLive && (
          <View style={styles.liveIndicator} />
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text 
          style={[styles.name, { color: theme.colors.text }]} 
          numberOfLines={1}
        >
          {channel.displayName}
        </Text>
        
        {channel.isLive && channel.game ? (
          <Text 
            style={[styles.game, { color: theme.colors.textSecondary }]}
            numberOfLines={1}
          >
            {channel.game}
          </Text>
        ) : (
          <Text 
            style={[styles.offline, { color: theme.colors.textSecondary }]}
          >
            Offline
          </Text>
        )}
      </View>

      {channel.isLive && channel.viewers && (
        <View style={styles.viewersContainer}>
          <View style={[styles.liveIndicatorDot, { backgroundColor: theme.colors.error }]} />
          <Text style={[styles.viewers, { color: theme.colors.textSecondary }]}>
            {formatNumber(channel.viewers)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  liveIndicator: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F43F5E',
    borderWidth: 2,
    borderColor: '#0E0E10',
    bottom: -2,
    right: -2,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 2,
  },
  game: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  offline: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  viewersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  viewers: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});