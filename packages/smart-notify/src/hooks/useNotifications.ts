/**
 * useNotifications Hook - Manage smart notifications
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { SmartNotification, NotifyOptions } from '../types';

export function useNotifications(maxVisible = 5) {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const notify = useCallback((options: NotifyOptions): string => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const notification: SmartNotification = {
      id,
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration ?? 5000,
      actions: options.actions,
      priority: options.priority || 'normal',
      groupId: options.groupId,
      timestamp: new Date()
    };

    setNotifications(prev => {
      // Sort by priority
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      const updated = [...prev, notification].sort(
        (a, b) => priorityOrder[a.priority || 'normal'] - priorityOrder[b.priority || 'normal']
      );
      return updated.slice(0, maxVisible * 2); // Keep buffer
    });

    // Auto-dismiss
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => dismiss(id), notification.duration);
      timersRef.current.set(id, timer);
    }

    return id;
  }, [maxVisible]);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const success = useCallback((title: string, message: string, options?: Partial<NotifyOptions>) => {
    return notify({ title, message, type: 'success', ...options });
  }, [notify]);

  const error = useCallback((title: string, message: string, options?: Partial<NotifyOptions>) => {
    return notify({ title, message, type: 'error', duration: 0, ...options });
  }, [notify]);

  const warning = useCallback((title: string, message: string, options?: Partial<NotifyOptions>) => {
    return notify({ title, message, type: 'warning', ...options });
  }, [notify]);

  const info = useCallback((title: string, message: string, options?: Partial<NotifyOptions>) => {
    return notify({ title, message, type: 'info', ...options });
  }, [notify]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return {
    notifications: notifications.slice(0, maxVisible),
    notify,
    dismiss,
    dismissAll,
    success,
    error,
    warning,
    info
  };
}

