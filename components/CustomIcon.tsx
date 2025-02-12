import React from "react";
import Svg, { Path, Circle } from "react-native-svg";
import { ICONS } from "@/assets/icons/icons";

// Define props interface for CustomIcon component
interface CustomIconProps {
  color: string; // Background color of the circle
  icon: string; // Name of the icon (must be a valid key from ICONS)
  iconFill?: string; // Color of the icon (default: white)
  size?: number; // Optional size parameter (default: 38px)
}

export default function CustomIcon({
  color,
  icon,
  iconFill = "white",
  size = 38,
}: CustomIconProps) {
  // Validate that the provided icon name exists in ICONS
  // If it doesn't exist, use "default" as a fallback
  const validIcon = ICONS[icon as keyof typeof ICONS] ? icon : "default";

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Background Circle (Icon Container) */}
      <Circle cx="12" cy="12" r="12" fill={color} />

      {/* Icon Path */}
      <Path
        fill={iconFill} // Apply the chosen fill color
        d={ICONS[validIcon as keyof typeof ICONS]} // Get the correct icon path
        transform="translate(4,4) scale(0.65)" // Adjust the icon position & size
      />
    </Svg>
  );
}
