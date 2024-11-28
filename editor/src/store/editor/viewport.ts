import { create } from 'zustand';

type EditorViewport = {
  tx: number;
  ty: number;
  translate(dx: number, dy: number): void;
};

const useEditorViewport = create<EditorViewport>((set) => ({
  tx: 0,
  ty: 0,

  translate(dx, dy) {
    set(({ tx, ty }) => ({
      tx: Math.min(0, tx + dx),
      ty: Math.min(0, ty + dy),
    }));
  },
}));

export { useEditorViewport };
