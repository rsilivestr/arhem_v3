import { Container, Graphics, Text } from '@pixi/react';
import { TextStyle } from 'pixi.js';
import { useState } from 'react';

import {
  EDITOR_CELL_HEIGHT,
  EDITOR_CELL_PADDING,
  EDITOR_CELL_RADIUS,
  EDITOR_CELL_WIDTH,
} from '@/config';
import { useTheme } from '@/hooks/useTheme';
import { useEditorGrid } from '@/store/editor/grid';
import { GameStep } from '@/types';

const ICON_SIZE = Math.ceil(EDITOR_CELL_HEIGHT / 2.5);
const ICON_STROKE = Math.ceil(ICON_SIZE / 10);
const STROKE_OFFSET = (ICON_SIZE - ICON_STROKE) / 2;
const ICON_TOP = (EDITOR_CELL_HEIGHT - ICON_SIZE) / 2;
const ICON_LEFT = (EDITOR_CELL_WIDTH - ICON_SIZE) / 2;
const LINE_OFFSET = 28;

type Props = {
  x: number;
  y: number;
  col: number;
  row: number;
  step: GameStep | null;
};

const styles = {
  address: new TextStyle({
    fontSize: 12,
    lineHeight: 24,
    fill: '#abc',
  }),
  name: new TextStyle({
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    fill: '#fff',
  }),
  code: new TextStyle({
    fontSize: 16,
    lineHeight: 24,
    fill: '#bcd',
  }),
  text: new TextStyle({
    fontSize: 16,
    lineHeight: 24,
    fill: '#fff',
    wordWrap: true,
    wordWrapWidth: EDITOR_CELL_WIDTH - 2 * EDITOR_CELL_PADDING,
  }),
};

export function EditorGridCell({ x, y, col, row, step }: Props) {
  const { colors } = useTheme();
  const { activeCell, setActiveCell } = useEditorGrid();
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = col === activeCell?.col && row === activeCell?.row;

  return (
    <Container x={x} y={y}>
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(isHovered ? colors.cell.hover : colors.cell.main);
          if (isSelected) {
            g.lineStyle({ width: 3, color: colors.cell.border });
          }
          g.drawRoundedRect(
            0,
            0,
            EDITOR_CELL_WIDTH,
            EDITOR_CELL_HEIGHT,
            EDITOR_CELL_RADIUS
          );
          g.endFill();
        }}
        cursor="pointer"
        onpointerenter={() => setIsHovered(true)}
        onpointerleave={() => setIsHovered(false)}
        onclick={() => {
          if (!isSelected) {
            setActiveCell({ col, row });
          }
        }}
      />
      <Text
        x={EDITOR_CELL_WIDTH - EDITOR_CELL_PADDING}
        y={EDITOR_CELL_PADDING}
        anchor={[1, 0]}
        text={`${col} : ${row}`}
        style={styles.address}
        eventMode="none"
      />
      {step ? (
        <>
          <Text
            x={EDITOR_CELL_PADDING}
            y={EDITOR_CELL_PADDING}
            text={step.name}
            style={styles.name}
            eventMode="none"
          />
          <Text
            x={EDITOR_CELL_PADDING}
            y={EDITOR_CELL_PADDING + LINE_OFFSET}
            text={step.code}
            style={styles.code}
            eventMode="none"
          />
          <Text
            x={EDITOR_CELL_PADDING}
            y={EDITOR_CELL_PADDING + 2 * LINE_OFFSET}
            text={step.text}
            style={styles.text}
            eventMode="none"
          />
        </>
      ) : (
        <Graphics
          x={ICON_LEFT}
          y={ICON_TOP}
          draw={(g) => {
            g.clear();
            g.beginFill(colors.cell.icon);
            g.drawRect(STROKE_OFFSET, 0, ICON_STROKE, ICON_SIZE);
            g.drawRect(0, STROKE_OFFSET, ICON_SIZE, ICON_STROKE);
            g.endFill();
          }}
          eventMode="none"
        />
      )}
    </Container>
  );
}
