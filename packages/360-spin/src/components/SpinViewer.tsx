/**
 * SpinViewer Component - 360° product viewer like Ortery
 * Drag to rotate with smooth turntable-style interaction
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SpinViewerProps } from '../types';
import '../styles/360-spin.css';

export const SpinViewer: React.FC<SpinViewerProps> = ({
  images,
  width = '100%',
  height = 400,
  sensitivity = 8,
  reverse = false,
  onFrameChange,
  theme = 'light',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const lastXRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);

  const totalFrames = images.length;

  // Preload all images for smooth rotation
  useEffect(() => {
    if (images.length === 0) return;

    setImagesLoaded(false);
    setLoadProgress(0);

    // Check if images are base64 data URLs (already loaded)
    const areBase64Images = images.every(src => src.startsWith('data:'));
    if (areBase64Images) {
      setImagesLoaded(true);
      setLoadProgress(100);
      return;
    }

    let loadedCount = 0;
    const imageElements: HTMLImageElement[] = [];

    images.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / images.length) * 100));
        if (loadedCount === images.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / images.length) * 100));
        if (loadedCount === images.length) {
          setImagesLoaded(true);
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
  }, [images]);

  // Notify parent of frame changes
  useEffect(() => {
    onFrameChange?.(currentFrame);
  }, [currentFrame, onFrameChange]);

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    lastXRef.current = e.clientX;
    accumulatedDeltaRef.current = 0;
  }, []);

  // Handle drag move - rotate product based on mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !imagesLoaded || totalFrames === 0) return;

    const deltaX = e.clientX - lastXRef.current;
    accumulatedDeltaRef.current += deltaX;

    const direction = reverse ? -1 : 1;
    const frameDelta = Math.floor(accumulatedDeltaRef.current / sensitivity) * direction;

    if (frameDelta !== 0) {
      setCurrentFrame(prev => {
        const newFrame = ((prev + frameDelta) % totalFrames + totalFrames) % totalFrames;
        return newFrame;
      });
      accumulatedDeltaRef.current = accumulatedDeltaRef.current % sensitivity;
    }

    lastXRef.current = e.clientX;
  }, [isDragging, imagesLoaded, sensitivity, reverse, totalFrames]);

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    accumulatedDeltaRef.current = 0;
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      accumulatedDeltaRef.current = 0;
    }
  }, [isDragging]);

  // Handle touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    lastXRef.current = e.touches[0].clientX;
    accumulatedDeltaRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !imagesLoaded || totalFrames === 0) return;

    const deltaX = e.touches[0].clientX - lastXRef.current;
    accumulatedDeltaRef.current += deltaX;

    const direction = reverse ? -1 : 1;
    const frameDelta = Math.floor(accumulatedDeltaRef.current / sensitivity) * direction;

    if (frameDelta !== 0) {
      setCurrentFrame(prev => {
        const newFrame = ((prev + frameDelta) % totalFrames + totalFrames) % totalFrames;
        return newFrame;
      });
      accumulatedDeltaRef.current = accumulatedDeltaRef.current % sensitivity;
    }

    lastXRef.current = e.touches[0].clientX;
  }, [isDragging, imagesLoaded, sensitivity, reverse, totalFrames]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    accumulatedDeltaRef.current = 0;
  }, []);

  // Show loading state while images preload
  if (!imagesLoaded && images.length > 0) {
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

  // Clean product display - drag left/right to rotate (like Ortery)
  return (
    <div
      ref={containerRef}
      className={`reactai-spin-viewer ${theme === 'dark' ? 'dark' : ''} ${isDragging ? 'dragging' : ''} ${className}`}
      style={{
        width,
        height,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={images[currentFrame]}
        alt={`360 view frame ${currentFrame + 1} of ${totalFrames}`}
        className="reactai-spin-image"
        draggable={false}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

