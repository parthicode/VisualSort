/**
 * DraggableItem component - Draggable image item with gesture handling
 */

import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, Platform, Vibration } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { SortingItem } from '../../types/models';
import { useDropZoneRegistry } from './DropZoneRegistry';
import { useDragOverlay } from './DragOverlay';

interface DraggableItemProps {
  item: SortingItem;
  size: number;
  isInColumn: boolean;
  onDragEnd: (itemId: string, x: number, y: number) => void;
  onDoubleTap: (itemId: string) => void;
}

export const DraggableItem: React.FC<DraggableItemProps> = React.memo(({
  item,
  size,
  isInColumn,
  onDragEnd,
  onDoubleTap,
}) => {
  const { showDragOverlay, updateDragPosition, hideDragOverlay } = useDragOverlay();

  // Shared values for animation
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Store initial position
  const initialX = useRef(0);
  const initialY = useRef(0);

  const triggerHaptic = (type: 'light' | 'medium' | 'error') => {
    switch (type) {
      case 'light':
        Vibration.vibrate(10);
        break;
      case 'medium':
        Vibration.vibrate(20);
        break;
      case 'error':
        Vibration.vibrate([0, 50, 50, 50]); // Double-pulse pattern
        break;
    }
  };

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      'worklet';
      runOnJS(onDoubleTap)(item.id);
    });

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .activateAfterLongPress(150)
    .onStart((event) => {
      'worklet';
      // Show overlay at current position
      runOnJS(showDragOverlay)(item.imagePath || '', size, event.absoluteX, event.absoluteY);

      // Hide original item
      opacity.value = 0;

      // Trigger light haptic
      runOnJS(triggerHaptic)('light');
    })
    .onUpdate((event) => {
      'worklet';
      // Update overlay position
      runOnJS(updateDragPosition)(event.absoluteX, event.absoluteY);
    })
    .onEnd((event) => {
      'worklet';
      // Calculate final position
      const finalX = event.absoluteX;
      const finalY = event.absoluteY;

      // Hide overlay
      runOnJS(hideDragOverlay)();
      
      // Show original item again
      opacity.value = 1;

      // Pass coordinates to JS thread
      runOnJS(onDragEnd)(item.id, finalX, finalY);
      runOnJS(triggerHaptic)('medium');
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const composedGesture = Gesture.Exclusive(doubleTapGesture, panGesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View 
        style={[
          styles.container, 
          { width: size, height: size }, 
          animatedStyle
        ]}
      >
        {item.imagePath ? (
          <Image
            source={{ uri: item.imagePath }}
            style={styles.image}
            resizeMode="cover"
            onError={(error) => {
              console.error('Image load error for item:', item.id);
              console.error('Error details:', error.nativeEvent);
              console.error('Image path:', item.imagePath);
            }}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'visible',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: '#757575',
  },
});

export default DraggableItem;
