/**
 * Storage service for persisting activity data using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity } from '../types/models';
import { IStorageService } from '../types/services';

const STORAGE_KEY = 'visual_sort_data';

class StorageService implements IStorageService {
  /**
   * Migrate old data format to new format
   * Handles cases where items might have 'image' instead of 'imagePath'
   */
  private migrateActivityData(activities: any[]): Activity[] {
    let migrationOccurred = false;
    
    const migratedActivities = activities.map(activity => {
      // Check if orientation migration is needed
      if (!activity.orientation) {
        migrationOccurred = true;
        console.log('Migrating activity without orientation - defaulting to "column"');
      }
      
      const migratedActivity: Activity = {
        id: activity.id,
        title: activity.title,
        createdAt: activity.createdAt,
        items: activity.items?.map((item: any) => {
          // Check if migration is needed
          if (item.image && !item.imagePath) {
            migrationOccurred = true;
            console.log('Migrating item with old "image" property to "imagePath"');
          }
          
          return {
            id: item.id,
            imagePath: item.imagePath || item.image || '', // Handle old 'image' property
            currentLocation: item.currentLocation || null,
          };
        }) || [],
        columns: activity.columns?.map((col: any) => ({
          id: col.id,
          title: col.title,
          headerImagePath: col.headerImagePath || null,
          colorIndex: col.colorIndex || 0,
        })) || [],
        orientation: activity.orientation || 'column', // Default to column for existing activities
      };
      
      return migratedActivity;
    });
    
    if (migrationOccurred) {
      console.log('Data migration completed - old format converted to new format');
    }
    
    return migratedActivities;
  }

  /**
   * Retrieve all activities from storage
   * @returns Array of activities, or empty array if none exist or on error
   */
  async getActivities(): Promise<Activity[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (!data) {
        return [];
      }

      const parsed = JSON.parse(data);
      
      // Validate that we have an activities array
      if (parsed && Array.isArray(parsed.activities)) {
        // Migrate data to handle any old format issues
        let migratedActivities = this.migrateActivityData(parsed.activities);
        
        // Filter out items with empty or invalid imagePath
        let cleanupOccurred = false;
        migratedActivities = migratedActivities.map(activity => {
          const validItems = activity.items.filter(item => {
            if (!item.imagePath || item.imagePath === '') {
              console.warn(`Removing item ${item.id} with empty imagePath from activity "${activity.title}"`);
              cleanupOccurred = true;
              return false;
            }
            return true;
          });
          
          return {
            ...activity,
            items: validItems,
          };
        });
        
        // Save cleaned data back to storage asynchronously (don't block return)
        if (cleanupOccurred) {
          console.log('Data cleanup completed - removed items with empty imagePath');
          // Don't await - let it save in background
          this.saveActivities(migratedActivities).catch(err => 
            console.error('Background save failed:', err)
          );
        }
        
        return migratedActivities;
      }

      return [];
    } catch (error) {
      console.error('Error reading activities from storage:', error);
      return [];
    }
  }

  /**
   * Save activities array to storage
   * @param activities - Array of activities to persist
   */
  async saveActivities(activities: Activity[]): Promise<void> {
    try {
      // Log what we're saving
      console.log('StorageService.saveActivities - Saving', activities.length, 'activities');
      activities.forEach(activity => {
        console.log(`  Activity "${activity.title}": ${activity.items.length} items`);
        activity.items.forEach(item => {
          console.log(`    Item ${item.id}: imagePath="${item.imagePath}"`);
        });
      });
      
      const data = JSON.stringify({ activities });
      await AsyncStorage.setItem(STORAGE_KEY, data);
      console.log('StorageService.saveActivities - Data saved successfully');
    } catch (error) {
      console.error('Error saving activities to storage:', error);
      throw new Error('Failed to save activities');
    }
  }

  /**
   * Clear all data from storage
   */
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear data');
    }
  }
}

// Export singleton instance
export default new StorageService();
