/**
 * Activity service for business logic operations
 */

import { Activity, SortingColumn, SortingItem } from '../types/models';
import { IActivityService } from '../types/services';
import { generateUUID } from '../utils/uuid';
import { getCurrentISODate } from '../utils/dateFormat';

class ActivityService implements IActivityService {
  /**
   * Create a new activity with specified columns
   * @param title - Activity title
   * @param columnTitles - Array of column titles
   * @param orientation - Layout orientation ('column' or 'row')
   * @returns New Activity object
   */
  createActivity(title: string, columnTitles: string[], orientation: 'column' | 'row' = 'column'): Activity {
    const columns: SortingColumn[] = columnTitles.map((colTitle, index) => ({
      id: generateUUID(),
      title: colTitle,
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
    const updatedItems = activity.items.map(item =>
      item.id === itemId
        ? { ...item, currentLocation: targetColumnId }
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
