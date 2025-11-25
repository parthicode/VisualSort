# Troubleshooting: Image Not Appearing Issue

## Problem
Images are not appearing in the Items Tray even though the count increases. Error: "property image doesn't exist"

## Root Cause
The issue is caused by **corrupted data in AsyncStorage** where items have:
- Empty `imagePath` property (`""`)
- Old `image` property instead of `imagePath`
- Missing required properties

## Fixes Applied

### 1. Data Migration & Cleanup (StorageService.ts)
- ✅ Migrates old `image` property to `imagePath`
- ✅ Filters out items with empty `imagePath`
- ✅ Preserves all activity properties correctly
- ✅ Auto-saves cleaned data back to storage
- ✅ Comprehensive logging for debugging

### 2. Error Handling (DraggableItem.tsx)
- ✅ Checks if `imagePath` exists before rendering
- ✅ Shows "No Image" placeholder for invalid items
- ✅ Logs image loading errors with details
- ✅ Prevents crashes from invalid URIs

### 3. Enhanced Logging
- ✅ ImageService logs every step of image saving
- ✅ StorageService logs all save/load operations
- ✅ Store logs item additions and fetches
- ✅ All logs show imagePath values for debugging

### 4. Dev Tools (HomeScreen.tsx)
- ✅ Added 🗑️ button in header (dev mode only)
- ✅ Tap to clear all data and start fresh
- ✅ Only visible when `__DEV__` is true

## How to Fix Your Issue

### Option 1: Let Auto-Cleanup Fix It (Recommended)
1. **Restart your app** completely (close and reopen)
2. **Check the console logs** - you should see:
   ```
   Removing item <id> with empty imagePath from activity "<name>"
   Data cleanup completed - removed items with empty imagePath
   ```
3. The corrupted items will be automatically removed
4. Try adding new images - they should work now

### Option 2: Manual Data Reset
1. **Tap the 🗑️ button** in the top-right of the Home screen (dev mode only)
2. Confirm deletion
3. All data will be cleared
4. Create a new activity and add images

### Option 3: Debug the Data
1. Open `debug-storage.js` for instructions
2. Add the debug code to any screen temporarily
3. Run it to see exactly what's in AsyncStorage
4. Look for items with empty `imagePath` or old `image` property

## Checking the Logs

When you add an image, you should see this sequence in the console:

```
Adding item - Original URI: file:///...
ImageService.saveImage - Input URI: file:///...
ImageService.saveImage - Optimized URI: file:///...
ImageService.saveImage - Directory path: /path/to/activities/<id>/items
Creating directory: /path/to/activities/<id>/items
ImageService.saveImage - Destination path: /path/to/activities/<id>/items/<uuid>.jpg
ImageService.saveImage - File copied successfully
ImageService.saveImage - File exists after copy: true
ImageService.saveImage - Final URI: file:///path/to/activities/<id>/items/<uuid>.jpg
Image saved to: file:///path/to/activities/<id>/items/<uuid>.jpg
Created new item: { id: "...", imagePath: "file://...", currentLocation: null }
StorageService.saveActivities - Saving 1 activities
  Activity "...": 1 items
    Item ...: imagePath="file://..."
StorageService.saveActivities - Data saved successfully
Item added successfully
```

If any step fails, the logs will show exactly where and why.

## Common Issues

### Images still not appearing?
- Check console for "Image load error" messages
- Verify the file path starts with `file://`
- Check if the file actually exists at that path
- Try clearing all data and starting fresh

### Count increases but no images?
- This means items are being created but with empty `imagePath`
- The auto-cleanup should remove these on next app restart
- Or use the 🗑️ button to clear all data

### Migration not working?
- Make sure you've restarted the app completely
- Check console for "Data migration completed" message
- If not appearing, the data might be in a different format

## Prevention

Going forward, all new images will be saved correctly with:
- Valid `imagePath` property
- Proper file:// URI format
- All required properties set
- Comprehensive error handling

## Need More Help?

1. Share the console logs when adding an image
2. Share any error messages you see
3. Try the debug script to inspect the data
4. Use the 🗑️ button to start fresh if needed
