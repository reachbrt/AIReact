/**
 * useVoiceRecognition Hook - Speech recognition with command matching
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { VoiceCommand, VoiceRecognitionState, VoiceConfig } from '../types';

// Type declarations for Web Speech API
interface SpeechRecognitionType extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionType;
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
  }
}

export function useVoiceRecognition(config: VoiceConfig = {}) {
  const { language = 'en-US', continuous = false, interimResults = true } = config;

  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    transcript: '',
    interimTranscript: '',
    confidence: 0,
    error: null
  });

  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const commandsRef = useRef<VoiceCommand[]>([]);

  const initRecognition = useCallback(() => {
    if (typeof window === 'undefined') return null;

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setState(prev => ({ ...prev, error: new Error('Speech recognition not supported') }));
      return null;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onresult = (event: any) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          setState(prev => ({
            ...prev,
            transcript: prev.transcript + result[0].transcript,
            confidence: result[0].confidence
          }));
          matchCommands(result[0].transcript);
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (interimTranscript) {
        setState(prev => ({ ...prev, interimTranscript }));
      }
    };

    recognition.onerror = (event: any) => {
      setState(prev => ({ ...prev, error: new Error(event.error), isListening: false }));
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    return recognition;
  }, [language, continuous, interimResults]);

  const matchCommands = useCallback((transcript: string) => {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    for (const command of commandsRef.current) {
      if (typeof command.phrase === 'string') {
        if (lowerTranscript.includes(command.phrase.toLowerCase())) {
          command.action(transcript);
          break;
        }
      } else if (command.phrase instanceof RegExp) {
        const matches = lowerTranscript.match(command.phrase);
        if (matches) {
          command.action(transcript, matches);
          break;
        }
      }
    }
  }, []);

  const startListening = useCallback((commands?: VoiceCommand[]) => {
    if (commands) commandsRef.current = commands;
    
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }

    if (recognitionRef.current) {
      setState(prev => ({ ...prev, isListening: true, error: null, transcript: '', interimTranscript: '' }));
      recognitionRef.current.start();
    }
  }, [initRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setState(prev => ({ ...prev, isListening: false }));
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', interimTranscript: '' }));
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  };
}

