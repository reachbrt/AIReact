# @aireact/predictive-input

🚀 **AI-Powered Predictive Text Input for React**

Intelligent text prediction and completion powered by AI for enhanced typing experiences.

<p>
  <a href="https://www.npmjs.com/package/@aireact/predictive-input"><img src="https://img.shields.io/npm/v/@aireact/predictive-input.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@aireact/predictive-input"><img src="https://img.shields.io/npm/dm/@aireact/predictive-input" alt="npm downloads"></a>
  <a href="https://github.com/reachbrt/AIReact/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@aireact/predictive-input.svg?style=flat-square" alt="MIT License"></a>
  <a href="https://github.com/reachbrt/AIReact"><img src="https://img.shields.io/github/stars/reachbrt/AIReact?style=social" alt="GitHub Stars"></a>
</p>

## ✨ Features

- **🧠 AI Predictions**: Smart text completion using AI
- **⚡ Inline Suggestions**: Ghost text predictions as you type
- **🎯 Context-Aware**: Understands context for better predictions
- **⌨️ Tab to Accept**: Easy keyboard navigation
- **🎨 Customizable**: Fully stylable components
- **🔧 TypeScript**: Full TypeScript support

## 📦 Installation

```bash
npm install @aireact/predictive-input @aireact/core
```

## 🚀 Quick Start

```tsx
import { PredictiveInput, usePredictiveText } from '@aireact/predictive-input';
import '@aireact/predictive-input/style.css';

function App() {
  return (
    <PredictiveInput
      provider="openai"
      apiKey={process.env.REACT_APP_OPENAI_API_KEY}
      placeholder="Start typing..."
      context="email composition"
      onAccept={(text) => console.log('Accepted:', text)}
    />
  );
}
```

### Using the Hook

```tsx
import { usePredictiveText } from '@aireact/predictive-input';

function CustomPredictive() {
  const {
    prediction,
    isLoading,
    getPrediction,
    acceptPrediction,
    clearPrediction
  } = usePredictiveText({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    context: 'professional email'
  });

  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    getPrediction(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && prediction) {
      e.preventDefault();
      setValue(value + prediction);
      acceptPrediction();
    }
  };

  return (
    <div className="predictive-wrapper">
      <input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {prediction && (
        <span className="ghost-text">{prediction}</span>
      )}
    </div>
  );
}
```

## 📖 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | string | - | AI provider |
| `apiKey` | string | - | API key |
| `context` | string | - | Context for predictions |
| `placeholder` | string | 'Type...' | Input placeholder |
| `debounceMs` | number | 200 | Debounce delay |
| `onAccept` | function | - | Accept callback |
| `acceptKey` | string | 'Tab' | Key to accept |

## 🎨 Customization

```css
:root {
  --aireact-predict-ghost: #9e9e9e;
  --aireact-predict-text: #333333;
  --aireact-predict-bg: #ffffff;
}
```

## 📦 Related Packages

### React (@aireact)
- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/autosuggest](https://www.npmjs.com/package/@aireact/autosuggest) - AI Suggestions
- [@aireact/smartform](https://www.npmjs.com/package/@aireact/smartform) - Smart Forms

### Vue.js (@aivue)
- [@aivue/predictive-input](https://www.npmjs.com/package/@aivue/predictive-input) - Vue Predictive Input
- [@aivue/core](https://www.npmjs.com/package/@aivue/core) - Vue Core AI Client

### Angular (@aiangular) - Coming Soon
- @aiangular/predictive-input - Angular Predictive Input

## 🔗 More Information

- [GitHub Repository](https://github.com/reachbrt/AIReact)
- [Full Documentation](https://github.com/reachbrt/AIReact/wiki)
- [Report Issues](https://github.com/reachbrt/AIReact/issues)

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

