/**
 * Autosuggest Component
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AutosuggestProps, Suggestion } from '../types';
import { useAutosuggest } from '../hooks/useAutosuggest';

export const Autosuggest: React.FC<AutosuggestProps> = ({
  value,
  onChange,
  provider = 'fallback',
  apiKey,
  model,
  placeholder = 'Type to search...',
  minLength = 2,
  debounce = 300,
  maxSuggestions = 5,
  className = '',
  context,
  onSuggestionSelect,
  renderSuggestion,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const {
    suggestions,
    isLoading,
    getSuggestions,
    clearSuggestions,
  } = useAutosuggest({
    provider,
    apiKey,
    model,
    minLength,
    debounce,
    maxSuggestions,
    context,
  });

  useEffect(() => {
    if (suggestions.length > 0) {
      setIsOpen(true);
      setActiveIndex(-1);
    }
  }, [suggestions]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    getSuggestions(newValue);
  }, [onChange, getSuggestions]);

  const handleSelectSuggestion = useCallback((suggestion: Suggestion) => {
    onChange(suggestion.text);
    onSuggestionSelect?.(suggestion);
    clearSuggestions();
    setIsOpen(false);
    inputRef.current?.focus();
  }, [onChange, onSuggestionSelect, clearSuggestions]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (activeIndex >= 0) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        clearSuggestions();
        break;
    }
  }, [isOpen, suggestions, activeIndex, handleSelectSuggestion, clearSuggestions]);

  const handleBlur = useCallback(() => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  }, []);

  return (
    <div className={`reactai-autosuggest ${className}`}>
      <div className="reactai-autosuggest-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="reactai-autosuggest-input"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        {isLoading && (
          <div className="reactai-autosuggest-spinner" aria-hidden="true" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="reactai-autosuggest-list"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              role="option"
              aria-selected={index === activeIndex}
              className={`reactai-autosuggest-item ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {renderSuggestion 
                ? renderSuggestion(suggestion) 
                : <span>{suggestion.text}</span>
              }
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

