# @aireact/chatbot

🚀 **AI Chat Components for React**

Enterprise-grade conversational AI with streaming responses, multi-provider support, and beautiful UI.

[![npm version](https://img.shields.io/npm/v/@aireact/chatbot.svg?style=flat-square)](https://www.npmjs.com/package/@aireact/chatbot)
[![MIT License](https://img.shields.io/npm/l/@aireact/chatbot.svg?style=flat-square)](https://github.com/reachbrt/reactai/blob/main/LICENSE)

## ✨ Features

- **💬 Ready-to-use Chat UI**: Beautiful, responsive chat interface
- **🔄 Real-time Streaming**: See AI responses token by token
- **📱 Mobile-friendly**: Responsive design for all devices
- **🎨 Customizable**: Style with CSS variables or custom components
- **🧠 Multi-Provider**: OpenAI, Claude, Gemini, Ollama, and more
- **📝 Markdown Support**: Rich text with code highlighting
- **🔧 TypeScript**: Full TypeScript support

## 📦 Installation

```bash
npm install @aireact/chatbot @aireact/core
```

## 🚀 Quick Start

```tsx
import { ChatWindow, useChatbot } from '@aireact/chatbot';
import '@aireact/chatbot/style.css';

function App() {
  return (
    <ChatWindow
      provider="openai"
      apiKey={process.env.REACT_APP_OPENAI_API_KEY}
      model="gpt-4o"
      title="AI Assistant"
      placeholder="Ask me anything..."
    />
  );
}
```

### Using the Hook

```tsx
import { useChatbot } from '@aireact/chatbot';

function CustomChat() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  } = useChatbot({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    model: 'gpt-4o',
    systemPrompt: 'You are a helpful assistant.',
    streaming: true
  });

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i} className={msg.role}>
          {msg.content}
        </div>
      ))}
      <input
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
        disabled={isLoading}
      />
    </div>
  );
}
```

## 🤖 Supported Providers

| Provider | Models | Streaming |
|----------|--------|-----------|
| OpenAI | GPT-4, GPT-4o, GPT-3.5 | ✅ |
| Anthropic | Claude 3, Claude 3.5 | ✅ |
| Google | Gemini Pro, Ultra | ✅ |
| Ollama | Llama, Mistral | ✅ |

## 📖 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | string | - | AI provider |
| `apiKey` | string | - | API key |
| `model` | string | - | Model name |
| `title` | string | 'Chat' | Window title |
| `placeholder` | string | 'Type...' | Input placeholder |
| `systemPrompt` | string | - | System prompt |
| `streaming` | boolean | true | Enable streaming |
| `theme` | 'light' \| 'dark' | 'light' | Theme |

## 🎨 Customization

```css
:root {
  --aireact-chat-bg: #ffffff;
  --aireact-chat-text: #333333;
  --aireact-chat-user-bg: #e1f5fe;
  --aireact-chat-assistant-bg: #f5f5f5;
  --aireact-chat-button-bg: #2196f3;
}
```

## 📦 Related Packages

- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/autosuggest](https://www.npmjs.com/package/@aireact/autosuggest) - AI Suggestions
- [@aireact/360-spin](https://www.npmjs.com/package/@aireact/360-spin) - 360° Viewer

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

