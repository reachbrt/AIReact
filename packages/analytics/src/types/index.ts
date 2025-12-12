/**
 * @reactai/analytics - Type definitions
 */

import { AIProvider } from '@reactai/core';

export interface AnalyticsEvent {
  id: string;
  name: string;
  category: string;
  timestamp: Date;
  properties?: Record<string, unknown>;
}

export interface AnalyticsMetric {
  name: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'tip';
  timestamp: Date;
}

export interface AnalyticsConfig {
  enabled: boolean;
  trackInteractions: boolean;
  trackAIRequests: boolean;
  storageKey?: string;
}

export interface AnalyticsDashboardProps {
  /** AI provider */
  provider?: AIProvider;
  /** API key */
  apiKey?: string;
  /** Model */
  model?: string;
  /** Events to display */
  events?: AnalyticsEvent[];
  /** Metrics to display */
  metrics?: AnalyticsMetric[];
  /** Show AI insights */
  showInsights?: boolean;
  /** Custom class name */
  className?: string;
  /** Theme */
  theme?: 'light' | 'dark';
}

export interface UseAnalyticsOptions {
  config: AnalyticsConfig;
  provider?: AIProvider;
  apiKey?: string;
  model?: string;
}

export interface UseAnalyticsReturn {
  events: AnalyticsEvent[];
  metrics: AnalyticsMetric[];
  insights: AIInsight[];
  isLoading: boolean;
  track: (name: string, properties?: Record<string, unknown>) => void;
  generateInsights: () => Promise<void>;
  clearEvents: () => void;
  getMetrics: () => AnalyticsMetric[];
}

