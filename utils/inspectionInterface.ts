// Defines the structure of an Inspection object used throughout the app
export interface Inspection {
  id: string; // Unique identifier
  latitude: number; // Latitude of the inspection location
  longitude: number; // Longitude of the inspection location
  imageUri: string; // URI of the associated image
  markerColor: string; // Color of the marker displayed on the map
  markerIcon: string; // Icon representing the inspection type
  title: string; // Title of the inspection
  description: string; // Detailed description
  timestamp: string; // Timestamp of when the inspection was recorded
}
