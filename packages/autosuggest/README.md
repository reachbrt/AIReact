# @aireact/autosuggest

🚀 **AI-Powered Suggestion Components for React**

Intelligent autocomplete and suggestion system powered by AI for enhanced user input experiences.

[![npm version](https://img.shields.io/npm/v/@aireact/autosuggest.svg?style=flat-square)](https://www.npmjs.com/package/@aireact/autosuggest)
[![MIT License](https://img.shields.io/npm/l/@aireact/autosuggest.svg?style=flat-square)](https://github.com/reachbrt/AIReact/blob/main/LICENSE)

## ✨ Features

- **🧠 AI-Powered**: Intelligent suggestions using AI models
- **⚡ Real-time**: Instant suggestions as you type
- **🎯 Context-Aware**: Understands context for better suggestions
- **🎨 Customizable**: Fully stylable components
- **📱 Responsive**: Works on all devices
- **🔧 TypeScript**: Full TypeScript support

## 📦 Installation

```bash
npm install @aireact/autosuggest @aireact/core
```

## 🚀 Quick Start

```tsx
import { Autosuggest, useAutosuggest } from '@aireact/autosuggest';
import '@aireact/autosuggest/style.css';

function App() {
  return (
    <Autosuggest
      provider="openai"
      apiKey={process.env.REACT_APP_OPENAI_API_KEY}
      placeholder="Start typing..."
      context="e-commerce product search"
      onSelect={(suggestion) => console.log('Selected:', suggestion)}
    />
  );
}
```

### Using the Hook

```tsx
import { useAutosuggest } from '@aireact/autosuggest';

function CustomAutosuggest() {
  const {
    suggestions,
    isLoading,
    getSuggestions,
    clearSuggestions
  } = useAutosuggest({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    context: 'product search',
    maxSuggestions: 5
  });

  return (
    <div>
      <input
        onChange={(e) => getSuggestions(e.target.value)}
        placeholder="Search..."
      />
      {isLoading && <span>Loading...</span>}
      <ul>
        {suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 📖 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | string | - | AI provider |
| `apiKey` | string | - | API key |
| `context` | string | - | Context for suggestions |
| `placeholder` | string | 'Type...' | Input placeholder |
| `maxSuggestions` | number | 5 | Max suggestions |
| `debounceMs` | number | 300 | Debounce delay |
| `onSelect` | function | - | Selection callback |

## 🎨 Customization

```css
:root {
  --aireact-suggest-bg: #ffffff;
  --aireact-suggest-border: #e0e0e0;
  --aireact-suggest-hover: #f5f5f5;
  --aireact-suggest-highlight: #2196f3;
}
```

## 📦 Related Packages

- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/chatbot](https://www.npmjs.com/package/@aireact/chatbot) - AI Chat
- [@aireact/predictive-input](https://www.npmjs.com/package/@aireact/predictive-input) - Predictive Text

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

