import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
import { Inspection } from "@/utils/inspectionInterface";

/**
 * Retrieves the list of inspections from AsyncStorage.
 * @returns {Promise<Inspection[]>} List of saved inspections.
 */
export const getInspections = async (): Promise<Inspection[]> => {
  try {
    const inspections = await AsyncStorage.getItem("inspections");
    return inspections ? (JSON.parse(inspections) as Inspection[]) : [];
  } catch (error) {
    console.error("Error retrieving inspections:", error);
    return [];
  }
};

/**
 * Saves a new inspection to AsyncStorage.
 * @param {Inspection} inspection - The inspection object to save.
 */
export const saveNewInspection = async (inspection: Inspection) => {
  try {
    const inspections = await getInspections(); // Retrieve existing inspections
    inspections.push(inspection); // Append the new inspection
    await AsyncStorage.setItem("inspections", JSON.stringify(inspections)); // Save back to AsyncStorage
    console.log("Inspection saved successfully");
  } catch (error) {
    console.error("Error saving inspection:", error);
  }
};

/**
 * Moves an image to the local file system for better persistence.
 * @param {string} imageUri - URI of the image to move.
 * @returns {Promise<string | null>} New file path or null if failed.
 */
export const moveImage = async (imageUri: string): Promise<string | null> => {
  const fileName = imageUri.split("/").pop(); // Extract filename
  const newDir = `${FileSystem.documentDirectory}images/`; // Target directory
  const newPath = `${newDir}${fileName}`; // Full new path

  try {
    // Request media library permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      console.warn("Permission to access media library is required!");
      return null;
    }

    // Ensure the directory exists
    const dirInfo = await FileSystem.getInfoAsync(newDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(newDir, { intermediates: true });
    }

    // Move the file to the new directory
    await FileSystem.moveAsync({
      from: imageUri,
      to: newPath,
    });

    // Save the file to the media library
    const asset = await MediaLibrary.createAssetAsync(newPath);
    const album = await MediaLibrary.getAlbumAsync("Pictures");

    if (!album) {
      await MediaLibrary.createAlbumAsync("Pictures", asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    console.log("Image moved to:", newPath);
    return newPath;
  } catch (error) {
    console.error("Error moving image:", error);
    return null;
  }
};

/**
 * Deletes a single inspection from AsyncStorage.
 * @param {string} id - The ID of the inspection to delete.
 * @param {Function} setInspections - State setter for updating the UI.
 */
export const deleteInspection = (id: string, setInspections: Function) => {
  Alert.alert(
    "Confirm Deletion",
    "Are you sure you want to delete this inspection?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("Deleting inspection with id:", id);
            const inspections = await getInspections();
            const updatedInspections = inspections.filter(
              (inspection) => inspection.id !== id
            );
            setInspections(updatedInspections);
            await AsyncStorage.setItem(
              "inspections",
              JSON.stringify(updatedInspections)
            );
            console.log("Inspection deleted successfully");
          } catch (error) {
            console.error("Error deleting inspection:", error);
          }
        },
      },
    ]
  );
};

/**
 * Deletes all inspections from AsyncStorage.
 * @param {Function} setInspections - State setter for updating the UI.
 */
export const resetInspections = async (setInspections: Function) => {
  Alert.alert(
    "Confirm Reset",
    "Are you sure you want to delete all inspections?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setInspections([]);
            await AsyncStorage.removeItem("inspections");
            console.log("All inspections deleted successfully");
          } catch (error) {
            console.error("Error deleting all inspections:", error);
          }
        },
      },
    ]
  );
};
