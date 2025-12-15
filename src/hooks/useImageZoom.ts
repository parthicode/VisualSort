/**
 * useImageZoom - Hook for managing image zoom modal state
 */

import { useState, useCallback } from 'react';

interface ImageZoomState {
  visible: boolean;
  imageUri: string;
}

export const useImageZoom = () => {
  const [zoomState, setZoomState] = useState<ImageZoomState>({
    visible: false,
    imageUri: '',
  });

  const showImageZoom = useCallback((imageUri: string) => {
    setZoomState({
      visible: true,
      imageUri,
    });
  }, []);

  const hideImageZoom = useCallback(() => {
    setZoomState({
      visible: false,
      imageUri: '',
    });
  }, []);

  return {
    isVisible: zoomState.visible,
    imageUri: zoomState.imageUri,
    showImageZoom,
    hideImageZoom,
  };
};