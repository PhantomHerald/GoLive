import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Stream } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';
import { useFormatNumber } from '@/hooks/useFormatNumber';
import { useFormatDuration } from '@/hooks/useFormatDuration';

type StreamCardProps = {
  stream: Stream;
  featured?: boolean;
};

export function StreamCard({ stream, featured = false }: StreamCardProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const { formatNumber } = useFormatNumber();
  const { formatDuration } = useFormatDuration();

  const handlePress = () => {
    router.push(`/stream/${stream.id}`);
  };

  const handleStreamerPress = (event: any) => {
    event.stopPropagation();
    router.push(`/profile?username=${stream.streamer.username}`);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        featured && styles.featuredContainer
      ]} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: stream.thumbnail }} 
          style={[
            styles.thumbnail,
            featured && styles.featuredThumbnail
          ]}
          resizeMode="cover" 
        />
        {stream.isLive && (
          <View style={styles.liveContainer}>
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.viewerCount}>
              {formatNumber(stream.viewers)} viewers
            </Text>
            {stream.startedAt && (
              <Text style={styles.duration}>
                {formatDuration(stream.startedAt)}
              </Text>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Pressable onPress={handleStreamerPress} style={styles.avatarContainer}>
          <Image source={{ uri: stream.streamer.avatar }} style={styles.avatar} />
        </Pressable>
        
        <View style={styles.textContainer}>
          <Text 
            style={[styles.title, { color: theme.colors.text }]} 
            numberOfLines={featured ? 2 : 1}
          >
            {stream.title}
          </Text>
          
          <Text 
            style={[styles.streamerName, { color: theme.colors.textSecondary }]}
            numberOfLines={1}
          >
            {stream.streamer.displayName}
          </Text>
          
          <Text 
            style={[styles.game, { color: theme.colors.textSecondary }]}
            numberOfLines={1}
          >
            {stream.game}
          </Text>
          
          {featured && stream.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {stream.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: theme.colors.backgroundTertiary }]}>
                  <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  featuredContainer: {
    marginBottom: 24,
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  featuredThumbnail: {
    borderRadius: 12,
  },
  liveContainer: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveBadge: {
    backgroundColor: '#F43F5E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  liveText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  viewerCount: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  duration: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 2,
  },
  streamerName: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  game: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});