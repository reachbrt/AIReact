/**
 * @aireact/chatbot
 * Enterprise AI chatbot component for React
 * 
 * @version 1.0.0
 * @author reachbrt
 * @license MIT
 */

// Version console log
const VERSION = '1.0.0';
console.log(
  `%c @aireact/chatbot v${VERSION} %c Loaded successfully `,
  'background: #667eea; color: white; padding: 2px 6px; border-radius: 3px 0 0 3px; font-weight: bold;',
  'background: #764ba2; color: white; padding: 2px 6px; border-radius: 0 3px 3px 0;'
);

// Import styles
import './styles/chatbot.css';

// Components
export { ChatWindow, ChatMessage, ChatInput } from './components';

// Hooks
export { useChatbot, useRAG, useVoice } from './hooks';

// Types
export type {
  ChatMessage as ChatMessageType,
  ChatAttachment,
  ChatWindowProps,
  UseChatbotOptions,
  UseChatbotReturn,
  // RAG types
  RAGDocument,
  RAGChunk,
  UseRAGOptions,
  UseRAGReturn,
  // Voice types
  UseVoiceOptions,
  UseVoiceReturn,
  SpeechOptions,
} from './types';

// Version export
export const REACTAI_CHATBOT_VERSION = VERSION;

