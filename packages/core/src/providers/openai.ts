/**
 * OpenAI Provider
 */

import { Message, ProviderConfig, StreamCallbacks } from '../types';

const DEFAULT_MODEL = 'gpt-4o';
const BASE_URL = 'https://api.openai.com/v1';

export async function openaiChat(
  messages: Message[],
  config: ProviderConfig
): Promise<string> {
  const response = await fetch(`${config.baseUrl || BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || DEFAULT_MODEL,
      messages,
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function openaiChatStream(
  messages: Message[],
  config: ProviderConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  const response = await fetch(`${config.baseUrl || BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || DEFAULT_MODEL,
      messages,
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `OpenAI API error: ${response.statusText}`);
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
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices[0]?.delta?.content || '';
            if (token) {
              fullText += token;
              callbacks.onToken(token);
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

