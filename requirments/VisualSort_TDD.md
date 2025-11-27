# **Technical Design Document (TDD)**

# **VisualSort \- React Native Implementation**

Version: 1.1  
Date: November 23, 2025  
Document Type: Technical Design Document  
Status: Draft

## **1\. EXECUTIVE SUMMARY**

### **1.1 Purpose**

This document outlines the technical architecture and implementation details for **VisualSort**, a cross-platform mobile application for iOS and Android. The app facilitates cognitive learning for children with ASD through customizable sorting activities.

### **1.2 Tech Stack Overview**

The application will be built using **React Native** to ensure code reusability across platforms while maintaining native performance, particularly for touch interactions.

* **Framework:** React Native (0.76+)  
* **Language:** TypeScript  
* **Navigation:** React Navigation v6+ (Native Stack)  
* **State Management:** Zustand (for lightweight, performant global state)  
* **Persistence:** react-native-mmkv (High-performance synchronous storage for JSON)  
* **File System:** react-native-fs (For managing image assets)  
* **Drag & Drop:** react-native-gesture-handler \+ react-native-reanimated  
* **Image Picker:** react-native-image-picker

## **2\. SYSTEM ARCHITECTURE**

### **2.1 High-Level Architecture**

The application follows a modular, layered architecture to separate UI concerns from business logic and data persistence.

graph TD  
    UI\[Presentation Layer (Components)\] \--\> Logic\[Business Logic (Hooks/Store)\]  
    Logic \--\> Services\[Service Layer\]  
    Services \--\> Storage\[Data Layer (MMKV / FS)\]

### **2.2 Directory Structure**

src/  
├── assets/             \# Static assets (icons, default images)  
├── components/         \# Reusable UI components  
│   ├── common/         \# Buttons, Inputs, Cards  
│   ├── sorting/        \# DraggableItem, DropZone, Column  
│   └── layout/         \# Screen wrappers, Headers  
├── constants/          \# Colors, Configs, Strings  
├── hooks/              \# Custom hooks (useDragAndDrop, useActivity)  
├── navigation/         \# Navigators (AppNavigator)  
├── screens/            \# Screen components  
│   ├── Home/  
│   ├── CreateActivity/  
│   └── SortingBoard/  
├── services/           \# Business logic interfaces  
│   ├── StorageService.ts  
│   ├── ImageService.ts  
│   └── ActivityService.ts  
├── store/              \# Zustand stores  
│   └── useAppStore.ts  
├── types/              \# TypeScript definitions  
└── utils/              \# Helper functions (UUID, Date formatting)

## **3\. DATA DESIGN**

### **3.1 Data Models (TypeScript Interfaces)**

#### **3.1.1 Activity Model**

interface Activity {  
  id: string;              // UUID  
  title: string;           // User defined title  
  createdAt: string;       // ISO Date string  
  columns: SortingColumn\[\];  
  items: SortingItem\[\];  
}

#### **3.1.2 Column Model**

interface SortingColumn {  
  id: string;              // UUID  
  title: string;           // "Red", "Animals", etc.  
  headerImagePath: string | null; // Local file URI  
  colorIndex: number;      // 0-5 (mapped to palette)  
}

#### **3.1.3 Item Model**

interface SortingItem {  
  id: string;              // UUID  
  imagePath: string;       // Local file URI  
  currentLocation: string | null; // Column ID or null (if in tray)  
}

### **3.2 Storage Strategy**

#### **3.2.1 Metadata Storage (JSON)**

All activity structures and item placements will be stored in a single JSON object stringified into react-native-mmkv.

* **Key:** visual\_sort\_data  
* **Value:** { activities: Activity\[\] }

#### **3.2.2 Binary Storage (File System)**

Images must be stored locally to work offline. We will use react-native-fs.

* **Root Dir:** DocumentDirectoryPath/VisualSort/  
* **Structure:**  
  * /activities/{activityId}/headers/{img\_uuid}.jpg  
  * /activities/{activityId}/items/{img\_uuid}.jpg

## **4\. COMPONENT DESIGN & UX LOGIC**

### **4.1 Navigation Flow (Stack Navigator)**

1. **HomeScreen**: Lists activities.  
2. **CreateActivityModal**: Full-screen modal for inputting title and column configuration.  
3. **SortingScreen**: The main game interface.

### **4.2 Critical Components**

#### **4.2.1 SortingBoard (The Game Loop)**

* **State:** Uses a local derived state from the global store to track immediate drag positions to ensure 60fps animations.  
* **Rendering:**  
  * Uses useWindowDimensions to calculate column width dynamically: (windowWidth \- padding) / columnCount.  
  * Renders Column components mapped from the activity data.  
* **Edit Mode:** Toggles boolean state isEditing. When true, overlays "Delete" icons on columns and "Add (+)" button if columns.length \< 6\.

