/**
 * SpinGenerator Component - Upload an image and generate 360° view
 * Creates e-commerce quality 360° product views from a single product photo
 */

import React, { useRef, useCallback, useState } from 'react';
import { SpinGeneratorProps } from '../types';
import { useSpinGenerator } from '../hooks/useSpinGenerator';
import { SpinViewer } from './SpinViewer';
import '../styles/360-spin.css';

export const SpinGenerator: React.FC<SpinGeneratorProps> = ({
  apiKey,
  onGenerate,
  onError,
  numFrames = 8,
  width = '100%',
  height = 400,
  showViewer = true,
  background = 'white',
  quality = 'standard',
  theme = 'light',
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFrames, setSelectedFrames] = useState<number>(numFrames);
  const [selectedBackground, setSelectedBackground] = useState<'white' | 'transparent' | 'studio'>(background);
  const [selectedQuality, setSelectedQuality] = useState<'standard' | 'hd'>(quality);

  const {
    sourceImage,
    generatedImages,
    isGenerating,
    progress,
    currentStep,
    error,
    setSourceImage,
    clearSourceImage,
    generate360View
  } = useSpinGenerator({ apiKey, onGenerate, onError });

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setSourceImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  }, [setSourceImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setSourceImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  }, [setSourceImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleGenerate = useCallback(() => {
    generate360View({
      numFrames: selectedFrames,
      background: selectedBackground,
      quality: selectedQuality
    });
  }, [generate360View, selectedFrames, selectedBackground, selectedQuality]);

  // Show the 360 viewer if we have generated images and generation is complete
  if (generatedImages.length > 0 && !isGenerating && showViewer) {
    return (
      <div className={`reactai-spin-generator ${theme === 'dark' ? 'dark' : ''} ${className}`}>
        <div className="reactai-spin-generator-header">
          <h3>🎉 360° View Generated!</h3>
          <div className="reactai-spin-header-actions">
            <span className="reactai-spin-frame-count">{generatedImages.length} frames</span>
            <button onClick={clearSourceImage} className="reactai-spin-reset-btn">
              ↺ New Product
            </button>
          </div>
        </div>
        <SpinViewer
          images={generatedImages}
          width={width}
          height={height}
          sensitivity={8}
          theme={theme}
        />
        <div className="reactai-spin-download-section">
          <p>↔ Drag to rotate the product</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`reactai-spin-generator ${theme === 'dark' ? 'dark' : ''} ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="reactai-spin-file-input"
      />

      {!sourceImage ? (
        <div
          className="reactai-spin-upload-zone"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ width, height }}
        >
          <div className="reactai-spin-upload-content">
            <span className="reactai-spin-upload-icon">📸</span>
            <h3>Upload Product Image</h3>
            <p>Drop a product photo here or click to browse</p>
            <p className="reactai-spin-upload-hint">AI will generate 360° views automatically</p>
          </div>
        </div>
      ) : (
        <div className="reactai-spin-preview" style={{ width }}>
          <div className="reactai-spin-preview-image" style={{ height }}>
            <img src={sourceImage} alt="Product to generate 360 view" />
            {isGenerating && (
              <div className="reactai-spin-generating-overlay">
                <div className="reactai-spin-generating-content">
                  <div className="reactai-spin-spinner"></div>
                  <p className="reactai-spin-step">{currentStep}</p>
                  <div className="reactai-spin-progress-container">
                    <div className="reactai-spin-progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="reactai-spin-progress-text">{Math.round(progress)}%</span>
                  {generatedImages.length > 0 && (
                    <div className="reactai-spin-preview-thumbnails">
                      {generatedImages.slice(-4).map((img, i) => (
                        <img key={i} src={img} alt={`Preview ${i}`} className="reactai-spin-thumb" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="reactai-spin-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          {!isGenerating && (
            <div className="reactai-spin-options">
              <div className="reactai-spin-option-group">
                <label>Frames</label>
                <select
                  value={selectedFrames}
                  onChange={(e) => setSelectedFrames(Number(e.target.value) as 8 | 12 | 16 | 24 | 36)}
                >
                  <option value={8}>8 frames (fast)</option>
                  <option value={12}>12 frames</option>
                  <option value={16}>16 frames</option>
                  <option value={24}>24 frames (smooth)</option>
                  <option value={36}>36 frames (premium)</option>
                </select>
              </div>
              <div className="reactai-spin-option-group">
                <label>Background</label>
                <select
                  value={selectedBackground}
                  onChange={(e) => setSelectedBackground(e.target.value as 'white' | 'transparent' | 'studio')}
                >
                  <option value="white">White</option>
                  <option value="studio">Studio</option>
                  <option value="transparent">Light Gradient</option>
                </select>
              </div>
              <div className="reactai-spin-option-group">
                <label>Quality</label>
                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value as 'standard' | 'hd')}
                >
                  <option value="standard">Standard</option>
                  <option value="hd">HD (slower)</option>
                </select>
              </div>
            </div>
          )}

          <div className="reactai-spin-actions">
            <button onClick={clearSourceImage} className="reactai-spin-btn-secondary" disabled={isGenerating}>
              ✕ Remove
            </button>
            <button onClick={handleGenerate} className="reactai-spin-btn-primary" disabled={isGenerating}>
              {isGenerating ? '⏳ Generating...' : '🔄 Generate 360° View'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

