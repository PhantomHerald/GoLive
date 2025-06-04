import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Circle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

type ViewerCountProps = {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  inverted?: boolean;
};

export function ViewerCount({ 
  count, 
  size = 'md',
  inverted = false 
}: ViewerCountProps) {
  const formatCount = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <View style={[
      styles.container, 
      styles[`${size}Container`],
      inverted && styles.inverted
    ]}>
      <Circle
        size={size === 'sm' ? 8 : size === 'md' ? 10 : 12}
        color={Colors.error.main}
        fill={Colors.error.main}
      />
      <Text style={[
        styles.text, 
        styles[`${size}Text`],
        inverted && styles.invertedText
      ]}>
        {formatCount(count)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: Layout.borderRadius.sm,
  },
  inverted: {
    backgroundColor: 'transparent',
  },
  text: {
    color: Colors.neutral[100],
    fontWeight: Layout.fontWeight.medium,
    marginLeft: 4,
  },
  invertedText: {
    color: Colors.text.primary,
  },
  smContainer: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  mdContainer: {
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  lgContainer: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  smText: {
    fontSize: Layout.fontSize.xs,
  },
  mdText: {
    fontSize: Layout.fontSize.sm,
  },
  lgText: {
    fontSize: Layout.fontSize.md,
  },
});

export default ViewerCount;