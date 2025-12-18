/**
 * ChatWindow Component - Modern Live Chat interface with RAG and Voice support
 */

import React, { useRef, useEffect, useState } from 'react';
import { ChatWindowProps, ChatAttachment } from '../types';
import { useChatbot } from '../hooks/useChatbot';
import { useRAG } from '../hooks/useRAG';
import { useVoice } from '../hooks/useVoice';
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

// Microphone icon
const MicIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={active ? 'active' : ''}>
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
  </svg>
);

// Attachment icon
const AttachIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
  </svg>
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
  enableFileUpload = false,
  acceptedFileTypes = '.txt,.md,.json,.csv,.html',
  enableVoiceInput = false,
  enableVoiceOutput = false,
  onMessageSent,
  onResponse,
  onError,
  onFileUpload,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);

  // RAG hook for document context
  const { documents, isProcessing, addDocument, removeDocument, getContext } = useRAG();

  // Voice hook
  const {
    isListening,
    isSupported: voiceSupported,
    transcript,
    startListening,
    stopListening,
    speak,
  } = useVoice({
    onTranscript: (text, isFinal) => {
      if (isFinal && text.trim()) {
        // Auto-send on final transcript
        handleSend(text);
        stopListening();
      }
    },
    onError,
  });

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
    systemPrompt: systemPrompt, // Base prompt, context added per-message
    streaming,
    onError,
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message callbacks and voice output
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        onMessageSent?.(lastMessage);
      } else if (lastMessage.role === 'assistant' && !lastMessage.isStreaming) {
        onResponse?.(lastMessage);
        // Speak response if voice output is enabled
        if (enableVoiceOutput && lastMessage.content) {
          speak(lastMessage.content);
        }
      }
    }
  }, [messages, onMessageSent, onResponse, enableVoiceOutput, speak]);

  const handleSend = async (content: string) => {
    clearError();
    // If we have documents, inject context into the system prompt dynamically
    // For now, we'll prepend context to the user message
    let enhancedContent = content;
    if (documents.length > 0) {
      const context = getContext(content, 3);
      if (context) {
        enhancedContent = `[Context from uploaded documents:\n${context}]\n\nUser question: ${content}`;
      }
    }
    await sendMessage(enhancedContent, pendingAttachments.length > 0 ? pendingAttachments : undefined);
    setPendingAttachments([]);
  };

  // Handle file upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: ChatAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const doc = await addDocument(file);

      if (doc) {
        newAttachments.push({
          id: doc.id,
          name: doc.name,
          type: file.type,
          size: file.size,
          content: doc.content,
        });
      }
    }

    setPendingAttachments(prev => [...prev, ...newAttachments]);
    onFileUpload?.(newAttachments);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setPendingAttachments(prev => prev.filter(a => a.id !== id));
    removeDocument(id);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const themeClass = theme === 'auto' ? '' : `reactai-theme-${theme}`;
  const allMessages = [...initialMessages, ...messages];

  return (
    <div className={`reactai-chat-window ${themeClass} ${className}`}>
      {/* Header */}
      <div className="reactai-chat-header">
        <div className="reactai-header-info">
          <div className="reactai-chat-title">{title}</div>
          {isLoading && <div className="reactai-status-typing">typing...</div>}
          {isProcessing && <div className="reactai-status-typing">processing file...</div>}
          {isListening && <div className="reactai-status-typing">listening...</div>}
        </div>
      </div>

      {/* Documents indicator */}
      {documents.length > 0 && (
        <div className="reactai-documents-bar">
          <span>📄 {documents.length} document{documents.length > 1 ? 's' : ''} loaded</span>
          <button onClick={() => documents.forEach(d => removeDocument(d.id))} className="reactai-clear-docs">
            Clear all
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="reactai-chat-messages">
        {allMessages.map((message, index) => {
          const prevMessage = allMessages[index - 1];
          const isConsecutive = prevMessage && prevMessage.role === message.role;

          return (
            <div key={message.id} className={`reactai-chat-message ${message.role} ${isConsecutive ? 'consecutive' : ''}`}>
              {message.role === 'assistant' && !isConsecutive && <BotAvatar />}
              {message.role === 'assistant' && isConsecutive && <div style={{ width: 28 }} />}
              <ChatMessage message={message} showTimestamp={showTimestamp} isConsecutive={isConsecutive} />
            </div>
          );
        })}

        {error && (
          <div className="reactai-error-message">
            <span>⚠️ {error.message}</span>
            <button onClick={clearError} className="reactai-error-dismiss">✕</button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Pending attachments */}
      {pendingAttachments.length > 0 && (
        <div className="reactai-attachments-bar">
          {pendingAttachments.map(att => (
            <div key={att.id} className="reactai-attachment-chip">
              <span>📎 {att.name}</span>
              <button onClick={() => handleRemoveAttachment(att.id)}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area with extras */}
      <div className="reactai-input-wrapper">
        {enableFileUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFileTypes}
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button
              className="reactai-input-action-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              aria-label="Attach file"
            >
              <AttachIcon />
            </button>
          </>
        )}

        {enableVoiceInput && voiceSupported && (
          <button
            className={`reactai-input-action-btn ${isListening ? 'active' : ''}`}
            onClick={handleVoiceToggle}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          >
            <MicIcon active={isListening} />
          </button>
        )}

        <ChatInput
          placeholder={isListening ? (transcript || 'Listening...') : placeholder}
          disabled={isLoading || isListening}
          onSend={handleSend}
        />
      </div>
    </div>
  );
};

