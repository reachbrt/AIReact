/**
 * SmartForm Component
 */

import React, { useCallback } from 'react';
import { SmartFormProps, FieldSchema } from '../types';
import { useSmartValidation } from '../hooks/useSmartValidation';

export const SmartForm: React.FC<SmartFormProps> = ({
  schema,
  values,
  onChange,
  onSubmit,
  provider = 'fallback',
  apiKey,
  model,
  aiValidation = true,
  autoCorrect = false,
  className = '',
  submitText = 'Submit',
  isSubmitting = false,
}) => {
  const { errors, isValidating, validateField, getSuggestion } = useSmartValidation({
    provider,
    apiKey,
    model,
    schema,
  });

  const handleChange = useCallback((name: string, value: string) => {
    onChange({ ...values, [name]: value });
  }, [values, onChange]);

  const handleBlur = useCallback(async (name: string, value: string) => {
    if (aiValidation) {
      await validateField(name, value);
    }

    if (autoCorrect && value.trim()) {
      const suggestion = await getSuggestion(name, value);
      if (suggestion && suggestion !== value) {
        onChange({ ...values, [name]: suggestion });
      }
    }
  }, [aiValidation, autoCorrect, validateField, getSuggestion, values, onChange]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  }, [values, onSubmit]);

  const renderField = (name: string, field: FieldSchema) => {
    const error = errors[name];
    const value = values[name] || '';
    const InputComponent = field.type === 'textarea' ? 'textarea' : 'input';
    
    return (
      <div key={name} className="reactai-form-field">
        {field.label && (
          <label className="reactai-form-label">
            {field.label}
            {field.required && <span className="reactai-required">*</span>}
          </label>
        )}
        <InputComponent
          type={field.type === 'textarea' ? undefined : field.type}
          name={name}
          value={value}
          onChange={(e) => handleChange(name, e.target.value)}
          onBlur={() => handleBlur(name, value)}
          placeholder={field.placeholder}
          className={`reactai-form-input ${error ? 'error' : ''}`}
          disabled={isSubmitting}
          minLength={field.minLength}
          maxLength={field.maxLength}
          required={field.required}
        />
        {error && (
          <div className="reactai-form-error">
            <span>⚠️ {error.message}</span>
            {error.suggestion && (
              <button
                type="button"
                className="reactai-apply-suggestion"
                onClick={() => handleChange(name, error.suggestion!)}
              >
                Apply: {error.suggestion}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <form className={`reactai-smart-form ${className}`} onSubmit={handleSubmit}>
      {Object.entries(schema).map(([name, field]) => renderField(name, field))}
      
      <button
        type="submit"
        className="reactai-form-submit"
        disabled={isSubmitting || isValidating}
      >
        {isSubmitting ? 'Submitting...' : isValidating ? 'Validating...' : submitText}
      </button>
    </form>
  );
};

