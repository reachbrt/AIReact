/**
 * @aireact/emotion-ui
 * Emotion-aware adaptive UI components for React
 */

// Components
export { EmotionAwareInput, EmotionAwareButton } from './components';

// Hooks
export { useEmotionDetector } from './hooks';

// Types
export type {
  EmotionType,
  EmotionState,
  EmotionAwareInputProps,
  EmotionAwareButtonProps,
  EmotionAwareNotificationProps,
  EmotionDetectorConfig
} from './types';

// Package version
export const REACTAI_EMOTION_UI_VERSION = '1.0.0';
console.log(
  `%c @aireact/emotion-ui v${REACTAI_EMOTION_UI_VERSION} `,
  'background: #EC4899; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;'
);

