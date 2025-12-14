/**
 * @aireact/analytics
 * AI-powered analytics & insights dashboard for React
 * 
 * @version 1.0.0
 * @author reachbrt
 * @license MIT
 */

// Version console log
const VERSION = '1.0.0';
console.log(
  `%c @aireact/analytics v${VERSION} %c Loaded successfully `,
  'background: #667eea; color: white; padding: 2px 6px; border-radius: 3px 0 0 3px; font-weight: bold;',
  'background: #764ba2; color: white; padding: 2px 6px; border-radius: 0 3px 3px 0;'
);

// Import styles
import './styles/analytics.css';

// Components
export { AnalyticsDashboard } from './components';

// Hooks
export { useAnalytics } from './hooks';

// Types
export type {
  AnalyticsEvent,
  AnalyticsMetric,
  AIInsight,
  AnalyticsConfig,
  AnalyticsDashboardProps,
  UseAnalyticsOptions,
  UseAnalyticsReturn,
} from './types';

// Version export
export const REACTAI_ANALYTICS_VERSION = VERSION;

