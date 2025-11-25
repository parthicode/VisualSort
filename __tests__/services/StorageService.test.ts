/**
 * Unit tests for StorageService
 */

import { MMKV } from 'react-native-mmkv';
import StorageService from '../../src/services/StorageService';
import { Activity } from '../../src/types/models';

// Mock MMKV
jest.mock('react-native-mmkv', () => {
  const mockStorage = new Map<string, string>();
  
  return {
    MMKV: jest.fn().mockImplementation(() => ({
      getString: jest.fn((key: string) => mockStorage.get(key)),
      set: jest.fn((key: string, value: string) => mockStorage.set(key, value)),
      delete: jest.fn((key: string) => mockStorage.delete(key)),
      clearAll: jest.fn(() => mockStorage.clear()),
    })),
  };
});

describe('StorageService', () => {
  beforeEach(() => {
    // Clear mock storage before each test
    const storage = new MMKV();
    storage.clearAll();
  });

  describe('getActivities', () => {
    it('should return empty array when no data exists', () => {
      const activities = StorageService.getActivities();
      expect(activities).toEqual([]);
    });

    it('should return parsed activities from storage', () => {
      const mockActivities: Activity[] = [
        {
          id: 'activity-1',
          title: 'Test Activity',
          createdAt: '2024-01-01T00:00:00.000Z',
          columns: [
            { id: 'col-1', title: 'Column 1', headerImagePath: null, colorIndex: 0 },
          ],
          items: [],
        },
      ];

      // Manually set data in mock storage with correct structure
      const storage = new MMKV();
      storage.set('visual_sort_data', JSON.stringify({ activities: mockActivities }));

      const activities = StorageService.getActivities();
      expect(activities).toHaveLength(1);
      expect(activities[0].title).toBe('Test Activity');
    });

    it('should return empty array on parse error', () => {
      const storage = new MMKV();
      storage.set('visual_sort_data', 'invalid json');

      const activities = StorageService.getActivities();
      expect(activities).toEqual([]);
    });
  });

  describe('saveActivities', () => {
    it('should save activities to storage as JSON', () => {
      const mockActivities: Activity[] = [
        {
          id: 'activity-1',
          title: 'Test Activity',
          createdAt: '2024-01-01T00:00:00.000Z',
          columns: [],
          items: [],
        },
      ];

      StorageService.saveActivities(mockActivities);

      const storage = new MMKV();
      const saved = storage.getString('visual_sort_data');
      expect(saved).toBeDefined();
      
      const parsed = JSON.parse(saved!);
      expect(parsed.activities).toHaveLength(1);
      expect(parsed.activities[0].title).toBe('Test Activity');
    });

    it('should handle empty array', () => {
      StorageService.saveActivities([]);

      const storage = new MMKV();
      const saved = storage.getString('visual_sort_data');
      expect(saved).toBe('{"activities":[]}');
    });
  });

  describe('clearAllData', () => {
    it('should remove all data from storage', () => {
      const storage = new MMKV();
      storage.set('visual_sort_data', JSON.stringify([{ id: 'test' }]));

      StorageService.clearAllData();

      const data = storage.getString('visual_sort_data');
      expect(data).toBeUndefined();
    });
  });
});
