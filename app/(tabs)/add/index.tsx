import { useState, useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import CustomMapView from "@/components/CustomMapView";
import { DEFAULT_LOCATION } from "@/utils/defaultLocation";

// Component for selecting marker location before adding an inspection
export default function AddMarkerScreen() {
  const [markerPosition, setMarkerPosition] = useState(DEFAULT_LOCATION);
  const [fetchedLocation, setFetchedLocation] = useState(false);
  const router = useRouter();

  // Updates marker position when dragged
  const handleMarkerPosition = useCallback(
    (coordinate: { latitude: number; longitude: number }) => {
      setMarkerPosition(coordinate);
    },
    []
  );

  // Moves to the next step, passing selected coordinates
  const handleNextPress = async () => {
    if (markerPosition) {
      console.log("Marker Position:", markerPosition);
      router.push({
        pathname: "/add/image",
        params: {
          latitude: markerPosition.latitude,
          longitude: markerPosition.longitude,
        },
      });
    }
  };

  // Ensures marker resets only if real location hasn't been fetched
  useEffect(() => {
    if (!fetchedLocation) {
      setMarkerPosition(DEFAULT_LOCATION);
    }
  }, [fetchedLocation]);

  return (
    <View style={styles.mapContainer}>
      {/* Map Component with marker selection */}
      <CustomMapView
        showMarker
        markerPosition={markerPosition} // Pass the marker position, which can be null initially
        onMarkerDragEnd={handleMarkerPosition} // Pass the drag end handler
        onLocationFetched={(coordinate) => {
          setMarkerPosition(coordinate); // Update marker with real location
          setFetchedLocation(true); // Mark real location as fetched
        }}
      />

      {/* Navigation Button */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Next"
          onPress={handleNextPress}
          iconName="arrow-forward-outline"
          buttonStyle={styles.customButtonStyle}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 70,
    alignSelf: "center",
  },
  customButtonStyle: {
    backgroundColor: "black",
  },
});
