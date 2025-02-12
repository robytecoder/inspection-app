import React, { useState } from "react";
import { View, ScrollView, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";

export default function AddImageScreen() {
  // Retrieve latitude and longitude from the previous screen
  const { latitude, longitude } = useLocalSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Requests permissions for camera and photo library access.
   * @returns {Promise<boolean>} - Returns `true` if permissions are granted, otherwise `false`.
   */
  const requestPermissions = async (): Promise<boolean> => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraPermission.status !== "granted" ||
      mediaLibraryPermission.status !== "granted"
    ) {
      Alert.alert(
        "Permissions needed",
        "Camera and photo library access are required."
      );
      return false;
    }
    return true;
  };

  /**
   * Opens the camera to capture an image.
   */
  const takeFromCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Store image URI
    }
  };

  /**
   * Opens the device's photo gallery to select an image.
   */
  const selectFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Set the image URI
    }
  };

  /**
   * Navigates to the next screen (`info.tsx`) and passes image & location data.
   */
  const handleNextPress = () => {
    if (!image) {
      Alert.alert("No image", "Please select or take an image first.");
      return;
    }

    router.push({
      pathname: "/add/info",
      params: {
        latitude: Number(latitude), // Pass latitude from previous screen
        longitude: Number(longitude), // Pass longitude from previous screen
        imageUri: encodeURIComponent(image), // Pass encoded image URI
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Capture Image from Camera */}
        <CustomButton
          title="Camera"
          onPress={takeFromCamera}
          iconName="camera-outline"
          buttonStyle={styles.customButtonStyle}
        />

        {/* Select Image from Gallery */}
        <CustomButton
          title="Gallery"
          onPress={selectFromGallery}
          iconName="images-outline"
          buttonStyle={styles.customButtonStyle}
        />

        {/* Display Selected Image */}
        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        )}

        {/* Proceed to Next Step */}
        {image && (
          <CustomButton
            title="Next"
            onPress={handleNextPress}
            iconName="arrow-forward"
            buttonStyle={styles.nextButtonStyle}
          />
        )}
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
    margin: 20,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  customButtonStyle: {
    backgroundColor: "#333",
    borderColor: "white",
    borderWidth: 2,
    margin: 20,
  },
  nextButtonStyle: {
    backgroundColor: "#333",
    borderColor: "white",
    borderWidth: 3,
    margin: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "cover",
  },
});
