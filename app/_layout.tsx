import React from "react";
import { Stack } from "expo-router";

// Root layout component that manages the main navigation structure
export default function RootLayout() {
  return (
    <Stack>
      {/* Main tab navigation screen (hides header for cleaner tab navigation) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Not Found Screen - Optionally customize if needed */}
      <Stack.Screen name="+not-found" options={{ title: "Page Not Found" }} />
    </Stack>
  );
}
