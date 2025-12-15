/**
 * Row component - Displays a category row with items (horizontal layout)
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
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

interface RowProps {
  column: SortingColumn;
  items: SortingItem[];
  isEditing: boolean;
  rowHeight: number;
  totalRows: number;
  showHeaders: boolean;
  onDeleteColumn: (columnId: string) => void;
  onEditTitle: (columnId: string, newTitle: string) => void;
  onHeaderImageSelect: (columnId: string) => void;
  onDragEnd: (itemId: string, x: number, y: number) => void;
  onDoubleTap: (itemId: string) => void;
}

export const Row: React.FC<RowProps> = ({
  column,
  items,
  isEditing,
  rowHeight,
  totalRows,
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
  const scrollViewRef = useRef<ScrollView>(null);
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
        // Calculate available width for grid (estimate based on typical screen width)
        const headerWidth = showHeaders ? 116 : 0;
        const estimatedRowWidth = 300; // Conservative estimate for row content area
        const itemWidth = STANDARD_IMAGE_SIZE + ITEM_GAP;
        const itemsPerRow = Math.floor(estimatedRowWidth / itemWidth);
        
        // Calculate which row the target item is in
        const targetRow = Math.floor(targetIndex / Math.max(1, itemsPerRow));
        const itemHeight = STANDARD_IMAGE_SIZE + ITEM_GAP;
        const targetY = targetRow * itemHeight;
        
        setTimeout(() => {
          try {
            scrollViewRef.current?.scrollTo({ 
              x: 0, 
              y: targetY,
              animated: true
            });
          } catch (error) {
            console.log('ScrollTo failed');
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
  const canDelete = totalRows > 1;
  
  // Use standard image size for consistency
  const headerImageSize = STANDARD_IMAGE_SIZE;
  const itemSize = STANDARD_IMAGE_SIZE;

  return (
    <View
      ref={viewRef}
      style={[styles.container, { height: rowHeight }]}
      onLayout={handleLayout}
      collapsable={false}
    >
      {/* Header - Only render if showHeaders is true */}
      {showHeaders && (
        <View style={[styles.header, { backgroundColor, width: 100 }]}>
          <View style={styles.headerContent}>
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

            {/* Row Title */}
            <View style={styles.titleContainer}>
              {isEditing ? (
                <TextInput
                  style={styles.titleInput}
                  value={titleValue}
                  onChangeText={setTitleValue}
                  onBlur={handleTitleBlur}
                  placeholder="Row title"
                  placeholderTextColor="#FFFFFF99"
                  multiline
                />
              ) : (
                <Text style={styles.title} numberOfLines={2}>
                  {column.title}
                </Text>
              )}
            </View>
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

      {/* Items Grid (Wrapping layout like Items to Sort) */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.itemsScroll}
        contentContainerStyle={styles.itemsList}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        nestedScrollEnabled={true}
      >
        <View style={styles.gridContainer}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemWrapper}>
              <DraggableItem
                item={item}
                size={itemSize}
                isInColumn={true}
                onDragEnd={onDragEnd}
                onDoubleTap={onDoubleTap}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const ITEM_GAP = 8;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'visible', // Allow dragged items to be visible outside container
    marginVertical: 4,
  },
  header: {
    position: 'relative',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
    gap: 4,
  },
  headerImageContainer: {
    // width and height set dynamically
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF33',
    padding: 1,
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
    fontSize: 14, // Increased by 20% (12 * 1.2 = 14.4, rounded to 14)
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  titleInput: {
    fontSize: 14, // Increased by 20%
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    minHeight: 30,
  },
  deleteButton: {
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
  itemsScroll: {
    flex: 1,
  },
  itemsList: {
    padding: 8,
    paddingBottom: STANDARD_IMAGE_SIZE + 8, // Ensure last row is fully visible
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemWrapper: {
    width: STANDARD_IMAGE_SIZE,
    height: STANDARD_IMAGE_SIZE,
  },
});

export default Row;
