/**
 * @aireact/voice-actions
 * Voice commands & speech recognition for React
 */

export { VoiceButton } from './components';
export { useVoiceRecognition } from './hooks';
export type { VoiceButtonProps, VoiceCommand, VoiceRecognitionState, VoiceConfig } from './types';

export const REACTAI_VOICE_ACTIONS_VERSION = '1.0.0';
console.log(`%c @aireact/voice-actions v${REACTAI_VOICE_ACTIONS_VERSION} `, 'background: #06B6D4; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;');

