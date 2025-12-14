# @aireact/voice-actions

🚀 **AI-Powered Voice Commands for React**

Voice recognition and command processing with AI for hands-free application control.

[![npm version](https://img.shields.io/npm/v/@aireact/voice-actions.svg?style=flat-square)](https://www.npmjs.com/package/@aireact/voice-actions)
[![MIT License](https://img.shields.io/npm/l/@aireact/voice-actions.svg?style=flat-square)](https://github.com/reachbrt/AIReact/blob/main/LICENSE)

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

- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/chatbot](https://www.npmjs.com/package/@aireact/chatbot) - AI Chat
- [@aireact/smart-notify](https://www.npmjs.com/package/@aireact/smart-notify) - Notifications

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

