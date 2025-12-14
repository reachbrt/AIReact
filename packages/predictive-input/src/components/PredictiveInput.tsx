/**
 * PredictiveInput Component - Input with AI predictions
 */

import React, { useState, useCallback, useRef } from 'react';
import { PredictiveInputProps } from '../types';
import { usePredictiveText } from '../hooks/usePredictiveText';
import '../styles/predictive-input.css';

export const PredictiveInput: React.FC<PredictiveInputProps> = ({
  value,
  onChange,
  onAcceptPrediction,
  placeholder = 'Start typing...',
  context,
  debounceMs = 300,
  showInline = true,
  theme = 'light',
  className = ''
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { predictions, isLoading, debouncedPredict, clearPredictions } = usePredictiveText();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (newValue.length >= 3) {
      debouncedPredict(newValue, context, debounceMs);
      setShowDropdown(true);
    } else {
      clearPredictions();
      setShowDropdown(false);
    }
  }, [onChange, debouncedPredict, context, debounceMs, clearPredictions]);

  const acceptPrediction = useCallback((prediction: string) => {
    onChange(prediction);
    onAcceptPrediction?.(prediction);
    clearPredictions();
    setShowDropdown(false);
    inputRef.current?.focus();
  }, [onChange, onAcceptPrediction, clearPredictions]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown || predictions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, predictions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Tab' || e.key === 'Enter') {
      if (predictions[selectedIndex]) {
        e.preventDefault();
        acceptPrediction(predictions[selectedIndex].text);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  }, [showDropdown, predictions, selectedIndex, acceptPrediction]);

  const inlinePrediction = showInline && predictions[0] && value.length >= 3
    ? predictions[0].text.slice(value.length)
    : '';

  return (
    <div className={`reactai-predictive-wrapper ${theme === 'dark' ? 'dark' : ''} ${className}`}>
      <div className="reactai-predictive-input-container">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder={placeholder}
          className="reactai-predictive-input"
        />
        {inlinePrediction && (
          <span className="reactai-inline-prediction">{inlinePrediction}</span>
        )}
        {isLoading && <span className="reactai-predictive-loader" />}
      </div>

      {showDropdown && predictions.length > 0 && (
        <ul className="reactai-predictions-dropdown">
          {predictions.map((pred, idx) => (
            <li
              key={idx}
              className={`reactai-prediction-item ${idx === selectedIndex ? 'selected' : ''}`}
              onClick={() => acceptPrediction(pred.text)}
            >
              <span className="prediction-text">{pred.text}</span>
              <span className="prediction-confidence">{Math.round(pred.confidence * 100)}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

