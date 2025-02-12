import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import CustomMapView from "@/components/CustomMapView";
import { getInspections } from "@/utils/inspectionUtils";
import { Inspection } from "@/utils/inspectionInterface";

export default function HomeMapScreen() {
  // State to store the list of inspections
  const [inspections, setInspections] = useState<Inspection[]>([]);

  // Get latitude & longitude params safely
  const params = useLocalSearchParams() as {
    latitude?: string;
    longitude?: string;
  };
  const centerPosition =
    params.latitude && params.longitude
      ? {
          latitude: parseFloat(params.latitude),
          longitude: parseFloat(params.longitude),
        }
      : undefined;

  // Load inspections using the utility function
  useFocusEffect(
    useCallback(() => {
      const fetchInspections = async () => {
        try {
          const data = await getInspections();
          setInspections(data);
        } catch (error) {
          console.error("Error loading inspections:", error);
        }
      };
      fetchInspections();
    }, [])
  );

  return (
    <View style={styles.container}>
      <CustomMapView
        inspections={inspections}
        centerPosition={centerPosition}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
