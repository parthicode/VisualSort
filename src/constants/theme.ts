/**
 * Theme constants for typography and spacing
 */

export const TYPOGRAPHY = {
  activityTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  columnHeader: {
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
  },
  button: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
};

export const SPACING = {
  screenPadding: 16,
  gridGap: 16,
  componentMargin: 8,
  minTouchTarget: 44,
};

export const LAYOUT = {
  columnsAreaHeight: 0.66, // 66% of screen height
  itemsTrayHeight: 0.33,   // 33% of screen height
  itemSize: 80,
  itemGap: 8,
};
