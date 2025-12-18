/**
 * @aireact/smartform - Type definitions
 */

import { AIProvider } from '@aireact/core';

export type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'url'
  | 'number'
  | 'date'
  | 'password'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'multiselect';

export interface FieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FieldSchema {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  required?: boolean;
  aiValidation?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  /** Options for select, radio, checkbox, multiselect fields */
  options?: FieldOption[];
  /** Allow inline layout for radio/checkbox groups */
  inline?: boolean;
}

export interface FormSchema {
  [key: string]: FieldSchema;
}

export interface FieldError {
  field: string;
  message: string;
  suggestion?: string;
  autoCorrect?: string;
}

export interface SmartFormProps {
  /** Form schema */
  schema: FormSchema;
  /** Form data */
  values: Record<string, string>;
  /** Change handler */
  onChange: (values: Record<string, string>) => void;
  /** Submit handler */
  onSubmit: (values: Record<string, string>) => void;
  /** AI provider */
  provider?: AIProvider;
  /** API key */
  apiKey?: string;
  /** Model */
  model?: string;
  /** Enable AI validation */
  aiValidation?: boolean;
  /** Auto-correct on blur */
  autoCorrect?: boolean;
  /** Custom class name */
  className?: string;
  /** Submit button text */
  submitText?: string;
  /** Loading state */
  isSubmitting?: boolean;
}

export interface UseSmartValidationOptions {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  schema: FormSchema;
}

export interface UseSmartValidationReturn {
  errors: Record<string, FieldError>;
  isValidating: boolean;
  validateField: (name: string, value: string) => Promise<FieldError | null>;
  validateForm: (values: Record<string, string>) => Promise<Record<string, FieldError>>;
  clearErrors: () => void;
  getSuggestion: (name: string, value: string) => Promise<string | null>;
}

