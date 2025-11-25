/**
 * Unit tests for ActivityService
 */

import ActivityService from '../../src/services/ActivityService';
import { Activity, SortingColumn, SortingItem } from '../../src/types/models';

// Mock UUID generation for predictable tests
jest.mock('../../src/utils/uuid', () => ({
  generateUUID: jest.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
}));

// Mock date formatting
jest.mock('../../src/utils/dateFormat', () => ({
  getCurrentISODate: jest.fn(() => '2024-01-01T00:00:00.000Z'),
}));

describe('ActivityService', () => {
  describe('createActivity', () => {
    it('should create a new activity with specified columns', () => {
      const title = 'Test Activity';
      const columnTitles = ['Column 1', 'Column 2', 'Column 3'];

      const activity = ActivityService.createActivity(title, columnTitles);

      expect(activity.title).toBe(title);
      expect(activity.columns).toHaveLength(3);
      expect(activity.items).toHaveLength(0);
      expect(activity.columns[0].title).toBe('Column 1');
      expect(activity.columns[1].title).toBe('Column 2');
      expect(activity.columns[2].title).toBe('Column 3');
    });

    it('should assign sequential color indices to columns', () => {
      const columnTitles = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      const activity = ActivityService.createActivity('Test', columnTitles);

      expect(activity.columns[0].colorIndex).toBe(0);
      expect(activity.columns[1].colorIndex).toBe(1);
      expect(activity.columns[2].colorIndex).toBe(2);
      expect(activity.columns[5].colorIndex).toBe(5);
      expect(activity.columns[6].colorIndex).toBe(0); // Wraps around
    });
  });

  describe('addColumn', () => {
    it('should add a new column to an activity', () => {
      const activity: Activity = {
        id: 'activity-1',
        title: 'Test',
        createdAt: '2024-01-01T00:00:00.000Z',
        columns: [
          { id: 'col-1', title: 'Column 1', headerImagePath: null, colorIndex: 0 },
        ],
        items: [],
      };

      const updated = ActivityService.addColumn(activity, 'New Column');

      expect(updated.columns).toHaveLength(2);
      expect(updated.columns[1].title).toBe('New Column');
      expect(updated.columns[1].colorIndex).toBe(1);
    });
  });

  describe('deleteColumn', () => {
    it('should remove column and move items to tray', () => {
      const activity: Activity = {
        id: 'activity-1',
        title: 'Test',
        createdAt: '2024-01-01T00:00:00.000Z',
        columns: [
          { id: 'col-1', title: 'Column 1', headerImagePath: null, colorIndex: 0 },
          { id: 'col-2', title: 'Column 2', headerImagePath: null, colorIndex: 1 },
        ],
        items: [
          { id: 'item-1', imagePath: 'path1', currentLocation: 'col-1' },
          { id: 'item-2', imagePath: 'path2', currentLocation: 'col-2' },
          { id: 'item-3', imagePath: 'path3', currentLocation: null },
        ],
      };

      const updated = ActivityService.deleteColumn(activity, 'col-1');

      expect(updated.columns).toHaveLength(1);
      expect(updated.columns[0].id).toBe('col-2');
      expect(updated.items[0].currentLocation).toBeNull(); // Moved to tray
      expect(updated.items[1].currentLocation).toBe('col-2'); // Unchanged
      expect(updated.items[2].currentLocation).toBeNull(); // Already in tray
    });
  });

  describe('moveItem', () => {
    it('should move item from tray to column', () => {
      const activity: Activity = {
        id: 'activity-1',
        title: 'Test',
        createdAt: '2024-01-01T00:00:00.000Z',
        columns: [
          { id: 'col-1', title: 'Column 1', headerImagePath: null, colorIndex: 0 },
        ],
        items: [
          { id: 'item-1', imagePath: 'path1', currentLocation: null },
        ],
      };

      const updated = ActivityService.moveItem(activity, 'item-1', 'col-1');

      expect(updated.items[0].currentLocation).toBe('col-1');
    });

    it('should move item from column to tray', () => {
      const activity: Activity = {
        id: 'activity-1',
        title: 'Test',
        createdAt: '2024-01-01T00:00:00.000Z',
        columns: [
          { id: 'col-1', title: 'Column 1', headerImagePath: null, colorIndex: 0 },
        ],
        items: [
          { id: 'item-1', imagePath: 'path1', currentLocation: 'col-1' },
        ],
      };

      const updated = ActivityService.moveItem(activity, 'item-1', null);

      expect(updated.items[0].currentLocation).toBeNull();
    });

    it('should move item between columns', () => {
      const activity: Activity = {
        id: 'activity-1',
        title: 'Test',
        createdAt: '2024-01-01T00:00:00.000Z',
        columns: [
          { id: 'col-1', title: 'Column 1', headerImagePath: null, colorIndex: 0 },
          { id: 'col-2', title: 'Column 2', headerImagePath: null, colorIndex: 1 },
        ],
        items: [
          { id: 'item-1', imagePath: 'path1', currentLocation: 'col-1' },
        ],
      };

      const updated = ActivityService.moveItem(activity, 'item-1', 'col-2');

      expect(updated.items[0].currentLocation).toBe('col-2');
    });
  });

  describe('resetPlacements', () => {
    it('should move all items to tray', () => {
      const activity: Activity = {
        id: 'activity-1',
        title: 'Test',
        createdAt: '2024-01-01T00:00:00.000Z',
        columns: [
          { id: 'col-1', title: 'Column 1', headerImagePath: null, colorIndex: 0 },
          { id: 'col-2', title: 'Column 2', headerImagePath: null, colorIndex: 1 },
        ],
        items: [
          { id: 'item-1', imagePath: 'path1', currentLocation: 'col-1' },
          { id: 'item-2', imagePath: 'path2', currentLocation: 'col-2' },
          { id: 'item-3', imagePath: 'path3', currentLocation: null },
        ],
      };

      const updated = ActivityService.resetPlacements(activity);

      expect(updated.items[0].currentLocation).toBeNull();
      expect(updated.items[1].currentLocation).toBeNull();
      expect(updated.items[2].currentLocation).toBeNull();
    });
  });

  describe('clearAllItems', () => {
    it('should return activity with empty items array', () => {
      const activity: Activity = {
        id: 'activity-1',
        title: 'Test',
        createdAt: '2024-01-01T00:00:00.000Z',
        columns: [
          { id: 'col-1', title: 'Column 1', headerImagePath: null, colorIndex: 0 },
        ],
        items: [
          { id: 'item-1', imagePath: 'path1', currentLocation: 'col-1' },
          { id: 'item-2', imagePath: 'path2', currentLocation: null },
        ],
      };

      const updated = ActivityService.clearAllItems(activity);

      expect(updated.items).toHaveLength(0);
      expect(updated.columns).toHaveLength(1); // Columns unchanged
    });
  });
});
