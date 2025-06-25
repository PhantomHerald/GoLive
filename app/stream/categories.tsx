import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { CategoryCard } from "@/components/CategoryCard";
import SectionHeader from "@/components/SectionHeader";
import { mockCategories } from "@/data/mockdata";

export default function CategoriesScreen() {
  return (
    <View style={[styles.container, { backgroundColor: "" }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <SectionHeader title="Popular Categories" />
          <View style={styles.categoriesGridContainer}>
            {mockCategories.map((category, index) => (
              <View key={category.id} style={styles.categoryItem}>
                <CategoryCard category={category} index={index} />
              </View>
            ))}
          </View>
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  categoriesGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  categoryItem: {
    width: "48%",
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 50,
  },
});
