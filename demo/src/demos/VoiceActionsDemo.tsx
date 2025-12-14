/**
 * VoiceActions Demo Component
 */

import React, { useState } from 'react';
import { VoiceButton, useVoiceRecognition } from '@aireact/voice-actions';

interface VoiceActionsDemoProps {
  apiKey: string;
}

export const VoiceActionsDemo: React.FC<VoiceActionsDemoProps> = ({ apiKey: _apiKey }) => {
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const { transcript, isListening, isSupported, startListening, stopListening, resetTranscript } = useVoiceRecognition({
    language: 'en-US',
    continuous: true,
  });

  const commands = [
    { phrase: 'hello', action: () => setLastCommand('Greeting detected!') },
    { phrase: 'search for', action: (text: string) => setLastCommand(`Searching: ${text}`) },
    { phrase: 'navigate to', action: (text: string) => setLastCommand(`Navigating: ${text}`) },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Voice Commands</h3>
        <p className="text-slate-500 text-sm">
          Control your app with voice commands using the Web Speech API.
        </p>
      </div>

      {/* Support Check */}
      {!isSupported && (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl text-center">
          Voice recognition is not supported in this browser. Try Chrome or Edge.
        </div>
      )}

      {/* Voice Button */}
      <div className="flex justify-center">
        <VoiceButton
          onTranscript={(text) => console.log('Transcript:', text)}
          onCommand={(cmd) => setLastCommand(cmd)}
          commands={commands}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50'
              : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg'
          }`}
        />
      </div>

      {/* Manual Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => startListening(commands)}
          disabled={isListening || !isSupported}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          🎤 Start
        </button>
        <button
          onClick={stopListening}
          disabled={!isListening}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          ⏹ Stop
        </button>
        <button
          onClick={resetTranscript}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
        >
          🔄 Reset
        </button>
      </div>

      {/* Transcript Display */}
      <div className="max-w-lg mx-auto bg-slate-50 p-4 rounded-xl min-h-[100px]">
        <div className="text-xs text-slate-400 uppercase mb-2">Transcript</div>
        <p className="text-slate-700">{transcript || 'Start speaking...'}</p>
      </div>

      {/* Last Command */}
      {lastCommand && (
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-xl border border-primary-100 max-w-lg mx-auto">
          <p className="text-slate-700 text-center">
            <span className="font-semibold text-primary-600">Command:</span> {lastCommand}
          </p>
        </div>
      )}

      {/* Available Commands */}
      <div className="max-w-lg mx-auto">
        <h4 className="text-sm font-medium text-slate-600 mb-2">Try saying:</h4>
        <div className="flex flex-wrap gap-2">
          {['Hello', 'Search for cats', 'Navigate to home'].map((cmd) => (
            <span key={cmd} className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
              "{cmd}"
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

