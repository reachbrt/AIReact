/**
 * SmartNotify Demo Component
 */

import React from 'react';
import { NotificationContainer, useNotifications } from '@aireact/smart-notify';

interface SmartNotifyDemoProps {
  apiKey: string;
}

export const SmartNotifyDemo: React.FC<SmartNotifyDemoProps> = ({ apiKey: _apiKey }) => {
  const { notifications, addNotification, removeNotification, clearAll } = useNotifications();

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: { title: 'Success!', message: 'Your action was completed successfully.' },
      error: { title: 'Error', message: 'Something went wrong. Please try again.' },
      warning: { title: 'Warning', message: 'Please review your input before continuing.' },
      info: { title: 'Info', message: 'Here is some helpful information for you.' },
    };

    addNotification({
      type,
      title: messages[type].title,
      message: messages[type].message,
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Smart Notifications</h3>
        <p className="text-slate-500 text-sm">
          AI-powered notification system with smart grouping and priority management.
        </p>
      </div>

      {/* Notification Buttons */}
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

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <div className="text-center">
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors text-sm"
          >
            Clear All ({notifications.length})
          </button>
        </div>
      )}

      {/* Notification Container */}
      <NotificationContainer
        notifications={notifications}
        onDismiss={removeNotification}
        position="top-right"
      />

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
        {[
          { icon: '🎯', label: 'Smart Priority' },
          { icon: '📦', label: 'Auto Grouping' },
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

