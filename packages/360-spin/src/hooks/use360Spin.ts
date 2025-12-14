/**
 * use360Spin Hook - Control 360 spin viewer with drag-based rotation and auto-animation
 * Implements requestAnimationFrame-based rotation as per IMPLEMENTATION_GUIDE.md
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { SpinViewerState, SpinConfig } from '../types';

export interface Use360SpinOptions extends SpinConfig {
  /** Callback when animation starts */
  onAnimationStart?: () => void;
  /** Callback when animation ends */
  onAnimationEnd?: () => void;
  /** Callback when frame changes */
  onFrameChange?: (frame: number) => void;
}

export function use360Spin(totalFrames: number, options: Use360SpinOptions = {}) {
  const {
    sensitivity = 8,
    frameRate = 30,
    direction = 'clockwise',
    onAnimationStart,
    onAnimationEnd,
    onFrameChange
  } = options;

  const [state, setState] = useState<SpinViewerState>({
    currentFrame: 0,
    isDragging: false,
    isAnimating: false,
    isLoading: true,
    loadProgress: 0
  });

  // Refs for animation control
  const lastXRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const startFrameRef = useRef(0);

  // Frame delay based on frame rate (e.g., 30 FPS = 33.33ms per frame)
  const frameDelay = 1000 / frameRate;

  // Go to specific frame
  const goToFrame = useCallback((frame: number) => {
    const normalizedFrame = ((frame % totalFrames) + totalFrames) % totalFrames;
    setState(prev => {
      if (prev.currentFrame !== normalizedFrame) {
        onFrameChange?.(normalizedFrame);
        return { ...prev, currentFrame: normalizedFrame };
      }
      return prev;
    });
  }, [totalFrames, onFrameChange]);

  // Next/previous frame helpers
  const nextFrame = useCallback(() => {
    setState(prev => {
      const newFrame = (prev.currentFrame + 1) % totalFrames;
      onFrameChange?.(newFrame);
      return { ...prev, currentFrame: newFrame };
    });
  }, [totalFrames, onFrameChange]);

  const prevFrame = useCallback(() => {
    setState(prev => {
      const newFrame = ((prev.currentFrame - 1) + totalFrames) % totalFrames;
      onFrameChange?.(newFrame);
      return { ...prev, currentFrame: newFrame };
    });
  }, [totalFrames, onFrameChange]);

  // Start auto-animation using requestAnimationFrame
  const startAnimation = useCallback(() => {
    // Check if already animating via ref to avoid stale closure
    if (animationFrameRef.current !== null) return;

    setState(prev => ({ ...prev, isAnimating: true }));
    onAnimationStart?.();
    lastFrameTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTimeRef.current;

      if (elapsed >= frameDelay) {
        setState(prev => {
          // Calculate frame step based on direction
          const step = direction === 'clockwise' ? 1 : -1;
          const newFrame = ((prev.currentFrame + step) % totalFrames + totalFrames) % totalFrames;
          onFrameChange?.(newFrame);
          return { ...prev, currentFrame: newFrame };
        });
        lastFrameTimeRef.current = currentTime;
      }

      // Continue animation loop only if ref is still set
      if (animationFrameRef.current !== null) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [frameDelay, direction, totalFrames, onAnimationStart, onFrameChange]);

  // Stop auto-animation
  const stopAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setState(prev => {
      if (prev.isAnimating) {
        onAnimationEnd?.();
        return { ...prev, isAnimating: false };
      }
      return prev;
    });
  }, [onAnimationEnd]);

  // Toggle animation
  const toggleAnimation = useCallback(() => {
    if (state.isAnimating) {
      stopAnimation();
    } else {
      startAnimation();
    }
  }, [state.isAnimating, startAnimation, stopAnimation]);

  // Drag-to-spin: Start drag
  const startDrag = useCallback((clientX: number) => {
    // Stop any running animation when user starts dragging
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setState(prev => ({ ...prev, isDragging: true, isAnimating: false }));
    lastXRef.current = clientX;
    accumulatedDeltaRef.current = 0;
    startFrameRef.current = state.currentFrame;
  }, [state.currentFrame]);

  // Drag-to-spin: Move drag
  const moveDrag = useCallback((clientX: number) => {
    if (!state.isDragging) return;

    const deltaX = clientX - lastXRef.current;
    accumulatedDeltaRef.current += deltaX;

    // Calculate frame delta based on sensitivity
    const frameDelta = Math.floor(accumulatedDeltaRef.current / sensitivity);

    if (frameDelta !== 0) {
      setState(prev => {
        const newFrame = ((prev.currentFrame + frameDelta) % totalFrames + totalFrames) % totalFrames;
        onFrameChange?.(newFrame);
        return { ...prev, currentFrame: newFrame };
      });
      accumulatedDeltaRef.current = accumulatedDeltaRef.current % sensitivity;
    }

    lastXRef.current = clientX;
  }, [state.isDragging, sensitivity, totalFrames, onFrameChange]);

  // Drag-to-spin: End drag
  const endDrag = useCallback(() => {
    setState(prev => ({ ...prev, isDragging: false }));
    accumulatedDeltaRef.current = 0;
  }, []);

  // Set loading state
  const setLoading = useCallback((isLoading: boolean, progress?: number) => {
    setState(prev => ({
      ...prev,
      isLoading,
      loadProgress: progress ?? (isLoading ? 0 : 100)
    }));
  }, []);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    // State
    ...state,
    totalFrames,

    // Frame navigation
    goToFrame,
    nextFrame,
    prevFrame,

    // Animation control
    startAnimation,
    stopAnimation,
    toggleAnimation,

    // Drag control
    startDrag,
    moveDrag,
    endDrag,

    // Loading
    setLoading
  };
}

