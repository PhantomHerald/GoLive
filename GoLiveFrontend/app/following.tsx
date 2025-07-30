import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Radio, Video } from 'lucide-react-native';
import followService from '@/services/followService';
import { useAuth } from '@/hooks/useAuth';
import SuccessToast from '@/components/SuccessToast';

interface FollowingUser {
  id: number;
  username: string;
  displayName?: string;
  avatar?: string;
  isLive?: boolean;
  streamId?: number;
}

export default function FollowingScreen() {
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { user } = useAuth();

  const fetchFollowing = async (isRefresh = false) => {
    if (!user?.id) {
      console.log('No user found, cannot fetch following');
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      console.log('Fetching following for user:', user.id);
      const result = await followService.getFollowing();
      console.log('Following result:', result);
      
      if (result.success && result.following) {
        // Add mock live status for demonstration
        const followingWithLiveStatus = result.following.map((user: any) => ({
          ...user,
          isLive: Math.random() > 0.7, // 30% chance of being live
          streamId: Math.random() > 0.7 ? Math.floor(Math.random() * 1000) : null,
        }));
        setFollowing(followingWithLiveStatus);
        setError(null);
      } else {
        setError(result.message || 'Failed to load following');
      }
    } catch (err) {
      setError('Failed to load following');
      console.error('Error fetching following:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Test authentication first
    const testAuth = async () => {
      try {
        const authResult = await followService.testAuth();
        console.log('Auth test result:', authResult);
        if (authResult.success) {
          fetchFollowing();
        } else {
          setError('Authentication failed: ' + authResult.message);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth test error:', error);
        setError('Authentication test failed');
        setLoading(false);
      }
    };

    testAuth();
  }, []);

  const onRefresh = () => {
    fetchFollowing(true);
  };

  const handleUnfollow = async (userId: number, username: string) => {
    Alert.alert(
      'Unfollow User',
      `Are you sure you want to unfollow ${username}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unfollow',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await followService.unfollowUser(userId);
              if (result.success) {
                setToastMessage(`Unfollowed ${username}`);
                setShowToast(true);
                // Remove from following list
                setFollowing(prev => prev.filter(user => user.id !== userId));
              } else {
                setToastMessage(result.message || 'Failed to unfollow');
                setShowToast(true);
              }
            } catch (error) {
              setToastMessage('Failed to unfollow user');
              setShowToast(true);
            }
          },
        },
      ]
    );
  };

  const handleUserPress = (user: FollowingUser) => {
    if (user.isLive && user.streamId) {
      // Navigate to live stream
      router.push(`/stream/${user.streamId}`);
    } else {
      // Navigate to user profile
      router.push(`/user/${user.username}`);
    }
  };

  const handleViewClips = () => {
    router.push('/(tabs)/Home');
  };

  const renderUserItem = ({ item }: { item: FollowingUser }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.userInfo}>
        <Image
          source={{ uri: item.avatar || 'https://via.placeholder.com/50' }}
          style={styles.avatar}
        />
        <View style={styles.userDetails}>
          <Text style={styles.username}>{item.displayName || item.username}</Text>
          <Text style={styles.handle}>@{item.username}</Text>
        </View>
      </View>
      
      <View style={styles.userActions}>
        {item.isLive && (
          <View style={styles.liveBadge}>
            <Radio size={12} color="#fff" />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.unfollowButton}
          onPress={() => handleUnfollow(item.id, item.username)}
        >
          <Text style={styles.unfollowText}>Unfollow</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006eff" />
          <Text style={styles.loadingText}>Loading following...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchFollowing()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : following.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Video size={64} color="#666" />
          </View>
          <Text style={styles.emptyText}>Oops, you follow no one yet</Text>
          <Text style={styles.emptySubtext}>View clips to find streamers to follow</Text>
          <TouchableOpacity style={styles.viewClipsButton} onPress={handleViewClips}>
            <Text style={styles.viewClipsButtonText}>View Clips</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={following}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#006eff"
              colors={["#006eff"]}
            />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}

      <SuccessToast
        message={toastMessage}
        visible={showToast}
        onHide={() => setShowToast(false)}
        top={100}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#006eff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIconContainer: {
    marginBottom: 24,
    opacity: 0.5,
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  viewClipsButton: {
    backgroundColor: '#006eff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
  },
  viewClipsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingVertical: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  handle: {
    color: '#666',
    fontSize: 14,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  unfollowButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  unfollowText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
}); 