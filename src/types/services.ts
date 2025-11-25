/**
 * Service layer interface definitions
 */

import { Activity, SortingItem } from './models';

export interface IStorageService {
  getActivities(): Promise<Activity[]>;
  saveActivities(activities: Activity[]): Promise<void>;
  clearAllData(): Promise<void>;
}

export interface IImageService {
  saveImage(uri: string, activityId: string, type: 'item' | 'header'): Promise<string>;
  deleteActivityFolder(activityId: string): Promise<void>;
  deleteImage(imagePath: string): Promise<void>;
  optimizeImage(uri: string): Promise<string>;
}

export interface IActivityService {
  createActivity(title: string, columnTitles: string[]): Activity;
  addColumn(activity: Activity, title: string): Activity;
  deleteColumn(activity: Activity, columnId: string): Activity;
  moveItem(activity: Activity, itemId: string, targetColumnId: string | null): Activity;
  resetPlacements(activity: Activity): Activity;
  clearAllItems(activity: Activity): Activity;
}
