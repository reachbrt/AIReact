/**
 * @reactai/autosuggest
 * AI-powered smart suggestions component for React
 * 
 * @version 1.0.0
 * @author reachbrt
 * @license MIT
 */

// Version console log
const VERSION = '1.0.0';
console.log(
  `%c @reactai/autosuggest v${VERSION} %c Loaded successfully `,
  'background: #667eea; color: white; padding: 2px 6px; border-radius: 3px 0 0 3px; font-weight: bold;',
  'background: #764ba2; color: white; padding: 2px 6px; border-radius: 0 3px 3px 0;'
);

// Import styles
import './styles/autosuggest.css';

// Components
export { Autosuggest } from './components';

// Hooks
export { useAutosuggest } from './hooks';

// Types
export type {
  Suggestion,
  AutosuggestProps,
  UseAutosuggestOptions,
  UseAutosuggestReturn,
} from './types';

// Version export
export const REACTAI_AUTOSUGGEST_VERSION = VERSION;

