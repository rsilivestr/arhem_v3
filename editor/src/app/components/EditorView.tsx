'use client';

import { Stage } from '@pixi/react';
import { useElementSize, } from '../hooks/useResizeObserver';
import { EventStepView } from './EventStepView';

export function EditorView() {
  const { ref, width, height } = useElementSize();

  return (
    <div className="w-full bg-slate-900 grow-[1]" ref={ref}>
      <Stage
        width={width}
        height={height}
        options={{
          antialias: true,
          backgroundAlpha: 0.25,
          backgroundColor: '#888',
        }}
      >
        <EventStepView id='abc' text='hello world!' position={[0,0]} />
      </Stage>
    </div>
  );
}
