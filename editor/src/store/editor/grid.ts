import { create } from 'zustand';

import { EventDetailsResponse, GameEvent, GameStep } from '@/types';

type Cell = {
  col: number;
  row: number;
};

type EditorGrid = {
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

export { useEditorGrid };
