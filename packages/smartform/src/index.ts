/**
 * @reactai/smartform
 * AI form validation & auto-correction for React
 * 
 * @version 1.0.0
 * @author reachbrt
 * @license MIT
 */

// Version console log
const VERSION = '1.0.0';
console.log(
  `%c @reactai/smartform v${VERSION} %c Loaded successfully `,
  'background: #667eea; color: white; padding: 2px 6px; border-radius: 3px 0 0 3px; font-weight: bold;',
  'background: #764ba2; color: white; padding: 2px 6px; border-radius: 0 3px 3px 0;'
);

// Import styles
import './styles/smartform.css';

// Components
export { SmartForm } from './components';

// Hooks
export { useSmartValidation } from './hooks';

// Types
export type {
  FieldType,
  FieldSchema,
  FormSchema,
  FieldError,
  SmartFormProps,
  UseSmartValidationOptions,
  UseSmartValidationReturn,
} from './types';

// Version export
export const REACTAI_SMARTFORM_VERSION = VERSION;

