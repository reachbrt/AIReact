/**
 * Smart Notify Types
 */

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface SmartNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  duration?: number;
  actions?: NotificationAction[];
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  groupId?: string;
  timestamp: Date;
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface NotificationContainerProps {
  position?: NotificationPosition;
  maxVisible?: number;
  groupSimilar?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export interface NotifyOptions {
  title: string;
  message: string;
  type?: NotificationType;
  duration?: number;
  actions?: NotificationAction[];
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  groupId?: string;
}

