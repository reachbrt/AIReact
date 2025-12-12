/**
 * useAutosuggest - React hook for AI-powered suggestions
 */

import { useState, useCallback, useRef } from 'react';
import { useAIClient } from '@reactai/core';
import { Suggestion, UseAutosuggestOptions, UseAutosuggestReturn } from '../types';

function generateId(): string {
  return `sug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function parseSuggestions(response: string, maxSuggestions: number): Suggestion[] {
  const suggestions: Suggestion[] = [];
  
  // Try to parse as JSON array first
  try {
    const parsed = JSON.parse(response);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, maxSuggestions).map((item, index) => ({
        id: generateId(),
        text: typeof item === 'string' ? item : item.text || item.suggestion || String(item),
        relevance: 1 - (index * 0.1),
      }));
    }
  } catch {
    // Not JSON, parse as text
  }

  // Parse line-by-line
  const lines = response.split('\n')
    .map(line => line.replace(/^[\d\-\.\)\*]+\s*/, '').trim())
    .filter(line => line.length > 0);

  for (let i = 0; i < Math.min(lines.length, maxSuggestions); i++) {
    suggestions.push({
      id: generateId(),
      text: lines[i],
      relevance: 1 - (i * 0.1),
    });
  }

  return suggestions;
}

export function useAutosuggest(options: UseAutosuggestOptions): UseAutosuggestReturn {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const { chat } = useAIClient({
    provider: options.provider,
    apiKey: options.apiKey,
    model: options.model,
  });

  const getSuggestions = useCallback(async (query: string) => {
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Check minimum length
    if (query.length < (options.minLength || 2)) {
      setSuggestions([]);
      return;
    }

    // Debounce
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const contextPrompt = options.context 
          ? `Context: ${options.context}\n\n` 
          : '';

        const prompt = `${contextPrompt}Generate ${options.maxSuggestions || 5} autocomplete suggestions for the following input. Return only the suggestions, one per line, no numbering or bullets:

Input: "${query}"

Suggestions:`;

        const response = await chat([
          { role: 'user', content: prompt }
        ]);

        const parsed = parseSuggestions(response, options.maxSuggestions || 5);
        setSuggestions(parsed);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to get suggestions');
        setError(error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, options.debounce || 300);
  }, [chat, options]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    getSuggestions,
    clearSuggestions,
  };
}

