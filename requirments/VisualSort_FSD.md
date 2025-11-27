# **Functional Specification Document**

# **VisualSort \- Categorization Learning Application**

**Version:** 2.2

**Date:** November 23, 2025

**Document Type:** Functional Specification Document

**Status:** Revised

## **1\. EXECUTIVE SUMMARY**

### **1.1 Purpose**

**VisualSort** is an educational mobile application designed to help children, particularly those with Autism Spectrum Disorder (ASD), develop cognitive skills through sorting and categorization. The application allows parents or therapists to create custom sorting boards (e.g., "Colors", "Animals vs. Vehicles", "Healthy vs. Junk Food"). Users upload images of items and the child organizes them by dragging and dropping them into the appropriate category columns.

### **1.2 Scope**

This document provides a complete functional specification for implementing the VisualSort application. It covers the Home Dashboard, Activity Creation flow, and the dynamic Sorting Interface with editing capabilities.

### **1.3 Target Audience**

* **Primary Users:** Children with ASD or learning needs (interacting with the sorting interface).  
* **Secondary Users:** Parents, teachers, and therapists (creating and managing activities).  
* **Development Team:** Developers, QA, and Designers.

### **1.4 Educational Goals**

* **Categorization:** Distinguishing between different attributes (color, shape, function).  
* **Fine Motor Skills:** Drag-and-drop interactions.  
* **Visual Structure:** Organizing items into defined spaces.  
* **Flexibility:** Allowing customized learning paths based on the child's specific needs.

## **2\. SYSTEM OVERVIEW**

### **2.1 Application Type**

Native or cross-platform mobile application for smartphones and tablets.

### **2.2 Core Functionality**

The application is divided into two distinct modes:

1. **Management Mode (Home):** Create, view, edit, and delete sorting activities.  
2. **Learning Mode (Sorting Page):** The interactive drag-and-drop environment.

### **2.3 User Interface Structure**

**Screen 1: Home Dashboard**

┌─────────────────────────────────────────────────┐  
│  App Bar: "VisualSort"                          │  
├─────────────────────────────────────────────────┤  
│  My Activities                                  │  
│                                                 │  
│  ┌───────────┐  ┌───────────┐                   │  
│  │   COLORS  │  │ ANIMALS   │                   │  
│  │ \[Preview\] │  │ \[Preview\] │                   │  
│  │ 3 Columns │  │ 2 Columns │                   │  
│  └───────────┘  └───────────┘                   │  
│                                                 │  
│  ┌───────────┐  ┌───────────┐                   │  
│  │ FRUIT/VEG │  │   SIZES   │                   │  
│  │ \[Preview\] │  │ \[Preview\] │                   │  
│  │ 2 Columns │  │ 4 Columns │                   │  
│  └───────────┘  └───────────┘                   │  
│                                                 │  
│                \[ (+) Create New \]               │  
└─────────────────────────────────────────────────┘

**Screen 2: Sorting Interface (Example: 3 Columns)**

┌─────────────────────────────────────────────────┐  
│  \< Back    Activity: "Colors"          \[Menu\]   │  
├─────────────────────────────────────────────────┤  
│                                                 │  
│  ┌──────┐    ┌──────┐    ┌──────┐               │  
│  │ Red  │    │ Blue │    │Green │               │  
│  │\[IMG\] │    │\[IMG\] │    │\[IMG\] │               │  
│  │      │    │      │    │      │               │  
│  │ 🍎   │    │ 🧢   │    │ 🥦   │               │  
│  │      │    │      │    │      │               │  
│  └──────┘    └──────┘    └──────┘               │  
│                                                 │  
├─────────────────────────────────────────────────┤  
│  Items to Sort (8)               \[Add Items\]    │  
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐            │  
│  │🚗 │ │🚙 │ │🥬 │ │🍓 │ │🔵 │ │...│            │  
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘            │  
└─────────────────────────────────────────────────┘

## **3\. DETAILED FUNCTIONAL REQUIREMENTS**

### **3.1 Home Dashboard**

#### **3.1.1 Activity List**

**Description**: The landing page displaying all created sorting activities.

**Functional Requirements**:

* **Layout**: Scrollable 2-column grid.  
* **Tile Content**:  
  * Activity Title (Truncated after 1 line).  
  * Subtitle: "X Columns".  
  * Visual: A mini-preview or generic icon representing the activity.  
* **Interaction**:  
  * **Tap**: Navigates to the *Sorting Interface* for that activity.  
  * **Long Press**: Activates context menu with "Delete" option.  
    * *Delete Logic*: Displays confirmation dialog ("Delete this activity?"). On confirm, removes activity and all associated local images.  
