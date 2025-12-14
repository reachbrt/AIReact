import React, { useState, useRef } from 'react';
import { ChatbotDemo } from './demos/ChatbotDemo';
import { AutosuggestDemo } from './demos/AutosuggestDemo';
import { SmartFormDemo } from './demos/SmartFormDemo';
import { AnalyticsDemo } from './demos/AnalyticsDemo';
import { ImageCaptionDemo } from './demos/ImageCaptionDemo';
import { EmotionUIDemo } from './demos/EmotionUIDemo';
import { DocIntelligenceDemo } from './demos/DocIntelligenceDemo';
import { PredictiveInputDemo } from './demos/PredictiveInputDemo';
import { SmartNotifyDemo } from './demos/SmartNotifyDemo';
import { VoiceActionsDemo } from './demos/VoiceActionsDemo';
import { SmartDataTableDemo } from './demos/SmartDataTableDemo';
import { SpinViewerDemo } from './demos/SpinViewerDemo';
import { REACTAI_CORE_VERSION } from '@aireact/core';
import { REACTAI_CHATBOT_VERSION } from '@aireact/chatbot';
import { REACTAI_AUTOSUGGEST_VERSION } from '@aireact/autosuggest';
import { REACTAI_SMARTFORM_VERSION } from '@aireact/smartform';
import { REACTAI_ANALYTICS_VERSION } from '@aireact/analytics';
import { REACTAI_IMAGE_CAPTION_VERSION } from '@aireact/image-caption';
import { REACTAI_EMOTION_UI_VERSION } from '@aireact/emotion-ui';
import { REACTAI_DOC_INTELLIGENCE_VERSION } from '@aireact/doc-intelligence';
import { REACTAI_PREDICTIVE_INPUT_VERSION } from '@aireact/predictive-input';
import { REACTAI_SMART_NOTIFY_VERSION } from '@aireact/smart-notify';
import { REACTAI_VOICE_ACTIONS_VERSION } from '@aireact/voice-actions';
import { REACTAI_SMART_DATATABLE_VERSION } from '@aireact/smart-datatable';
import { REACTAI_360_SPIN_VERSION } from '@aireact/360-spin';

