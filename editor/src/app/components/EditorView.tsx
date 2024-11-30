import { Container } from '@pixi/react';

import { useViewportTransform } from '@/hooks/useViewportTransform';

import { EditorGrid } from './EditorGrid';

export function EditorView() {
  const { tx, ty } = useViewportTransform();

  return (
    <Container x={tx} y={ty}>
      <EditorGrid />
    </Container>
  );
}
