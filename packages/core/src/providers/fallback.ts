/**
 * Fallback Provider - Mock responses for development without API keys
 */

import { Message, ProviderConfig, StreamCallbacks } from '../types';

const MOCK_RESPONSES = [
  "I'm a mock AI response. This is the fallback provider being used because no API key was configured.",
  "Hello! I'm operating in development mode. Configure an API key to connect to a real AI provider.",
  "This is a simulated response from the fallback provider. Everything looks good!",
  "The fallback provider is active. Your UI integration is working correctly.",
];

function getRandomResponse(): string {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fallbackChat(
  _messages: Message[],
  _config: ProviderConfig
): Promise<string> {
  // Simulate network delay
  await delay(500 + Math.random() * 500);
  return getRandomResponse();
}

export async function fallbackChatStream(
  _messages: Message[],
  _config: ProviderConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  const response = getRandomResponse();
  const words = response.split(' ');
  let fullText = '';

  for (const word of words) {
    await delay(50 + Math.random() * 100);
    const token = word + ' ';
    fullText += token;
    callbacks.onToken(token);
  }

  callbacks.onComplete?.(fullText.trim());
}

