import { TextMetrics, TextStyle } from 'pixi.js';
import { useMemo } from 'react';

import { EDITOR_CELL_PADDING, EDITOR_CELL_WIDTH } from '@/config';

type TextParams = {
  text: string;
  style: TextStyle;
  maxWidth?: number;
  maxLines?: number;
};

export function useClippedText({
  text,
  style,
  maxWidth = EDITOR_CELL_WIDTH - 2 * EDITOR_CELL_PADDING,
  maxLines = 2,
}: TextParams) {
  return useMemo(() => {
    const { width: letterWidth } = TextMetrics.measureText('x', style);
    const maxTextLineLength = Math.floor(maxWidth / letterWidth);
    const { lines } = TextMetrics.measureText(text, style);
    if (lines.length > maxLines) {
      lines.length = maxLines;
      const lastIndex = maxLines - 1;
      lines[lastIndex] = lines[lastIndex].replace(/[.,?!:;]+?$/g, '');
      if (lines[lastIndex].length + 3 > maxTextLineLength) {
        lines[lastIndex] = lines[lastIndex].replace(/[.,?!:;]?\s\w+?$/g, '');
      }
      lines[lastIndex] = `${lines[lastIndex]}...`;
    }
    return lines.join(' ');
  }, [text, style, maxWidth, maxLines]);
}
