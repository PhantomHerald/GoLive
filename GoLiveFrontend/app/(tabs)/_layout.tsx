import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Bell, CirclePlus, CircleUser, Search } from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#BF94FE",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Browse"
        options={{
          title: "Browse",
          tabBarIcon: ({ color }) => <Search size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Create"
        options={{
          title: "",
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <CirclePlus
              size={50}
              color={color}
              style={{ marginBottom: "auto" }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Activity"
        options={{
          title: "Activity",
          headerShown: true,
          headerStyle: { backgroundColor: "black" },

          tabBarIcon: ({ color }) => <Bell size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <CircleUser size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
