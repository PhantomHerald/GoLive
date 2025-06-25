import { Category } from "@/data/mockdata";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CategoryCardProps = {
  category: Category;
  index: number;
};

export function CategoryCard({ category, index }: CategoryCardProps) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={alert}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: category.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: "white" }]} numberOfLines={1}>
          {category.name}
        </Text>

        <Text style={[styles.viewers, { color: "white" }]} numberOfLines={1}>
          {category.viewers} viewers
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    width: 140,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#18181B",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    paddingTop: 8,
  },
  name: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    marginBottom: 2,
  },
  viewers: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
  },
});
