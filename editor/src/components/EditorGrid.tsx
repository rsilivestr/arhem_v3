import { Container } from '@pixi/react';
import { useMemo } from 'react';

import { EditorGridCell } from '@/components/EditorGridCell';
import {
  EDITOR_CELL_HEIGHT,
  EDITOR_CELL_WIDTH,
  EDITOR_GRID_GAP_X,
  EDITOR_GRID_GAP_Y,
  EDITOR_PADDING,
} from '@/config';
import { useEditorGrid } from '@/store/editor/grid';
import { GameStep } from '@/types';

const colOffset = EDITOR_CELL_WIDTH + EDITOR_GRID_GAP_X;
const rowOffset = EDITOR_CELL_HEIGHT + EDITOR_GRID_GAP_Y;

export function EditorGrid() {
  const grid = useEditorGrid();
  const cells: (GameStep | null)[] = useMemo(() => {
    if (!grid.event) {
      return [];
    }
    const _cells = Array(grid.event.max_cols * grid.event.max_rows).fill(null);
    grid.steps.forEach(({ step }) => {
      console.log(step);
      const stepIndex = (step.row - 1) * grid.event!.max_cols + (step.col - 1);
      console.log(stepIndex);
      _cells[stepIndex] = step;
    });
    return _cells;
  }, [grid.event, grid.steps]);

  return (
    <Container x={EDITOR_PADDING} y={EDITOR_PADDING}>
      {grid.event &&
        cells.map((step, index) => {
          const colIndex = index % grid.event!.max_cols;
          const rowIndex = Math.floor(index / grid.event!.max_rows);
          return (
            <EditorGridCell
              key={`${colIndex}/${rowIndex}`}
              x={colIndex * colOffset}
              y={rowIndex * rowOffset}
              col={colIndex + 1}
              row={rowIndex + 1}
              step={step}
            />
          );
        })}
    </Container>
  );
}