#### **4.2.2 DraggableItem**

* **Tech:** Wraps a \<Image\> in a GestureDetector (Pan) and Animated.View.  
* **Logic:**  
  * **onStart:** Store initial coordinates. Scale up to 1.1x. Haptic feedback (Light).  
  * **onUpdate:** Update translateX, translateY.  
  * **onEnd:**  
    * Calculate drop coordinates.  
    * Hit test against defined Drop Zones (Columns).  
    * **If Hit:** Update Store (move item to column). Haptic feedback (Medium). Snap to new position.  
    * **If Miss:** Spring animation back to initial coordinates. Haptic feedback (Error).

#### **4.2.3 Column (Drop Zone)**

* **Props:** items: SortingItem\[\], color, title, isEditing.  
* **Logic:**  
  * Measures its own layout on mount using onLayout and registers these coordinates in a DropZoneRegistry (Context or Store) so draggable items know where to land.  
  * Renders items vertically.

## **5\. SERVICES IMPLEMENTATION**

### **5.1 StorageService**

Abstractions for MMKV interactions.

* getActivities(): Returns parsed JSON.  
* saveActivity(activity): Updates the array and re-serializes.  
* deleteActivity(id): Removes activity from array AND triggers ImageService.cleanup(id).

### **5.2 ImageService**

Abstractions for file system operations.

* saveImage(uri, activityId, type):  
  1. Generates UUID.  
  2. Copies file from temporary picker location to DocumentDirectoryPath/VisualSort/activities/{id}/{type}/.  
  3. Returns the file:// URI.  
* deleteActivityFolder(activityId): Recursively deletes the specific activity folder.

## **6\. STATE MANAGEMENT (Zustand)**

We will use a single store useAppStore to minimize complexity.

interface AppState {  
  activities: Activity\[\];  
  currentActivityId: string | null;

  // Actions  
  fetchActivities: () \=\> void;  
  addActivity: (title: string, columns: string\[\]) \=\> void;  
  deleteActivity: (id: string) \=\> void;  
  updateStructure: (id: string, newCols: SortingColumn\[\]) \=\> void; // For add/remove cols  
    
  // Game Actions  
  moveItem: (itemId: string, targetColumnId: string | null) \=\> void;  
  addItem: (activityId: string, imageUri: string) \=\> void;  
}

## **7\. DRAG AND DROP IMPLEMENTATION DETAILS**

Since we need to drag items *between* scrollable areas (The "Items to Sort" tray might scroll horizontally, and columns might get long vertically), standard Drag and Drop APIs can be tricky.

**Proposed Solution:**

* Use a **Z-Index Portal** approach.  
* When a drag starts, the item is visually detached from its list and rendered in an absolute overlay on top of the entire screen structure.  
* We use react-native-reanimated shared values to track the absolute X/Y of the finger.  
* **Hit Detection:** Manual calculation.  
  * We maintain a map of DropZones { id: string, x: number, y: number, width: number, height: number }.  
  * On dragEnd, we loop through DropZones to check if fingerX \> zone.x && fingerX \< zone.x \+ zone.width (etc).

## **8\. EDITING & DYNAMIC COLUMNS**

### **8.1 Adding a Column**

1. User clicks "Add Column".  
2. Store updates activities array for current ID.  
3. UI re-renders. Since widths are calculated via flex or percentage (100 / N), the existing columns will shrink smoothly to accommodate the new one.

### **8.2 Deleting a Column**

1. Check if items exist in that column.  
2. If yes, iterate through those items and set currentLocation \= null.  
3. Remove column from array.  
4. Save Store.

## **9\. TESTING STRATEGY**

### **9.1 Unit Tests (Jest)**

* **Logic:** Test moveItem reducer logic (ensuring items actually switch IDs).  
* **Validation:** Test CreateActivity input validation (max 6 columns, non-empty titles).

### **9.2 Component Tests (React Native Testing Library)**

* **Rendering:** Ensure correct number of columns render based on props.  
* **Interaction:** Fire events for "Add Items" and ensure Image Picker mock is called.

## **10\. DEPLOYMENT & CONFIG**

### **10.1 Permissions**

* **iOS:** Info.plist  
  * NSPhotoLibraryUsageDescription: "To select images for sorting items."  
  * NSCameraUsageDescription: "To take photos of items to sort."  
* **Android:** AndroidManifest.xml  
  * READ\_EXTERNAL\_STORAGE / READ\_MEDIA\_IMAGES  
  * CAMERA

### **10.2 Asset Optimization**

* Images selected by users should be resized/compressed before saving to disk to prevent storage bloat.  
* Library: react-native-image-resizer or expo-image-manipulator.  
* Target: Max 1024x1024px, JPEG 80% quality.