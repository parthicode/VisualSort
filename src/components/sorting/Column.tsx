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
import { useDropZoneRegistry } from './DropZoneRegistry';
import DraggableItem from './DraggableItem';

interface ColumnProps {
  column: SortingColumn;
  items: SortingItem[];
  isEditing: boolean;
  columnWidth: number;
  totalColumns: number;
  onDeleteColumn: (columnId: string) => void;
  onEditTitle: (columnId: string, newTitle: string) => void;
  onHeaderImageSelect: (columnId: string) => void;
  onDragEnd: (itemId: string, x: number, y: number) => void;
  onDoubleTap: (itemId: string) => void;
}

export const Column: React.FC<ColumnProps> = React.memo(({
  column,
  items,
  isEditing,
  columnWidth,
  totalColumns,
  onDeleteColumn,
  onEditTitle,
  onHeaderImageSelect,
  onDragEnd,
  onDoubleTap,
}) => {
  const { registerZone, unregisterZone } = useDropZoneRegistry();
  const viewRef = useRef<View>(null);
  const [titleValue, setTitleValue] = React.useState(column.title);

  useEffect(() => {
    setTitleValue(column.title);
  }, [column.title]);

  useEffect(() => {
    return () => {
      unregisterZone(`column-${column.id}`);
    };
  }, [column.id, unregisterZone]);

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
  const canDelete = totalColumns > 2;
  
  // Calculate header image size dynamically (70% of column width, max 120px)
  const headerImageSize = Math.min(columnWidth * 0.7, 120);

  const renderItem = ({ item }: { item: SortingItem }) => (
    <View style={styles.itemContainer}>
      <DraggableItem
        item={item}
        size={(columnWidth - 24) * 0.7} // Reduced by 30%
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
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor }]}>
        {/* Header Image Area */}
        <TouchableOpacity
          style={[
            styles.headerImageContainer,
            { width: headerImageSize, height: headerImageSize }
          ]}
          onPress={() => onHeaderImageSelect(column.id)}
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

      {/* Items List */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.itemsList}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  header: {
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
