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

  // Shared values for animation
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
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
      // Store initial position
      initialX.current = event.absoluteX - translateX.value;
      initialY.current = event.absoluteY - translateY.value;

      // Scale up and reduce opacity
      scale.value = withSpring(1.1, { damping: 15 });
      opacity.value = 0.3;

      // Trigger light haptic
      runOnJS(triggerHaptic)('light');
    })
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      'worklet';
      // Calculate final position
      const finalX = event.absoluteX;
      const finalY = event.absoluteY;

      // Animate back to origin immediately
      translateX.value = withSpring(0, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
      scale.value = withSpring(1, { damping: 15 });
      opacity.value = 1;

      // Pass coordinates to JS thread
      runOnJS(onDragEnd)(item.id, finalX, finalY);
      runOnJS(triggerHaptic)('medium');
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    zIndex: scale.value > 1 ? 9999 : 1,
    elevation: scale.value > 1 ? 999 : 2,
  }));

  const composedGesture = Gesture.Exclusive(doubleTapGesture, panGesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
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
    overflow: 'visible', // Changed from 'hidden' to allow elevation shadow
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
