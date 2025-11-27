/**
 * DragOverlay - Renders dragged items at the root level above all other content
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface DragOverlayContextType {
  showDragOverlay: (imagePath: string, size: number, x: number, y: number) => void;
  updateDragPosition: (x: number, y: number) => void;
  hideDragOverlay: () => void;
}

const DragOverlayContext = createContext<DragOverlayContextType | null>(null);

export const useDragOverlay = () => {
  const context = useContext(DragOverlayContext);
  if (!context) {
    throw new Error('useDragOverlay must be used within DragOverlayProvider');
  }
  return context;
};

export const DragOverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dragState, setDragState] = useState<{
    visible: boolean;
    imagePath: string;
    size: number;
  }>({
    visible: false,
    imagePath: '',
    size: 0,
  });

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  const showDragOverlay = useCallback((imagePath: string, size: number, x: number, y: number) => {
    setDragState({ visible: true, imagePath, size });
    translateX.value = x - size / 2;
    translateY.value = y - size / 2;
    scale.value = withSpring(1.1, { damping: 15 });
    opacity.value = 0.9;
  }, [translateX, translateY, scale, opacity]);

  const updateDragPosition = useCallback((x: number, y: number) => {
    translateX.value = x - dragState.size / 2;
    translateY.value = y - dragState.size / 2;
  }, [translateX, translateY, dragState.size]);

  const hideDragOverlay = useCallback(() => {
    scale.value = withSpring(1, { damping: 15 });
    opacity.value = 0;
    setTimeout(() => {
      setDragState({ visible: false, imagePath: '', size: 0 });
    }, 200);
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <DragOverlayContext.Provider value={{ showDragOverlay, updateDragPosition, hideDragOverlay }}>
      {children}
      {dragState.visible && (
        <View style={styles.overlayContainer} pointerEvents="none">
          <Animated.View
            style={[
              styles.dragItem,
              {
                width: dragState.size,
                height: dragState.size,
              },
              animatedStyle,
            ]}
          >
            <Image
              source={{ uri: dragState.imagePath }}
              style={styles.image}
              resizeMode="cover"
            />
          </Animated.View>
        </View>
      )}
    </DragOverlayContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999999,
    elevation: 999999,
  },
  dragItem: {
    position: 'absolute',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 9999,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
