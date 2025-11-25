# How to Clear Data and Start Fresh

## Option 1: Use the Dev Button (Easiest)
1. Go to the Home screen
2. Look for the 🗑️ button in the top-right corner (only visible in dev mode)
3. Tap it
4. Confirm deletion
5. All data will be cleared

## Option 2: Add Debug Code Temporarily

Add this to your HomeScreen.tsx temporarily:

```typescript
// Add this import at the top
import AsyncStorage from '@react-native-async-storage/async-storage';

// Add this function inside the component
const clearStorageManually = async () => {
  try {
    await AsyncStorage.removeItem('visual_sort_data');
    console.log('✅ Storage cleared successfully!');
    Alert.alert('Success', 'All data cleared. Please restart the app.');
  } catch (error) {
    console.error('❌ Error clearing storage:', error);
    Alert.alert('Error', 'Failed to clear storage');
  }
};

// Add this button in the render:
<TouchableOpacity onPress={clearStorageManually}>
  <Text>CLEAR ALL DATA</Text>
</TouchableOpacity>
```

## Option 3: Use React Native Debugger

1. Open React Native Debugger
2. Go to Console tab
3. Type: `AsyncStorage.removeItem('visual_sort_data')`
4. Press Enter
5. Restart the app

## Option 4: Reinstall the App

1. Uninstall the app from your device/emulator
2. Reinstall it
3. All data will be gone

## After Clearing Data

1. **Restart the app completely** (close and reopen)
2. Create a new activity
3. Try adding images
4. **Check the console logs** to see what's happening

## What to Look For in Console Logs

When you add an image, you should see:

```
handleAddItems - Opening image picker
handleAddItems - Picker result: {...}
handleAddItems - Adding 1 images
handleAddItems - Adding asset with URI: file:///...
Adding item - Original URI: file:///...
ImageService.saveImage - Input URI: file:///...
ImageService.saveImage - Optimized URI: file:///...
ImageService.saveImage - Directory path: /path/to/activities/...
Creating directory: /path/to/activities/...
ImageService.saveImage - File copied successfully
ImageService.saveImage - File exists after copy: true
ImageService.saveImage - Final URI: file:///...
Image saved to: file:///...
Created new item: { id: "...", imagePath: "file://...", currentLocation: null }
StorageService.saveActivities - Saving 1 activities
Item added successfully
```

If you see an error anywhere in this sequence, that's where the problem is!

## Still Not Working?

**PLEASE SHARE THE CONSOLE LOGS!** Without them, I can't help you debug the issue.
