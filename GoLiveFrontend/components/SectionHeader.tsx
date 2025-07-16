import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ChevronRight } from "lucide-react-native";

type SectionHeaderProps = {
  title: string;
  showViewAll?: boolean;
  onViewAllPress?: () => void;
};

export default function SectionHeader({
  title,
  showViewAll = false,
  onViewAllPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: "white" }]}>{title}</Text>

      {showViewAll && (
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAllPress}>
          <Text style={[styles.viewAllText, { color: "white" }]}>View All</Text>
          <ChevronRight size={16} color={"white"} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    marginRight: 2,
  },
});
