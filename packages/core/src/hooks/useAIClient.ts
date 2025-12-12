/**
 * useAIClient - React hook for AI interactions
 */

import { useState, useCallback, useMemo } from 'react';
import { AIClient } from '../AIClient';
import { AIConfig, Message, StreamCallbacks } from '../types';

export interface UseAIClientReturn {
  chat: (messages: Message[]) => Promise<string>;
  chatStream: (messages: Message[], onToken: (token: string) => void, onComplete?: (fullText: string) => void) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  clearError: () => void;
  client: AIClient;
}

export function useAIClient(config: AIConfig): UseAIClientReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const client = useMemo(() => new AIClient(config), [
    config.provider,
    config.apiKey,
    config.model,
    config.baseUrl,
    config.temperature,
    config.maxTokens,
  ]);

  const chat = useCallback(async (messages: Message[]): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await client.chat(messages);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  const chatStream = useCallback(async (
    messages: Message[],
    onToken: (token: string) => void,
    onComplete?: (fullText: string) => void
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    const callbacks: StreamCallbacks = {
      onToken,
      onComplete: (fullText) => {
        setIsLoading(false);
        onComplete?.(fullText);
      },
      onError: (err) => {
        setError(err);
        setIsLoading(false);
      },
    };

    try {
      await client.chatStream(messages, callbacks);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setIsLoading(false);
      throw error;
    }
  }, [client]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    chat,
    chatStream,
    isLoading,
    error,
    clearError,
    client,
  };
}

