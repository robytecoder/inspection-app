import React, { useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

// Mapping for tab icons
const tabIcons: { [key: string]: string } = {
  index: "map-outline",
  indexFocused: "map-sharp",
  list: "list-outline",
  listFocused: "list-sharp",
  add: "add-sharp",
};

// Default function component for the tab layout
export default function TabLayout() {
  // Set navigation bar color on Android
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("black").catch((error) =>
        console.error("Failed to set navigation bar color:", error)
      );
    }
  }, []);

  return (
    <>
      {/* StatusBar component for consistent appearance */}
      <StatusBar style="light" backgroundColor="black" />

      {/* Tabs navigation */}
      <Tabs
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: "black" },
          headerTitleAlign: "center",
          headerTitleStyle: { color: "white" },
          tabBarStyle:
            route.name === "add"
              ? { display: "none" }
              : { backgroundColor: "black", borderColor: "black" },
          tabBarLabelStyle: { color: "white" },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "white",
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => {
            const iconName =
              route.name === "index"
                ? focused
                  ? tabIcons.indexFocused
                  : tabIcons.index
                : route.name === "list"
                ? focused
                  ? tabIcons.listFocused
                  : tabIcons.list
                : tabIcons.add;
            return (
              <Ionicons
                name={iconName as keyof typeof Ionicons.glyphMap}
                color={color}
                size={24}
              />
            );
          },
        })}
      >
        {/* Define the screens for the tabs */}
        <Tabs.Screen
          name="index"
          options={{ title: "Inspection Map", headerShown: true }}
        />
        <Tabs.Screen
          name="add"
          options={{ title: "Inspection Add", headerShown: false }}
        />
        <Tabs.Screen
          name="list"
          options={{ title: "Inspection List", headerShown: true }}
        />
      </Tabs>
    </>
  );
}