type DemoTab = 'chatbot' | 'autosuggest' | 'smartform' | 'analytics' | 'image-caption' | 'emotion-ui' | 'doc-intelligence' | 'predictive-input' | 'smart-notify' | 'voice-actions' | 'smart-datatable' | '360-spin';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DemoTab>('chatbot');
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('reactai_openai_key') || '';
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [tempApiKey, setTempApiKey] = useState('');
  const demoSectionRef = useRef<HTMLDivElement>(null);

  const tabs: { id: DemoTab; label: string; icon: string; desc: string }[] = [
    { id: 'chatbot', label: 'Chatbot', icon: '💬', desc: 'Enterprise AI chatbot with streaming responses and multi-provider support.' },
    { id: 'autosuggest', label: 'Autosuggest', icon: '🔍', desc: 'AI-powered smart suggestions with real-time autocomplete.' },
    { id: 'smartform', label: 'Smart Form', icon: '📝', desc: 'Intelligent form validation with AI-powered auto-correction.' },
    { id: 'analytics', label: 'Analytics', icon: '📊', desc: 'AI-powered analytics dashboard with actionable insights.' },
    { id: 'image-caption', label: 'Image Caption', icon: '🖼️', desc: 'AI image captioning with GPT-4 Vision integration.' },
    { id: 'emotion-ui', label: 'Emotion UI', icon: '😊', desc: 'Emotion-aware adaptive UI components.' },
    { id: 'doc-intelligence', label: 'Doc Intelligence', icon: '📄', desc: 'Document OCR & intelligent data extraction.' },
    { id: 'predictive-input', label: 'Predictive Input', icon: '✨', desc: 'AI predictive text completion.' },
    { id: 'smart-notify', label: 'Smart Notify', icon: '🔔', desc: 'Smart notifications with priority management.' },
    { id: 'voice-actions', label: 'Voice Actions', icon: '🎤', desc: 'Voice commands & speech recognition.' },
    { id: 'smart-datatable', label: 'Smart DataTable', icon: '📋', desc: 'AI-native data tables with NLP queries.' },
    { id: '360-spin', label: '360 Spin', icon: '🔄', desc: 'Interactive 360° product viewer.' },
  ];

  const versions: Record<string, string> = {
    core: REACTAI_CORE_VERSION,
    chatbot: REACTAI_CHATBOT_VERSION,
    autosuggest: REACTAI_AUTOSUGGEST_VERSION,
    smartform: REACTAI_SMARTFORM_VERSION,
    analytics: REACTAI_ANALYTICS_VERSION,
    'image-caption': REACTAI_IMAGE_CAPTION_VERSION,
    'emotion-ui': REACTAI_EMOTION_UI_VERSION,
    'doc-intelligence': REACTAI_DOC_INTELLIGENCE_VERSION,
    'predictive-input': REACTAI_PREDICTIVE_INPUT_VERSION,
    'smart-notify': REACTAI_SMART_NOTIFY_VERSION,
    'voice-actions': REACTAI_VOICE_ACTIONS_VERSION,
    'smart-datatable': REACTAI_SMART_DATATABLE_VERSION,
    '360-spin': REACTAI_360_SPIN_VERSION,
  };

  const currentTab = tabs.find(t => t.id === activeTab);

  const handleSaveApiKey = () => {
    if (tempApiKey.trim().startsWith('sk-')) {
      setApiKey(tempApiKey.trim());
      localStorage.setItem('reactai_openai_key', tempApiKey.trim());
      setShowApiKeyInput(false);
    }
  };

  const handleClearApiKey = () => {
    setApiKey('');
    setTempApiKey('');
    localStorage.removeItem('reactai_openai_key');
    setShowApiKeyInput(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

        <div className="max-w-5xl mx-auto text-center relative">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">⚛️ ReactAI</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Production-ready AI components for React. Build intelligent apps in minutes, not months.
          </p>

          {/* API Key Status */}
          {apiKey && (
            <div className="mt-6 inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                OpenAI Connected
              </span>
              <button
                onClick={handleClearApiKey}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
              >
                Change Key
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap justify-center gap-3 mt-10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Scroll to demo section after a brief delay for state update
                  setTimeout(() => {
                    demoSectionRef.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }, 100);
                }}
                className={`
                  px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2
                  transition-all duration-300 transform hover:-translate-y-0.5
                  ${activeTab === tab.id
                    ? 'bg-white text-primary-600 shadow-xl shadow-black/20'
                    : 'bg-white/15 text-white border-2 border-white/30 hover:bg-white/25 hover:shadow-lg'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* API Key Input Section */}
        {showApiKeyInput && (
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 mb-8">
            <div className="max-w-xl mx-auto text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔑</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Enter Your OpenAI API Key</h2>
              <p className="text-slate-500 mb-6">
                To use the AI-powered demos, please enter your OpenAI API key.
                Your key is stored locally in your browser and never sent to our servers.
              </p>

              <div className="flex gap-3">
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-800"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
                />
                <button
                  onClick={handleSaveApiKey}
                  disabled={!tempApiKey.startsWith('sk-')}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Connect
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-4">
                Don't have an API key? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Get one from OpenAI</a>
              </p>
            </div>
          </div>
        )}

        {/* Info Cards - Now at the top */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Packages Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <span className="text-2xl">📦</span> Installed Packages
            </h3>
            <div className="space-y-3">
              {Object.entries(versions).map(([pkg, version]) => (
                <div key={pkg} className="flex items-center justify-between py-2 px-4 bg-slate-50 rounded-lg">
                  <span className="font-medium text-primary-600">@aireact/{pkg}</span>
                  <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                    v{version}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Start Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <span className="text-2xl">🚀</span> Quick Start
            </h3>
            <pre className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto border border-slate-700">
              <code>{`npm install @aireact/core @aireact/chatbot

import { ChatWindow } from '@aireact/chatbot';

<ChatWindow
  provider="openai"
  apiKey="your-api-key"
/>`}</code>
            </pre>
          </div>
        </div>

        {/* Demo Section - Now at the bottom */}
        <div
          ref={demoSectionRef}
          className={`bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 scroll-mt-6 ${!apiKey ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <span className="text-3xl">{currentTab?.icon}</span>
                @aireact/{activeTab}
              </h2>
              <p className="text-slate-500 mt-2 text-lg">{currentTab?.desc}</p>
            </div>
            <span className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full text-sm font-bold shadow-lg shadow-primary-500/25">
              v{versions[activeTab]}
            </span>
          </div>

          {!apiKey && (
            <div className="text-center py-12">
              <p className="text-slate-500">Please enter your OpenAI API key above to use the demos.</p>
            </div>
          )}

          {apiKey && (
            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
              {activeTab === 'chatbot' && <ChatbotDemo apiKey={apiKey} />}
              {activeTab === 'autosuggest' && <AutosuggestDemo apiKey={apiKey} />}
              {activeTab === 'smartform' && <SmartFormDemo apiKey={apiKey} />}
              {activeTab === 'analytics' && <AnalyticsDemo apiKey={apiKey} />}
              {activeTab === 'image-caption' && <ImageCaptionDemo apiKey={apiKey} />}
              {activeTab === 'emotion-ui' && <EmotionUIDemo apiKey={apiKey} />}
              {activeTab === 'doc-intelligence' && <DocIntelligenceDemo apiKey={apiKey} />}
              {activeTab === 'predictive-input' && <PredictiveInputDemo apiKey={apiKey} />}
              {activeTab === 'smart-notify' && <SmartNotifyDemo apiKey={apiKey} />}
              {activeTab === 'voice-actions' && <VoiceActionsDemo apiKey={apiKey} />}
              {activeTab === 'smart-datatable' && <SmartDataTableDemo apiKey={apiKey} />}
              {activeTab === '360-spin' && <SpinViewerDemo apiKey={apiKey} />}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-10 text-slate-500">
        <p>Built with ❤️ by <strong className="text-primary-500">reachbrt</strong></p>
        <p className="mt-2 text-sm opacity-70">Open the browser console to see version logs</p>
      </footer>
    </div>
  );
};

export default App;

