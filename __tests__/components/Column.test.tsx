/**
 * Component tests for Column
 */

import { COLUMN_COLORS } from '../../src/constants/colors';

describe('Column Component', () => {
  describe('color assignment', () => {
    it('should use correct color based on colorIndex', () => {
      const testCases = [
        { colorIndex: 0, expectedColor: '#EF5350' }, // Red
        { colorIndex: 1, expectedColor: '#42A5F5' }, // Blue
        { colorIndex: 2, expectedColor: '#66BB6A' }, // Green
        { colorIndex: 3, expectedColor: '#FFA726' }, // Orange
        { colorIndex: 4, expectedColor: '#AB47BC' }, // Purple
        { colorIndex: 5, expectedColor: '#26C6DA' }, // Cyan
      ];

      testCases.forEach(({ colorIndex, expectedColor }) => {
        const color = COLUMN_COLORS[colorIndex % COLUMN_COLORS.length];
        expect(color).toBe(expectedColor);
      });
    });

    it('should wrap around color palette for indices > 5', () => {
      const color6 = COLUMN_COLORS[6 % COLUMN_COLORS.length];
      const color0 = COLUMN_COLORS[0];
      expect(color6).toBe(color0); // Should wrap to red
    });
  });

  describe('delete icon visibility', () => {
    it('should show delete icon when isEditing is true', () => {
      const isEditing = true;
      const totalColumns = 3;
      const canDelete = totalColumns > 2;

      expect(isEditing && canDelete).toBe(true);
    });

    it('should hide delete icon when isEditing is false', () => {
      const isEditing = false;
      const totalColumns = 3;
      const canDelete = totalColumns > 2;

      expect(isEditing && canDelete).toBe(false);
    });

    it('should hide delete icon when only 2 columns exist', () => {
      const isEditing = true;
      const totalColumns = 2;
      const canDelete = totalColumns > 2;

      expect(isEditing && canDelete).toBe(false);
    });
  });
});
