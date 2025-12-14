/**
 * VoiceButton Component - Voice input button with visualization
 */

import React, { useCallback } from 'react';
import { VoiceButtonProps } from '../types';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import '../styles/voice-actions.css';

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onTranscript,
  onCommand: _onCommand,
  commands = [],
  language = 'en-US',
  continuous = false,
  showTranscript = true,
  theme = 'light',
  className = ''
}) => {
  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition({ language, continuous });

  const handleClick = useCallback(() => {
    if (isListening) {
      stopListening();
      if (transcript && onTranscript) {
        onTranscript(transcript);
      }
    } else {
      resetTranscript();
      startListening(commands);
    }
  }, [isListening, transcript, commands, startListening, stopListening, resetTranscript, onTranscript]);

  if (!isSupported) {
    return (
      <div className={`reactai-voice-wrapper ${theme === 'dark' ? 'dark' : ''} ${className}`}>
        <div className="reactai-voice-unsupported">
          Voice recognition is not supported in this browser
        </div>
      </div>
    );
  }

  return (
    <div className={`reactai-voice-wrapper ${theme === 'dark' ? 'dark' : ''} ${className}`}>
      <button
        onClick={handleClick}
        className={`reactai-voice-button ${isListening ? 'listening' : ''}`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        <svg className="reactai-mic-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
        {isListening && <span className="reactai-voice-pulse" />}
      </button>

      {showTranscript && (transcript || interimTranscript) && (
        <div className="reactai-voice-transcript">
          <span className="final">{transcript}</span>
          <span className="interim">{interimTranscript}</span>
        </div>
      )}

      {error && (
        <div className="reactai-voice-error">
          {error.message}
        </div>
      )}
    </div>
  );
};

