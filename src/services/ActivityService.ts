/**
 * Activity service for business logic operations
 */

import { Activity, SortingColumn, SortingItem } from '../types/models';
import { IActivityService } from '../types/services';
import { generateUUID } from '../utils/uuid';
import { getCurrentISODate } from '../utils/dateFormat';

class ActivityService implements IActivityService {
  /**
   * Validate column count is within acceptable range
   * @param count - Number of columns
   * @returns True if valid (1-6), false otherwise
   */
  validateColumnCount(count: number): boolean {
    return count >= 1 && count <= 6;
  }

  /**
   * Create a new activity with specified columns
   * @param title - Activity title
   * @param columnTitles - Array of column titles
   * @param orientation - Layout orientation ('column' or 'row')
   * @param showHeaders - Whether to show column/row headers
   * @returns New Activity object
   */
  createActivity(
    title: string, 
    columnTitles: string[], 
    orientation: 'column' | 'row' = 'column',
    showHeaders: boolean = true
  ): Activity {
    const columns: SortingColumn[] = columnTitles.map((colTitle, index) => ({
      id: generateUUID(),
      title: showHeaders ? colTitle : `Category ${index + 1}`,
      headerImagePath: null,
      colorIndex: index % 6, // Cycle through 6 colors
    }));

    return {
      id: generateUUID(),
      title,
      createdAt: getCurrentISODate(),
      columns,
      items: [],
      orientation,
      showHeaders,
    };
  }

  /**
   * Update header visibility for an activity
   * @param activity - Current activity
   * @param showHeaders - New header visibility setting
   * @returns Updated activity with new showHeaders value
   */
  updateHeaderVisibility(activity: Activity, showHeaders: boolean): Activity {
    return {
      ...activity,
      showHeaders,
    };
  }

  /**
   * Add a new column to an activity
   * @param activity - Current activity
   * @param title - New column title
   * @returns Updated activity with new column
   */
  addColumn(activity: Activity, title: string): Activity {
    const newColumn: SortingColumn = {
      id: generateUUID(),
      title,
      headerImagePath: null,
      colorIndex: activity.columns.length % 6,
    };

    return {
      ...activity,
      columns: [...activity.columns, newColumn],
    };
  }

  /**
   * Delete a column from an activity
   * Items in the deleted column are moved to the tray (currentLocation = null)
   * @param activity - Current activity
   * @param columnId - ID of column to delete
   * @returns Updated activity without the column
   */
  deleteColumn(activity: Activity, columnId: string): Activity {
    // Move items from deleted column to tray
    const updatedItems = activity.items.map(item =>
      item.currentLocation === columnId
        ? { ...item, currentLocation: null }
        : item
    );

    // Remove the column
    const updatedColumns = activity.columns.filter(col => col.id !== columnId);

    return {
      ...activity,
      columns: updatedColumns,
      items: updatedItems,
    };
  }

  /**
   * Move an item to a new location with specific order
   * @param activity - Current activity
   * @param itemId - ID of item to move
   * @param targetColumnId - Target column ID, or null for tray
   * @param targetOrder - Target order/position in the column
   * @returns Updated activity with item moved
   */
  moveItemWithOrder(
    activity: Activity,
    itemId: string,
    targetColumnId: string | null,
    targetOrder: number
  ): Activity {
    const movingItem = activity.items.find(item => item.id === itemId);
    if (!movingItem) {
      return activity;
    }

    const sourceColumnId = movingItem.currentLocation;
    const sourceOrder = movingItem.order;

    // Step 1: Remove item from source and compact source column orders
    let updatedItems = activity.items.map(item => {
      if (item.id === itemId) {
        // Don't modify the moving item yet
        return item;
      } else if (item.currentLocation === sourceColumnId && item.order > sourceOrder) {
        // Compact orders in source column
        return { ...item, order: item.order - 1 };
      }
      return item;
    });

    // Step 2: Make space in target column and insert item
    updatedItems = updatedItems.map(item => {
      if (item.id === itemId) {
        // Move the item to new location with target order
        return { ...item, currentLocation: targetColumnId, order: targetOrder };
      } else if (item.currentLocation === targetColumnId && item.order >= targetOrder) {
        // Shift items down to make space
        return { ...item, order: item.order + 1 };
      }
      return item;
    });

    return {
      ...activity,
      items: updatedItems,
    };
  }

  /**
   * Move an item to a new location
   * @param activity - Current activity
   * @param itemId - ID of item to move
   * @param targetColumnId - Target column ID, or null for tray
   * @returns Updated activity with item moved
   */
  moveItem(
    activity: Activity,
    itemId: string,
    targetColumnId: string | null
  ): Activity {
    // Get the max order in the target column
    const targetColumnItems = activity.items.filter(
      item => item.currentLocation === targetColumnId && item.id !== itemId
    );
    const maxOrder = targetColumnItems.length > 0 
      ? Math.max(...targetColumnItems.map(item => item.order))
      : -1;

    const updatedItems = activity.items.map(item =>
      item.id === itemId
        ? { ...item, currentLocation: targetColumnId, order: maxOrder + 1 }
        : item
    );

    return {
      ...activity,
      items: updatedItems,
    };
  }

  /**
   * Reset all item placements (move all items to tray)
   * @param activity - Current activity
   * @returns Updated activity with all items in tray
   */
  resetPlacements(activity: Activity): Activity {
    const updatedItems = activity.items.map(item => ({
      ...item,
      currentLocation: null,
    }));

    return {
      ...activity,
      items: updatedItems,
    };
  }

  /**
   * Clear all items from an activity
   * @param activity - Current activity
   * @returns Updated activity with empty items array
   */
  clearAllItems(activity: Activity): Activity {
    return {
      ...activity,
      items: [],
    };
  }
}

// Export singleton instance
export default new ActivityService();
