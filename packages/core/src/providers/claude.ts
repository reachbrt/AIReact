/**
 * Claude (Anthropic) Provider
 */

import { Message, ProviderConfig, StreamCallbacks } from '../types';

const DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';
const BASE_URL = 'https://api.anthropic.com/v1';

function convertMessages(messages: Message[]): { system?: string; messages: Array<{ role: string; content: string }> } {
  const systemMessage = messages.find(m => m.role === 'system');
  const otherMessages = messages.filter(m => m.role !== 'system');
  
  return {
    system: systemMessage?.content,
    messages: otherMessages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
  };
}

export async function claudeChat(
  messages: Message[],
  config: ProviderConfig
): Promise<string> {
  const { system, messages: convertedMessages } = convertMessages(messages);
  
  const response = await fetch(`${config.baseUrl || BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model || DEFAULT_MODEL,
      max_tokens: config.maxTokens || 4096,
      system,
      messages: convertedMessages,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}

export async function claudeChatStream(
  messages: Message[],
  config: ProviderConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  const { system, messages: convertedMessages } = convertMessages(messages);
  
  const response = await fetch(`${config.baseUrl || BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model || DEFAULT_MODEL,
      max_tokens: config.maxTokens || 4096,
      system,
      messages: convertedMessages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Claude API error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  if (!reader) {
    throw new Error('No response body');
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'content_block_delta') {
              const token = data.delta?.text || '';
              if (token) {
                fullText += token;
                callbacks.onToken(token);
              }
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }

    callbacks.onComplete?.(fullText);
  } catch (error) {
    callbacks.onError?.(error instanceof Error ? error : new Error('Stream error'));
    throw error;
  }
}

