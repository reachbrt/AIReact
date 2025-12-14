import React, { useState } from 'react';
import { AnalyticsDashboard, AnalyticsEvent } from '@aireact/analytics';

interface AnalyticsDemoProps {
  apiKey: string;
}

const generateMockEvents = (): AnalyticsEvent[] => {
  const eventNames = ['page_view', 'button_click', 'form_submit', 'search', 'purchase'];
  const categories = ['navigation', 'interaction', 'conversion', 'engagement'];

  return Array.from({ length: 15 }, (_, i) => ({
    id: `evt_${i}`,
    name: eventNames[Math.floor(Math.random() * eventNames.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    properties: {
      source: ['organic', 'paid', 'referral'][Math.floor(Math.random() * 3)],
    },
  }));
};

export const AnalyticsDemo: React.FC<AnalyticsDemoProps> = ({ apiKey }) => {
  const [events] = useState<AnalyticsEvent[]>(generateMockEvents());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ● Live Demo
          </span>
          <span className="text-sm text-slate-500">Real-time analytics dashboard</span>
        </div>
        <button
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
            ${theme === 'light'
              ? 'bg-slate-800 text-white hover:bg-slate-700'
              : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200'
            }
          `}
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>

      <AnalyticsDashboard
        events={events}
        showInsights={true}
        theme={theme}
        provider="openai"
        apiKey={apiKey}
      />

      <div className="mt-6 p-4 bg-slate-100 rounded-xl">
        <p className="text-sm font-semibold text-slate-700 mb-2">💡 Features:</p>
        <ul className="text-sm text-slate-600 space-y-1.5">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Real-time metrics visualization
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> AI-generated insights and recommendations
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Event tracking and categorization
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Light and dark theme support
          </li>
        </ul>
      </div>
    </div>
  );
};

