/**
 * EmotionAwareInput - Input that adapts to user emotion
 */

import React, { useCallback } from 'react';
import { EmotionAwareInputProps } from '../types';
import { useEmotionDetector } from '../hooks/useEmotionDetector';
import '../styles/emotion-ui.css';

export const EmotionAwareInput: React.FC<EmotionAwareInputProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Type here...',
  validationMessage,
  validationState = 'none',
  adaptToEmotion = true,
  theme = 'light',
  className = ''
}) => {
  const { emotionState, processInput, recordTypingPattern } = useEmotionDetector({
    enableTextAnalysis: adaptToEmotion,
    enableTypingPatterns: adaptToEmotion
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (adaptToEmotion) {
      processInput(newValue);
    }
  }, [onChange, processInput, adaptToEmotion]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      recordTypingPattern('backspace');
    } else {
      recordTypingPattern('keypress');
    }
  }, [recordTypingPattern]);

  const getEmotionClass = () => {
    if (!adaptToEmotion) return '';
    return `emotion-${emotionState.current}`;
  };

  const getAdaptiveMessage = () => {
    if (!validationMessage) return null;
    
    if (emotionState.current === 'frustrated' && validationState === 'error') {
      return "Don't worry, let's fix this together. " + validationMessage;
    }
    return validationMessage;
  };

  return (
    <div className={`reactai-emotion-input-wrapper ${theme === 'dark' ? 'dark' : ''} ${className}`}>
      {label && <label className="reactai-emotion-label">{label}</label>}
      
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`reactai-emotion-input ${validationState} ${getEmotionClass()}`}
      />
      
      {validationMessage && (
        <span className={`reactai-emotion-message ${validationState}`}>
          {getAdaptiveMessage()}
        </span>
      )}
      
      {adaptToEmotion && emotionState.current !== 'neutral' && (
        <div className="reactai-emotion-indicator">
          <span className={`emotion-dot ${emotionState.current}`} />
          <span className="emotion-text">{emotionState.current}</span>
        </div>
      )}
    </div>
  );
};

