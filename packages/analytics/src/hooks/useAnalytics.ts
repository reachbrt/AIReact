/**
 * useAnalytics - React hook for analytics tracking
 */

import { useState, useCallback, useEffect } from 'react';
import { useAIClient } from '@aireact/core';
import { 
  AnalyticsEvent, 
  AnalyticsMetric, 
  AIInsight, 
  UseAnalyticsOptions, 
  UseAnalyticsReturn 
} from '../types';

function generateId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function useAnalytics(options: UseAnalyticsOptions): UseAnalyticsReturn {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { chat } = useAIClient({
    provider: options.provider || 'fallback',
    apiKey: options.apiKey,
    model: options.model,
  });

  // Load events from storage
  useEffect(() => {
    if (options.config.storageKey) {
      const stored = localStorage.getItem(options.config.storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setEvents(parsed.map((e: AnalyticsEvent) => ({
            ...e,
            timestamp: new Date(e.timestamp),
          })));
        } catch {
          // Ignore invalid data
        }
      }
    }
  }, [options.config.storageKey]);

  // Save events to storage
  useEffect(() => {
    if (options.config.storageKey && events.length > 0) {
      localStorage.setItem(options.config.storageKey, JSON.stringify(events));
    }
  }, [events, options.config.storageKey]);

  const track = useCallback((name: string, properties?: Record<string, unknown>) => {
    if (!options.config.enabled) return;

    const event: AnalyticsEvent = {
      id: generateId(),
      name,
      category: properties?.category as string || 'general',
      timestamp: new Date(),
      properties,
    };

    setEvents(prev => [...prev, event]);
  }, [options.config.enabled]);

  const generateInsights = useCallback(async () => {
    if (events.length === 0) return;

    setIsLoading(true);
    try {
      const eventSummary = events.slice(-20).map(e => 
        `${e.name} (${e.category}) at ${e.timestamp.toISOString()}`
      ).join('\n');

      const prompt = `Analyze these user events and provide 3 actionable insights:

${eventSummary}

Respond with a JSON array of insights:
[{"title": "...", "description": "...", "type": "info|warning|success|tip"}]`;

      const response = await chat([{ role: 'user', content: prompt }]);
      
      try {
        const parsed = JSON.parse(response);
        if (Array.isArray(parsed)) {
          setInsights(parsed.map((insight, index) => ({
            id: `insight_${Date.now()}_${index}`,
            ...insight,
            timestamp: new Date(),
          })));
        }
      } catch {
        // If not valid JSON, create a simple insight
        setInsights([{
          id: generateId(),
          title: 'Analysis Complete',
          description: response.slice(0, 200),
          type: 'info',
          timestamp: new Date(),
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [events, chat]);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setInsights([]);
    if (options.config.storageKey) {
      localStorage.removeItem(options.config.storageKey);
    }
  }, [options.config.storageKey]);

  const getMetrics = useCallback((): AnalyticsMetric[] => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const recentEvents = events.filter(e => e.timestamp >= last24h);
    const previousEvents = events.filter(e => e.timestamp >= last48h && e.timestamp < last24h);

    const categories = [...new Set(events.map(e => e.category))];
    
    return [
      {
        name: 'Total Events',
        value: events.length,
        change: recentEvents.length - previousEvents.length,
        trend: recentEvents.length > previousEvents.length ? 'up' : 
               recentEvents.length < previousEvents.length ? 'down' : 'stable',
      },
      {
        name: 'Events (24h)',
        value: recentEvents.length,
        trend: 'stable',
      },
      {
        name: 'Categories',
        value: categories.length,
        trend: 'stable',
      },
    ];
  }, [events]);

  return {
    events,
    metrics: getMetrics(),
    insights,
    isLoading,
    track,
    generateInsights,
    clearEvents,
    getMetrics,
  };
}

