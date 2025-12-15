/**
 * ItemsTray component - Displays unsorted items in a scrollable grid
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { SortingItem } from '../../types/models';
import { STANDARD_IMAGE_SIZE } from '../../constants/sizing';
import { useDropZoneRegistry } from './DropZoneRegistry';
import DraggableItem from './DraggableItem';

interface ItemsTrayProps {
  items: SortingItem[];
  onAddItems: () => void;
  onDragEnd: (itemId: string, x: number, y: number) => void;
  onDoubleTap: (itemId: string) => void;
}

const ITEM_SIZE = STANDARD_IMAGE_SIZE; // Use standard size for consistency
const ITEM_GAP = 8;

export const ItemsTray: React.FC<ItemsTrayProps> = React.memo(({ 
  items, 
  onAddItems,
  onDragEnd,
  onDoubleTap,
}) => {
  const { registerZone, unregisterZone } = useDropZoneRegistry();
  const viewRef = useRef<View>(null);

  useEffect(() => {
    return () => {
      unregisterZone('items-tray');
    };
  }, [unregisterZone]);

  const handleLayout = (event: LayoutChangeEvent) => {
    viewRef.current?.measureInWindow((x, y, width, height) => {
      registerZone('items-tray', { x, y, width, height });
    });
  };

  // Debug: Log items when they change (only in dev mode)
  useEffect(() => {
    if (__DEV__) {
      console.log('ItemsTray - Rendering with', items.length, 'items');
    }
  }, [items]);

  return (
    <View
      ref={viewRef}
      style={styles.container}
      onLayout={handleLayout}
      collapsable={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Items to Sort ({items.length})
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddItems}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>+ Add Items</Text>
        </TouchableOpacity>
      </View>

      {/* Items Grid - Wrapping layout that fills rows left to right */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        removeClippedSubviews={false}
        nestedScrollEnabled={true}
      >
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items yet. Tap "+ Add Items" to get started.</Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {items.map((item) => (
              <View key={item.id} style={styles.itemWrapper}>
                <DraggableItem
                  item={item}
                  size={ITEM_SIZE}
                  isInColumn={false}
                  onDragEnd={onDragEnd}
                  onDoubleTap={onDoubleTap}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1, // IMPORTANT: Allow container to take available space
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#BDBDBD',
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  addButton: {
    backgroundColor: '#42A5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: ITEM_SIZE + 16, // Ensure last row is fully visible
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ITEM_GAP,
  },
  itemWrapper: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
});

export default ItemsTray;
