/**
 * AIClient - Unified AI Client for multiple providers
 */

import { AIConfig, AIClientInterface, Message, ProviderConfig, StreamCallbacks } from './types';
import { openaiChat, openaiChatStream } from './providers/openai';
import { claudeChat, claudeChatStream } from './providers/claude';
import { geminiChat, geminiChatStream } from './providers/gemini';
import { fallbackChat, fallbackChatStream } from './providers/fallback';

const DEFAULT_MODELS: Record<string, string> = {
  openai: 'gpt-4o',
  claude: 'claude-3-5-sonnet-20241022',
  gemini: 'gemini-pro',
  huggingface: 'mistralai/Mistral-7B-Instruct-v0.1',
  ollama: 'llama2',
  deepseek: 'deepseek-chat',
  fallback: 'mock',
};

export class AIClient implements AIClientInterface {
  private config: AIConfig;
  private providerConfig: ProviderConfig;

  constructor(config: AIConfig) {
    this.config = {
      ...config,
      provider: config.provider || 'fallback',
      model: config.model || DEFAULT_MODELS[config.provider || 'fallback'],
    };

    this.providerConfig = {
      apiKey: config.apiKey || '',
      model: this.config.model!,
      baseUrl: config.baseUrl,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
    };

    // If no API key, use fallback
    if (!config.apiKey && config.provider !== 'fallback') {
      console.warn(`[@reactai/core] No API key provided for ${config.provider}, using fallback provider`);
      this.config.provider = 'fallback';
    }
  }

  async chat(messages: Message[]): Promise<string> {
    switch (this.config.provider) {
      case 'openai':
        return openaiChat(messages, this.providerConfig);
      case 'claude':
        return claudeChat(messages, this.providerConfig);
      case 'gemini':
        return geminiChat(messages, this.providerConfig);
      case 'fallback':
      default:
        return fallbackChat(messages, this.providerConfig);
    }
  }

  async chatStream(messages: Message[], callbacks: StreamCallbacks): Promise<void> {
    switch (this.config.provider) {
      case 'openai':
        return openaiChatStream(messages, this.providerConfig, callbacks);
      case 'claude':
        return claudeChatStream(messages, this.providerConfig, callbacks);
      case 'gemini':
        return geminiChatStream(messages, this.providerConfig, callbacks);
      case 'fallback':
      default:
        return fallbackChatStream(messages, this.providerConfig, callbacks);
    }
  }

  getProvider(): string {
    return this.config.provider;
  }

  getModel(): string {
    return this.config.model || DEFAULT_MODELS[this.config.provider];
  }
}

