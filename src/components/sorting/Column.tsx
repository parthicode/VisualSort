/**
 * Column component - Displays a category column with items
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { SortingColumn, SortingItem } from '../../types/models';
import { COLUMN_COLORS } from '../../constants/colors';
import { STANDARD_IMAGE_SIZE } from '../../constants/sizing';
import { useDropZoneRegistry } from './DropZoneRegistry';
import { useImageZoomContext } from '../../contexts/ImageZoomContext';
import DraggableItem from './DraggableItem';

interface ColumnProps {
  column: SortingColumn;
  items: SortingItem[];
  isEditing: boolean;
  columnWidth: number;
  totalColumns: number;
  showHeaders: boolean;
  onDeleteColumn: (columnId: string) => void;
  onEditTitle: (columnId: string, newTitle: string) => void;
  onHeaderImageSelect: (columnId: string) => void;
  onDragEnd: (itemId: string, x: number, y: number) => void;
  onDoubleTap: (itemId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  items,
  isEditing,
  columnWidth,
  totalColumns,
  showHeaders,
  onDeleteColumn,
  onEditTitle,
  onHeaderImageSelect,
  onDragEnd,
  onDoubleTap,
}) => {
  const { registerZone, unregisterZone } = useDropZoneRegistry();
  const { showImageZoom } = useImageZoomContext();
  const viewRef = useRef<View>(null);
  const flatListRef = useRef<FlatList>(null);
  const [titleValue, setTitleValue] = React.useState(column.title);
  const prevItemIdsRef = useRef<string[]>(items.map(item => item.id));

  useEffect(() => {
    setTitleValue(column.title);
  }, [column.title]);

  useEffect(() => {
    return () => {
      unregisterZone(`column-${column.id}`);
    };
  }, [column.id, unregisterZone]);

  // Auto-scroll to the newly added or moved item
  useEffect(() => {
    if (items.length === 0) {
      prevItemIdsRef.current = [];
      return;
    }

    const currentItemIds = items.map(item => item.id);
    const prevItemIds = prevItemIdsRef.current;
    
    // Skip if this is the initial render
    if (prevItemIds.length === 0) {
      prevItemIdsRef.current = currentItemIds;
      return;
    }
    
    // Find newly added items (in current but not in previous)
    const newItems = currentItemIds.filter(id => !prevItemIds.includes(id));
    
    // Find moved items (in both but at different positions)
    const movedItems = currentItemIds.filter((id, index) => {
      const prevIndex = prevItemIds.indexOf(id);
      return prevIndex !== -1 && prevIndex !== index;
    });
    
    // Scroll to the first new or moved item
    const targetItemId = newItems[0] || movedItems[0];
    if (targetItemId && items.length > 0) {
      const targetIndex = currentItemIds.indexOf(targetItemId);
      if (targetIndex !== -1 && targetIndex < items.length) {
        setTimeout(() => {
          try {
            flatListRef.current?.scrollToIndex({ 
              index: targetIndex, 
              animated: true,
              viewPosition: 0.5 // Center the item in view
            });
          } catch (error) {
            // Fallback to scrollToEnd if scrollToIndex fails
            console.log('ScrollToIndex failed, using fallback');
          }
        }, 150);
      }
    }
    
    prevItemIdsRef.current = currentItemIds;
  }, [items]);

  const handleLayout = (event: LayoutChangeEvent) => {
    viewRef.current?.measureInWindow((x, y, width, height) => {
      registerZone(`column-${column.id}`, { x, y, width, height });
    });
  };

  const handleTitleBlur = () => {
    if (titleValue.trim() !== column.title) {
      onEditTitle(column.id, titleValue.trim());
    }
  };

  const backgroundColor = COLUMN_COLORS[column.colorIndex % COLUMN_COLORS.length];
  const canDelete = totalColumns > 1;
  
  // Use standard image size for consistency
  const headerImageSize = STANDARD_IMAGE_SIZE;
  const itemSize = STANDARD_IMAGE_SIZE;

  const renderItem = ({ item }: { item: SortingItem }) => (
    <View style={styles.itemContainer}>
      <DraggableItem
        item={item}
        size={itemSize} // 80% of header image size
        isInColumn={true}
        onDragEnd={onDragEnd}
        onDoubleTap={onDoubleTap}
      />
    </View>
  );

  return (
    <View
      ref={viewRef}
      style={[styles.container, { width: columnWidth }]}
      onLayout={handleLayout}
      collapsable={false}
    >
      {/* Header - Only render if showHeaders is true */}
      {showHeaders && (
        <View style={[styles.header, { backgroundColor }]}>
          {/* Header Image Area */}
          <TouchableOpacity
            style={[
              styles.headerImageContainer,
              { width: headerImageSize, height: headerImageSize }
            ]}
            onPress={() => onHeaderImageSelect(column.id)}
            onLongPress={() => {
              if (column.headerImagePath) {
                showImageZoom(column.headerImagePath);
              }
            }}
            activeOpacity={0.7}
          >
            {column.headerImagePath ? (
              <Image
                source={{ uri: column.headerImagePath }}
                style={styles.headerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.headerImagePlaceholder}>
                <Text style={[styles.headerImagePlaceholderText, { fontSize: headerImageSize * 0.3 }]}>+</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Column Title */}
          <View style={styles.titleContainer}>
            {isEditing ? (
              <TextInput
                style={styles.titleInput}
                value={titleValue}
                onChangeText={setTitleValue}
                onBlur={handleTitleBlur}
                placeholder="Column title"
                placeholderTextColor="#FFFFFF99"
              />
            ) : (
              <Text style={styles.title} numberOfLines={1}>
                {column.title}
              </Text>
            )}
          </View>

          {/* Delete Icon */}
          {isEditing && canDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDeleteColumn(column.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.deleteIcon}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Items List */}
      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.itemsList}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        maxToRenderPerBatch={10}
        windowSize={5}
        nestedScrollEnabled={true}
        onScrollToIndexFailed={(info) => {
          // Fallback: wait for layout and try again
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.5,
            });
          }, 500);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'visible', // Allow dragged items to be visible outside container
    marginHorizontal: 4,
  },
  header: {
    position: 'relative',
    padding: 12,
    alignItems: 'center',
  },
  headerImageContainer: {
    // width and height set dynamically
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#FFFFFF33',
    padding: 1, // 1mm gap between border and image
  },
  headerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 7,
  },
  headerImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImagePlaceholderText: {
    // fontSize set dynamically (30% of image size)
    color: '#FFFFFF',
    fontWeight: '300',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 100,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 28,
  },
  itemsList: {
    padding: 8,
  },
  itemContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
  itemImage: {
    height: 80,
    borderRadius: 8,
  },
});

export default Column;
