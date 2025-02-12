import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useRouter } from "expo-router";
import InspectionView from "@/components/InspectionView";
import CustomButton from "@/components/CustomButton";
import { Inspection } from "@/utils/inspectionInterface";
import {
  getInspections,
  deleteInspection,
  resetInspections,
} from "@/utils/inspectionUtils";

export default function ListScreen() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const handleInspectionDelete = (id: string) =>
    deleteInspection(id, setInspections);
  const handleInspectionsReset = () => resetInspections(setInspections);
  const router = useRouter();

  // Load inspections when the screen is in focus
  useFocusEffect(
    useCallback(() => {
      const fetchInspections = async () => {
        const data = await getInspections();
        setInspections(data);
      };
      fetchInspections();
    }, [])
  );

  // Render inspections
  const renderInspections = () => {
    if (inspections.length === 0) {
      return (
        <View style={styles.noInspectionsContainer}>
          <Text style={styles.noInspectionsText}>No Inspections</Text>
        </View>
      );
    }

    return inspections
      .slice()
      .reverse()
      .map((inspection) => (
        <View key={inspection.id} style={styles.inspectionContainer}>
          <InspectionView
            inspection={inspection}
            onDelete={handleInspectionDelete}
            onPress={(latitude, longitude) =>
              router.push({
                pathname: "/(tabs)",
                params: {
                  latitude: latitude.toString(),
                  longitude: longitude.toString(),
                },
              })
            }
          />
        </View>
      ));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {renderInspections()}
      {inspections.length > 0 && (
        <CustomButton
          title="Reset"
          onPress={handleInspectionsReset}
          iconName="trash-outline"
          buttonStyle={styles.customButtonStyle}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "black",
  },
  noInspectionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  noInspectionsText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  inspectionContainer: {
    width: "100%",
    marginBottom: 30,
  },
  customButtonStyle: {
    backgroundColor: "#333",
    borderColor: "white",
    borderWidth: 1,
    margin: 30,
  },
});
