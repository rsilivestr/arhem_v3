import { Container, Graphics } from '@pixi/react';
import { useMemo } from 'react';

import {
  EDITOR_CELL_HEIGHT,
  EDITOR_CELL_WIDTH,
  EDITOR_GRID_GAP,
  EDITOR_PADDING,
} from '@/config';
import { useEditorGrid } from '@/store/editor/grid';

const colOffset = EDITOR_CELL_WIDTH + EDITOR_GRID_GAP;
const rowOffset = EDITOR_CELL_HEIGHT + EDITOR_GRID_GAP;

export function EditorGrid() {
  const grid = useEditorGrid();
  const cells = useMemo(
    () => Array(grid.columns * grid.rows).fill(null),
    [grid.columns, grid.rows]
  );

  return (
    <Container x={EDITOR_PADDING} y={EDITOR_PADDING}>
      {cells.map((c, index) => {
        const colIndex = index % grid.columns;
        const rowIndex = Math.floor(index / grid.rows);
        return (
          <Graphics
            key={`${colIndex}/${rowIndex}`}
            x={colIndex * colOffset}
            y={rowIndex * rowOffset}
            draw={(g) => {
              g.clear();
              g.beginFill('#334155');
              g.drawRect(0, 0, EDITOR_CELL_WIDTH, EDITOR_CELL_HEIGHT);
              g.endFill();
            }}
          />
        );
      })}
    </Container>
  );
}
