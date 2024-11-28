'use client';

import { Sprite, Stage } from '@pixi/react';
import { Texture } from 'pixi.js';

import { useElementSize } from '@/hooks/useResizeObserver';

import { EditorView } from './EditorView';

export function EditorRoot() {
  const { ref, width, height } = useElementSize();

  return (
    <div className="grow bg-slate-200 dark:bg-slate-800" ref={ref}>
      <Stage
        width={width}
        height={height}
        options={{
          antialias: true,
          backgroundAlpha: 0,
          eventMode: 'static',
        }}
      >
        <Sprite width={width} height={height} texture={Texture.EMPTY} />
        <EditorView />
      </Stage>
    </div>
  );
}
