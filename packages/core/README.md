# @aireact/core

🚀 **Core AI Functionality for React**

Multi-provider AI client supporting OpenAI, Claude, Gemini, HuggingFace, Ollama, and DeepSeek with unified API.

[![npm version](https://img.shields.io/npm/v/@aireact/core.svg?style=flat-square)](https://www.npmjs.com/package/@aireact/core)
[![MIT License](https://img.shields.io/npm/l/@aireact/core.svg?style=flat-square)](https://github.com/reachbrt/reactai/blob/main/LICENSE)

## ✨ Features

- **🔌 Multi-Provider Support**: OpenAI, Claude, Gemini, HuggingFace, Ollama, DeepSeek
- **🔄 Streaming Responses**: Real-time token streaming for all providers
- **🎯 Unified API**: Same interface across all AI providers
- **📝 TypeScript First**: Full TypeScript support with comprehensive types
- **⚡ React Hooks**: `useAIClient` hook for easy integration
- **🛡️ Error Handling**: Robust error handling and fallback support

## 📦 Installation

```bash
npm install @aireact/core
```

## 🚀 Quick Start

### Using the AIClient

```tsx
import { AIClient } from '@aireact/core';

const client = new AIClient({
  provider: 'openai',
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  model: 'gpt-4o'
});

// Send a message
const response = await client.sendMessage('Hello, AI!');
console.log(response);

// Stream a response
await client.streamMessage('Tell me a story', (token) => {
  console.log(token);
});
```

### Using the React Hook

```tsx
import { useAIClient } from '@aireact/core';

function MyComponent() {
  const { client, isReady, error } = useAIClient({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    model: 'gpt-4o'
  });

  const handleSend = async () => {
    if (client && isReady) {
      const response = await client.sendMessage('Hello!');
      console.log(response);
    }
  };

  return (
    <button onClick={handleSend} disabled={!isReady}>
      Send Message
    </button>
  );
}
```

## 🤖 Supported Providers

| Provider | Models | Streaming |
|----------|--------|-----------|
| OpenAI | GPT-4, GPT-4o, GPT-3.5 | ✅ |
| Anthropic | Claude 3, Claude 3.5 | ✅ |
| Google | Gemini Pro, Gemini Ultra | ✅ |
| HuggingFace | Various open models | ✅ |
| Ollama | Llama, Mistral, etc. | ✅ |
| DeepSeek | DeepSeek Chat, Coder | ✅ |

## 📖 API Reference

### AIClient Options

```typescript
interface AIClientOptions {
  provider: 'openai' | 'claude' | 'gemini' | 'huggingface' | 'ollama' | 'deepseek';
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  organizationId?: string;
  maxTokens?: number;
  temperature?: number;
}
```

### useAIClient Hook

```typescript
const { 
  client,      // AIClient instance
  isReady,     // Boolean - client is ready
  error,       // Error | null
  setProvider, // (provider: string) => void
  setModel     // (model: string) => void
} = useAIClient(options);
```

## 📦 Related Packages

- [@aireact/chatbot](https://www.npmjs.com/package/@aireact/chatbot) - AI Chat Components
- [@aireact/autosuggest](https://www.npmjs.com/package/@aireact/autosuggest) - AI-Powered Suggestions
- [@aireact/360-spin](https://www.npmjs.com/package/@aireact/360-spin) - 360° Product Viewer

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

