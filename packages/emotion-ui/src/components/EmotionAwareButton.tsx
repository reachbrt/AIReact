/**
 * EmotionAwareButton - Button that adapts to user emotion
 */

import React, { useState } from 'react';
import { EmotionAwareButtonProps } from '../types';
import '../styles/emotion-ui.css';

export const EmotionAwareButton: React.FC<EmotionAwareButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  encouragingText,
  disabled = false,
  loading = false,
  adaptToEmotion = true,
  theme = 'light',
  className = ''
}) => {
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    if (disabled || loading) return;
    
    setClicks(prev => prev + 1);
    
    // Show encouragement after multiple clicks (user might be frustrated)
    if (adaptToEmotion && clicks >= 2 && encouragingText) {
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 3000);
    }
    
    onClick?.();
  };

  return (
    <div className={`reactai-emotion-button-wrapper ${theme === 'dark' ? 'dark' : ''}`}>
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className={`reactai-emotion-button ${variant} ${className}`}
      >
        {loading ? (
          <span className="reactai-button-spinner" />
        ) : (
          children
        )}
      </button>
      
      {showEncouragement && encouragingText && (
        <div className="reactai-encouragement">
          💪 {encouragingText}
        </div>
      )}
    </div>
  );
};

