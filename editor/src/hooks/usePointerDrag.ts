/* eslint-disable react-hooks/exhaustive-deps */
import { Container, PixiRef, useApp } from '@pixi/react';
import { FederatedPointerEvent } from 'pixi.js';
import { DependencyList, RefObject, useEffect, useState } from 'react';

type Params<T> = {
  elementRef?: RefObject<PixiRef<typeof Container>>;
  handlePointerDown: (
    e: FederatedPointerEvent,
    startDrag: (state: T | null) => void
  ) => void;
  handlePointerMove: (e: FederatedPointerEvent, state: T) => void;
  handlePointerUp?: (e: FederatedPointerEvent, state: T) => void;
};

export function usePointerDrag<T>(
  {
    elementRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }: Params<T>,
  // Pass common dependencies instead of wrapping handlers in useCallback
  // Take care when passing dependencies since eslint won't check this hook
  deps: DependencyList
) {
  const app = useApp();

  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    const eventTarget = elementRef?.current ?? app.stage;

    const onDown = (e: FederatedPointerEvent) => {
      // The user is responsible to start movement
      handlePointerDown(e, setState);
    };

    eventTarget.on('pointerdown', onDown);

    return () => {
      eventTarget.off('pointerdown', onDown);
    };
  }, [app, ...deps]);

  useEffect(() => {
    if (!state) return;

    const onMove = (e: FederatedPointerEvent) => {
      handlePointerMove(e, state);
    };

    const onUp = (e: FederatedPointerEvent) => {
      // We always finish the movement to prevent leaking drag
      // state is cleared before executing user callback to avoid dealing with exceptions
      setState(null);
      handlePointerUp?.(e, state);
    };

    app.stage.on('globalpointermove', onMove);
    app.stage.on('pointerup', onUp);
    app.stage.on('pointerupoutside', onUp);

    return () => {
      app.stage.off('globalpointermove', onMove);
      app.stage.off('pointerup', onUp);
      app.stage.off('pointerupoutside', onUp);
    };
  }, [app, state, ...deps]);

  return state;
}
