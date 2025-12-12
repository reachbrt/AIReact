/**
 * @reactai/core
 * Core AI functionality for ReactAI - Multi-provider AI client
 * 
 * @version 1.0.0
 * @author reachbrt
 * @license MIT
 */

// Version console log
const VERSION = '1.0.0';
console.log(
  `%c @reactai/core v${VERSION} %c Loaded successfully `,
  'background: #667eea; color: white; padding: 2px 6px; border-radius: 3px 0 0 3px; font-weight: bold;',
  'background: #764ba2; color: white; padding: 2px 6px; border-radius: 0 3px 3px 0;'
);

// Main exports
export { AIClient } from './AIClient';

// Hooks
export { useAIClient } from './hooks';
export type { UseAIClientReturn } from './hooks';

// Types
export type {
  AIProvider,
  AIConfig,
  Message,
  ChatResponse,
  StreamCallbacks,
  AIClientInterface,
  ProviderConfig,
} from './types';

// Providers (for advanced usage)
export {
  openaiChat,
  openaiChatStream,
  claudeChat,
  claudeChatStream,
  geminiChat,
  geminiChatStream,
  fallbackChat,
  fallbackChatStream,
} from './providers';

// Version export
export const REACTAI_CORE_VERSION = VERSION;

