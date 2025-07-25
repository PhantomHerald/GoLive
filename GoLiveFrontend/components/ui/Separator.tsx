import React from 'react';
import { View, StyleSheet } from 'react-native';
import {Colors} from '@/constants/Colors';

type SeparatorProps = {
  horizontal?: boolean;
  color?: string;
  thickness?: number;
  style?: object;
};

export function Separator({ 
  horizontal = false, 
  color = Colors.neutral[700],
  thickness = 1,
  style = {}
}: SeparatorProps) {
  return (
    <View 
      style={[
        horizontal ? styles.horizontal : styles.vertical,
        { backgroundColor: color },
        horizontal ? { height: thickness } : { width: thickness },
        style
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
    height: 1,
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});

export default Separator;