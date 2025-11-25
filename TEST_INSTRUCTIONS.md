# Testing Instructions

## Current Issue
- Item count increases when adding images
- But images don't appear on screen
- Need to see console logs to diagnose

## What I've Added

### 1. Comprehensive Logging
Every step of the image adding process now logs to console:
- Image picker opening
- URI received from picker
- Image optimization
- File saving
- Directory creation
- Data storage
- UI rendering

### 2. Auto-Refresh After Adding
After each image is added, the app now fetches activities again to ensure UI updates.

### 3. Error Handling
Better error messages that show exactly what failed.

### 4. Data Cleanup
Automatically removes items with empty imagePath on app load.

## How to Test

### Step 1: Clear All Data
Use the 🗑️ button on the Home screen (top-right, dev mode only)

### Step 2: Create New Activity
1. Tap the "+" tile
2. Enter a title
3. Set number of columns
4. Enter column titles
5. Tap "Create"

### Step 3: Add Images
1. Tap "+ Add Items" button
2. Select one or more images
3. **WATCH THE CONSOLE** - you should see detailed logs

### Step 4: Check Console Output

#### If Successful, You'll See:
```
handleAddItems - Opening image picker
handleAddItems - Picker result: {...}
handleAddItems - Adding 1 images
Adding item - Original URI: file:///...
ImageService.saveImage - Input URI: file:///...
ImageService.saveImage - Optimized URI: file:///...
Creating directory: /path/...
ImageService.saveImage - File copied successfully
ImageService.saveImage - File exists after copy: true
Image saved to: file:///...
Created new item: { id: "...", imagePath: "file://...", currentLocation: null }
StorageService.saveActivities - Saving 1 activities
  Activity "...": 1 items
    Item ...: imagePath="file://..."
Item added successfully
handleAddItems - Refreshed activities
SortingScreen - Total items: 1
SortingScreen - Tray items: 1
ItemsTray - Rendering with 1 items
```

#### If Failed, You'll See Error Messages Like:
```
Error saving image: ...
Failed to add item: ...
Image load error for item: ...
```

### Step 5: What to Look For

1. **If logs show successful save but no image appears:**
   - Check if imagePath is empty: `imagePath=""`
   - Check if items are being filtered out
   - Check if DraggableItem is rendering

2. **If logs show errors:**
   - Share the exact error message
   - This will tell us what's failing

3. **If no logs appear:**
   - Metro bundler might not be running
   - Check if console is connected

## Common Issues

### Issue: "No logs appear"
**Solution:** Make sure Metro bundler is running and console is visible

### Issue: "imagePath is empty"
**Solution:** ImageService.saveImage is failing - check the error logs

### Issue: "Items filtered out"
**Solution:** StorageService is removing items with empty paths - this is correct behavior

### Issue: "Picker cancelled"
**Solution:** User cancelled - this is normal

## Next Steps

**PLEASE SHARE YOUR CONSOLE LOGS!**

Without seeing the logs, I cannot help you further. The logs will show exactly what's happening and where it's failing.

Copy the entire console output from when you tap "+ Add Items" until you see the result, and share it here.
