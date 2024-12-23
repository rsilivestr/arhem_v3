import { create } from 'zustand';

import { EventDetailsResponse, GameEvent, GameStep } from '@/types';

type Cell = {
  col: number;
  row: number;
};

type EditorGrid = {
  cols: number;
  rows: number;
  setSize(columns: number, rows: number): void;
  addCols(amount: number): void;
  addRows(count: number): void;

  activeCell: Cell | null;
  setActiveCell(cell: Cell | null): void;

  event: GameEvent | null;
  setEvent(event: GameEvent | null): void;

  steps: EventDetailsResponse['steps'];
  setSteps(steps: EventDetailsResponse['steps']): void;

  activeStep: GameStep | null;
  setActiveStep(step: GameStep | null): void;
};

const useEditorGrid = create<EditorGrid>((set) => ({
  cols: 5,
  rows: 5,

  setSize(cols, rows) {
    if (isValidSize(cols) && isValidSize(rows)) {
      set({ cols, rows });
    }
  },

  addCols(amount) {
    set((grid) => {
      const cols = grid.cols + amount;
      return isValidSize(cols) ? { ...grid, cols } : grid;
    });
  },

  addRows(amount) {
    set((grid) => {
      const rows = grid.rows + amount;
      return isValidSize(rows) ? { ...grid, rows } : grid;
    });
  },

  activeCell: null,

  setActiveCell(activeCell) {
    set({ activeCell });
  },

  event: null,
  setEvent(event) {
    set({ event });
  },

  steps: [],
  setSteps(steps) {
    set({ steps });
  },

  activeStep: null,
  setActiveStep(activeStep) {
    set({ activeStep });
  },
}));

function isValidSize(n: number) {
  return Number.isInteger(n) && n > 0 && n <= Number.MAX_SAFE_INTEGER;
}

export { useEditorGrid };
