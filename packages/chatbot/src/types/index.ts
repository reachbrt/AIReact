/**
 * @aireact/chatbot - Type definitions
 */

import { AIProvider } from '@aireact/core';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatWindowProps {
  /** AI provider to use */
  provider?: AIProvider;
  /** API key for the provider */
  apiKey?: string;
  /** Model to use */
  model?: string;
  /** Chat window title */
  title?: string;
  /** Placeholder text for input */
  placeholder?: string;
  /** Initial messages */
  initialMessages?: ChatMessage[];
  /** System prompt */
  systemPrompt?: string;
  /** Enable streaming responses */
  streaming?: boolean;
  /** Custom class name */
  className?: string;
  /** Theme variant */
  theme?: 'light' | 'dark' | 'auto';
  /** Show timestamp on messages */
  showTimestamp?: boolean;
  /** Callback when message is sent */
  onMessageSent?: (message: ChatMessage) => void;
  /** Callback when response is received */
  onResponse?: (message: ChatMessage) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

export interface UseChatbotOptions {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  systemPrompt?: string;
  streaming?: boolean;
  onError?: (error: Error) => void;
}

export interface UseChatbotReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

