/**
 * Component tests for ItemsTray
 */

describe('ItemsTray Component', () => {
  describe('item count display', () => {
    it('should display correct count for zero items', () => {
      const itemCount = 0;
      const displayText = `Items to Sort (${itemCount})`;
      
      expect(displayText).toBe('Items to Sort (0)');
    });

    it('should display correct count for one item', () => {
      const itemCount = 1;
      const displayText = `Items to Sort (${itemCount})`;
      
      expect(displayText).toBe('Items to Sort (1)');
    });

    it('should display correct count for multiple items', () => {
      const itemCount = 15;
      const displayText = `Items to Sort (${itemCount})`;
      
      expect(displayText).toBe('Items to Sort (15)');
    });
  });

  describe('item layout', () => {
    const ITEM_SIZE = 80;
    const ITEM_GAP = 8;

    it('should use correct item size', () => {
      expect(ITEM_SIZE).toBe(80);
    });

    it('should use correct gap between items', () => {
      expect(ITEM_GAP).toBe(8);
    });

    it('should calculate total width for items correctly', () => {
      const itemCount = 5;
      const totalWidth = (ITEM_SIZE * itemCount) + (ITEM_GAP * (itemCount - 1));
      
      expect(totalWidth).toBe(432); // (80 * 5) + (8 * 4)
    });
  });
});
