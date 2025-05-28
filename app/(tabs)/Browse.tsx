import Searchtabs from "@/components/ui/searchtabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28282E",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    margin: 10,
    flex: 1, // Make the container expand to fill available width
    minWidth: 0, // Prevent overflow issues
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
});

type SearchBarProps = {
  placeholder?: string;
  onSearch?: (text: string) => void;
};

const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleChange = (text: string) => {
    setQuery(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 10,
        }}
      >
        {/* Search icon outside the container */}
        <Ionicons name="search" size={20} color="#888" style={styles.icon} />
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder={placeholder || "Search"}
            value={query}
            onChangeText={handleChange}
            placeholderTextColor="#888"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function Browsescreen() {
  return (
    <>
      {/* searchbar */}
      <SearchBar />
      <Searchtabs />
    </>
  );
}
