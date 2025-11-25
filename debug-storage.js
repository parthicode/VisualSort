/**
 * Debug script to inspect AsyncStorage data
 * 
 * To use this in your app, add this code to any screen temporarily:
 * 
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 * 
 * // Add a button that calls this:
 * const debugStorage = async () => {
 *   const data = await AsyncStorage.getItem('visual_sort_data');
 *   console.log('=== RAW STORAGE DATA ===');
 *   console.log(data);
 *   
 *   if (data) {
 *     const parsed = JSON.parse(data);
 *     console.log('=== PARSED DATA ===');
 *     console.log(JSON.stringify(parsed, null, 2));
 *     
 *     if (parsed.activities) {
 *       parsed.activities.forEach((activity, i) => {
 *         console.log(`\n=== ACTIVITY ${i}: ${activity.title} ===`);
 *         console.log(`ID: ${activity.id}`);
 *         console.log(`Created: ${activity.createdAt}`);
 *         console.log(`Columns: ${activity.columns?.length || 0}`);
 *         console.log(`Items: ${activity.items?.length || 0}`);
 *         
 *         if (activity.items) {
 *           activity.items.forEach((item, j) => {
 *             console.log(`  Item ${j}:`);
 *             console.log(`    ID: ${item.id}`);
 *             console.log(`    imagePath: "${item.imagePath}"`);
 *             console.log(`    image: "${item.image}"`); // Check for old property
 *             console.log(`    currentLocation: ${item.currentLocation}`);
 *           });
 *         }
 *       });
 *     }
 *   }
 * };
 * 
 * // To clear storage:
 * const clearStorage = async () => {
 *   await AsyncStorage.removeItem('visual_sort_data');
 *   console.log('Storage cleared!');
 * };
 */

// This file is just documentation - copy the code above into your component
