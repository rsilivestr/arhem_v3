'use client';

import { Stage } from '@pixi/react';

import { useElementSize } from '../hooks/useResizeObserver';
import { EventStepView } from './EventStepView';

export function EditorView() {
  const { ref, width, height } = useElementSize();

  return (
    <div className="grow bg-slate-200 dark:bg-slate-800" ref={ref}>
      <Stage
        width={width}
        height={height}
        options={{
          antialias: true,
          backgroundAlpha: 0,
        }}
      >
        <EventStepView id="abc" text="hello world!" position={[100, 500]} />
      </Stage>
    </div>
  );
}
