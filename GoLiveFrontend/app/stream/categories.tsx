import React from "react";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import { CategoryCard } from "@/components/CategoryCard";
import SectionHeader from "@/components/SectionHeader";
import { mockCategories } from "@/data/mockdata";

export default function CategoriesScreen() {
  return (
    <View style={[styles.container, { backgroundColor: "" }]}> 
      <FlatList
        data={mockCategories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={<SectionHeader title="Popular" />}
        renderItem={({ item, index }) => (
          <View style={styles.categoryItem}>
            <CategoryCard category={item} index={index} />
          </View>
        )}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 16,
    marginHorizontal: 0,
  },
  categoryItem: {
    flex: 1,
    marginHorizontal: 0,
    // Ensures two per row with space between
  },
});
