/**
 * PredictiveInput Demo Component
 */

import React, { useState } from 'react';
import { PredictiveInput } from '@aireact/predictive-input';

interface PredictiveInputDemoProps {
  apiKey: string;
}

export const PredictiveInputDemo: React.FC<PredictiveInputDemoProps> = ({ apiKey }) => {
  const [value, setValue] = useState('');
  const [acceptedPrediction, setAcceptedPrediction] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">AI Predictive Input</h3>
        <p className="text-slate-500 text-sm">
          Start typing and see AI-powered text predictions appear in real-time.
        </p>
      </div>

      {/* Predictive Input */}
      <div className="max-w-lg mx-auto">
        <PredictiveInput
          value={value}
          onChange={setValue}
          onPredictionAccept={(prediction) => {
            setValue(prediction);
            setAcceptedPrediction(prediction);
          }}
          apiKey={apiKey}
          provider="openai"
          placeholder="Start typing a sentence..."
          className="w-full"
          debounceMs={300}
        />
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-slate-500">
        <p>Press <kbd className="px-2 py-1 bg-slate-200 rounded text-xs">Tab</kbd> to accept a prediction</p>
      </div>

      {/* Accepted Prediction */}
      {acceptedPrediction && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-xl border border-primary-100 max-w-lg mx-auto">
          <p className="text-slate-700 text-center">
            <span className="font-semibold text-primary-600">Accepted:</span> {acceptedPrediction}
          </p>
        </div>
      )}

      {/* Example Prompts */}
      <div className="max-w-lg mx-auto">
        <h4 className="text-sm font-medium text-slate-600 mb-2">Try these:</h4>
        <div className="flex flex-wrap gap-2">
          {[
            'The quick brown fox',
            'Once upon a time',
            'In the beginning',
            'Dear Sir or Madam',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setValue(prompt)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-600 transition-colors"
            >
              {prompt}...
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

