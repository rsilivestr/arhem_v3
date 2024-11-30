import { create } from 'zustand';

import { clamp } from '@/utils/clamp';

type EditorViewport = {
  tx: number;
  ty: number;
  txMax: number;
  tyMax: number;
  translate(dx: number, dy: number): void;
  setMaxTranslate(txMax: number, tyMax: number): void;
};

const useEditorViewport = create<EditorViewport>((set) => ({
  tx: 0,
  ty: 0,
  txMax: 0,
  tyMax: 0,

  translate(dx, dy) {
    set(({ tx, ty, txMax, tyMax }) => ({
      // Scene transform equals negative viewport transform.
      tx: clamp(tx + dx, -txMax, 0),
      ty: clamp(ty + dy, -tyMax, 0),
    }));
  },

  setMaxTranslate(txMax, tyMax) {
    set({ txMax, tyMax });
  },
}));

export { useEditorViewport };
