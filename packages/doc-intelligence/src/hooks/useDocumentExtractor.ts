/**
 * useDocumentExtractor Hook - Extract data from documents using AI
 */

import { useState, useCallback } from 'react';
import { ExtractedDocument, DocumentExtractorConfig, DocumentField } from '../types';

export function useDocumentExtractor(_config: DocumentExtractorConfig = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResult, setLastResult] = useState<ExtractedDocument | null>(null);

  const extractFromImage = useCallback(async (_imageData: string, fields?: string[]): Promise<ExtractedDocument> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate AI extraction (in real implementation, call AI API)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockFields: DocumentField[] = [
        { name: 'date', value: '2024-01-15', confidence: 0.95 },
        { name: 'total', value: '$125.00', confidence: 0.92 },
        { name: 'vendor', value: 'Sample Company', confidence: 0.88 },
      ];

      const result: ExtractedDocument = {
        id: `doc_${Date.now()}`,
        type: 'invoice',
        fields: fields ? mockFields.filter(f => fields.includes(f.name)) : mockFields,
        rawText: 'Sample extracted text from document...',
        confidence: 0.91,
        processedAt: new Date()
      };

      setLastResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Extraction failed');
      setError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const extractFromFile = useCallback(async (file: File, fields?: string[]): Promise<ExtractedDocument> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = await extractFromImage(e.target?.result as string, fields);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, [extractFromImage]);

  return {
    extractFromImage,
    extractFromFile,
    isProcessing,
    error,
    lastResult
  };
}

