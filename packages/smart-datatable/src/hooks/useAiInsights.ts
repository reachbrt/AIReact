/**
 * useAiInsights Hook
 * Generates AI-powered data insights (trends, outliers, recommendations)
 * Based on DETAILED_DOCUMENTATION.md
 */

import { useState, useCallback } from 'react';
import {
  AIInsight,
  InsightCategory,
  UseAiInsightsOptions
} from '../types';

/**
 * Generate a unique ID for insights
 */
function generateId(): string {
  return `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Analyze data locally to generate basic insights
 */
function analyzeDataLocally<T extends Record<string, any>>(
  data: T[],
  columns: { key: string; type: string; label: string }[],
  categories: InsightCategory[]
): AIInsight[] {
  const insights: AIInsight[] = [];

  if (data.length === 0) {
    insights.push({
      id: generateId(),
      category: 'summary',
      title: 'No Data Available',
      description: 'The dataset is empty. Add some data to see insights.',
      confidence: 1.0
    });
    return insights;
  }

  // Summary insight
  if (categories.includes('summary')) {
    insights.push({
      id: generateId(),
      category: 'summary',
      title: 'Data Overview',
      description: `Dataset contains ${data.length} records with ${columns.length} columns.`,
      confidence: 1.0,
      data: { rowCount: data.length, columnCount: columns.length }
    });
  }

  // Analyze numeric columns for trends and outliers
  const numericColumns = columns.filter(col => col.type === 'number');

  for (const col of numericColumns) {
    const values = data
      .map(row => row[col.key])
      .filter(v => typeof v === 'number' && !isNaN(v));

    if (values.length === 0) continue;

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Trends insight
    if (categories.includes('trends')) {
      insights.push({
        id: generateId(),
        category: 'trends',
        title: `${col.label} Statistics`,
        description: `Average: ${avg.toFixed(2)}, Range: ${min} - ${max}`,
        confidence: 0.85,
        data: { column: col.key, avg, min, max, sum }
      });
    }

    // Outliers insight
    if (categories.includes('outliers')) {
      const stdDev = Math.sqrt(
        values.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / values.length
      );
      const threshold = avg + 2 * stdDev;
      const outliers = data.filter(row => {
        const val = row[col.key];
        return typeof val === 'number' && val > threshold;
      });

      if (outliers.length > 0) {
        insights.push({
          id: generateId(),
          category: 'outliers',
          title: `High ${col.label} Values Detected`,
          description: `${outliers.length} records have ${col.label} values above ${threshold.toFixed(2)} (2 standard deviations above average)`,
          confidence: 0.75,
          data: { column: col.key, threshold, count: outliers.length }
        });
      }
    }
  }

  // Analyze categorical columns for patterns
  const stringColumns = columns.filter(col => col.type === 'string');

  for (const col of stringColumns) {
    const valueCounts: Record<string, number> = {};
    data.forEach(row => {
      const val = String(row[col.key] || '');
      valueCounts[val] = (valueCounts[val] || 0) + 1;
    });

    const entries = Object.entries(valueCounts).sort((a, b) => b[1] - a[1]);
    const topValue = entries[0];

    if (categories.includes('patterns') && topValue) {
      const percentage = ((topValue[1] / data.length) * 100).toFixed(1);
      insights.push({
        id: generateId(),
        category: 'patterns',
        title: `${col.label} Distribution`,
        description: `"${topValue[0]}" is the most common value (${percentage}% of records)`,
        confidence: 0.8,
        data: { column: col.key, topValue: topValue[0], count: topValue[1], percentage }
      });
    }
  }

  // Recommendations
  if (categories.includes('recommendations')) {
    if (data.length < 10) {
      insights.push({
        id: generateId(),
        category: 'recommendations',
        title: 'Add More Data',
        description: 'Consider adding more records for more accurate insights.',
        confidence: 0.9
      });
    }
  }

  return insights;
}

export function useAiInsights(options: UseAiInsightsOptions) {
  const { schema, data, config } = options;
  const categories = config?.categories || ['trends', 'outliers', 'patterns', 'recommendations', 'summary'];

  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateInsights = useCallback(async (filterCategories?: InsightCategory[]): Promise<AIInsight[]> => {
    setLoading(true);
    setError(null);

    try {
      const activeCategories = filterCategories || categories;
      const generatedInsights = analyzeDataLocally(data, schema.columns, activeCategories);
      setInsights(generatedInsights);
      return generatedInsights;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Insight generation failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [data, schema, categories]);

  const generateContextualInsights = useCallback(async (selectedRows: any[]): Promise<AIInsight[]> => {
    setLoading(true);
    try {
      const generatedInsights = analyzeDataLocally(selectedRows, schema.columns, categories);
      return generatedInsights;
    } finally {
      setLoading(false);
    }
  }, [schema, categories]);

  const getSummary = useCallback(async (currentData?: any[]): Promise<string> => {
    const targetData = currentData || data;
    return `Dataset contains ${targetData.length} records across ${schema.columns.length} columns.`;
  }, [data, schema]);

  const clearInsights = useCallback(() => {
    setInsights([]);
  }, []);

  return {
    insights,
    loading,
    error,
    hasInsights: insights.length > 0,
    generateInsights,
    generateContextualInsights,
    getSummary,
    clearInsights
  };
}

