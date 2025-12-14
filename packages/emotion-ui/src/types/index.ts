/**
 * Emotion UI Types
 */

export type EmotionType = 'neutral' | 'happy' | 'sad' | 'frustrated' | 'excited' | 'confused' | 'calm';

export interface EmotionState {
  current: EmotionType;
  confidence: number;
  history: Array<{ emotion: EmotionType; timestamp: Date }>;
}

export interface EmotionAwareInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  validationMessage?: string;
  validationState?: 'success' | 'error' | 'warning' | 'none';
  adaptToEmotion?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export interface EmotionAwareButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  encouragingText?: string;
  disabled?: boolean;
  loading?: boolean;
  adaptToEmotion?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export interface EmotionAwareNotificationProps {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  empathetic?: boolean;
  onClose?: () => void;
  duration?: number;
  theme?: 'light' | 'dark';
}

export interface EmotionDetectorConfig {
  enableTextAnalysis?: boolean;
  enableTypingPatterns?: boolean;
  enableClickPatterns?: boolean;
  sensitivityLevel?: 'low' | 'medium' | 'high';
}

