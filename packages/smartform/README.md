# @aireact/smartform

🚀 **AI-Powered Form Validation for React**

Intelligent form validation and auto-completion powered by AI for smarter user experiences.

[![npm version](https://img.shields.io/npm/v/@aireact/smartform.svg?style=flat-square)](https://www.npmjs.com/package/@aireact/smartform)
[![MIT License](https://img.shields.io/npm/l/@aireact/smartform.svg?style=flat-square)](https://github.com/reachbrt/AIReact/blob/main/LICENSE)

## ✨ Features

- **🧠 AI Validation**: Intelligent field validation using AI
- **📝 Auto-Complete**: Smart field suggestions and completion
- **🎯 Context-Aware**: Understands form context for better validation
- **⚡ Real-time**: Instant feedback as users type
- **🎨 Customizable**: Fully stylable components
- **🔧 TypeScript**: Full TypeScript support

## 📦 Installation

```bash
npm install @aireact/smartform @aireact/core
```

## 🚀 Quick Start

```tsx
import { SmartForm, useSmartValidation } from '@aireact/smartform';
import '@aireact/smartform/style.css';

function App() {
  return (
    <SmartForm
      provider="openai"
      apiKey={process.env.REACT_APP_OPENAI_API_KEY}
      onSubmit={(data) => console.log('Form data:', data)}
    >
      <SmartForm.Field name="email" type="email" label="Email" />
      <SmartForm.Field name="phone" type="tel" label="Phone" />
      <SmartForm.Field name="address" type="text" label="Address" />
      <button type="submit">Submit</button>
    </SmartForm>
  );
}
```

### Using the Hook

```tsx
import { useSmartValidation } from '@aireact/smartform';

function CustomForm() {
  const {
    validate,
    errors,
    isValidating,
    suggestions
  } = useSmartValidation({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    context: 'user registration form'
  });

  const handleBlur = async (field, value) => {
    await validate(field, value);
  };

  return (
    <form>
      <input
        name="email"
        onBlur={(e) => handleBlur('email', e.target.value)}
      />
      {errors.email && <span className="error">{errors.email}</span>}
      {suggestions.email && <span className="hint">{suggestions.email}</span>}
    </form>
  );
}
```

## 📖 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | string | - | AI provider |
| `apiKey` | string | - | API key |
| `context` | string | - | Form context |
| `onSubmit` | function | - | Submit handler |
| `validateOnBlur` | boolean | true | Validate on blur |
| `showSuggestions` | boolean | true | Show AI suggestions |

## 🎨 Customization

```css
:root {
  --aireact-form-error: #f44336;
  --aireact-form-success: #4caf50;
  --aireact-form-hint: #2196f3;
}
```

## 📦 Related Packages

- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/autosuggest](https://www.npmjs.com/package/@aireact/autosuggest) - AI Suggestions
- [@aireact/predictive-input](https://www.npmjs.com/package/@aireact/predictive-input) - Predictive Text

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

