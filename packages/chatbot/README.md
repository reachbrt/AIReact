# @aireact/chatbot

🚀 **AI Chat Components for React**

Enterprise-grade conversational AI with streaming responses, multi-provider support, and beautiful UI.

<p>
  <a href="https://www.npmjs.com/package/@aireact/chatbot"><img src="https://img.shields.io/npm/v/@aireact/chatbot.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@aireact/chatbot"><img src="https://img.shields.io/npm/dm/@aireact/chatbot" alt="npm downloads"></a>
  <a href="https://github.com/reachbrt/AIReact/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@aireact/chatbot.svg?style=flat-square" alt="MIT License"></a>
  <a href="https://github.com/reachbrt/AIReact"><img src="https://img.shields.io/github/stars/reachbrt/AIReact?style=social" alt="GitHub Stars"></a>
</p>

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

### React (@aireact)
- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/autosuggest](https://www.npmjs.com/package/@aireact/autosuggest) - AI Suggestions
- [@aireact/smartform](https://www.npmjs.com/package/@aireact/smartform) - AI Form Validation
- [@aireact/smart-datatable](https://www.npmjs.com/package/@aireact/smart-datatable) - AI Data Tables

### Vue.js (@aivue)
- [@aivue/chatbot](https://www.npmjs.com/package/@aivue/chatbot) - Vue Chat Components
- [@aivue/core](https://www.npmjs.com/package/@aivue/core) - Vue Core AI Client

### Angular (@aiangular) - Coming Soon
- @aiangular/chatbot - Angular Chat Components

## 🔗 More Information

- [GitHub Repository](https://github.com/reachbrt/AIReact)
- [Full Documentation](https://github.com/reachbrt/AIReact/wiki)
- [Report Issues](https://github.com/reachbrt/AIReact/issues)

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