* **Empty State**: If no activities exist, display "Tap \+ to create your first sorting game."

#### **3.1.2 Create Activity Button**

**Description**: A Floating Action Button (FAB) or prominent button to start the creation flow.

**User Interactions**:

1. User taps "Create New".  
2. System opens the **Create Activity Modal**.

### **3.2 Activity Creation Flow**

#### **3.2.1 Configuration Form**

**Description**: Users define the initial structure of the sorting page.

**Input Fields**:

1. **Page Title**: Text input (Max 25 chars). E.g., "Healthy vs Unhealthy".  
2. **Number of Columns**: Numeric selection (Min: 2, **Max: 6**).  
3. **Column Titles**: Dynamic list of text inputs based on the number selected above.

**Creation Logic**:

* **Validation**: All titles must be non-empty.  
* **Confirmation**: "Create Activity" button.  
* **Post-Creation**: Upon clicking Create, the activity is saved to storage, and the user is immediately navigated to the new (empty) *Sorting Interface*.

### **3.3 Sorting Interface (The Board)**

#### **3.3.1 Dynamic Column Management**

**Description**: The main workspace where sorting happens.

**Functional Requirements**:

* **Layout**: Display $N$ vertical columns.  
* **Width Calculation**: Each column width \= (100% / N) \- (Gaps).  
* **Headers**:  
  * Display the **Column Title**.  
  * **Header Color**: Assigned automatically from a high-contrast accessibility palette.  
  * **Header Image**: User can upload a representative image for the category.  
    * *Interaction*: Tap header image area \-\> Camera/Gallery picker \-\> Save.

#### **3.3.2 Edit Structure Mode (New)**

**Description**: Allows modifying the board structure after creation. Accessed via the Activity Menu \-\> "Edit Structure".

**Functionality**:

1. **Add Column**:  
   * Button: "Add Column (+)" (Visible if columns \< 6).  
   * Action: Appends a new column to the right. User is prompted to enter a Title.  
2. **Delete Column**:  
   * Visuals: "Delete (Trash Icon)" appears on every column header in Edit Mode.  
   * Constraint: Minimum 2 columns must remain. Cannot delete if only 2 columns exist.  
   * **Safety Logic**: If a column containing items is deleted, all items in that column are automatically moved to the "Items to Sort" tray.  
3. **Edit Title**: Tapping the text of a header in Edit Mode allows renaming.

#### **3.3.3 Item Management**

**Description**: Users upload items to be sorted.

**Functional Requirements**:

* **"Add Items" Button**: Located in the "Items to Sort" section (bottom).  
* **Functionality**: Multi-select from gallery or Camera.  
* **Storage**: Items are associated specifically with the *current Activity ID*.

#### **3.3.4 Items to Sort Display**

**Description**: The holding area for unsorted items.

**Functional Requirements**:

* **Section Title**: "Items to Sort (X)".  
* **Layout**: Responsive horizontal grid.  
* **Behavior**: Items uploaded appear here. Items returned from columns appear here.

### **3.4 Drag and Drop Interactions**

#### **3.4.1 Mechanics**

**Description**: Identical mechanics to original specification.

**Functional Requirements**:

* **Initiation**: Long press (\>150ms).  
* **Visuals**: Dragged item at 110% scale, 30% opacity on original.  
* **Drop Zones**:  
  * Target: Any of the Category Columns.  
  * Return: The "Items to Sort" section.  
* **Feedback**:  
  * **Valid Drop**: Item snaps to column/grid. Haptic success.  
  * **Invalid Drop**: Elastic bounce back. Haptic error.

#### **3.4.2 Organizing Items**

**Description**: Items inside columns.

**Functional Requirements**:

* Items stack vertically within the column.  
* Item size in columns: Scaled to fit column width.  
* **Double Tap**:  
  * In "Items to Sort": Delete item (with confirmation).  
  * In Column: Return item to "Items to Sort".

### **3.5 Data Persistence and Storage**

#### **3.5.1 Data Structure (Updated)**

**Description**: The data model supports variable columns and items.

**Data Schema (JSON)**:

{  
  "activities": \[  
    {  
      "id": "uuid-activity-1",  
      "title": "Colors",  
      "createdAt": "2025-11-23T10:00:00Z",  
      "columns": \[  
        {  
          "id": "col-1",  
          "title": "Red",  
          "headerImage": "/path/to/img\_red.jpg",  
          "colorIndex": 0  
        },  
        // ... more columns  
      \],  
      "items": \[  
        {  
          "id": "uuid-item-1",  
          "imagePath": "/path/to/apple.jpg",  
          "currentLocation": "col-1"  
        },  
        // ... more items  
      \]  
    }  
  \]  
}

