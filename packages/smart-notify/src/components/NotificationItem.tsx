/**
 * NotificationItem Component
 */

import React from 'react';
import { SmartNotification } from '../types';

interface NotificationItemProps {
  notification: SmartNotification;
  onDismiss: (id: string) => void;
}

const ICONS: Record<string, string> = {
  info: '💡',
  success: '✅',
  warning: '⚠️',
  error: '❌'
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onDismiss }) => {
  return (
    <div className={`reactai-notification ${notification.type} ${notification.priority === 'urgent' ? 'urgent' : ''}`}>
      <div className="reactai-notification-icon">{ICONS[notification.type]}</div>
      <div className="reactai-notification-content">
        <h4 className="reactai-notification-title">{notification.title}</h4>
        <p className="reactai-notification-message">{notification.message}</p>
        {notification.actions && notification.actions.length > 0 && (
          <div className="reactai-notification-actions">
            {notification.actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`reactai-notification-action ${action.variant || 'secondary'}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button className="reactai-notification-close" onClick={() => onDismiss(notification.id)}>×</button>
    </div>
  );
};

