/**
 * usePredictiveText Hook - AI-powered text predictions
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { Prediction, PredictiveConfig } from '../types';

const SAMPLE_COMPLETIONS: Record<string, string[]> = {
  'hello': ['Hello! How can I help you today?', 'Hello there!', 'Hello, nice to meet you!'],
  'thank': ['Thank you for your help!', 'Thanks so much!', 'Thank you very much!'],
  'please': ['Please let me know if you need anything.', 'Please help me with this.'],
  'i would': ['I would like to...', 'I would appreciate...', 'I would be happy to...'],
  'can you': ['Can you help me with...', 'Can you please...', 'Can you explain...'],
};

export function usePredictiveText(_config: PredictiveConfig = {}) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const getPredictions = useCallback(async (text: string, _context?: string): Promise<Prediction[]> => {
    if (!text || text.length < 3) return [];

    setIsLoading(true);

    // Simulate AI prediction (in real implementation, call AI API)
    await new Promise(resolve => setTimeout(resolve, 200));

    const lowerText = text.toLowerCase();
    let completions: string[] = [];

    for (const [key, values] of Object.entries(SAMPLE_COMPLETIONS)) {
      if (lowerText.includes(key)) {
        completions = values;
        break;
      }
    }

    if (completions.length === 0) {
      completions = [`${text}...`, `${text} and more`, `${text} is great`];
    }

    const results: Prediction[] = completions.slice(0, 3).map((text, idx) => ({
      text,
      confidence: 0.9 - idx * 0.1,
      type: 'completion' as const
    }));

    setIsLoading(false);
    setPredictions(results);
    return results;
  }, []);

  const debouncedPredict = useCallback((text: string, context?: string, debounceMs = 300) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => getPredictions(text, context), debounceMs);
  }, [getPredictions]);

  const clearPredictions = useCallback(() => {
    setPredictions([]);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    predictions,
    isLoading,
    getPredictions,
    debouncedPredict,
    clearPredictions
  };
}

