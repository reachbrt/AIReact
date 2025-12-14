# @aireact/emotion-ui

🚀 **Emotion-Aware UI Components for React**

AI-powered components that adapt based on user sentiment and emotional context.

[![npm version](https://img.shields.io/npm/v/@aireact/emotion-ui.svg?style=flat-square)](https://www.npmjs.com/package/@aireact/emotion-ui)
[![MIT License](https://img.shields.io/npm/l/@aireact/emotion-ui.svg?style=flat-square)](https://github.com/reachbrt/reactai/blob/main/LICENSE)

## ✨ Features

- **🎭 Sentiment Detection**: Real-time emotion analysis
- **🎨 Adaptive UI**: Components that respond to user mood
- **💬 Context-Aware**: Understands conversational context
- **⚡ Real-time**: Instant feedback and adaptation
- **🔧 TypeScript**: Full TypeScript support
- **📱 Responsive**: Works on all devices

## 📦 Installation

```bash
npm install @aireact/emotion-ui @aireact/core
```

## 🚀 Quick Start

```tsx
import { EmotionAwareButton, EmotionAwareInput, useEmotionDetector } from '@aireact/emotion-ui';
import '@aireact/emotion-ui/style.css';

function App() {
  return (
    <div>
      <EmotionAwareInput
        provider="openai"
        apiKey={process.env.REACT_APP_OPENAI_API_KEY}
        placeholder="How are you feeling?"
        onEmotionChange={(emotion) => console.log('Detected:', emotion)}
      />
      <EmotionAwareButton emotion="positive">
        Submit Feedback
      </EmotionAwareButton>
    </div>
  );
}
```

### Using the Hook

```tsx
import { useEmotionDetector } from '@aireact/emotion-ui';

function CustomEmotionUI() {
  const {
    emotion,
    confidence,
    isAnalyzing,
    detectEmotion
  } = useEmotionDetector({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY
  });

  return (
    <div className={`emotion-${emotion}`}>
      <textarea
        onChange={(e) => detectEmotion(e.target.value)}
        placeholder="Express yourself..."
      />
      {emotion && (
        <div className="emotion-indicator">
          Detected: {emotion} ({Math.round(confidence * 100)}%)
        </div>
      )}
    </div>
  );
}
```

## 🎭 Detected Emotions

| Emotion | Description | UI Adaptation |
|---------|-------------|---------------|
| `positive` | Happy, excited, grateful | Warm colors, celebratory |
| `negative` | Sad, frustrated, angry | Calming colors, supportive |
| `neutral` | Informational, factual | Default styling |
| `confused` | Uncertain, questioning | Helpful prompts |

## 📖 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | string | - | AI provider |
| `apiKey` | string | - | API key |
| `onEmotionChange` | function | - | Emotion callback |
| `adaptColors` | boolean | true | Auto-adapt colors |
| `showIndicator` | boolean | false | Show emotion badge |

## 🎨 Customization

```css
:root {
  --aireact-emotion-positive: #4caf50;
  --aireact-emotion-negative: #f44336;
  --aireact-emotion-neutral: #9e9e9e;
  --aireact-emotion-confused: #ff9800;
}
```

## 📦 Related Packages

- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/chatbot](https://www.npmjs.com/package/@aireact/chatbot) - AI Chat
- [@aireact/smart-notify](https://www.npmjs.com/package/@aireact/smart-notify) - Smart Notifications

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

