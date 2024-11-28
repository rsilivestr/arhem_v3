import { FederatedWheelEvent } from '@pixi/events';
import { useApp } from '@pixi/react';
import { useEffect } from 'react';

import { EventButton } from '@/constants';
import { useEditorViewport } from '@/store/editor/viewport';

import { usePointerDrag } from './usePointerDrag';

export function useViewportTransform() {
  const app = useApp();
  const { tx, ty, translate } = useEditorViewport();

  useEffect(() => {
    const stage = app.stage;
    if (!stage) {
      return;
    }
    const handleWheel = ({ deltaY, shiftKey }: FederatedWheelEvent) => {
      const dirMod = deltaY > 0 ? -1 : 1;
      if (shiftKey) {
        translate(250 * dirMod, 0);
      } else {
        translate(0, 150 * dirMod);
      }
    };
    stage.on('wheel', handleWheel);
    return () => {
      stage.off('wheel', handleWheel);
    };
    // Callback can be safely omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.stage]);

  usePointerDrag(
    {
      handlePointerDown(e, setState) {
        if (e.button !== EventButton.Middle || e.defaultPrevented) {
          return;
        }
        e.preventDefault();
        setState(true);
      },
      handlePointerMove(e) {
        if (e.defaultPrevented) {
          return;
        }
        e.preventDefault();
        translate(e.movementX, e.movementY);
      },
    },
    []
  );

  return { tx, ty };
}
