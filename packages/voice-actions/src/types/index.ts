/**
 * Voice Actions Types
 */

export interface VoiceCommand {
  phrase: string | RegExp;
  action: (transcript: string, matches?: RegExpMatchArray) => void;
  description?: string;
}

export interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  error: Error | null;
}

export interface VoiceButtonProps {
  onTranscript?: (transcript: string) => void;
  onCommand?: (command: string) => void;
  commands?: VoiceCommand[];
  language?: string;
  continuous?: boolean;
  showTranscript?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export interface VoiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

