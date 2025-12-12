import React from 'react';
import { ChatWindow } from '@reactai/chatbot';

interface ChatbotDemoProps {
  apiKey: string;
}

export const ChatbotDemo: React.FC<ChatbotDemoProps> = ({ apiKey }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ● Live Demo
        </span>
        <span className="text-sm text-slate-500">Try the chatbot below</span>
      </div>
      <ChatWindow
        provider="openai"
        apiKey={apiKey}
        title="ReactAI Assistant"
        placeholder="Ask me anything..."
        showTimestamp={true}
      />
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
        <p className="text-sm text-green-800">
          <strong>✓ Connected:</strong> Using OpenAI GPT for real AI responses.
        </p>
      </div>
    </div>
  );
};

