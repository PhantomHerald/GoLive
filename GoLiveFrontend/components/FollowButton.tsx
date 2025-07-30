import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { UserPlus, UserMinus } from 'lucide-react-native';
import followService from '@/services/followService';
import { useAuth } from '@/hooks/useAuth';

interface FollowButtonProps {
  targetUserId: number;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function FollowButton({
  targetUserId,
  initialIsFollowing = false,
  onFollowChange,
  size = 'medium',
  variant = 'primary'
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const { user } = useAuth();

  // Check if current user is following the target user
  useEffect(() => {
    if (user?.id && user.id !== targetUserId) {
      checkFollowingStatus();
    } else {
      setCheckingStatus(false);
    }
  }, [user?.id, targetUserId]);

  const checkFollowingStatus = async () => {
    try {
      const result = await followService.checkIfFollowing(targetUserId);
      if (result.success) {
        setIsFollowing(result.isFollowing || false);
      }
    } catch (error) {
      console.error('Error checking following status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleFollowToggle = async () => {
    if (loading || checkingStatus) return;
    
    setLoading(true);
    try {
      let result;
      if (isFollowing) {
        result = await followService.unfollowUser(targetUserId);
      } else {
        result = await followService.followUser(targetUserId);
      }

      if (result.success) {
        setIsFollowing(!isFollowing);
        onFollowChange?.(!isFollowing);
      } else {
        console.error('Follow/Unfollow failed:', result.message);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show follow button if it's the current user's profile
  if (user?.id === targetUserId) {
    return null;
  }

  if (checkingStatus) {
    return (
      <TouchableOpacity style={[styles.button, styles[size], styles[variant], styles.loading]} disabled>
        <ActivityIndicator size="small" color={variant === 'outline' ? '#006eff' : '#fff'} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[size],
        styles[variant],
        isFollowing ? styles.following : styles.notFollowing
      ]}
      onPress={handleFollowToggle}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'outline' ? '#006eff' : '#fff'} />
      ) : (
        <>
          {isFollowing ? (
            <UserMinus size={getIconSize()} color={getIconColor()} />
          ) : (
            <UserPlus size={getIconSize()} color={getIconColor()} />
          )}
          <Text style={[
            styles.text,
            styles[`${size}Text`],
            styles[variant],
            isFollowing ? styles.followingText : styles.notFollowingText
          ]}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );

  function getIconSize() {
    switch (size) {
      case 'small': return 14;
      case 'large': return 20;
      default: return 16;
    }
  }

  function getIconColor() {
    if (variant === 'outline') return '#006eff';
    return isFollowing ? '#666' : '#fff';
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 6,
  },
  loading: {
    opacity: 0.7,
  },
  // Size variants
  small: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: 44,
  },
  // Variant styles
  primary: {
    backgroundColor: '#006eff',
  },
  secondary: {
    backgroundColor: '#333',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#006eff',
  },
  // Following states
  following: {
    backgroundColor: '#333',
  },
  notFollowing: {
    backgroundColor: '#006eff',
  },
  // Text styles
  text: {
    fontWeight: '600',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  // Text colors
  followingText: {
    color: '#666',
  },
  notFollowingText: {
    color: '#fff',
  },
}); 