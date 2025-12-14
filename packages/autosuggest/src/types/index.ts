/**
 * @aireact/autosuggest - Type definitions
 */

import { AIProvider } from '@aireact/core';

export interface Suggestion {
  id: string;
  text: string;
  relevance?: number;
  metadata?: Record<string, unknown>;
}

export interface AutosuggestProps {
  /** Current value */
  value: string;
  /** Value change handler */
  onChange: (value: string) => void;
  /** AI provider */
  provider?: AIProvider;
  /** API key */
  apiKey?: string;
  /** Model to use */
  model?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Minimum characters before suggesting */
  minLength?: number;
  /** Debounce delay in ms */
  debounce?: number;
  /** Maximum suggestions to show */
  maxSuggestions?: number;
  /** Custom class name */
  className?: string;
  /** Context for better suggestions */
  context?: string;
  /** Callback when suggestion is selected */
  onSuggestionSelect?: (suggestion: Suggestion) => void;
  /** Custom suggestion renderer */
  renderSuggestion?: (suggestion: Suggestion) => React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
}

export interface UseAutosuggestOptions {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  minLength?: number;
  debounce?: number;
  maxSuggestions?: number;
  context?: string;
}

export interface UseAutosuggestReturn {
  suggestions: Suggestion[];
  isLoading: boolean;
  error: Error | null;
  getSuggestions: (query: string) => Promise<void>;
  clearSuggestions: () => void;
}

