import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { CommonActions } from "@react-navigation/native";
import uuid from "react-native-uuid";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import ColorPicker from "@/components/CustomColorPicker";
import CustomIcon from "@/components/CustomIcon";
import { ICONS, IconType } from "@/assets/icons/icons";
import { moveImage, saveNewInspection } from "@/utils/inspectionUtils";
import { Inspection } from "@/utils/inspectionInterface";

/**
 * Screen to input additional inspection details (title, description, color, icon).
 * Handles saving the inspection after user input.
 */
export default function AddInfoScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { latitude, longitude, imageUri } = useLocalSearchParams() as {
    latitude: string;
    longitude: string;
    imageUri: string;
  };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [markerColor, setMarkerColor] = useState("#D32F2F");
  const [markerIcon, setMarkerIcon] = useState("default");

  /**
   * Handles saving the new inspection.
   * Moves the image, generates a UUID, and saves inspection data.
   */
  const handleSavePress = async () => {
    try {
      // Construct new inspection object
      const newImageUri = await moveImage(imageUri as string);
      if (newImageUri) {
        const timestamp = new Date().toISOString();
        const newInspection: Inspection = {
          id: uuid.v4() as string, // Ensure UUID is a string
          latitude: Number(latitude),
          longitude: Number(longitude),
          imageUri: newImageUri,
          markerColor,
          markerIcon,
          title,
          description,
          timestamp,
        };
        await saveNewInspection(newInspection);

        // Navigate back to the list screen after saving
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "list" }],
          })
        );
      } else {
        console.log("Failed to move image");
      }
    } catch (error) {
      console.log("Error handling save press:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Icon Selection */}
      <View style={styles.container}>
        <View style={styles.iconRow}>
          {Object.keys(ICONS).map((icon) => (
            <Pressable
              key={icon}
              onPress={() => setMarkerIcon(icon)}
              style={styles.icon}
            >
              <CustomIcon
                color={icon === markerIcon ? "white" : "transparent"}
                icon={icon as IconType}
                iconFill={icon === markerIcon ? "black" : "gray"}
              />
            </Pressable>
          ))}
        </View>
        <View style={styles.colorPickerStyle}>
          <ColorPicker onSelectColor={(color) => setMarkerColor(color)} />
        </View>
      </View>

      {/* Input Fields (Title & Description) */}
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <Ionicons name="pencil" size={24} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor="gray"
            value={title}
            onChangeText={setTitle}
            cursorColor={"white"}
            clearTextOnFocus={true}
          />
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <Ionicons name="pencil" size={24} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="gray"
            value={description}
            onChangeText={setDescription}
            multiline
            cursorColor={"white"}
            clearTextOnFocus={true}
          />
        </View>
      </View>

      {/* Image Preview */}
      <View style={styles.container}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>

      {/* Save Button */}
      <View style={styles.container}>
        <CustomButton
          title="Save"
          onPress={handleSavePress}
          iconName="save-outline"
          buttonStyle={styles.customButtonStyle}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    margin: 15,
  },
  customButtonStyle: {
    backgroundColor: "#333",
    borderColor: "white",
    borderWidth: 3,
  },
  colorPickerStyle: {
    marginTop: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 30,
    borderColor: "white",
    borderWidth: 2,
    paddingHorizontal: 10,
    width: 300,
  },
  input: {
    flex: 1,
    color: "white",
    paddingVertical: 15,
    fontSize: 18,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "cover",
  },
  iconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: 300,
  },
  icon: {
    marginHorizontal: 10,
    margin: 5,
  },
});
