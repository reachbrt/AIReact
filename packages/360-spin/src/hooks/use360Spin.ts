/**
 * use360Spin Hook - Control 360 spin viewer with drag-based rotation
 */

import { useState, useCallback, useRef } from 'react';
import { SpinViewerState, SpinConfig } from '../types';

export function use360Spin(totalFrames: number, config: SpinConfig = {}) {
  const { sensitivity = 8 } = config;

  const [state, setState] = useState<SpinViewerState>({
    currentFrame: 0,
    isDragging: false
  });

  const lastXRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);

  const goToFrame = useCallback((frame: number) => {
    const normalizedFrame = ((frame % totalFrames) + totalFrames) % totalFrames;
    setState(prev => ({ ...prev, currentFrame: normalizedFrame }));
  }, [totalFrames]);

  const nextFrame = useCallback(() => {
    goToFrame(state.currentFrame + 1);
  }, [state.currentFrame, goToFrame]);

  const prevFrame = useCallback(() => {
    goToFrame(state.currentFrame - 1);
  }, [state.currentFrame, goToFrame]);

  const startDrag = useCallback((clientX: number) => {
    setState(prev => ({ ...prev, isDragging: true }));
    lastXRef.current = clientX;
    accumulatedDeltaRef.current = 0;
  }, []);

  const moveDrag = useCallback((clientX: number) => {
    if (!state.isDragging) return;

    const deltaX = clientX - lastXRef.current;
    accumulatedDeltaRef.current += deltaX;

    const frameDelta = Math.floor(accumulatedDeltaRef.current / sensitivity);

    if (frameDelta !== 0) {
      setState(prev => ({
        ...prev,
        currentFrame: ((prev.currentFrame + frameDelta) % totalFrames + totalFrames) % totalFrames
      }));
      accumulatedDeltaRef.current = accumulatedDeltaRef.current % sensitivity;
    }

    lastXRef.current = clientX;
  }, [state.isDragging, sensitivity, totalFrames]);

  const endDrag = useCallback(() => {
    setState(prev => ({ ...prev, isDragging: false }));
    accumulatedDeltaRef.current = 0;
  }, []);

  return {
    ...state,
    goToFrame,
    nextFrame,
    prevFrame,
    startDrag,
    moveDrag,
    endDrag,
    totalFrames
  };
}

