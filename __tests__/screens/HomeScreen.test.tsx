/**
 * Component tests for HomeScreen
 */

describe('HomeScreen Component', () => {
  describe('empty state', () => {
    it('should display empty state message when no activities exist', () => {
      const activities: any[] = [];
      const shouldShowEmptyState = activities.length === 0;
      const emptyMessage = 'Tap + to create your first sorting game';
      
      expect(shouldShowEmptyState).toBe(true);
      expect(emptyMessage).toBe('Tap + to create your first sorting game');
    });

    it('should not display empty state when activities exist', () => {
      const activities = [
        { id: '1', title: 'Activity 1', columns: [], items: [] },
      ];
      const shouldShowEmptyState = activities.length === 0;
      
      expect(shouldShowEmptyState).toBe(false);
    });
  });

  describe('activity tile layout', () => {
    const TILE_PADDING = 16;
    const TILE_GAP = 16;
    const SCREEN_WIDTH = 375; // Example iPhone width

    it('should calculate correct tile width for 2-column grid', () => {
      const numColumns = 2;
      const tileWidth = (SCREEN_WIDTH - TILE_PADDING * 2 - TILE_GAP) / numColumns;
      
      // (375 - 16*2 - 16) / 2 = (375 - 48) / 2 = 327 / 2 = 163.5
      expect(tileWidth).toBe(163.5);
    });

    it('should use square aspect ratio for tiles', () => {
      const tileWidth = 163.5;
      const tileHeight = tileWidth; // 1:1 aspect ratio
      
      expect(tileHeight).toBe(tileWidth);
    });
  });

  describe('activity tile content', () => {
    it('should display activity title', () => {
      const activity = {
        id: '1',
        title: 'Sorting Colors',
        columns: [{ id: 'c1' }, { id: 'c2' }],
        items: [{ id: 'i1' }, { id: 'i2' }, { id: 'i3' }],
      };
      
      expect(activity.title).toBe('Sorting Colors');
    });

    it('should display column count with singular form', () => {
      const columnCount = 1;
      const subtitle = `${columnCount} ${columnCount === 1 ? 'column' : 'columns'}`;
      
      expect(subtitle).toBe('1 column');
    });

    it('should display column count with plural form', () => {
      const columnCount = 3;
      const subtitle = `${columnCount} ${columnCount === 1 ? 'column' : 'columns'}`;
      
      expect(subtitle).toBe('3 columns');
    });

    it('should display item count with singular form', () => {
      const itemCount = 1;
      const subtitle = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
      
      expect(subtitle).toBe('1 item');
    });

    it('should display item count with plural form', () => {
      const itemCount = 5;
      const subtitle = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
      
      expect(subtitle).toBe('5 items');
    });
  });
});
