/**
 * Google Gemini Provider
 */

import { Message, ProviderConfig, StreamCallbacks } from '../types';

const DEFAULT_MODEL = 'gemini-pro';

function getBaseUrl(apiKey: string, model: string): string {
  return `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
}

function convertMessages(messages: Message[]): { contents: Array<{ role: string; parts: Array<{ text: string }> }> } {
  return {
    contents: messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
  };
}

export async function geminiChat(
  messages: Message[],
  config: ProviderConfig
): Promise<string> {
  const model = config.model || DEFAULT_MODEL;
  const url = config.baseUrl || getBaseUrl(config.apiKey, model);
  const body = convertMessages(messages);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...body,
      generationConfig: {
        temperature: config.temperature ?? 0.7,
        maxOutputTokens: config.maxTokens,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function geminiChatStream(
  messages: Message[],
  config: ProviderConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  const model = config.model || DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:streamGenerateContent?key=${config.apiKey}`;
  const body = convertMessages(messages);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...body,
      generationConfig: {
        temperature: config.temperature ?? 0.7,
        maxOutputTokens: config.maxTokens,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Gemini API error: ${response.statusText}`);
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
      
      try {
        const data = JSON.parse(chunk);
        const token = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (token) {
          fullText += token;
          callbacks.onToken(token);
        }
      } catch {
        // Skip invalid JSON
      }
    }

    callbacks.onComplete?.(fullText);
  } catch (error) {
    callbacks.onError?.(error instanceof Error ? error : new Error('Stream error'));
    throw error;
  }
}

