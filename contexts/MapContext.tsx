import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import * as Location from "expo-location";
import MapView from "react-native-maps";

// Define the interface for coordinates
interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapContextProps {
  mapRef: React.MutableRefObject<MapView | null>;
  location: Coordinate | null;
  centerPosition: Coordinate | null;
  markerPosition: Coordinate | null;
  setLocation: (location: Coordinate) => void;
  setCenterPosition: (position: Coordinate | null) => void;
  setMarkerPosition: (position: Coordinate | null) => void;
  getCurrentLocation: () => Promise<void>;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const mapRef = useRef<MapView | null>(null);
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [centerPosition, setCenterPosition] = useState<Coordinate | null>(null);
  const [markerPosition, setMarkerPosition] = useState<Coordinate | null>(null);

  // Fetch user location
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;
      setLocation({ latitude, longitude });

      // Set initial center position to user's location
      if (!centerPosition) {
        setCenterPosition({ latitude, longitude });
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  // Fetch the location when component mounts
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <MapContext.Provider
      value={{
        mapRef,
        location,
        markerPosition,
        centerPosition,
        setLocation,
        setCenterPosition,
        setMarkerPosition,
        getCurrentLocation,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};
