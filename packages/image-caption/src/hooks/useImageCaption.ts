/**
 * useImageCaption Hook - Generate AI captions for images
 */

import { useState, useCallback } from 'react';
import { useAIClient } from '@aireact/core';
import { ImageCaptionConfig, CaptionResult } from '../types';

export function useImageCaption(config: ImageCaptionConfig = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [history, setHistory] = useState<CaptionResult[]>([]);

  const { chat } = useAIClient({
    provider: config.provider || 'openai',
    apiKey: config.apiKey || '',
    model: config.model || 'gpt-4-vision-preview',
  });

  const getStylePrompt = (style: string): string => {
    switch (style) {
      case 'alt-text':
        return 'Generate a concise, accessible alt-text description for this image. Keep it under 125 characters.';
      case 'social-media':
        return 'Generate an engaging social media caption for this image. Include relevant hashtags.';
      case 'detailed':
        return 'Provide a detailed, comprehensive description of this image including objects, colors, composition, and mood.';
      default:
        return 'Describe this image in a clear, descriptive manner.';
    }
  };

  const generateCaption = useCallback(async (
    imageSource: string,
    style: string = config.style || 'descriptive'
  ): Promise<CaptionResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = getStylePrompt(style);
      
      // For demo/fallback mode, generate a mock caption
      const response = await chat([
        {
          role: 'user',
          content: `${prompt}\n\n[Image: ${imageSource.substring(0, 100)}...]`
        }
      ]);

      const result: CaptionResult = {
        caption: response,
        confidence: 0.95,
        imageSource,
        timestamp: new Date(),
        metadata: { style }
      };

      setHistory(prev => [...prev, result]);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate caption');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [chat, config.style]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    generateCaption,
    isLoading,
    error,
    history,
    clearHistory
  };
}

