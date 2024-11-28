import { create } from 'zustand';

type EditorGrid = {
  columns: number;
  rows: number;
  setSize(columns: number, rows: number): void;
  addColumns(amount: number): void;
  addRows(count: number): void;
};

const useEditorGrid = create<EditorGrid>((set) => ({
  columns: 5,
  rows: 5,

  setSize(columns, rows) {
    if (isValidSize(columns) && isValidSize(rows)) {
      set({ columns, rows });
    }
  },

  addColumns(amount) {
    set((grid) => {
      const columns = grid.columns + amount;
      return isValidSize(columns) ? { ...grid, columns } : grid;
    });
  },

  addRows(amount) {
    set((grid) => {
      const rows = grid.rows + amount;
      return isValidSize(rows) ? { ...grid, rows } : grid;
    });
  },
}));

function isValidSize(n: number) {
  return Number.isInteger(n) && n > 0 && n <= Number.MAX_SAFE_INTEGER;
}

export { useEditorGrid };
