import React from "react";
import { Pressable } from "react-native";
import { Stack, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";

/**
 * Stack navigator layout for managing the Add Inspection flow
 */
export default function StackLayout() {
  const navigation = useNavigation(); // Hook to access the navigation object

  // Function to handle the press event on the header right button
  const handlePress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "index" }],
      })
    );
  };

  return (
    // Stack navigator to manage screen navigation
    <Stack
      screenOptions={{
        headerShown: true, // Show the header
        headerTitleAlign: "center", // Center align the header title
        headerStyle: { backgroundColor: "black" }, // Set header background color to black
        headerTitleStyle: { color: "white" }, // Set header title color to white
        headerTintColor: "white", // Set header tint color to white
        headerRight: () => (
          // Pressable component for the header right button
          <Pressable onPressIn={handlePress} style={{ marginRight: 10 }}>
            <Ionicons name="close" size={24} color="white" />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Tap or Drag" }} />
      <Stack.Screen name="image" options={{ title: "Select" }} />
      <Stack.Screen name="info" options={{ title: "Edit" }} />
    </Stack>
  );
}
