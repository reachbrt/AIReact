/**
 * useSmartValidation - React hook for AI-powered form validation
 */

import { useState, useCallback } from 'react';
import { useAIClient } from '@reactai/core';
import { FieldError, UseSmartValidationOptions, UseSmartValidationReturn } from '../types';

export function useSmartValidation(options: UseSmartValidationOptions): UseSmartValidationReturn {
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [isValidating, setIsValidating] = useState(false);

  const { chat } = useAIClient({
    provider: options.provider,
    apiKey: options.apiKey,
    model: options.model,
  });

  const validateField = useCallback(async (name: string, value: string): Promise<FieldError | null> => {
    const fieldSchema = options.schema[name];
    if (!fieldSchema) return null;

    // Basic validation first
    if (fieldSchema.required && !value.trim()) {
      const error: FieldError = {
        field: name,
        message: `${fieldSchema.label || name} is required`,
      };
      setErrors(prev => ({ ...prev, [name]: error }));
      return error;
    }

    if (value && fieldSchema.minLength && value.length < fieldSchema.minLength) {
      const error: FieldError = {
        field: name,
        message: `${fieldSchema.label || name} must be at least ${fieldSchema.minLength} characters`,
      };
      setErrors(prev => ({ ...prev, [name]: error }));
      return error;
    }

    // AI validation if enabled
    if (fieldSchema.aiValidation && value.trim()) {
      setIsValidating(true);
      try {
        const prompt = `Validate this ${fieldSchema.type} field value: "${value}"
Field: ${fieldSchema.label || name}
Type: ${fieldSchema.type}

If valid, respond with just "VALID".
If invalid, respond with a JSON object: {"error": "error message", "suggestion": "corrected value if applicable"}`;

        const response = await chat([{ role: 'user', content: prompt }]);
        
        if (response.trim().toUpperCase() !== 'VALID') {
          try {
            const parsed = JSON.parse(response);
            const error: FieldError = {
              field: name,
              message: parsed.error || 'Invalid value',
              suggestion: parsed.suggestion,
              autoCorrect: parsed.suggestion,
            };
            setErrors(prev => ({ ...prev, [name]: error }));
            return error;
          } catch {
            // If not valid JSON, treat as error message
            if (!response.includes('VALID')) {
              const error: FieldError = {
                field: name,
                message: response.slice(0, 100),
              };
              setErrors(prev => ({ ...prev, [name]: error }));
              return error;
            }
          }
        }
      } finally {
        setIsValidating(false);
      }
    }

    // Clear error if valid
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    return null;
  }, [chat, options.schema]);

  const validateForm = useCallback(async (values: Record<string, string>): Promise<Record<string, FieldError>> => {
    const formErrors: Record<string, FieldError> = {};

    for (const name of Object.keys(options.schema)) {
      const value = values[name] || '';
      const error = await validateField(name, value);
      if (error) {
        formErrors[name] = error;
      }
    }

    return formErrors;
  }, [options.schema, validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getSuggestion = useCallback(async (name: string, value: string): Promise<string | null> => {
    const fieldSchema = options.schema[name];
    if (!fieldSchema || !value.trim()) return null;

    try {
      const prompt = `Suggest a correction or improvement for this ${fieldSchema.type} field:
Field: ${fieldSchema.label || name}
Current value: "${value}"

Respond with just the corrected value, nothing else.`;

      const response = await chat([{ role: 'user', content: prompt }]);
      return response.trim();
    } catch {
      return null;
    }
  }, [chat, options.schema]);

  return {
    errors,
    isValidating,
    validateField,
    validateForm,
    clearErrors,
    getSuggestion,
  };
}

