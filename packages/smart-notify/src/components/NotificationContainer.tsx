/**
 * NotificationContainer Component
 */

import React from 'react';
import { NotificationContainerProps, SmartNotification } from '../types';
import { NotificationItem } from './NotificationItem';
import '../styles/smart-notify.css';

interface ContainerProps extends NotificationContainerProps {
  notifications: SmartNotification[];
  onDismiss: (id: string) => void;
}

export const NotificationContainer: React.FC<ContainerProps> = ({
  notifications,
  onDismiss,
  position = 'top-right',
  theme = 'light',
  className = ''
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className={`reactai-notification-container ${position} ${theme === 'dark' ? 'dark' : ''} ${className}`}>
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

