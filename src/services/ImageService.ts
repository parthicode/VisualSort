/**
 * Image service for managing file system operations
 */

import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import { IImageService } from '../types/services';
import { generateUUID } from '../utils/uuid';

const BASE_DIR = `${RNFS.DocumentDirectoryPath}/VisualSort/activities`;

class ImageService implements IImageService {
  /**
   * Ensure directory exists, create if it doesn't
   */
  private async ensureDirectoryExists(path: string): Promise<void> {
    try {
      const exists = await RNFS.exists(path);
      if (!exists) {
        console.log('Creating directory:', path);
        // Create parent directories recursively
        const parts = path.split('/');
        let currentPath = '';
        
        for (const part of parts) {
          if (!part) continue;
          currentPath += (currentPath ? '/' : '') + part;
          
          const partExists = await RNFS.exists(currentPath);
          if (!partExists) {
            await RNFS.mkdir(currentPath);
          }
        }
      }
    } catch (error) {
      console.error('Error ensuring directory exists:', error);
      throw error;
    }
  }

  /**
   * Optimize image before saving (resize and compress)
   * @param uri - Original image URI
   * @returns URI of optimized image
   */
  async optimizeImage(uri: string): Promise<string> {
    try {
      const result = await ImageResizer.createResizedImage(
        uri,
        1024,  // max width
        1024,  // max height
        'JPEG',
        80,    // quality (0-100)
        0,     // rotation
        undefined, // output path (auto-generated)
        true,  // keep metadata
      );

      return result.uri;
    } catch (error) {
      console.error('Error optimizing image:', error);
      // Return original URI if optimization fails
      return uri;
    }
  }

  /**
   * Save image to app storage
   * @param uri - Source image URI (from picker)
   * @param activityId - Activity ID for organizing files
   * @param type - 'item' or 'header'
   * @returns file:// URI of saved image
   */
  async saveImage(
    uri: string,
    activityId: string,
    type: 'item' | 'header'
  ): Promise<string> {
    try {
      console.log('ImageService.saveImage - Input URI:', uri);
      console.log('ImageService.saveImage - Activity ID:', activityId);
      console.log('ImageService.saveImage - Type:', type);
      
      // Optimize image first
      const optimizedUri = await this.optimizeImage(uri);
      console.log('ImageService.saveImage - Optimized URI:', optimizedUri);

      // Generate unique filename
      const imageId = generateUUID();
      const extension = 'jpg';
      const filename = `${imageId}.${extension}`;

      // Construct directory path
      const dirPath = `${BASE_DIR}/${activityId}/${type}s`;
      console.log('ImageService.saveImage - Directory path:', dirPath);
      await this.ensureDirectoryExists(dirPath);

      // Construct full file path
      const destPath = `${dirPath}/${filename}`;
      console.log('ImageService.saveImage - Destination path:', destPath);

      // Copy file to destination
      await RNFS.copyFile(optimizedUri, destPath);
      console.log('ImageService.saveImage - File copied successfully');

      // Verify file exists
      const fileExists = await RNFS.exists(destPath);
      console.log('ImageService.saveImage - File exists after copy:', fileExists);

      // Clean up optimized temp file if different from original
      if (optimizedUri !== uri) {
        try {
          await RNFS.unlink(optimizedUri);
        } catch (e) {
          // Ignore cleanup errors
        }
      }

      const finalUri = `file://${destPath}`;
      console.log('ImageService.saveImage - Final URI:', finalUri);
      return finalUri;
    } catch (error) {
      console.error('Error saving image:', error);
      throw new Error('Failed to save image');
    }
  }

  /**
   * Delete entire activity folder and all images
   * @param activityId - Activity ID
   */
  async deleteActivityFolder(activityId: string): Promise<void> {
    try {
      const activityPath = `${BASE_DIR}/${activityId}`;
      const exists = await RNFS.exists(activityPath);

      if (exists) {
        await RNFS.unlink(activityPath);
      }
    } catch (error) {
      console.error('Error deleting activity folder:', error);
      throw new Error('Failed to delete activity folder');
    }
  }

  /**
   * Delete a single image file
   * @param imagePath - Full file:// URI of image
   */
  async deleteImage(imagePath: string): Promise<void> {
    try {
      // Remove file:// prefix if present
      const path = imagePath.replace('file://', '');
      const exists = await RNFS.exists(path);

      if (exists) {
        await RNFS.unlink(path);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }
}

// Export singleton instance
export default new ImageService();
