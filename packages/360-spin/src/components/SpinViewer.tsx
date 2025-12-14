/**
 * SpinViewer Component - 360° product viewer with auto-rotation and drag-to-spin
 * Implements the product rotation logic from IMPLEMENTATION_GUIDE.md:
 * - Static image shown when not animating
 * - Frame sequence animation on hover/click/auto trigger
 * - Drag-to-spin interaction
 * - requestAnimationFrame-based smooth rotation
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { SpinViewerProps } from '../types';
import { use360Spin } from '../hooks/use360Spin';
import '../styles/360-spin.css';

export const SpinViewer: React.FC<SpinViewerProps> = ({
  staticImage,
  images,
  width = '100%',
  height = 400,
  trigger = 'manual',
  frameRate = 30,
  direction = 'clockwise',
  sensitivity = 8,
  reverse = false,
  enableDragSpin = true,
  onFrameChange,
  onAnimationStart,
  onAnimationEnd,
  theme = 'light',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalFrames = images.length;

  // Use the 360 spin hook for state and animation control
  const {
    currentFrame,
    isDragging,
    isAnimating,
    isLoading,
    loadProgress,
    startAnimation,
    stopAnimation,
    startDrag,
    moveDrag,
    endDrag,
    setLoading
  } = use360Spin(totalFrames, {
    sensitivity,
    frameRate,
    direction: reverse ? (direction === 'clockwise' ? 'counterclockwise' : 'clockwise') : direction,
    onFrameChange,
    onAnimationStart,
    onAnimationEnd
  });

  // Preload all images for smooth rotation
  useEffect(() => {
    if (images.length === 0) return;

    setLoading(true, 0);

    // Check if images are base64 data URLs (already loaded)
    const areBase64Images = images.every(src => src.startsWith('data:'));
    if (areBase64Images) {
      setLoading(false, 100);
      return;
    }

    let loadedCount = 0;
    const imageElements: HTMLImageElement[] = [];

    images.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / images.length) * 100);
        if (loadedCount === images.length) {
          setLoading(false, 100);
        } else {
          setLoading(true, progress);
        }
      };
      img.onerror = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / images.length) * 100);
        if (loadedCount === images.length) {
          setLoading(false, 100);
        } else {
          setLoading(true, progress);
        }
      };
      img.src = src;
      imageElements.push(img);
    });

    return () => {
      imageElements.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [images, setLoading]);

  // Auto-start animation if trigger is 'auto'
  useEffect(() => {
    if (trigger === 'auto' && !isLoading && totalFrames > 0) {
      startAnimation();
    }
  }, [trigger, isLoading, totalFrames, startAnimation]);

  // Handle mouse enter - start animation on hover
  const handleMouseEnter = useCallback(() => {
    if (trigger === 'hover' && !isLoading) {
      startAnimation();
    }
  }, [trigger, isLoading, startAnimation]);

  // Handle mouse leave - stop animation on hover end
  const handleMouseLeave = useCallback(() => {
    if (trigger === 'hover') {
      stopAnimation();
    }
    if (isDragging) {
      endDrag();
    }
  }, [trigger, isDragging, stopAnimation, endDrag]);

  // Handle click - toggle animation on click
  const handleClick = useCallback(() => {
    if (trigger === 'click' && !isDragging) {
      if (isAnimating) {
        stopAnimation();
      } else {
        startAnimation();
      }
    }
  }, [trigger, isDragging, isAnimating, startAnimation, stopAnimation]);

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enableDragSpin) return;
    e.preventDefault();
    startDrag(e.clientX);
  }, [enableDragSpin, startDrag]);

  // Handle drag move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableDragSpin || isLoading || totalFrames === 0) return;
    moveDrag(e.clientX);
  }, [enableDragSpin, isLoading, totalFrames, moveDrag]);

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    if (!enableDragSpin) return;
    endDrag();
  }, [enableDragSpin, endDrag]);

  // Handle touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableDragSpin) return;
    startDrag(e.touches[0].clientX);
  }, [enableDragSpin, startDrag]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enableDragSpin || isLoading || totalFrames === 0) return;
    moveDrag(e.touches[0].clientX);
  }, [enableDragSpin, isLoading, totalFrames, moveDrag]);

  const handleTouchEnd = useCallback(() => {
    if (!enableDragSpin) return;
    endDrag();
  }, [enableDragSpin, endDrag]);

  // Determine which image to show
  const getDisplayImage = (): string => {
    // If animating or dragging, show current frame
    if (isAnimating || isDragging) {
      return images[currentFrame] || staticImage || '';
    }
    // Otherwise show static image (or first frame if no static image)
    return staticImage || images[0] || '';
  };

  // Show loading state while images preload
  if (isLoading && images.length > 0) {
    return (
      <div
        className={`reactai-spin-viewer ${theme === 'dark' ? 'dark' : ''} loading ${className}`}
        style={{ width, height }}
      >
        <div className="reactai-spin-loading">
          <div className="reactai-spin-loading-spinner"></div>
          <span>Loading 360° view... {loadProgress}%</span>
        </div>
      </div>
    );
  }

  // Determine cursor based on state and settings
  const getCursor = (): string => {
    if (!enableDragSpin) {
      return trigger === 'click' ? 'pointer' : 'default';
    }
    return isDragging ? 'grabbing' : 'grab';
  };

  // Main viewer with all interaction handlers
  return (
    <div
      ref={containerRef}
      className={`reactai-spin-viewer ${theme === 'dark' ? 'dark' : ''} ${isDragging ? 'dragging' : ''} ${isAnimating ? 'animating' : ''} ${className}`}
      style={{
        width,
        height,
        cursor: getCursor(),
        userSelect: 'none'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={getDisplayImage()}
        alt={`360 view frame ${currentFrame + 1} of ${totalFrames}`}
        className="reactai-spin-image"
        draggable={false}
        style={{ pointerEvents: 'none' }}
      />

      {/* Hint overlay for hover trigger */}
      {trigger === 'hover' && !isAnimating && !isDragging && (
        <div className="reactai-spin-hint">
          Hover to spin
        </div>
      )}

      {/* Hint overlay for click trigger */}
      {trigger === 'click' && !isAnimating && !isDragging && (
        <div className="reactai-spin-hint">
          Click to spin
        </div>
      )}

      {/* Frame indicator */}
      {(isAnimating || isDragging) && (
        <div className="reactai-spin-frame-indicator">
          {currentFrame + 1} / {totalFrames}
        </div>
      )}
    </div>
  );
};

