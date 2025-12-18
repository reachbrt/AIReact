/**
 * useAiTransformations Hook
 * AI-powered data transformations (column, row, selection, table scope)
 * Based on ANGULAR_REACT_IMPLEMENTATION_GUIDE.md
 */

import { useState, useCallback } from 'react';
import {
  AITransformation,
  TransformationChange,
  UseAiTransformationsOptions
} from '../types';

/**
 * Interpolate placeholders in a template with data
 */
function interpolateTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = data[key];
    return value !== undefined ? String(value) : `{{${key}}}`;
  });
}

/**
 * Generate a mock transformation result for local use
 * In production, this would call the actual AI provider
 */
function generateLocalTransformation(
  transformation: AITransformation,
  values: any[],
  _columnKey?: string
): Record<string, any> {
  const mapping: Record<string, any> = {};
  
  // Simple local transformations based on transformation type
  if (transformation.id.includes('standardize') || transformation.id.includes('normalize')) {
    values.forEach(val => {
      // Simple standardization: uppercase first letter
      if (typeof val === 'string') {
        mapping[val] = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
      }
    });
  } else if (transformation.id.includes('categorize') || transformation.id.includes('classify')) {
    values.forEach(val => {
      // Simple mock categorization
      mapping[val] = 'Category A';
    });
  } else if (transformation.id.includes('translate')) {
    values.forEach(val => {
      // Mock translation (just returns same value)
      mapping[val] = val;
    });
  } else {
    // Default: no change
    values.forEach(val => {
      mapping[val] = val;
    });
  }
  
  return mapping;
}

export function useAiTransformations(options: UseAiTransformationsOptions) {
  const { data, transformations: initialTransformations } = options;

  const [transformations] = useState<AITransformation[]>(initialTransformations);
  const [pendingChanges, setPendingChanges] = useState<TransformationChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Transform a column with AI
   */
  const transformColumn = useCallback(async (
    transformation: AITransformation,
    columnKey: string
  ): Promise<TransformationChange[]> => {
    setLoading(true);
    setError(null);

    try {
      // Get unique values from column
      const values = data.map(row => row[columnKey]);
      const uniqueValues = [...new Set(values)].slice(0, 50); // Limit to 50 unique values

      // Generate transformation mapping (local fallback)
      const mapping = generateLocalTransformation(transformation, uniqueValues, columnKey);

      // Build changes array
      const changes: TransformationChange[] = [];
      data.forEach((row, index) => {
        const oldValue = row[columnKey];
        const newValue = mapping[oldValue];

        if (newValue !== undefined && newValue !== oldValue) {
          changes.push({
            rowIndex: index,
            column: columnKey,
            oldValue,
            newValue
          });
        }
      });

      if (transformation.preview) {
        setPendingChanges(changes);
      }

      return changes;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transformation failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [data]);

  /**
   * Transform a single row with AI
   */
  const transformRow = useCallback(async (
    transformation: AITransformation,
    row: Record<string, any>,
    _rowIndex: number
  ): Promise<TransformationChange[]> => {
    setLoading(true);
    setError(null);

    try {
      const prompt = interpolateTemplate(transformation.promptTemplate, row);
      
      // For local mode, just return empty changes (AI integration needed)
      const changes: TransformationChange[] = [];
      
      // In production, this would call AI and get transformed values
      console.log('Transform row prompt:', prompt);

      if (transformation.preview) {
        setPendingChanges(changes);
      }

      return changes;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Row transformation failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Apply pending changes to data
   */
  const applyChanges = useCallback((
    targetData: Record<string, any>[],
    changes: TransformationChange[]
  ): Record<string, any>[] => {
    const newData = JSON.parse(JSON.stringify(targetData)); // Deep clone

    changes.forEach(change => {
      if (newData[change.rowIndex]) {
        newData[change.rowIndex][change.column] = change.newValue;
      }
    });

    return newData;
  }, []);

  /**
   * Clear pending changes
   */
  const clearPendingChanges = useCallback(() => {
    setPendingChanges([]);
  }, []);

  return {
    transformations,
    pendingChanges,
    loading,
    error,
    transformColumn,
    transformRow,
    applyChanges,
    clearPendingChanges
  };
}

