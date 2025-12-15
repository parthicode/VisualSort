/**
 * ImageZoomContext - Context for global image zoom functionality
 */

import React, { createContext, useContext } from 'react';
import { useImageZoom } from '../hooks/useImageZoom';
import ImageZoomModal from '../components/common/ImageZoomModal';

interface ImageZoomContextType {
  showImageZoom: (imageUri: string) => void;
}

const ImageZoomContext = createContext<ImageZoomContextType | undefined>(undefined);

export const useImageZoomContext = () => {
  const context = useContext(ImageZoomContext);
  if (!context) {
    throw new Error('useImageZoomContext must be used within ImageZoomProvider');
  }
  return context;
};

interface ImageZoomProviderProps {
  children: React.ReactNode;
}

export const ImageZoomProvider: React.FC<ImageZoomProviderProps> = ({ children }) => {
  const { isVisible, imageUri, showImageZoom, hideImageZoom } = useImageZoom();

  return (
    <ImageZoomContext.Provider value={{ showImageZoom }}>
      {children}
      <ImageZoomModal
        visible={isVisible}
        imageUri={imageUri}
        onClose={hideImageZoom}
      />
    </ImageZoomContext.Provider>
  );
};