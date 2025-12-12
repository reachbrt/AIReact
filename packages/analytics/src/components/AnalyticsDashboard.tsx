/**
 * AnalyticsDashboard Component
 */

import React from 'react';
import { AnalyticsDashboardProps, AnalyticsMetric, AIInsight, AnalyticsEvent } from '../types';

const MetricCard: React.FC<{ metric: AnalyticsMetric }> = ({ metric }) => (
  <div className="reactai-metric-card">
    <div className="reactai-metric-name">{metric.name}</div>
    <div className="reactai-metric-value">{metric.value.toLocaleString()}</div>
    {metric.trend && (
      <div className={`reactai-metric-trend ${metric.trend}`}>
        {metric.trend === 'up' && '↑'}
        {metric.trend === 'down' && '↓'}
        {metric.trend === 'stable' && '→'}
        {metric.change !== undefined && ` ${Math.abs(metric.change)}`}
      </div>
    )}
  </div>
);

const InsightCard: React.FC<{ insight: AIInsight }> = ({ insight }) => (
  <div className={`reactai-insight-card ${insight.type}`}>
    <div className="reactai-insight-icon">
      {insight.type === 'info' && 'ℹ️'}
      {insight.type === 'warning' && '⚠️'}
      {insight.type === 'success' && '✅'}
      {insight.type === 'tip' && '💡'}
    </div>
    <div className="reactai-insight-content">
      <div className="reactai-insight-title">{insight.title}</div>
      <div className="reactai-insight-description">{insight.description}</div>
    </div>
  </div>
);

const EventRow: React.FC<{ event: AnalyticsEvent }> = ({ event }) => (
  <tr className="reactai-event-row">
    <td>{event.name}</td>
    <td><span className="reactai-event-category">{event.category}</span></td>
    <td>{event.timestamp.toLocaleTimeString()}</td>
  </tr>
);

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  events = [],
  metrics = [],
  showInsights = true,
  className = '',
  theme = 'light',
}) => {
  // Generate default metrics if none provided
  const displayMetrics = metrics.length > 0 ? metrics : [
    { name: 'Total Events', value: events.length, trend: 'stable' as const },
    { name: 'Categories', value: [...new Set(events.map(e => e.category))].length, trend: 'stable' as const },
    { name: 'Today', value: events.filter(e => {
      const today = new Date();
      return e.timestamp.toDateString() === today.toDateString();
    }).length, trend: 'up' as const },
  ];

  // Mock insights for display
  const mockInsights: AIInsight[] = showInsights ? [
    {
      id: '1',
      title: 'User Engagement',
      description: 'User interactions have increased by 15% this week.',
      type: 'success',
      timestamp: new Date(),
    },
    {
      id: '2',
      title: 'Performance Tip',
      description: 'Consider caching frequently accessed data to improve response times.',
      type: 'tip',
      timestamp: new Date(),
    },
  ] : [];

  return (
    <div className={`reactai-analytics-dashboard ${theme} ${className}`}>
      <div className="reactai-dashboard-header">
        <h2>📊 Analytics Dashboard</h2>
        <span className="reactai-dashboard-subtitle">AI-Powered Insights</span>
      </div>

      {/* Metrics Grid */}
      <div className="reactai-metrics-grid">
        {displayMetrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Insights Section */}
      {showInsights && mockInsights.length > 0 && (
        <div className="reactai-insights-section">
          <h3>🤖 AI Insights</h3>
          <div className="reactai-insights-list">
            {mockInsights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}

      {/* Events Table */}
      {events.length > 0 && (
        <div className="reactai-events-section">
          <h3>📋 Recent Events</h3>
          <table className="reactai-events-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Category</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {events.slice(-10).reverse().map(event => (
                <EventRow key={event.id} event={event} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

