/**
 * SmartForm Component
 */

import React, { useCallback } from 'react';
import { SmartFormProps, FieldSchema, FieldOption } from '../types';
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

  const handleMultiChange = useCallback((name: string, optionValue: string, checked: boolean) => {
    const val = values[name];
    const currentValues = Array.isArray(val) ? val : (val ? String(val).split(',').filter(Boolean) : []);
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter(v => v !== optionValue);
    onChange({ ...values, [name]: newValues.join(',') });
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

  // Render select field
  const renderSelect = (name: string, field: FieldSchema, error: boolean) => (
    <select
      name={name}
      value={values[name] || ''}
      onChange={(e) => handleChange(name, e.target.value)}
      onBlur={() => handleBlur(name, values[name] || '')}
      className={`reactai-form-input reactai-form-select ${error ? 'error' : ''}`}
      disabled={isSubmitting}
      required={field.required}
    >
      <option value="">{field.placeholder || 'Select an option...'}</option>
      {field.options?.map((opt: FieldOption) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  // Render radio group
  const renderRadio = (name: string, field: FieldSchema, _error: boolean) => (
    <div className={`reactai-form-radio-group ${field.inline ? 'inline' : ''}`}>
      {field.options?.map((opt: FieldOption) => (
        <label key={opt.value} className={`reactai-form-radio-label ${opt.disabled ? 'disabled' : ''}`}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={values[name] === opt.value}
            onChange={(e) => handleChange(name, e.target.value)}
            onBlur={() => handleBlur(name, values[name] || '')}
            disabled={isSubmitting || opt.disabled}
            className="reactai-form-radio"
          />
          <span className="reactai-form-radio-custom" />
          <span className="reactai-form-radio-text">{opt.label}</span>
        </label>
      ))}
    </div>
  );

  // Render checkbox (single or group for multiselect-like behavior)
  const renderCheckbox = (name: string, field: FieldSchema, _error: boolean) => {
    // Single checkbox (boolean)
    if (!field.options || field.options.length === 0) {
      return (
        <label className="reactai-form-checkbox-label">
          <input
            type="checkbox"
            name={name}
            checked={values[name] === 'true'}
            onChange={(e) => handleChange(name, e.target.checked ? 'true' : 'false')}
            onBlur={() => handleBlur(name, values[name] || '')}
            disabled={isSubmitting}
            className="reactai-form-checkbox"
          />
          <span className="reactai-form-checkbox-custom" />
          <span className="reactai-form-checkbox-text">{field.placeholder || 'Check this option'}</span>
        </label>
      );
    }

    // Multiple checkboxes (multiselect behavior)
    const val = values[name];
    const selectedValues = Array.isArray(val) ? val : (val ? String(val).split(',') : []);
    return (
      <div className={`reactai-form-checkbox-group ${field.inline ? 'inline' : ''}`}>
        {field.options.map((opt: FieldOption) => (
          <label key={opt.value} className={`reactai-form-checkbox-label ${opt.disabled ? 'disabled' : ''}`}>
            <input
              type="checkbox"
              name={name}
              value={opt.value}
              checked={selectedValues.includes(opt.value)}
              onChange={(e) => handleMultiChange(name, opt.value, e.target.checked)}
              onBlur={() => handleBlur(name, values[name] || '')}
              disabled={isSubmitting || opt.disabled}
              className="reactai-form-checkbox"
            />
            <span className="reactai-form-checkbox-custom" />
            <span className="reactai-form-checkbox-text">{opt.label}</span>
          </label>
        ))}
      </div>
    );
  };

  // Render multiselect (select with multiple attribute)
  const renderMultiSelect = (name: string, field: FieldSchema, error: boolean) => {
    const multiVal = values[name];
    const selectedValues = Array.isArray(multiVal) ? multiVal : (multiVal ? String(multiVal).split(',') : []);
    return (
      <select
        name={name}
        multiple
        value={selectedValues}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions, option => option.value);
          onChange({ ...values, [name]: selected.join(',') });
        }}
        onBlur={() => handleBlur(name, values[name] || '')}
        className={`reactai-form-input reactai-form-multiselect ${error ? 'error' : ''}`}
        disabled={isSubmitting}
        required={field.required}
      >
        {field.options?.map((opt: FieldOption) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  };

  const renderField = (name: string, field: FieldSchema) => {
    const error = errors[name];
    const value = values[name] || '';
    const hasError = !!error;

    // Render based on field type
    let fieldContent: React.ReactNode;

    switch (field.type) {
      case 'select':
        fieldContent = renderSelect(name, field, hasError);
        break;
      case 'radio':
        fieldContent = renderRadio(name, field, hasError);
        break;
      case 'checkbox':
        fieldContent = renderCheckbox(name, field, hasError);
        break;
      case 'multiselect':
        fieldContent = renderMultiSelect(name, field, hasError);
        break;
      case 'textarea':
        fieldContent = (
          <textarea
            name={name}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            onBlur={() => handleBlur(name, value)}
            placeholder={field.placeholder}
            className={`reactai-form-input ${hasError ? 'error' : ''}`}
            disabled={isSubmitting}
            minLength={field.minLength}
            maxLength={field.maxLength}
            required={field.required}
          />
        );
        break;
      default:
        fieldContent = (
          <input
            type={field.type}
            name={name}
            value={value}
            onChange={(e) => handleChange(name, e.target.value)}
            onBlur={() => handleBlur(name, value)}
            placeholder={field.placeholder}
            className={`reactai-form-input ${hasError ? 'error' : ''}`}
            disabled={isSubmitting}
            minLength={field.minLength}
            maxLength={field.maxLength}
            required={field.required}
          />
        );
    }

    return (
      <div key={name} className="reactai-form-field">
        {field.label && (
          <label className="reactai-form-label">
            {field.label}
            {field.required && <span className="reactai-required">*</span>}
          </label>
        )}
        {fieldContent}
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

