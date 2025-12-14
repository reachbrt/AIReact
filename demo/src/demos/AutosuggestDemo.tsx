import React, { useState } from 'react';
import { Autosuggest } from '@aireact/autosuggest';

interface AutosuggestDemoProps {
  apiKey: string;
}

export const AutosuggestDemo: React.FC<AutosuggestDemoProps> = ({ apiKey }) => {
  const [value, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ● Live Demo
        </span>
        <span className="text-sm text-slate-500">Start typing to see AI suggestions</span>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Search for anything:
        </label>
        <Autosuggest
          value={value}
          onChange={setValue}
          provider="openai"
          apiKey={apiKey}
          placeholder="Start typing to get AI suggestions..."
          minLength={2}
          debounce={300}
          maxSuggestions={5}
          context="General knowledge and common search queries"
          onSuggestionSelect={(suggestion) => {
            setSelectedValue(suggestion.text);
          }}
        />
      </div>

      {selectedValue && (
        <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-xl animate-fade-in">
          <span className="text-slate-600">Selected:</span>
          <strong className="ml-2 text-primary-700">{selectedValue}</strong>
        </div>
      )}

      <div className="mt-6 p-4 bg-slate-100 rounded-xl">
        <p className="text-sm text-slate-600">
          <strong>💡 Tip:</strong> Type at least 2 characters to see AI-powered suggestions.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          The autosuggest component uses AI to generate contextually relevant suggestions based on your input.
        </p>
      </div>
    </div>
  );
};

