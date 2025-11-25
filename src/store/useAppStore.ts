/**
 * Global application state management using Zustand
 */

import { create } from 'zustand';
import { Activity, SortingColumn } from '../types/models';
import StorageService from '../services/StorageService';
import ImageService from '../services/ImageService';
import ActivityService from '../services/ActivityService';

interface AppState {
  // State
  activities: Activity[];
  currentActivityId: string | null;
  isLoading: boolean;

  // Activity Management Actions
  fetchActivities: () => Promise<void>;
  addActivity: (title: string, columnTitles: string[]) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  deleteAllData: () => Promise<void>;

  // Structure Editing Actions
  addColumn: (activityId: string, title: string) => Promise<void>;
  deleteColumn: (activityId: string, columnId: string) => Promise<void>;
  updateColumnTitle: (activityId: string, columnId: string, title: string) => Promise<void>;
  updateHeaderImage: (activityId: string, columnId: string, imagePath: string) => Promise<void>;

  // Item Management Actions
  addItem: (activityId: string, imageUri: string) => Promise<void>;
  deleteItem: (activityId: string, itemId: string) => Promise<void>;
  moveItem: (activityId: string, itemId: string, targetColumnId: string | null) => Promise<void>;

  // Bulk Actions
  resetPlacements: (activityId: string) => Promise<void>;
  clearAllItems: (activityId: string) => Promise<void>;

  // Utility
  setCurrentActivityId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  activities: [],
  currentActivityId: null,
  isLoading: false,

  // Fetch activities from storage
  fetchActivities: async () => {
    const activities = await StorageService.getActivities();
    set({ activities });
  },

  // Add new activity
  addActivity: async (title: string, columnTitles: string[]) => {
    const newActivity = ActivityService.createActivity(title, columnTitles);
    const activities = [...get().activities, newActivity];
    await StorageService.saveActivities(activities);
    set({ activities, currentActivityId: newActivity.id });
  },

  // Delete activity
  deleteActivity: async (id: string) => {
    try {
      // Delete images from file system
      await ImageService.deleteActivityFolder(id);

      // Remove from state and storage
      const activities = get().activities.filter(a => a.id !== id);
      await StorageService.saveActivities(activities);
      set({ activities, currentActivityId: null });
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  },

  // Delete all data
  deleteAllData: async () => {
    try {
      const activities = get().activities;

      // Delete all activity folders
      await Promise.all(
        activities.map(activity => ImageService.deleteActivityFolder(activity.id))
      );

      // Clear storage
      await StorageService.clearAllData();
      set({ activities: [], currentActivityId: null });
    } catch (error) {
      console.error('Error deleting all data:', error);
      throw error;
    }
  },

  // Add column to activity
  addColumn: async (activityId: string, title: string) => {
    const activities = get().activities.map(activity => {
      if (activity.id === activityId) {
        return ActivityService.addColumn(activity, title);
      }
      return activity;
    });

    await StorageService.saveActivities(activities);
    set({ activities });
  },

  // Delete column from activity
  deleteColumn: async (activityId: string, columnId: string) => {
    const activities = get().activities.map(activity => {
      if (activity.id === activityId) {
        return ActivityService.deleteColumn(activity, columnId);
      }
      return activity;
    });

    await StorageService.saveActivities(activities);
    set({ activities });
  },

  // Update column title
  updateColumnTitle: async (activityId: string, columnId: string, title: string) => {
    const activities = get().activities.map(activity => {
      if (activity.id === activityId) {
        const updatedColumns = activity.columns.map(col =>
          col.id === columnId ? { ...col, title } : col
        );
        return { ...activity, columns: updatedColumns };
      }
      return activity;
    });

    await StorageService.saveActivities(activities);
    set({ activities });
  },

  // Update header image
  updateHeaderImage: async (activityId: string, columnId: string, imagePath: string) => {
    const activities = get().activities.map(activity => {
      if (activity.id === activityId) {
        const updatedColumns = activity.columns.map(col =>
          col.id === columnId ? { ...col, headerImagePath: imagePath } : col
        );
        return { ...activity, columns: updatedColumns };
      }
      return activity;
    });

    await StorageService.saveActivities(activities);
    set({ activities });
  },

  // Add item to activity
  addItem: async (activityId: string, imageUri: string) => {
    try {
      // Save and optimize image
      const savedImagePath = await ImageService.saveImage(imageUri, activityId, 'item');

      // Add item to activity
      const activities = get().activities.map(activity => {
        if (activity.id === activityId) {
          const newItem = {
            id: require('../utils/uuid').generateUUID(),
            imagePath: savedImagePath,
            currentLocation: null,
          };
          return { ...activity, items: [...activity.items, newItem] };
        }
        return activity;
      });

      await StorageService.saveActivities(activities);
      set({ activities });
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  },

  // Delete item from activity
  deleteItem: async (activityId: string, itemId: string) => {
    try {
      const activity = get().activities.find(a => a.id === activityId);
      const item = activity?.items.find(i => i.id === itemId);

      if (item) {
        // Delete image file
        await ImageService.deleteImage(item.imagePath);
      }

      // Remove item from activity
      const activities = get().activities.map(activity => {
        if (activity.id === activityId) {
          const updatedItems = activity.items.filter(i => i.id !== itemId);
          return { ...activity, items: updatedItems };
        }
        return activity;
      });

      await StorageService.saveActivities(activities);
      set({ activities });
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },

  // Move item to new location
  moveItem: async (activityId: string, itemId: string, targetColumnId: string | null) => {
    const activities = get().activities.map(activity => {
      if (activity.id === activityId) {
        return ActivityService.moveItem(activity, itemId, targetColumnId);
      }
      return activity;
    });

    await StorageService.saveActivities(activities);
    set({ activities });
  },

  // Reset all placements
  resetPlacements: async (activityId: string) => {
    const activities = get().activities.map(activity => {
      if (activity.id === activityId) {
        return ActivityService.resetPlacements(activity);
      }
      return activity;
    });

    await StorageService.saveActivities(activities);
    set({ activities });
  },

  // Clear all items
  clearAllItems: async (activityId: string) => {
    try {
      const activity = get().activities.find(a => a.id === activityId);

      if (activity) {
        // Delete all item images
        await Promise.all(
          activity.items.map(item => ImageService.deleteImage(item.imagePath))
        );
      }

      // Clear items from activity
      const activities = get().activities.map(activity => {
        if (activity.id === activityId) {
          return ActivityService.clearAllItems(activity);
        }
        return activity;
      });

      await StorageService.saveActivities(activities);
      set({ activities });
    } catch (error) {
      console.error('Error clearing items:', error);
      throw error;
    }
  },

  // Set current activity ID
  setCurrentActivityId: (id: string | null) => {
    set({ currentActivityId: id });
  },
}));
