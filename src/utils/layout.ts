/**
 * Layout calculation utilities for dynamic sizing
 */

export const MAX_COLUMN_WIDTH = 200; // pixels
export const MAX_ROW_HEIGHT = 200; // pixels
export const SCREEN_PADDING = 32; // 16px on each side
export const COLUMN_GAP = 8; // pixels
export const ROW_GAP = 8; // pixels

/**
 * Calculate column width based on column count and available width
 * For fewer than 4 columns: equal distribution
 * For 4+ columns: apply maximum width constraint
 * 
 * @param columnCount - Number of columns
 * @param windowWidth - Available screen width
 * @returns Calculated column width in pixels
 */
export const calculateColumnWidth = (columnCount: number, windowWidth: number): number => {
  if (columnCount <= 0) {
    return 0;
  }

  const totalGaps = COLUMN_GAP * (columnCount - 1);
  const availableWidth = windowWidth - SCREEN_PADDING - totalGaps;
  
  if (columnCount < 4) {
    // Equal distribution for fewer than 4 columns
    return availableWidth / columnCount;
  } else {
    // Apply max width constraint for 4+ columns
    const calculatedWidth = availableWidth / columnCount;
    return Math.min(calculatedWidth, MAX_COLUMN_WIDTH);
  }
};

/**
 * Calculate row height based on row count and available height
 * For fewer than 4 rows: equal distribution
 * For 4+ rows: apply maximum height constraint
 * 
 * @param rowCount - Number of rows
 * @param windowHeight - Available screen height
 * @returns Calculated row height in pixels
 */
export const calculateRowHeight = (rowCount: number, windowHeight: number): number => {
  if (rowCount <= 0) {
    return 0;
  }

  const totalGaps = ROW_GAP * (rowCount - 1);
  const availableHeight = windowHeight - SCREEN_PADDING - totalGaps;
  
  if (rowCount < 4) {
    // Equal distribution for fewer than 4 rows
    return availableHeight / rowCount;
  } else {
    // Apply max height constraint for 4+ rows
    const calculatedHeight = availableHeight / rowCount;
    return Math.min(calculatedHeight, MAX_ROW_HEIGHT);
  }
};
