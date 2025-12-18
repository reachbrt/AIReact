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
  /** Attached files for RAG */
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  /** Extracted text content from the file */
  content?: string;
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
  /** Enable file upload / RAG */
  enableFileUpload?: boolean;
  /** Accepted file types for upload */
  acceptedFileTypes?: string;
  /** Enable voice input */
  enableVoiceInput?: boolean;
  /** Enable voice output (text-to-speech) */
  enableVoiceOutput?: boolean;
  /** Callback when message is sent */
  onMessageSent?: (message: ChatMessage) => void;
  /** Callback when response is received */
  onResponse?: (message: ChatMessage) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Callback when file is uploaded */
  onFileUpload?: (files: ChatAttachment[]) => void;
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
  sendMessage: (content: string, attachments?: ChatAttachment[]) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

/** RAG Document types */
export interface RAGDocument {
  id: string;
  name: string;
  content: string;
  chunks: RAGChunk[];
}

export interface RAGChunk {
  id: string;
  documentId: string;
  content: string;
  embedding?: number[];
}

export interface UseRAGOptions {
  chunkSize?: number;
  chunkOverlap?: number;
}

export interface UseRAGReturn {
  documents: RAGDocument[];
  isProcessing: boolean;
  addDocument: (file: File) => Promise<RAGDocument | null>;
  removeDocument: (id: string) => void;
  getContext: (query: string, topK?: number) => string;
  clearDocuments: () => void;
}

/** Voice types */
export interface UseVoiceOptions {
  language?: string;
  continuous?: boolean;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onError?: (error: Error) => void;
}

export interface UseVoiceReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string, options?: SpeechOptions) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
  language?: string;
}

