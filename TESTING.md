# Cross-Platform Testing Guide

This document provides a comprehensive testing checklist for VisualSort on both iOS and Android platforms.

## Platform Requirements

### iOS
- **Minimum Version**: iOS 14.0+
- **Tested Devices**: iPhone 8 and newer recommended
- **Permissions Required**:
  - Photo Library Access (NSPhotoLibraryUsageDescription)
  - Camera Access (NSCameraUsageDescription)

### Android
- **Minimum Version**: Android 8.0 (API 26)+
- **Tested Devices**: Various screen sizes and manufacturers
- **Permissions Required**:
  - READ_MEDIA_IMAGES (Android 13+)
  - READ_EXTERNAL_STORAGE (Android 12 and below)
  - CAMERA

## Testing Checklist

### 1. Activity Creation Flow

#### iOS Testing
- [ ] Launch app on iOS device
- [ ] Tap FAB (+) button to create new activity
- [ ] Enter activity title (test with emojis, special characters)
- [ ] Select number of columns (2-6)
- [ ] Enter column titles
- [ ] Verify validation errors display correctly
- [ ] Create activity and verify navigation to sorting screen
- [ ] Verify activity appears on home screen

#### Android Testing
- [ ] Launch app on Android device
- [ ] Tap FAB (+) button to create new activity
- [ ] Enter activity title (test with emojis, special characters)
- [ ] Select number of columns (2-6)
- [ ] Enter column titles
- [ ] Verify validation errors display correctly
- [ ] Create activity and verify navigation to sorting screen
- [ ] Verify activity appears on home screen

### 2. Image Selection and Storage

#### iOS Testing
- [ ] Tap "Add Items" button
- [ ] Select "Choose from Library"
- [ ] Verify permission prompt appears (first time)
- [ ] Grant photo library permission
- [ ] Select multiple images
- [ ] Verify images appear in items tray
- [ ] Verify images are optimized (check file sizes)
- [ ] Test camera capture
- [ ] Verify camera permission prompt
- [ ] Take photo and verify it appears in tray

#### Android Testing
- [ ] Tap "Add Items" button
- [ ] Verify permission prompt appears (first time)
- [ ] Grant storage permission
- [ ] Select multiple images from gallery
- [ ] Verify images appear in items tray
- [ ] Verify images are optimized (check file sizes)
- [ ] Test camera capture
- [ ] Verify camera permission prompt
- [ ] Take photo and verify it appears in tray

### 3. Drag-and-Drop Performance

#### iOS Testing
- [ ] Add 20+ items to an activity
- [ ] Long-press (150ms) on an item to start drag
- [ ] Verify haptic feedback on drag start
- [ ] Drag item across screen smoothly
- [ ] Verify 60fps performance during drag
- [ ] Drop item in column - verify haptic feedback
- [ ] Drop item outside valid zone - verify bounce back animation
- [ ] Test rapid successive drags
- [ ] Verify no lag or frame drops

#### Android Testing
- [ ] Add 20+ items to an activity
- [ ] Long-press (150ms) on an item to start drag
- [ ] Verify vibration feedback on drag start
- [ ] Drag item across screen smoothly
- [ ] Verify 60fps performance during drag
- [ ] Drop item in column - verify vibration feedback
- [ ] Drop item outside valid zone - verify bounce back animation
- [ ] Test rapid successive drags
- [ ] Verify no lag or frame drops

### 4. Column Management

#### iOS Testing
- [ ] Enter Edit Structure Mode
- [ ] Add new column (test up to 6 columns)
- [ ] Verify column width adjusts dynamically
- [ ] Edit column title
- [ ] Add header image to column
- [ ] Delete column (verify items move to tray)
- [ ] Verify cannot delete when only 2 columns remain
- [ ] Exit Edit Structure Mode

#### Android Testing
- [ ] Enter Edit Structure Mode
- [ ] Add new column (test up to 6 columns)
- [ ] Verify column width adjusts dynamically
- [ ] Edit column title
- [ ] Add header image to column
- [ ] Delete column (verify items move to tray)
- [ ] Verify cannot delete when only 2 columns remain
- [ ] Exit Edit Structure Mode

### 5. Data Persistence

#### iOS Testing
- [ ] Create activity with items
- [ ] Move items to columns
- [ ] Force close app (swipe up from app switcher)
- [ ] Reopen app
- [ ] Verify all activities are present
- [ ] Verify item placements are preserved
- [ ] Verify images load correctly

#### Android Testing
- [ ] Create activity with items
- [ ] Move items to columns
- [ ] Force close app (Recent Apps > Swipe away)
- [ ] Reopen app
- [ ] Verify all activities are present
- [ ] Verify item placements are preserved
- [ ] Verify images load correctly

### 6. Activity Menu Operations

#### iOS Testing
- [ ] Open activity menu (⋮ button)
- [ ] Test "Reset Placements" - verify all items return to tray
- [ ] Test "Clear All Items" - verify confirmation dialog
- [ ] Confirm clear - verify all items deleted
- [ ] Test "Delete Activity" - verify confirmation dialog
- [ ] Confirm delete - verify navigation back to home
- [ ] Verify activity removed from home screen

#### Android Testing
- [ ] Open activity menu (⋮ button)
- [ ] Test "Reset Placements" - verify all items return to tray
- [ ] Test "Clear All Items" - verify confirmation dialog
- [ ] Confirm clear - verify all items deleted
- [ ] Test "Delete Activity" - verify confirmation dialog
- [ ] Confirm delete - verify navigation back to home
- [ ] Verify activity removed from home screen

