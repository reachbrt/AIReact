/**
 * @aireact/smart-notify
 * AI-powered smart notifications for React
 */

export { NotificationContainer, NotificationItem } from './components';
export { useNotifications } from './hooks';
export type { SmartNotification, NotificationContainerProps, NotifyOptions, NotificationType, NotificationPosition, NotificationAction } from './types';

export const REACTAI_SMART_NOTIFY_VERSION = '1.0.0';
console.log(`%c @aireact/smart-notify v${REACTAI_SMART_NOTIFY_VERSION} `, 'background: #EF4444; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;');

