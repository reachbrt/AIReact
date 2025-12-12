/**
 * ChatInput Component - Modern chat input area
 */

import React, { useState, useCallback, KeyboardEvent, useRef, useEffect } from 'react';

interface ChatInputProps {
  placeholder?: string;
  disabled?: boolean;
  onSend: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = 'Type a message...',
  disabled = false,
  onSend,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [input]);

  const handleSend = useCallback(() => {
    const trimmedInput = input.trim();
    if (trimmedInput && !disabled) {
      // Clear input immediately before calling onSend
      setInput('');

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Send the message
      onSend(trimmedInput);

      // Refocus the textarea after sending
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  }, [input, disabled, onSend]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="reactai-chat-input">
      {/* Input wrapper with attachment button */}
      <div className="reactai-input-wrapper">
        {/* Attachment button */}
        <button
          className="reactai-attach-button"
          aria-label="Attach file"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="reactai-input-textarea"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="true"
        />

        {/* Send button inside wrapper */}
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="reactai-send-button"
          aria-label="Send message"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