#### **3.5.2 Storage Logic**

* **Autosave**: Triggered on any change (Item upload, drag-drop, header image upload, column add/delete).  
* **Directory Structure**:  
  * AppDocuments/activity\_{uuid}/items/  
  * AppDocuments/activity\_{uuid}/headers/

### **3.6 Reset & Delete Functionality**

#### **3.6.1 Activity Menu**

**Description**: Inside an Activity (Sorting Interface), the App Bar menu has specific options.

**Menu Options**:

1. **Edit Structure**: Enters mode to add/remove/rename columns (See 3.3.2).  
2. **Reset Placements**: Moves all items from columns back to "Items to Sort".  
3. **Clear All Items**: Deletes all item images for this activity.  
4. **Delete Activity**: Permanently removes the entire activity and returns user to Home Dashboard.

#### **3.6.2 Global Reset (Home Screen)**

**Description**: Menu on the Home Screen App Bar.

* **Delete All Data**: Wipes all activities and images.

### **3.7 User Interface Specifications**

#### **3.7.1 App Bar**

* **Home**: Title "VisualSort". Menu: "Delete All Data".  
* **Sorting Page**: Title "{Activity Name}". Left Icon: Back Arrow. Right Icon: Menu.

#### **3.7.2 Layout**

* **Home**: 2-Column Grid. Padding 16px. Gap 16px.  
* **Sorting**:  
  * Columns Area: \~66% height.  
  * Items Area: \~33% height.

#### **3.7.3 Color Palette (High Contrast)**

**Description**: Columns are assigned colors sequentially from this palette to ensure visual distinction.

1. **Column 1**: \#EF5350 (Red)  
2. **Column 2**: \#42A5F5 (Blue)  
3. **Column 3**: \#66BB6A (Green)  
4. **Column 4**: \#FFA726 (Orange)  
5. **Column 5**: \#AB47BC (Purple)  
6. **Column 6**: \#26C6DA (Cyan) \<-- New Color for 6th column

#### **3.7.4 Typography & Touch**

* Same specifications as original document (Bold 20px Titles, 44px min touch targets).

### **3.8 Animations & Haptics**

**Description**: Identical to original document.

* **Drag**: Scale up, opacity down.  
* **Drop**: Snap to grid.  
* **Feedback**: Light haptic on lift, Medium on drop, Double-pulse on error.

## **4\. TECHNICAL ARCHITECTURE**

### **4.1 Navigation**

* **Stack Navigation**:  
  * Home (Root)  
  * CreateActivityModal (Dialog/Modal)  
  * SortingPage (Pushed onto stack)

### **4.2 Services Updates**

* **Storage Service**: Updated to handle dynamic column arrays (adding/removing objects from the columns array in JSON).  
* **Image Service**: Updated to clean up images when an entire activity is deleted.

## **5\. USER WORKFLOWS**

### **5.1 Creating a New Sorting Game**

1. Parent opens app to Home Dashboard.  
2. Taps "Create New".  
3. Enters Title: "Living vs Non-Living".  
4. Selects Columns: "2".  
5. Enters Col 1: "Living".  
6. Enters Col 2: "Non-Living".  
7. Taps "Create".  
8. App saves structure and opens the new Sorting Page.

### **5.2 Editing Structure (Adding a Column)**

1. Parent realizes they need a "Unsure" category.  
2. Taps Menu \-\> "Edit Structure".  
3. Taps "Add Column (+)".  
4. Enters title "Unsure".  
5. Taps "Done".  
6. Board updates to 3 columns.

### **5.3 Learning (Child)**

1. Child sees the "Items to Sort" tray.  
2. Drags the cat image.  
3. Hovers over "Living" column \-\> Column highlights (Red).  
4. Drops image \-\> Snaps into place \-\> "Pop" sound/haptic.

## **6\. FUTURE ENHANCEMENTS**

* **Sound Recording**: Allow parents to record voice prompts for column headers.  
* **Lock Mode**: A PIN-protected mode that prevents editing/creating.  
* **Success Celebration**: A confetti animation when all items are sorted.

## **7\. GLOSSARY**

* **Activity**: A specific sorting game instance.  
* **Items to Sort**: The inventory of images waiting to be categorized.  
* **Column**: The category destination.