/**
 * SortingScreen - Main interactive sorting interface
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import { SortingScreenProps } from '../../types/navigation';
import { useAppStore } from '../../store/useAppStore';
import { DropZoneRegistryProvider } from '../../components/sorting/DropZoneRegistry';
import { DragOverlayProvider } from '../../components/sorting/DragOverlay';
import Column from '../../components/sorting/Column';
import Row from '../../components/sorting/Row';
import ItemsTray from '../../components/sorting/ItemsTray';
import DraggableItem from '../../components/sorting/DraggableItem';

export const SortingScreen: React.FC<SortingScreenProps> = ({ route, navigation }) => {
  const { activityId } = route.params;
  const { width, height } = useWindowDimensions();

  const {
    activities,
    moveItem,
    addItem,
    deleteItem,
    updateHeaderImage,
    updateColumnTitle,
    addColumn,
    deleteColumn,
    resetPlacements,
    clearAllItems,
    deleteActivity,
    fetchActivities,
  } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Get current activity
  const activity = useMemo(
    () => activities.find((a) => a.id === activityId),
    [activities, activityId]
  );

  if (!activity) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Activity not found</Text>
      </View>
    );
  }

  // Calculate layout dimensions based on orientation
  const isColumnLayout = activity.orientation === 'column';
  const COLUMNS_HEIGHT_RATIO = 0.66;
  const TRAY_HEIGHT_RATIO = 0.34;
  const columnsHeight = height * COLUMNS_HEIGHT_RATIO;
  const trayHeight = height * TRAY_HEIGHT_RATIO;

  const PADDING = 16;
  const COLUMN_GAP = 8;
  const ROW_GAP = 8;
  const MIN_COLUMNS_FOR_CALC = 4; // Calculate size as if there are at least 4 columns/rows
  const MAX_COLUMN_WIDTH = 200; // Maximum width for columns
  const MAX_ROW_HEIGHT = 150; // Maximum height for rows
  
  const columnWidth = useMemo(
    () => {
      if (!isColumnLayout) return 0;
      // Use the larger of actual count or 4 for calculation
      const columnsForCalc = Math.max(activity.columns.length, MIN_COLUMNS_FOR_CALC);
      const calculatedWidth = (width - PADDING * 2 - COLUMN_GAP * (columnsForCalc - 1)) / columnsForCalc;
      // Apply max width constraint
      return Math.min(calculatedWidth, MAX_COLUMN_WIDTH);
    },
    [width, activity.columns.length, isColumnLayout]
  );

  const rowHeight = useMemo(
    () => {
      if (isColumnLayout) return 0;
      // Use the larger of actual count or 4 for calculation
      const rowsForCalc = Math.max(activity.columns.length, MIN_COLUMNS_FOR_CALC);
      const calculatedHeight = (columnsHeight - PADDING * 2 - ROW_GAP * (rowsForCalc - 1)) / rowsForCalc;
      // Apply max height constraint
      return Math.min(calculatedHeight, MAX_ROW_HEIGHT);
    },
    [columnsHeight, activity.columns.length, isColumnLayout]
  );

  // Filter items by location
  const trayItems = useMemo(
    () => activity.items.filter((item) => item.currentLocation === null),
    [activity.items]
  );

  const getColumnItems = (columnId: string) =>
    activity.items.filter((item) => item.currentLocation === columnId);

  // Handlers
  const handleDragEnd = async (itemId: string, x: number, y: number) => {
    try {
      // Simple zone detection - check if coordinates are in tray or columns/rows area
      // Tray is in the bottom third of the screen
      if (y > height * 0.66) {
        // Dropped in tray
        await moveItem(activityId, itemId, null);
      } else {
        if (isColumnLayout) {
          // Column layout - find which column horizontally
          const columnIndex = Math.floor((x - PADDING) / (columnWidth + COLUMN_GAP));
          if (columnIndex >= 0 && columnIndex < activity.columns.length) {
            const columnId = activity.columns[columnIndex].id;
            await moveItem(activityId, itemId, columnId);
          }
        } else {
          // Row layout - find which row vertically (from bottom since rows are bottom-aligned)
          // Calculate from the bottom of the columns area
          const columnsAreaBottom = columnsHeight;
          const relativeY = columnsAreaBottom - y + PADDING;
          const rowIndexFromBottom = Math.floor(relativeY / (rowHeight + ROW_GAP));
          // Reverse the index since rows are rendered bottom-to-top but array is top-to-bottom
          const rowIndex = activity.columns.length - 1 - rowIndexFromBottom;
          if (rowIndex >= 0 && rowIndex < activity.columns.length) {
            const columnId = activity.columns[rowIndex].id;
            await moveItem(activityId, itemId, columnId);
          }
        }
      }
    } catch (error) {
      console.error('Error moving item:', error);
    }
  };

  const handleDoubleTap = async (itemId: string) => {
    // Double tap always deletes the item
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(activityId, itemId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleAddItems = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0, // 0 = unlimited
        quality: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', `Image picker error: ${result.errorMessage || result.errorCode}`);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        for (const asset of result.assets) {
          if (asset.uri) {
            try {
              await addItem(activityId, asset.uri);
              // Force re-fetch to ensure UI updates
              await fetchActivities();
            } catch (itemError) {
              console.error('Failed to add item:', itemError);
              Alert.alert('Error', `Failed to add image: ${itemError}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Unexpected error adding items:', error);
      Alert.alert('Error', `Failed to add items: ${error}`);
    }
  };

  const handleHeaderImageSelect = async (columnId: string) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 1,
      });

      if (result.assets && result.assets[0]?.uri) {
        // Save header image
        const ImageService = require('../../services/ImageService').default;
        const savedPath = await ImageService.saveImage(
          result.assets[0].uri,
          activityId,
          'header'
        );
        updateHeaderImage(activityId, columnId, savedPath);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update header image');
    }
  };

  const handleEditTitle = (columnId: string, newTitle: string) => {
    if (newTitle.trim()) {
      updateColumnTitle(activityId, columnId, newTitle);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    const layoutType = isColumnLayout ? 'column' : 'row';
    Alert.alert(
      `Delete ${layoutType.charAt(0).toUpperCase() + layoutType.slice(1)}`,
      `Items in this ${layoutType} will be moved to the tray.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteColumn(activityId, columnId),
        },
      ]
    );
  };

  const handleAddColumn = () => {
    const layoutType = isColumnLayout ? 'columns' : 'rows';
    const layoutTypeSingular = isColumnLayout ? 'Column' : 'Row';
    
    if (activity.columns.length >= 6) {
      Alert.alert(`Maximum ${layoutTypeSingular}s`, `You can have a maximum of 6 ${layoutType}.`);
      return;
    }

    // For now, add a column/row with a default name
    // User can edit the title after creation
    const columnNumber = activity.columns.length + 1;
    addColumn(activityId, `${layoutTypeSingular} ${columnNumber}`);
  };

  const handleResetPlacements = () => {
    Alert.alert(
      'Reset Items',
      'Move all items back to the tray?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => resetPlacements(activityId),
        },
      ]
    );
  };

  const handleClearAllItems = () => {
    Alert.alert(
      'Clear All Items',
      'This will delete all item images. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllItems(activityId);
            } catch (error) {
              Alert.alert('Error', 'Failed to clear items');
            }
          },
        },
      ]
    );
  };

  const handleDeleteActivity = () => {
    Alert.alert(
      'Delete Activity',
      'This will delete the activity and all associated images. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Navigate away first to avoid rendering deleted activity
              navigation.goBack();
              // Then delete the activity
              await deleteActivity(activityId);
            } catch (error) {
              console.error('Error deleting activity:', error);
              Alert.alert('Error', 'Failed to delete activity');
            }
          },
        },
      ]
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <DragOverlayProvider>
        <DropZoneRegistryProvider>
        {/* Header with Title and Menu */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.appName}>VisualSort</Text>
          </View>
          <Text style={styles.headerTitle} numberOfLines={1}>{activity.title}</Text>
          <View style={styles.headerRight}>
            {!isEditing && (
              <>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleResetPlacements}
                >
                  <Text style={styles.resetButtonText}>Reset Items</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => setShowMenu(!showMenu)}
                >
                  <Text style={styles.menuButtonText}>⋮</Text>
                </TouchableOpacity>
              </>
            )}
            {isEditing && (
              <View style={styles.editControls}>
                {activity.columns.length < 6 && (
                  <TouchableOpacity
                    style={styles.addColumnButton}
                    onPress={handleAddColumn}
                  >
                    <Text style={styles.addColumnButtonText}>
                      Add {isColumnLayout ? 'Column' : 'Row'}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Columns/Rows Area */}
        <View 
          style={[
            isColumnLayout ? styles.columnsArea : styles.rowsArea,
            { height: columnsHeight }
          ]}
          collapsable={false}
        >
          {isColumnLayout ? (
            // Column Layout
            activity.columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                items={getColumnItems(column.id)}
                isEditing={isEditing}
                columnWidth={columnWidth}
                totalColumns={activity.columns.length}
                onDeleteColumn={handleDeleteColumn}
                onEditTitle={handleEditTitle}
                onHeaderImageSelect={handleHeaderImageSelect}
                onDragEnd={handleDragEnd}
                onDoubleTap={handleDoubleTap}
              />
            ))
          ) : (
            // Row Layout
            activity.columns.map((column) => (
              <Row
                key={column.id}
                column={column}
                items={getColumnItems(column.id)}
                isEditing={isEditing}
                rowHeight={rowHeight}
                totalRows={activity.columns.length}
                onDeleteColumn={handleDeleteColumn}
                onEditTitle={handleEditTitle}
                onHeaderImageSelect={handleHeaderImageSelect}
                onDragEnd={handleDragEnd}
                onDoubleTap={handleDoubleTap}
              />
            ))
          )}
        </View>

        {/* Items Tray */}
        <View style={[styles.trayArea, { height: trayHeight }]} collapsable={false}>
          <ItemsTray 
            items={trayItems} 
            onAddItems={handleAddItems}
            onDragEnd={handleDragEnd}
            onDoubleTap={handleDoubleTap}
          />
        </View>

        {/* Menu Dropdown */}
        {showMenu && !isEditing && (
          <View style={styles.menuDropdown}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                setIsEditing(true);
              }}
            >
              <Text style={styles.menuItemText}>Edit Structure</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                handleResetPlacements();
              }}
            >
              <Text style={styles.menuItemText}>Reset Items</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                handleClearAllItems();
              }}
            >
              <Text style={styles.menuItemText}>Clear All Items</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={() => {
                setShowMenu(false);
                handleDeleteActivity();
              }}
            >
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                Delete Activity
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </DropZoneRegistryProvider>
      </DragOverlayProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#757575',
  },
  header: {
    backgroundColor: '#42A5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 18, // Increased by 50% (12 * 1.5 = 18)
    color: '#FFFFFF',
    opacity: 0.8,
    marginLeft: 4,
    lineHeight: 24, // Match arrow height for vertical alignment
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 26, // Increased by 30% (20 * 1.3 = 26)
    fontWeight: 'bold',
    color: '#FFFFFF',
    zIndex: -1, // Behind left and right elements
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  columnsArea: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'flex-start', // Left-align columns
    overflow: 'visible', // Allow dragged items to be visible
  },
  rowsArea: {
    flexDirection: 'column',
    padding: 16,
    justifyContent: 'flex-end', // Bottom-align rows
    overflow: 'visible', // Allow dragged items to be visible
  },
  trayArea: {
    borderTopWidth: 2,
    borderTopColor: '#BDBDBD',
    overflow: 'visible', // Allow dragged items to be visible
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  menuDropdown: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 200,
    zIndex: 1000,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuItemText: {
    fontSize: 16,
    color: '#212121',
  },
  menuItemDanger: {
    borderBottomWidth: 0,
  },
  menuItemTextDanger: {
    color: '#F44336',
  },
  editControls: {
    flexDirection: 'row',
    gap: 8,
  },
  addColumnButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addColumnButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  doneButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SortingScreen;
