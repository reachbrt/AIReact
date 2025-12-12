/**
 * useChatbot - React hook for chatbot functionality
 */

import { useState, useCallback } from 'react';
import { useAIClient, Message } from '@reactai/core';
import { ChatMessage, UseChatbotOptions, UseChatbotReturn } from '../types';

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function useChatbot(options: UseChatbotOptions): UseChatbotReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { chat, chatStream } = useAIClient({
    provider: options.provider,
    apiKey: options.apiKey,
    model: options.model,
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Build message history for AI
    const aiMessages: Message[] = [];
    
    if (options.systemPrompt) {
      aiMessages.push({ role: 'system', content: options.systemPrompt });
    }

    // Add previous messages
    messages.forEach(msg => {
      aiMessages.push({ role: msg.role, content: msg.content });
    });

    // Add current message
    aiMessages.push({ role: 'user', content: content.trim() });

    try {
      if (options.streaming) {
        const assistantId = generateId();
        
        // Add placeholder message for streaming
        setMessages(prev => [...prev, {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isStreaming: true,
        }]);

        await chatStream(
          aiMessages,
          (token) => {
            setMessages(prev => prev.map(msg => 
              msg.id === assistantId 
                ? { ...msg, content: msg.content + token }
                : msg
            ));
          },
          () => {
            setMessages(prev => prev.map(msg => 
              msg.id === assistantId 
                ? { ...msg, isStreaming: false }
                : msg
            ));
            setIsLoading(false);
          }
        );
      } else {
        const response = await chat(aiMessages);
        
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setIsLoading(false);
      options.onError?.(error);
    }
  }, [messages, chat, chatStream, options]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    clearError,
  };
}

