import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Define the props for the ColorPicker component
interface ColorPickerProps {
  onSelectColor?: (color: string) => void;
}

// Get the screen width
const screenWidth = Dimensions.get("window").width;

// Calculate the dynamic size of color circles based on screen width
const CIRCLE_SIZE = Math.min(32, screenWidth / 10); // Limits max size to 40

// Available colors constant
const COLORS = [
  "#D32F2F",
  "#E64A19",
  "#FBC02D",
  "#388E3C",
  "#1976D2",
  "#512DA8",
  "#7B1FA2",
];

// Default function component for the color picker
export default function ColorPicker({ onSelectColor }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  // Memoized color selection handler
  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedColor(color);
      onSelectColor?.(color); // Calls the function only if it's provided
    },
    [onSelectColor]
  );

  return (
    <View style={styles.container}>
      {COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorCircle,
            {
              backgroundColor: color,
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
            },
            selectedColor === color && styles.selectedBorder,
          ]}
          onPress={() => handleColorSelect(color)}
        >
          {selectedColor === color && (
            <MaterialIcons
              name="check"
              size={CIRCLE_SIZE * 0.75}
              color="white"
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Styles for the ColorPicker component
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorCircle: {
    margin: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedBorder: {
    borderWidth: 3,
    borderColor: "white",
  },
});
