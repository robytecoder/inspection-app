import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomIcon from "@/components/CustomIcon";
import { IconType } from "@/assets/icons/icons";
import { Inspection } from "@/utils/inspectionInterface";

// Constants
const SCREEN_WIDTH = Dimensions.get("window").width;
const MODAL_WIDTH_PERCENTAGE = 0.9;
const MODAL_WIDTH = SCREEN_WIDTH * MODAL_WIDTH_PERCENTAGE;

interface InspectionViewProps {
  inspection: Inspection;
  onDelete?: (id: string) => void;
  onPress?: (latitude: number, longitude: number) => void;
  isModal?: boolean;
}

export default function InspectionView({
  inspection,
  onDelete,
  onPress,
  isModal = false,
}: InspectionViewProps) {
  const containerWidth = isModal ? MODAL_WIDTH : SCREEN_WIDTH;

  return (
    <View style={[styles.inspectionContainer, { width: containerWidth }]}>
      {/* Top Bar */}
      <View
        style={[
          styles.inspectionBar,
          { backgroundColor: inspection.markerColor },
        ]}
      >
        {/* Clickable Icon (Disabled in Modal) */}
        <Pressable
          style={styles.iconContainer}
          onPress={() => onPress?.(inspection.latitude, inspection.longitude)}
          disabled={isModal}
        >
          <CustomIcon
            color="transparent"
            icon={inspection.markerIcon as IconType}
            iconFill="white"
          />
        </Pressable>

        {/* Title */}
        <Text style={styles.textTitleStyle}>{inspection.title}</Text>

        {/* Delete Button (If Available) */}
        {onDelete && (
          <Pressable
            onPress={() => onDelete(inspection.id)}
            style={styles.iconContainer}
          >
            <Ionicons name="close" size={30} color="white" />
          </Pressable>
        )}
      </View>

      {/* Image */}
      {inspection.imageUri && (
        <Image
          source={{ uri: inspection.imageUri }}
          style={{ width: containerWidth, height: containerWidth }}
        />
      )}

      {/* Description */}
      {inspection.description.trim() !== "" && (
        <Text style={styles.textDescriptionStyle}>
          {inspection.description}
        </Text>
      )}

      {/* Timestamp */}
      <Text style={styles.textTimestampStyle}>
        {new Date(inspection.timestamp).toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inspectionContainer: {
    paddingBottom: 10,
    backgroundColor: "black",
  },
  inspectionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  iconContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textTitleStyle: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    padding: 10,
  },
  textDescriptionStyle: {
    color: "white",
    fontSize: 16,
    marginHorizontal: 15,
    marginTop: 10,
  },
  textTimestampStyle: {
    color: "white",
    fontSize: 12,
    marginHorizontal: 15,
    marginVertical: 8,
    textAlign: "right",
  },
});
