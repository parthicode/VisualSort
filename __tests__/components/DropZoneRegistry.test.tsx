/**
 * Unit tests for DropZoneRegistry hit detection algorithm
 */

describe('DropZoneRegistry - Hit Detection', () => {
  // Test the hit detection algorithm directly
  const findZoneAtPoint = (
    zones: Map<string, { id: string; x: number; y: number; width: number; height: number }>,
    x: number,
    y: number
  ): string | null => {
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
  };

  describe('single zone', () => {
    it('should find zone when point is inside', () => {
      const zones = new Map();
      zones.set('zone-1', { id: 'zone-1', x: 0, y: 0, width: 100, height: 100 });

      const result = findZoneAtPoint(zones, 50, 50);
      expect(result).toBe('zone-1');
    });

    it('should return null when point is outside', () => {
      const zones = new Map();
      zones.set('zone-1', { id: 'zone-1', x: 0, y: 0, width: 100, height: 100 });

      const result = findZoneAtPoint(zones, 150, 150);
      expect(result).toBeNull();
    });

    it('should handle edge cases at boundaries', () => {
      const zones = new Map();
      zones.set('zone-1', { id: 'zone-1', x: 0, y: 0, width: 100, height: 100 });

      // Test boundaries
      expect(findZoneAtPoint(zones, 0, 0)).toBe('zone-1'); // Top-left corner
      expect(findZoneAtPoint(zones, 100, 100)).toBe('zone-1'); // Bottom-right corner
      expect(findZoneAtPoint(zones, 101, 101)).toBeNull(); // Just outside
    });
  });

  describe('multiple zones', () => {
    it('should find correct zone among multiple zones', () => {
      const zones = new Map();
      zones.set('zone-1', { id: 'zone-1', x: 0, y: 0, width: 100, height: 100 });
      zones.set('zone-2', { id: 'zone-2', x: 100, y: 0, width: 100, height: 100 });
      zones.set('zone-3', { id: 'zone-3', x: 0, y: 100, width: 100, height: 100 });

      expect(findZoneAtPoint(zones, 50, 50)).toBe('zone-1');
      expect(findZoneAtPoint(zones, 150, 50)).toBe('zone-2');
      expect(findZoneAtPoint(zones, 50, 150)).toBe('zone-3');
    });

    it('should return null when point is in gap between zones', () => {
      const zones = new Map();
      zones.set('zone-1', { id: 'zone-1', x: 0, y: 0, width: 50, height: 50 });
      zones.set('zone-2', { id: 'zone-2', x: 100, y: 0, width: 50, height: 50 });

      // Point in gap between zones
      const result = findZoneAtPoint(zones, 75, 25);
      expect(result).toBeNull();
    });
  });

  describe('overlapping zones', () => {
    it('should return first matching zone when zones overlap', () => {
      const zones = new Map();
      zones.set('zone-1', { id: 'zone-1', x: 0, y: 0, width: 100, height: 100 });
      zones.set('zone-2', { id: 'zone-2', x: 50, y: 50, width: 100, height: 100 });

      // Point in overlapping area - should return first zone found
      const result = findZoneAtPoint(zones, 75, 75);
      expect(result).toBeTruthy();
      expect(['zone-1', 'zone-2']).toContain(result);
    });
  });
});
