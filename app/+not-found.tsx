import React from "react";
import { View, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";

// Default function component for the Not Found screen
export default function NotFoundScreen() {
  return (
    <>
      {/* Stack.Screen component to set the screen title */}
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View style={styles.container}>
        {/* Link component to navigate back to the Home screen */}
        <Link href="/" style={styles.button}>
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
