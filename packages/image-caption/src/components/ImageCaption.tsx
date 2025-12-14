/**
 * ImageCaption Component - AI-powered image captioning
 */

import React, { useState, useCallback, useRef } from 'react';
import { ImageCaptionProps } from '../types';
import { useImageCaption } from '../hooks/useImageCaption';
import '../styles/image-caption.css';

export const ImageCaption: React.FC<ImageCaptionProps> = ({
  apiKey,
  provider = 'openai',
  placeholder = 'Drop an image here or click to upload',
  style = 'descriptive',
  multiple = false,
  maxFileSize = 10,
  accept = 'image/*',
  theme = 'light',
  className = '',
  onCaptionGenerated,
  onError
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { generateCaption, isLoading, error, history } = useImageCaption({
    provider,
    apiKey,
    style
  });

  const handleFile = useCallback(async (file: File) => {
    if (file.size > maxFileSize * 1024 * 1024) {
      const err = new Error(`File size exceeds ${maxFileSize}MB limit`);
      onError?.(err);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setPreview(imageData);
      
      try {
        const result = await generateCaption(imageData, style);
        setCaption(result.caption);
        onCaptionGenerated?.(result);
      } catch (err) {
        onError?.(err instanceof Error ? err : new Error('Failed to generate caption'));
      }
    };
    reader.readAsDataURL(file);
  }, [generateCaption, maxFileSize, style, onCaptionGenerated, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(caption);
  };

  return (
    <div className={`reactai-image-caption ${theme === 'dark' ? 'dark' : ''} ${className}`}>
      <div
        className={`reactai-image-dropzone ${isDragging ? 'dragging' : ''} ${preview ? 'has-preview' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        
        {preview ? (
          <img src={preview} alt="Preview" className="reactai-image-preview" />
        ) : (
          <div className="reactai-dropzone-content">
            <svg className="reactai-upload-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
            </svg>
            <p>{placeholder}</p>
          </div>
        )}
        
        {isLoading && (
          <div className="reactai-loading-overlay">
            <div className="reactai-spinner" />
            <span>Generating caption...</span>
          </div>
        )}
      </div>

      {caption && (
        <div className="reactai-caption-result">
          <div className="reactai-caption-header">
            <span>Generated Caption</span>
            <button onClick={copyCaption} className="reactai-copy-btn">Copy</button>
          </div>
          <p className="reactai-caption-text">{caption}</p>
        </div>
      )}

      {error && (
        <div className="reactai-caption-error">
          {error.message}
        </div>
      )}

      {history.length > 1 && (
        <div className="reactai-caption-history">
          <h4>History ({history.length})</h4>
          {history.slice(-5).reverse().map((item, idx) => (
            <div key={idx} className="reactai-history-item">
              <span>{item.caption.substring(0, 50)}...</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

