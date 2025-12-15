# Image Zoom Feature

## Overview
Added a comprehensive image zoom feature that allows users to view enlarged versions of any image in the app with a single tap or long press.

## Features
- **Single Tap Zoom**: Tap any draggable item image to view it in full-screen zoom mode
- **Long Press Zoom**: Long press on column/row header images to zoom them
- **Pinch to Zoom**: Pinch gestures to zoom in/out (1x to 3x scale)
- **Pan to Move**: Pan gestures to move around when zoomed in
- **Double Tap**: Double tap to toggle between 1x and 2x zoom
- **Single Tap to Close**: Tap once to close the zoom modal (when not zoomed)
- **Smooth Animations**: Smooth spring animations for all interactions

## Implementation Details

### Components Added
1. **ImageZoomModal** (`src/components/common/ImageZoomModal.tsx`)
   - Full-screen modal with gesture handling
   - Supports pinch, pan, and tap gestures
   - Smooth animations using react-native-reanimated

2. **ImageZoomContext** (`src/contexts/ImageZoomContext.tsx`)
   - Global context provider for image zoom functionality
   - Manages modal state across the entire app

3. **useImageZoom Hook** (`src/hooks/useImageZoom.ts`)
   - Custom hook for managing zoom state
   - Provides show/hide functionality

### Components Modified
1. **App.tsx** - Added ImageZoomProvider wrapper
2. **DraggableItem.tsx** - Added single tap gesture for zoom
3. **Column.tsx** - Added long press gesture for header image zoom
4. **Row.tsx** - Added long press gesture for header image zoom

## Usage
- **For draggable items**: Single tap on any image to zoom
- **For header images**: Long press on column/row header images to zoom
- **In zoom mode**: 
  - Pinch to zoom in/out
  - Pan to move around when zoomed
  - Double tap to toggle zoom level
  - Single tap to close (when at 1x zoom)
  - Use close button (X) in top-right corner

## Gesture Hierarchy
The gesture system is designed to not interfere with existing functionality:
- **DraggableItem**: Single tap (zoom) → Double tap (existing) → Long press + drag (existing)
- **Header Images**: Single tap (select image) → Long press (zoom)

## Technical Notes
- Uses `react-native-gesture-handler` for gesture recognition
- Uses `react-native-reanimated` for smooth animations
- Maintains existing drag and drop functionality
- No additional dependencies required
- Fully TypeScript compatible