/**
 * Predictive Input Types
 */

export interface PredictiveInputProps {
  value: string;
  onChange: (value: string) => void;
  onAcceptPrediction?: (prediction: string) => void;
  placeholder?: string;
  context?: string;
  maxPredictions?: number;
  debounceMs?: number;
  showInline?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export interface Prediction {
  text: string;
  confidence: number;
  type: 'completion' | 'suggestion' | 'correction';
}

export interface PredictiveConfig {
  provider?: 'openai' | 'anthropic' | 'local';
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

