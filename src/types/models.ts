/**
 * Core data models for VisualSort application
 */

export interface Activity {
  id: string;              // UUID v4
  title: string;           // Max 25 characters
  createdAt: string;       // ISO 8601 date string
  columns: SortingColumn[];
  items: SortingItem[];
}

export interface SortingColumn {
  id: string;              // UUID v4
  title: string;           // User-defined category name
  headerImagePath: string | null;  // file:// URI or null
  colorIndex: number;      // 0-5, maps to color palette
}

export interface SortingItem {
  id: string;              // UUID v4
  imagePath: string;       // file:// URI to local image
  currentLocation: string | null;  // Column ID or null (in tray)
}
