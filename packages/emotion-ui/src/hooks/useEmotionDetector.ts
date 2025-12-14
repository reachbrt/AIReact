/**
 * useEmotionDetector Hook - Detect user emotions from interactions
 */

import { useState, useCallback, useRef } from 'react';
import { EmotionType, EmotionState, EmotionDetectorConfig } from '../types';

const EMOTION_KEYWORDS: Record<EmotionType, string[]> = {
  happy: ['great', 'awesome', 'love', 'thanks', 'wonderful', 'amazing', 'perfect', 'excellent'],
  sad: ['sad', 'disappointed', 'sorry', 'unfortunately', 'bad', 'terrible', 'awful'],
  frustrated: ['frustrated', 'angry', 'annoyed', 'stupid', 'broken', 'hate', 'worst', 'useless'],
  excited: ['excited', 'wow', 'incredible', 'fantastic', 'yes', 'finally', 'yay'],
  confused: ['confused', 'dont understand', 'what', 'how', 'why', 'help', 'unclear'],
  calm: ['okay', 'fine', 'alright', 'sure', 'understood', 'got it'],
  neutral: []
};

export function useEmotionDetector(config: EmotionDetectorConfig = {}) {
  const {
    enableTextAnalysis = true,
    enableTypingPatterns = true,
    sensitivityLevel = 'medium'
  } = config;

  const [emotionState, setEmotionState] = useState<EmotionState>({
    current: 'neutral',
    confidence: 1,
    history: []
  });

  const typingMetrics = useRef({ speed: 0, corrections: 0, pauses: 0 });
  const lastKeyTime = useRef<number>(Date.now());

  const analyzeText = useCallback((text: string): EmotionType => {
    if (!enableTextAnalysis) return 'neutral';
    
    const lowerText = text.toLowerCase();
    let detectedEmotion: EmotionType = 'neutral';
    let maxMatches = 0;

    for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
      const matches = keywords.filter(kw => lowerText.includes(kw)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = emotion as EmotionType;
      }
    }

    return detectedEmotion;
  }, [enableTextAnalysis]);

  const recordTypingPattern = useCallback((event: 'keypress' | 'backspace' | 'pause') => {
    if (!enableTypingPatterns) return;

    const now = Date.now();
    const timeSinceLastKey = now - lastKeyTime.current;

    if (event === 'keypress') {
      typingMetrics.current.speed = timeSinceLastKey < 100 ? typingMetrics.current.speed + 1 : Math.max(0, typingMetrics.current.speed - 1);
    } else if (event === 'backspace') {
      typingMetrics.current.corrections++;
    } else if (event === 'pause' && timeSinceLastKey > 2000) {
      typingMetrics.current.pauses++;
    }

    lastKeyTime.current = now;

    // Detect frustration from rapid corrections
    if (typingMetrics.current.corrections > 5) {
      updateEmotion('frustrated', 0.7);
    }
  }, [enableTypingPatterns]);

  const updateEmotion = useCallback((emotion: EmotionType, confidence: number) => {
    setEmotionState(prev => ({
      current: emotion,
      confidence,
      history: [...prev.history.slice(-10), { emotion, timestamp: new Date() }]
    }));
  }, []);

  const processInput = useCallback((text: string) => {
    const detected = analyzeText(text);
    if (detected !== 'neutral') {
      const confidenceMap = { low: 0.5, medium: 0.7, high: 0.9 };
      updateEmotion(detected, confidenceMap[sensitivityLevel]);
    }
  }, [analyzeText, updateEmotion, sensitivityLevel]);

  const reset = useCallback(() => {
    setEmotionState({ current: 'neutral', confidence: 1, history: [] });
    typingMetrics.current = { speed: 0, corrections: 0, pauses: 0 };
  }, []);

  return {
    emotionState,
    processInput,
    recordTypingPattern,
    updateEmotion,
    reset
  };
}

