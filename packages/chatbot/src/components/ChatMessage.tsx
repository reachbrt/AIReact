/**
 * ChatMessage Component - Modern chat message bubble
 */

import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  showTimestamp?: boolean;
  isConsecutive?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  showTimestamp = false,
}) => {
  return (
    <div className="reactai-message-bubble">
      <div className="reactai-message-text">
        {message.content}
        {message.isStreaming && (
          <span className="reactai-typing-indicator">
            <span className="reactai-typing-dot"></span>
            <span className="reactai-typing-dot"></span>
            <span className="reactai-typing-dot"></span>
          </span>
        )}
        {showTimestamp && (
          <span className="reactai-message-meta">
            <span className="reactai-message-timestamp">
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

