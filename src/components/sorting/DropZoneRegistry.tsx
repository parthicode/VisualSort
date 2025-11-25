/**
 * DropZoneRegistry - Context for managing drop zones in drag-and-drop system
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { LayoutRectangle } from 'react-native';

export interface DropZoneInfo {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DropZoneRegistryContextValue {
  zones: Map<string, DropZoneInfo>;
  registerZone: (id: string, layout: LayoutRectangle) => void;
  unregisterZone: (id: string) => void;
  findZoneAtPoint: (x: number, y: number) => string | null;
}

const DropZoneRegistryContext = createContext<DropZoneRegistryContextValue | undefined>(
  undefined
);

interface DropZoneRegistryProviderProps {
  children: ReactNode;
}

export const DropZoneRegistryProvider: React.FC<DropZoneRegistryProviderProps> = ({
  children,
}) => {
  const [zones, setZones] = useState<Map<string, DropZoneInfo>>(new Map());

  const registerZone = useCallback((id: string, layout: LayoutRectangle) => {
    setZones((prevZones) => {
      const newZones = new Map(prevZones);
      newZones.set(id, {
        id,
        x: layout.x,
        y: layout.y,
        width: layout.width,
        height: layout.height,
      });
      return newZones;
    });
  }, []);

  const unregisterZone = useCallback((id: string) => {
    setZones((prevZones) => {
      const newZones = new Map(prevZones);
      newZones.delete(id);
      return newZones;
    });
  }, []);

  const findZoneAtPoint = useCallback(
    (x: number, y: number): string | null => {
      for (const [id, zone] of zones.entries()) {
        if (
          x >= zone.x &&
          x <= zone.x + zone.width &&
          y >= zone.y &&
          y <= zone.y + zone.height
        ) {
          return id;
        }
      }
      return null;
    },
    [zones]
  );

  const value: DropZoneRegistryContextValue = {
    zones,
    registerZone,
    unregisterZone,
    findZoneAtPoint,
  };

  return (
    <DropZoneRegistryContext.Provider value={value}>
      {children}
    </DropZoneRegistryContext.Provider>
  );
};

export const useDropZoneRegistry = (): DropZoneRegistryContextValue => {
  const context = useContext(DropZoneRegistryContext);
  if (!context) {
    throw new Error(
      'useDropZoneRegistry must be used within a DropZoneRegistryProvider'
    );
  }
  return context;
};
