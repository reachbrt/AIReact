/**
 * Image Caption Types
 */

export interface ImageCaptionConfig {
  /** AI provider to use */
  provider?: 'openai' | 'claude' | 'gemini';
  /** API key for the AI provider */
  apiKey?: string;
  /** Model to use (e.g., 'gpt-4-vision-preview') */
  model?: string;
  /** Maximum tokens for response */
  maxTokens?: number;
  /** Caption style */
  style?: 'descriptive' | 'alt-text' | 'social-media' | 'detailed';
}

export interface CaptionResult {
  /** Generated caption */
  caption: string;
  /** Confidence score (0-1) */
  confidence?: number;
  /** Image URL or data */
  imageSource: string;
  /** Timestamp */
  timestamp: Date;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

export interface ImageCaptionProps {
  /** API key for the vision AI provider */
  apiKey?: string;
  /** AI provider */
  provider?: 'openai' | 'claude' | 'gemini';
  /** Placeholder text */
  placeholder?: string;
  /** Caption style */
  style?: 'descriptive' | 'alt-text' | 'social-media' | 'detailed';
  /** Allow multiple images */
  multiple?: boolean;
  /** Maximum file size in MB */
  maxFileSize?: number;
  /** Accepted file types */
  accept?: string;
  /** Theme */
  theme?: 'light' | 'dark';
  /** Custom class name */
  className?: string;
  /** Callback when caption is generated */
  onCaptionGenerated?: (result: CaptionResult) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

