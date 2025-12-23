# @aireact/voice-actions

🚀 **AI-Powered Voice Commands for React**

Voice recognition and command processing with AI for hands-free application control.

<p>
  <a href="https://www.npmjs.com/package/@aireact/voice-actions"><img src="https://img.shields.io/npm/v/@aireact/voice-actions.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@aireact/voice-actions"><img src="https://img.shields.io/npm/dm/@aireact/voice-actions" alt="npm downloads"></a>
  <a href="https://github.com/reachbrt/AIReact/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@aireact/voice-actions.svg?style=flat-square" alt="MIT License"></a>
  <a href="https://github.com/reachbrt/AIReact"><img src="https://img.shields.io/github/stars/reachbrt/AIReact?style=social" alt="GitHub Stars"></a>
</p>

## ✨ Features

- **🎤 Voice Recognition**: Speech-to-text with AI enhancement
- **🗣️ Text-to-Speech**: Natural voice responses
- **🎯 Command Processing**: AI understands intent
- **🌍 Multi-Language**: Support for 50+ languages
- **⚡ Real-time**: Instant voice processing
- **🔧 TypeScript**: Full TypeScript support

## 📦 Installation

```bash
npm install @aireact/voice-actions @aireact/core
```

## 🚀 Quick Start

```tsx
import { VoiceButton, useVoiceRecognition } from '@aireact/voice-actions';
import '@aireact/voice-actions/style.css';

function App() {
  return (
    <VoiceButton
      provider="openai"
      apiKey={process.env.REACT_APP_OPENAI_API_KEY}
      onCommand={(command) => console.log('Command:', command)}
      onTranscript={(text) => console.log('Heard:', text)}
      language="en-US"
    />
  );
}
```

### Using the Hook

```tsx
import { useVoiceRecognition } from '@aireact/voice-actions';

function VoiceControlled() {
  const {
    isListening,
    transcript,
    command,
    startListening,
    stopListening,
    speak
  } = useVoiceRecognition({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    language: 'en-US',
    commands: {
      'open settings': () => openSettings(),
      'search for *': (query) => search(query),
      'go to *': (page) => navigate(page)
    }
  });

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? '🔴 Listening...' : '🎤 Start'}
      </button>
      {transcript && <p>You said: {transcript}</p>}
      {command && <p>Command: {command}</p>}
      <button onClick={() => speak('Hello! How can I help?')}>
        Speak
      </button>
    </div>
  );
}
```

## 🌍 Supported Languages

| Language | Code | Speech-to-Text | Text-to-Speech |
|----------|------|----------------|----------------|
| English (US) | en-US | ✅ | ✅ |
| English (UK) | en-GB | ✅ | ✅ |
| Spanish | es-ES | ✅ | ✅ |
| French | fr-FR | ✅ | ✅ |
| German | de-DE | ✅ | ✅ |
| Japanese | ja-JP | ✅ | ✅ |
| Chinese | zh-CN | ✅ | ✅ |

## 📖 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | string | - | AI provider |
| `apiKey` | string | - | API key |
| `language` | string | 'en-US' | Voice language |
| `onCommand` | function | - | Command callback |
| `onTranscript` | function | - | Transcript callback |
| `continuous` | boolean | false | Continuous listening |

## 🎨 Customization

```css
:root {
  --aireact-voice-active: #f44336;
  --aireact-voice-idle: #9e9e9e;
  --aireact-voice-bg: #ffffff;
}
```

## 📦 Related Packages

### React (@aireact)
- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/chatbot](https://www.npmjs.com/package/@aireact/chatbot) - AI Chat
- [@aireact/smart-notify](https://www.npmjs.com/package/@aireact/smart-notify) - Notifications

### Vue.js (@aivue)
- [@aivue/voice-actions](https://www.npmjs.com/package/@aivue/voice-actions) - Vue Voice Actions
- [@aivue/core](https://www.npmjs.com/package/@aivue/core) - Vue Core AI Client

### Angular (@aiangular) - Coming Soon
- @aiangular/voice-actions - Angular Voice Actions

## 🔗 More Information

- [GitHub Repository](https://github.com/reachbrt/AIReact)
- [Full Documentation](https://github.com/reachbrt/AIReact/wiki)
- [Report Issues](https://github.com/reachbrt/AIReact/issues)

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

