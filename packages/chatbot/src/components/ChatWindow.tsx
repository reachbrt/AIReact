/**
 * ChatWindow Component - Modern Live Chat interface
 */

import React, { useRef, useEffect } from 'react';
import { ChatWindowProps } from '../types';
import { useChatbot } from '../hooks/useChatbot';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

// Bot avatar SVG component
const BotAvatar = () => (
  <div className="reactai-bot-avatar">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  </div>
);

export const ChatWindow: React.FC<ChatWindowProps> = ({
  provider = 'fallback',
  apiKey,
  model,
  title = 'LIVE CHAT',
  placeholder = 'Type a message...',
  initialMessages = [],
  systemPrompt,
  streaming = true,
  className = '',
  theme = 'light',
  showTimestamp = false,
  onMessageSent,
  onResponse,
  onError,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError,
  } = useChatbot({
    provider,
    apiKey,
    model,
    systemPrompt,
    streaming,
    onError,
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message callbacks
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        onMessageSent?.(lastMessage);
      } else if (lastMessage.role === 'assistant' && !lastMessage.isStreaming) {
        onResponse?.(lastMessage);
      }
    }
  }, [messages, onMessageSent, onResponse]);

  const handleSend = async (content: string) => {
    clearError();
    await sendMessage(content);
  };

  const themeClass = theme === 'auto'
    ? ''
    : `reactai-theme-${theme}`;

  const allMessages = [...initialMessages, ...messages];

  return (
    <div className={`reactai-chat-window ${themeClass} ${className}`}>
      {/* Header */}
      <div className="reactai-chat-header">
        <div className="reactai-header-info">
          <div className="reactai-chat-title">{title}</div>
          {isLoading && (
            <div className="reactai-status-typing">typing...</div>
          )}
        </div>
        <div className="reactai-header-actions">
          <button className="reactai-header-btn" aria-label="Minimize">
            ─
          </button>
          <button className="reactai-header-btn" aria-label="Close">
            ✕
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="reactai-chat-messages">
        {allMessages.map((message, index) => {
          const prevMessage = allMessages[index - 1];
          const isConsecutive = prevMessage && prevMessage.role === message.role;

          return (
            <div key={message.id} className={`reactai-chat-message ${message.role} ${isConsecutive ? 'consecutive' : ''}`}>
              {message.role === 'assistant' && !isConsecutive && <BotAvatar />}
              {message.role === 'assistant' && isConsecutive && <div style={{ width: 28 }} />}
              <ChatMessage
                message={message}
                showTimestamp={showTimestamp}
                isConsecutive={isConsecutive}
              />
            </div>
          );
        })}

        {error && (
          <div className="reactai-error-message">
            <span>⚠️ {error.message}</span>
            <button onClick={clearError} className="reactai-error-dismiss">
              ✕
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        placeholder={placeholder}
        disabled={isLoading}
        onSend={handleSend}
      />
    </div>
  );
};

