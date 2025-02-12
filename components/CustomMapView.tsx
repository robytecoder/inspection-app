import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Modal,
  View,
  ScrollView,
} from "react-native";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import MapView from "react-native-maps";
import { DEFAULT_LOCATION } from "@/utils/defaultLocation";
import CustomIcon from "@/components/CustomIcon";
import InspectionItem from "@/components/InspectionView";
import { Inspection } from "@/utils/inspectionInterface";

// Define the interface for coordinates
interface Coordinate {
  latitude: number;
  longitude: number;
}

// Define the props for the CustomMapView component
interface CustomMapViewProps {
  inspections?: Inspection[];
  centerPosition?: Coordinate;
  markerPosition?: Coordinate;
  showMarker?: boolean;
  onMarkerDragEnd?: (coordinate: Coordinate) => void;
  onLocationFetched?: (coordinate: Coordinate) => void;
}

// Default function component for the custom map view
export default function CustomMapView({
  inspections = [],
  centerPosition,
  markerPosition = DEFAULT_LOCATION,
  showMarker = false,
  onMarkerDragEnd,
  onLocationFetched,
}: CustomMapViewProps) {
  const mapRef = useRef<MapView | null>(null);
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInspection, setSelectedInspection] =
    useState<Inspection | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  /**
   * Request location permission and fetch the current coordinates.
   */
  const requestAndFetchCoordinates = async (): Promise<Coordinate> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied");
        setLocationPermission(false);
        return DEFAULT_LOCATION; // Return default location if permission is denied
      }
      setLocationPermission(true);
      const { coords } = await Location.getCurrentPositionAsync({});
      return { latitude: coords.latitude, longitude: coords.longitude };
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocationPermission(false);
      return DEFAULT_LOCATION; // Fallback to default location on error
    }
  };

  /**
   * Opens modal with inspection details when a marker is pressed.
   */
  const handleMarkerPress = useCallback((inspection: Inspection) => {
    setSelectedInspection(inspection);
    setModalVisible(true);
  }, []);

  /**
   * Centers the map on the user's location.
   */
  const centerMapOnUser = useCallback(async () => {
    setLoading(true);
    const coordinate = await requestAndFetchCoordinates();
    setLocation(coordinate);
    onLocationFetched?.(coordinate);
    mapRef.current?.animateToRegion({
      ...coordinate,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    setLoading(false);
  }, []);

  // Fetch location on mount
  useEffect(() => {
    (async () => {
      const coordinate = await requestAndFetchCoordinates();
      setLocation(coordinate);
      onLocationFetched?.(coordinate);
    })();
  }, []);

  // Center the map when receiving new coordinates
  useEffect(() => {
    if (centerPosition && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: centerPosition.latitude,
        longitude: centerPosition.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [centerPosition]);

  // Trigger re-rendering when permission changes
  useEffect(() => {
    if (locationPermission) {
      setLocation(location);
    }
  }, [locationPermission]);

  // Render a message if the location is not available
  if (!location) {
    return <Text>{"Waiting for location..."}</Text>;
  }

  return (
    <>
      {/* MapView Component */}
      <MapView
        ref={mapRef}
        provider="google"
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation
        showsMyLocationButton={locationPermission}
        onPress={(e) => onMarkerDragEnd?.(e.nativeEvent.coordinate)}
      >
        {/* Display multiple markers for inspections */}
        {inspections.map((inspection) => (
          <Marker
            key={inspection.id}
            coordinate={{
              latitude: inspection.latitude,
              longitude: inspection.longitude,
            }}
            onPress={() => handleMarkerPress(inspection)}
          >
            <CustomIcon
              color={inspection.markerColor}
              icon={inspection.markerIcon}
            />
          </Marker>
        ))}

        {/* Draggable Marker for user selection */}
        {showMarker && (
          <Marker
            coordinate={markerPosition || location}
            anchor={{ x: 0.5, y: 1 }}
            draggable
            // onDragEnd={(e) => onMarkerDragEnd?.(e.nativeEvent.coordinate)}
          />
        )}
      </MapView>

      {/* Center Map Button */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={centerMapOnUser}
        disabled={loading}
      >
        <Ionicons name="locate" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal for inspection details */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {selectedInspection && (
                <InspectionItem
                  inspection={selectedInspection}
                  onDelete={() => {
                    setModalVisible(false);
                  }}
                  // isModal={true}
                  isModal
                />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Activity indicator to show loading state */}
      {loading && <ActivityIndicator size="large" color="black" />}
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "black",
    borderRadius: 50,
    padding: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "black",
    borderRadius: 18,
    overflow: "hidden",
  },
  modalContent: {
    backgroundColor: "black",
    borderRadius: 18,
    alignItems: "center",
  },
});
