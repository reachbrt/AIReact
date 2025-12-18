import React, { useState } from 'react';
import { ChatWindow, ChatAttachment } from '@aireact/chatbot';

interface ChatbotDemoProps {
  apiKey: string;
}

interface ChatOptions {
  title: string;
  placeholder: string;
  theme: 'light' | 'dark';
  model: string;
  showAvatars: boolean;
  streaming: boolean;
  fullHeight: boolean;
  enableMarkdown: boolean;
  useProxy: boolean;
  proxyUrl: string;
  language: string;
  systemPrompt: string;
  enableFileUpload: boolean;
  enableVoiceInput: boolean;
  enableVoiceOutput: boolean;
}

const defaultOptions: ChatOptions = {
  title: 'AI Assistant',
  placeholder: 'Ask me anything...',
  theme: 'light',
  model: 'gpt-3.5-turbo',
  showAvatars: true,
  streaming: true,
  fullHeight: false,
  enableMarkdown: true,
  useProxy: false,
  proxyUrl: '/api/chat',
  language: 'en',
  systemPrompt: 'You are a helpful AI assistant. Answer questions concisely and accurately.',
  enableFileUpload: true,
  enableVoiceInput: true,
  enableVoiceOutput: false,
};

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const modelOptions = [
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
];

export const ChatbotDemo: React.FC<ChatbotDemoProps> = ({ apiKey }) => {
  const [options, setOptions] = useState<ChatOptions>(defaultOptions);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = (attachments: ChatAttachment[]) => {
    setUploadedFiles(prev => [...prev, ...attachments.map(a => a.name)]);
  };

  const updateOption = <K extends keyof ChatOptions>(key: K, value: ChatOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const resetOptions = () => {
    setOptions(defaultOptions);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              ⚙️ Configuration
            </span>
            <button
              onClick={resetOptions}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              🔄 Reset
            </button>
          </div>

        {/* Basic Configuration */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            🎨 Basic Configuration
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
              <input
                type="text"
                value={options.title}
                onChange={(e) => updateOption('title', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Placeholder</label>
              <input
                type="text"
                value={options.placeholder}
                onChange={(e) => updateOption('placeholder', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Theme</label>
                <select
                  value={options.theme}
                  onChange={(e) => updateOption('theme', e.target.value as 'light' | 'dark')}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {themeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Model</label>
                <select
                  value={options.model}
                  onChange={(e) => updateOption('model', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {modelOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        </div>

        {/* Toggle Options - Second Column */}
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              ✅ Toggle Options
            </h3>
            <div className="space-y-2">
              {[
                { key: 'streaming', label: 'Enable Streaming' },
                { key: 'fullHeight', label: 'Full Height' },
                { key: 'enableMarkdown', label: 'Enable Markdown' },
                { key: 'useProxy', label: 'Use Proxy' },
                { key: 'enableFileUpload', label: 'File Upload (RAG)' },
                { key: 'enableVoiceInput', label: 'Voice Input' },
                { key: 'enableVoiceOutput', label: 'Voice Output' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-50 p-1.5 rounded">
                  <input
                    type="checkbox"
                    checked={options[key as keyof ChatOptions] as boolean}
                    onChange={(e) => updateOption(key as keyof ChatOptions, e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Feature Info */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-800 mb-2">
              <strong>✓ Connected:</strong> {options.model}
            </p>
            <div className="text-xs text-slate-600 space-y-1">
              <p>📎 RAG: Upload files for context</p>
              <p>🎤 Voice: Speak or listen</p>
              <p>🌐 i18n: Multi-language</p>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-2 pt-2 border-t border-green-200">
                <p className="text-xs text-green-700">
                  <strong>Files:</strong> {uploadedFiles.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Options - Third Column */}
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              🔧 Advanced Options
            </h3>
            <div className="space-y-3">
              {options.useProxy && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Proxy URL</label>
                  <input
                    type="text"
                    value={options.proxyUrl}
                    onChange={(e) => updateOption('proxyUrl', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Language</label>
                <select
                  value={options.language}
                  onChange={(e) => updateOption('language', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {languageOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">System Prompt</label>
                <textarea
                  value={options.systemPrompt}
                  onChange={(e) => updateOption('systemPrompt', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Window - Separate Row */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ● Live Preview
          </span>
        </div>

        <div className={options.fullHeight ? 'h-[500px]' : 'h-[400px]'}>
          <ChatWindow
            provider="openai"
            apiKey={apiKey}
            model={options.model}
            title={options.title}
            placeholder={options.placeholder}
            theme={options.theme}
            streaming={options.streaming}
            systemPrompt={options.systemPrompt}
            showTimestamp={true}
            enableFileUpload={options.enableFileUpload}
            acceptedFileTypes=".txt,.md,.json,.csv,.html"
            enableVoiceInput={options.enableVoiceInput}
            enableVoiceOutput={options.enableVoiceOutput}
            onFileUpload={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};

