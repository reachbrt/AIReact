/**
 * EmotionUI Demo Component
 */

import React, { useState } from 'react';
import { EmotionAwareInput, EmotionAwareButton, useEmotionDetector } from '@aireact/emotion-ui';

interface EmotionUIDemoProps {
  apiKey: string;
}

export const EmotionUIDemo: React.FC<EmotionUIDemoProps> = ({ apiKey }) => {
  const [inputValue, setInputValue] = useState('');
  const { emotion, confidence, analyzeText } = useEmotionDetector({ apiKey, provider: 'openai' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 10) {
      analyzeText(value);
    }
  };

  const emotionEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    neutral: '😐',
    excited: '🎉',
    frustrated: '😤',
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Emotion-Aware UI</h3>
        <p className="text-slate-500 text-sm">
          Type a message and watch the UI adapt to your emotional tone in real-time.
        </p>
      </div>

      {/* Emotion Display */}
      <div className="flex justify-center items-center gap-4">
        <div className="text-center p-4 bg-slate-50 rounded-xl">
          <div className="text-4xl mb-2">{emotionEmojis[emotion] || '😐'}</div>
          <div className="text-sm font-medium text-slate-600 capitalize">{emotion}</div>
          <div className="text-xs text-slate-400">
            {Math.round(confidence * 100)}% confidence
          </div>
        </div>
      </div>

      {/* Emotion-Aware Input */}
      <div className="max-w-md mx-auto space-y-4">
        <EmotionAwareInput
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type something emotional..."
          emotion={emotion}
          className="w-full"
        />

        {/* Emotion-Aware Buttons */}
        <div className="flex justify-center gap-3">
          <EmotionAwareButton emotion={emotion} variant="primary">
            Send Message
          </EmotionAwareButton>
          <EmotionAwareButton emotion={emotion} variant="secondary">
            Cancel
          </EmotionAwareButton>
        </div>
      </div>

      {/* Emotion Tips */}
      <div className="text-center text-sm text-slate-500">
        <p>Try typing: "I'm so happy today!" or "This is really frustrating..."</p>
      </div>
    </div>
  );
};

