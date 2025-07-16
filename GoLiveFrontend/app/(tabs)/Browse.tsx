import Searchtabs from "@/components/ui/searchtabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28282E",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 10,
    marginHorizontal: 10,
    flex: 1, // Make the container expand to fill available width
    minWidth: 0, // Prevent overflow issues
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
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
    <SafeAreaView
      style={[
        { paddingTop: 15 },
        Platform.select({
          android: { marginTop: 30 },
          default: {},
        }),
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 10,
        }}
      >
        <View style={styles.container}>
          <Ionicons name="search" size={20} color="#888" style={styles.icon} />
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
