/**
 * ImageZoomModal - Full-screen image zoom modal with pinch and pan gestures
 */

import React from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface ImageZoomModalProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIN_SCALE = 1;
const MAX_SCALE = 3;

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  visible,
  imageUri,
  onClose,
}) => {
  // Shared values for animations
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Reset values when modal opens
  React.useEffect(() => {
    if (visible) {
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const resetTransform = () => {
    'worklet';
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  };

  // Pinch gesture for zooming
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      'worklet';
      const newScale = Math.min(Math.max(event.scale, MIN_SCALE), MAX_SCALE);
      scale.value = newScale;
    })
    .onEnd(() => {
      'worklet';
      if (scale.value < MIN_SCALE) {
        scale.value = withSpring(MIN_SCALE);
      } else if (scale.value > MAX_SCALE) {
        scale.value = withSpring(MAX_SCALE);
      }
    });

  // Pan gesture for moving the image when zoomed
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      // Only allow panning when zoomed in
      if (scale.value > 1) {
        const maxTranslateX = (SCREEN_WIDTH * (scale.value - 1)) / 2;
        const maxTranslateY = (SCREEN_HEIGHT * (scale.value - 1)) / 2;
        
        translateX.value = Math.min(
          Math.max(event.translationX, -maxTranslateX),
          maxTranslateX
        );
        translateY.value = Math.min(
          Math.max(event.translationY, -maxTranslateY),
          maxTranslateY
        );
      }
    })
    .onEnd(() => {
      'worklet';
      // Reset position if not zoomed
      if (scale.value <= 1) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  // Double tap to zoom in/out
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      'worklet';
      if (scale.value > 1) {
        // Zoom out
        resetTransform();
      } else {
        // Zoom in
        scale.value = withSpring(2);
      }
    });

  // Single tap to close (only when not zoomed)
  const singleTapGesture = Gesture.Tap()
    .onEnd(() => {
      'worklet';
      if (scale.value <= 1) {
        runOnJS(onClose)();
      }
    });

  const composedGesture = Gesture.Simultaneous(
    Gesture.Exclusive(doubleTapGesture, singleTapGesture),
    pinchGesture,
    panGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
      
      <Animated.View style={[styles.overlay, backgroundStyle]}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <View style={styles.closeIcon}>
            <View style={styles.closeLine1} />
            <View style={styles.closeLine2} />
          </View>
        </TouchableOpacity>

        {/* Zoomable image */}
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={styles.imageContainer}>
            <Animated.Image
              source={{ uri: imageUri }}
              style={[styles.image, animatedStyle]}
              resizeMode="contain"
            />
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  closeIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeLine1: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: 'white',
    transform: [{ rotate: '45deg' }],
  },
  closeLine2: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: 'white',
    transform: [{ rotate: '-45deg' }],
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.8,
  },
});

export default ImageZoomModal;