/**
 * DocumentScanner Component - Scan and extract data from documents
 */

import React, { useState, useRef, useCallback } from 'react';
import { DocumentScannerProps } from '../types';
import { useDocumentExtractor } from '../hooks/useDocumentExtractor';
import '../styles/doc-intelligence.css';

export const DocumentScanner: React.FC<DocumentScannerProps> = ({
  onExtract,
  onError,
  extractFields,
  showPreview = true,
  theme = 'light',
  className = ''
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { extractFromFile, isProcessing, lastResult } = useDocumentExtractor();

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      onError?.(new Error('Please upload an image or PDF file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const result = await extractFromFile(file, extractFields);
      onExtract(result);
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Extraction failed'));
    }
  }, [extractFromFile, extractFields, onExtract, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className={`reactai-doc-scanner ${theme === 'dark' ? 'dark' : ''} ${className}`}>
      <div
        className={`reactai-doc-dropzone ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: 'none' }} />
        
        {showPreview && preview ? (
          <img src={preview} alt="Document preview" className="reactai-doc-preview" />
        ) : (
          <div className="reactai-doc-placeholder">
            <svg className="reactai-doc-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
            </svg>
            <p>Drop document here or click to upload</p>
          </div>
        )}

        {isProcessing && (
          <div className="reactai-doc-loading">
            <div className="reactai-doc-spinner" />
            <span>Extracting data...</span>
          </div>
        )}
      </div>

      {lastResult && (
        <div className="reactai-doc-results">
          <h4>Extracted Fields</h4>
          {lastResult.fields.map((field, idx) => (
            <div key={idx} className="reactai-doc-field">
              <span className="field-name">{field.name}</span>
              <span className="field-value">{field.value}</span>
              <span className="field-confidence">{Math.round(field.confidence * 100)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