### 7. File System Operations

#### iOS Testing
- [ ] Create activity and add images
- [ ] Use iOS Files app to navigate to app directory
- [ ] Verify folder structure: VisualSort/activities/{activityId}/items/
- [ ] Verify images are JPEG format
- [ ] Delete activity from app
- [ ] Verify folder is removed from file system
- [ ] Test "Delete All Data" - verify all folders removed

#### Android Testing
- [ ] Create activity and add images
- [ ] Use file manager to check app storage
- [ ] Verify folder structure: VisualSort/activities/{activityId}/items/
- [ ] Verify images are JPEG format
- [ ] Delete activity from app
- [ ] Verify folder is removed from file system
- [ ] Test "Delete All Data" - verify all folders removed

### 8. Screen Orientations

#### iOS Testing
- [ ] Test in portrait orientation
- [ ] Rotate to landscape
- [ ] Verify layout adjusts correctly
- [ ] Verify column widths recalculate
- [ ] Test drag-and-drop in landscape
- [ ] Rotate back to portrait
- [ ] Verify no layout issues

#### Android Testing
- [ ] Test in portrait orientation
- [ ] Rotate to landscape
- [ ] Verify layout adjusts correctly
- [ ] Verify column widths recalculate
- [ ] Test drag-and-drop in landscape
- [ ] Rotate back to portrait
- [ ] Verify no layout issues

### 9. Edge Cases

#### iOS Testing
- [ ] Test with 0 items in activity
- [ ] Test with 100+ items in activity
- [ ] Test with very long activity titles
- [ ] Test with very long column titles
- [ ] Test with large images (10MB+)
- [ ] Test with very small images
- [ ] Test with unusual aspect ratios
- [ ] Test rapid navigation between screens
- [ ] Test with low storage space

#### Android Testing
- [ ] Test with 0 items in activity
- [ ] Test with 100+ items in activity
- [ ] Test with very long activity titles
- [ ] Test with very long column titles
- [ ] Test with large images (10MB+)
- [ ] Test with very small images
- [ ] Test with unusual aspect ratios
- [ ] Test rapid navigation between screens
- [ ] Test with low storage space

### 10. Permission Handling

#### iOS Testing
- [ ] Deny photo library permission
- [ ] Verify graceful error handling
- [ ] Go to Settings and grant permission
- [ ] Return to app and verify functionality works
- [ ] Deny camera permission
- [ ] Verify graceful error handling
- [ ] Grant camera permission and verify functionality

#### Android Testing
- [ ] Deny storage permission
- [ ] Verify graceful error handling
- [ ] Go to Settings and grant permission
- [ ] Return to app and verify functionality works
- [ ] Deny camera permission
- [ ] Verify graceful error handling
- [ ] Grant camera permission and verify functionality

## Performance Benchmarks

### Target Metrics
- **App Launch Time**: < 2 seconds (cold start)
- **Image Load Time**: < 500ms per image
- **Drag Animation**: Consistent 60fps
- **Screen Transitions**: < 300ms
- **Image Optimization**: < 1 second per image

### Testing Tools

#### iOS
- Xcode Instruments (Time Profiler, Allocations)
- React Native Performance Monitor (Dev Menu > Show Perf Monitor)
- Console logs for timing measurements

#### Android
- Android Studio Profiler
- React Native Performance Monitor (Dev Menu > Show Perf Monitor)
- Logcat for timing measurements

## Device Testing Matrix

### iOS Devices (Recommended)
- iPhone SE (2nd gen) - Small screen
- iPhone 12/13 - Standard size
- iPhone 14 Pro Max - Large screen
- iPad (9th gen) - Tablet

### Android Devices (Recommended)
- Samsung Galaxy A series - Mid-range
- Google Pixel - Stock Android
- OnePlus - High refresh rate
- Various screen sizes (5" to 6.7")

## Known Platform Differences

### Haptic Feedback
- **iOS**: Uses native haptic engine with different intensities
- **Android**: Uses vibration API with duration patterns
- Both provide adequate feedback for user interactions

### Image Picker
- **iOS**: Native iOS photo picker UI
- **Android**: System photo picker (varies by manufacturer)
- Both support multi-select and camera capture

### File System
- **iOS**: App sandbox with DocumentDirectory
- **Android**: App-private storage
- Both automatically cleaned on app uninstall

### Permissions
- **iOS**: Runtime permission prompts with usage descriptions
- **Android**: Runtime permissions (API 23+) with rationale dialogs
- Both require proper permission handling

## Automated Testing

### Unit Tests
```bash
npm test
```

### Run All Tests
```bash
npm test -- --coverage
```

### Test Specific Files
```bash
npm test -- ActivityService.test.ts
```

## Reporting Issues

When reporting platform-specific issues, include:
1. Device model and OS version
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots or screen recordings
5. Console logs (if applicable)
6. Whether issue occurs on both platforms or just one

## Release Checklist

Before releasing to production:
- [ ] All tests passing on both platforms
- [ ] Performance benchmarks met
- [ ] Permissions working correctly
- [ ] No memory leaks detected
- [ ] Tested on minimum OS versions
- [ ] Tested on various screen sizes
- [ ] Accessibility features verified
- [ ] App store screenshots prepared
- [ ] Release notes written
