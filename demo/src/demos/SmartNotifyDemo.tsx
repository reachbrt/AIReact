/**
 * SmartNotify Demo Component
 */

import React, { useState } from 'react';
import { NotificationContainer, useNotifications } from '@aireact/smart-notify';
import { useAIClient } from '@aireact/core';

interface SmartNotifyDemoProps {
  apiKey: string;
}

export const SmartNotifyDemo: React.FC<SmartNotifyDemoProps> = ({ apiKey }) => {
  const { notifications, notify, dismiss, dismissAll, success, error, warning, info } = useNotifications();
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { chat } = useAIClient({
    provider: apiKey ? 'openai' : 'fallback',
    apiKey,
  });

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    const handlers = { success, error, warning, info };
    const messages = {
      success: { title: 'Success!', message: 'Your action was completed successfully.' },
      error: { title: 'Error', message: 'Something went wrong. Please try again.' },
      warning: { title: 'Warning', message: 'Please review your input before continuing.' },
      info: { title: 'Info', message: 'Here is some helpful information for you.' },
    };
    handlers[type](messages[type].title, messages[type].message);
  };

  // AI-powered notification generation
  const generateAiNotification = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await chat([
        {
          role: 'system',
          content: `You are a notification generator. Based on the user's input, generate a JSON response with:
- type: one of "success", "error", "warning", "info"
- title: a short title (max 50 chars)
- message: a helpful message (max 150 chars)
- priority: one of "low", "normal", "high", "urgent"

Respond ONLY with valid JSON, no markdown or explanation.`
        },
        { role: 'user', content: aiPrompt }
      ]);

      // Parse AI response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        notify({
          type: parsed.type || 'info',
          title: parsed.title || 'AI Notification',
          message: parsed.message || response,
          priority: parsed.priority || 'normal',
          duration: parsed.priority === 'urgent' ? 0 : 5000,
        });
      } else {
        info('AI Response', response.slice(0, 150));
      }
      setAiPrompt('');
    } catch (err) {
      error('AI Error', 'Failed to generate notification');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Smart Notifications</h3>
        <p className="text-slate-500 text-sm">
          AI-powered notification system with smart grouping and priority management.
        </p>
      </div>

      {/* AI Notification Generator */}
      <div className="max-w-xl mx-auto p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
        <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
          🤖 AI Notification Generator
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateAiNotification()}
            placeholder="Describe a notification... (e.g., 'payment successful for $50')"
            className="flex-1 px-3 py-2 text-sm border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isGenerating}
          />
          <button
            onClick={generateAiNotification}
            disabled={isGenerating || !aiPrompt.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-lg transition-colors text-sm font-medium"
          >
            {isGenerating ? '...' : '✨ Generate'}
          </button>
        </div>
        <p className="text-xs text-purple-600 mt-2">
          AI will determine the notification type, title, message, and priority automatically.
        </p>
      </div>

      {/* Manual Notification Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => showNotification('success')}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          ✓ Success
        </button>
        <button
          onClick={() => showNotification('error')}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          ✕ Error
        </button>
        <button
          onClick={() => showNotification('warning')}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
        >
          ⚠ Warning
        </button>
        <button
          onClick={() => showNotification('info')}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          ℹ Info
        </button>
      </div>

      {/* Priority Examples */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => notify({ title: 'Low Priority', message: 'This can wait', type: 'info', priority: 'low' })}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors text-sm"
        >
          Low Priority
        </button>
        <button
          onClick={() => notify({ title: 'High Priority', message: 'Important update!', type: 'warning', priority: 'high' })}
          className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors text-sm"
        >
          High Priority
        </button>
        <button
          onClick={() => notify({ title: '🚨 Urgent!', message: 'Requires immediate attention', type: 'error', priority: 'urgent', duration: 0 })}
          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm"
        >
          Urgent (Sticky)
        </button>
      </div>

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <div className="text-center">
          <button
            onClick={dismissAll}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors text-sm"
          >
            Clear All ({notifications.length})
          </button>
        </div>
      )}

      {/* Notification Container */}
      <NotificationContainer
        notifications={notifications}
        onDismiss={dismiss}
        position="top-right"
      />

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
        {[
          { icon: '🤖', label: 'AI-Generated' },
          { icon: '🎯', label: 'Smart Priority' },
          { icon: '⏱️', label: 'Auto Dismiss' },
          { icon: '🎨', label: 'Customizable' },
        ].map((feature) => (
          <div key={feature.label} className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl mb-1">{feature.icon}</div>
            <div className="text-xs text-slate-600">{feature.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

