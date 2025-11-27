# Row/Column Orientation Feature

## Overview
Added the ability to choose between column and row layout orientations when creating an activity.

## Changes Made

### 1. Data Model Updates
- **Activity Model** (`src/types/models.ts`): Added `orientation: 'column' | 'row'` field
- **Storage Migration** (`src/services/StorageService.ts`): Existing activities default to 'column' orientation

### 2. Create Activity Screen
- **CreateActivityModal** (`src/screens/CreateActivity/CreateActivityModal.tsx`):
  - Added orientation selector with "Columns" and "Rows" buttons
  - Dynamic labels that change based on selected orientation
  - Passes orientation to activity creation

### 3. New Row Component
- **Row Component** (`src/components/sorting/Row.tsx`):
  - Horizontal layout version of Column component
  - Header on the left with image and title
  - Items scroll horizontally to the right
  - Same functionality as columns (edit, delete, drag & drop)

### 4. Sorting Screen Updates
- **SortingScreen** (`src/screens/Sorting/SortingScreen.tsx`):
  - Detects activity orientation and renders appropriate layout
  - Column layout: Vertical columns with horizontal scrolling items
  - Row layout: Horizontal rows with vertical scrolling items
  - Updated drag & drop detection for both orientations
  - Dynamic labels in UI (Add Column/Row, Delete Column/Row, etc.)

### 5. Service Layer
- **ActivityService** (`src/services/ActivityService.ts`): Updated `createActivity` to accept orientation parameter
- **AppStore** (`src/store/useAppStore.ts`): Updated `addActivity` to pass orientation

## User Experience

### Creating an Activity
1. User selects "Columns" or "Rows" orientation
2. Labels update dynamically (e.g., "Number of Columns" vs "Number of Rows")
3. Activity is created with the selected orientation

### Column Layout (Default)
- Sorting options displayed as vertical columns
- Items tray at the bottom
- Items can be dragged to any column

### Row Layout (New)
- Sorting options displayed as horizontal rows
- Items tray at the bottom
- Items can be dragged to any row

## Technical Details

### Layout Calculations
- **Column Layout**: Width calculated based on screen width divided by number of columns
- **Row Layout**: Height calculated based on available height divided by number of rows
- Both maintain consistent spacing and padding

### Drag & Drop
- Column layout: Detects horizontal position to determine target column
- Row layout: Detects vertical position to determine target row
- Both check if drop is in tray area (bottom 34% of screen)

## Backward Compatibility
- Existing activities without orientation field automatically default to 'column'
- No data loss or breaking changes for existing users
