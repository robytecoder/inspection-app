import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define the props for the CustomButton component
interface CustomButtonProps {
  title: string; // Button label
  onPress: () => void; // Function triggered on button press
  iconName: keyof typeof Ionicons.glyphMap; // Name of Ionicons icon
  buttonStyle?: StyleProp<ViewStyle>; // Optional custom styles
}

// Functional component for a customizable button with an icon
const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  iconName,
  buttonStyle = {}, // Default to an empty object
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons name={iconName} size={24} color="white" />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

// Get screen width for responsiveness
const screenWidth = Dimensions.get("window").width;

// Styles for the CustomButton component
const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // padding: 15,
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: 300,
    // minWidth: screenWidth * 0.6,
    // maxWidth: screenWidth * 0.9,
    backgroundColor: "#333",
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default CustomButton;
