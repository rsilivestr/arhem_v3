import { Container, Graphics } from '@pixi/react';
import { useMemo } from 'react';

import { useEditorGrid } from '@/store/editor/grid';

const GRID_PADDING = 100;
const CELL = {
  width: 400,
  height: 200,
  gap: 200,
};

export function EditorGrid() {
  const grid = useEditorGrid();
  const cells = useMemo(
    () => Array(grid.columns * grid.rows).fill(null),
    [grid.columns, grid.rows]
  );

  return (
    <Container x={GRID_PADDING} y={GRID_PADDING}>
      {cells.map((c, index) => {
        const colIndex = (index % grid.columns)
        const rowIndex = Math.floor(index / grid.rows)
        return (
          <Graphics
            key={`${colIndex}/${rowIndex}`}
            x={colIndex * (CELL.width + CELL.gap)}
            y={rowIndex * (CELL.height + CELL.gap)}
            draw={(g) => {
              g.clear();
              g.beginFill('#334155');
              g.drawRect(0, 0, CELL.width, CELL.height);
              g.endFill();
            }}
          />
        );
      })}
    </Container>
  );
}
