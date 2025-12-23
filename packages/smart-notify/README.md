# @aireact/smart-notify

🚀 **AI-Powered Smart Notifications for React**

Intelligent notification system that adapts messages based on context and user behavior.

<p>
  <a href="https://www.npmjs.com/package/@aireact/smart-notify"><img src="https://img.shields.io/npm/v/@aireact/smart-notify.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@aireact/smart-notify"><img src="https://img.shields.io/npm/dm/@aireact/smart-notify" alt="npm downloads"></a>
  <a href="https://github.com/reachbrt/AIReact/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@aireact/smart-notify.svg?style=flat-square" alt="MIT License"></a>
  <a href="https://github.com/reachbrt/AIReact"><img src="https://img.shields.io/github/stars/reachbrt/AIReact?style=social" alt="GitHub Stars"></a>
</p>

## ✨ Features

- **🔔 Smart Notifications**: AI-enhanced notification content
- **🎯 Context-Aware**: Adapts based on user context
- **⏰ Smart Timing**: Optimal delivery timing
- **📊 Priority Detection**: Auto-prioritize notifications
- **🎨 Customizable**: Multiple notification styles
- **🔧 TypeScript**: Full TypeScript support

## 📦 Installation

```bash
npm install @aireact/smart-notify @aireact/core
```

## 🚀 Quick Start

```tsx
import { NotificationContainer, useNotifications } from '@aireact/smart-notify';
import '@aireact/smart-notify/style.css';

function App() {
  const { notify, notifications } = useNotifications({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY
  });

  const handleAction = async () => {
    await notify({
      title: 'Action Complete',
      message: 'Your file has been uploaded successfully.',
      type: 'success',
      enhance: true // AI will enhance the message
    });
  };

  return (
    <div>
      <button onClick={handleAction}>Upload File</button>
      <NotificationContainer notifications={notifications} />
    </div>
  );
}
```

### Using the Hook

```tsx
import { useNotifications } from '@aireact/smart-notify';

function NotificationDemo() {
  const {
    notifications,
    notify,
    dismiss,
    dismissAll,
    updateNotification
  } = useNotifications({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    position: 'top-right',
    maxNotifications: 5
  });

  const showSmartNotification = async () => {
    await notify({
      title: 'Order Update',
      message: 'Your order #12345 has shipped',
      type: 'info',
      enhance: true,
      context: 'e-commerce order tracking',
      duration: 5000
    });
  };

  return (
    <div>
      <button onClick={showSmartNotification}>Show Notification</button>
      <button onClick={dismissAll}>Clear All</button>
    </div>
  );
}
```

## 📖 Props & Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `provider` | string | - | AI provider |
| `apiKey` | string | - | API key |
| `position` | string | 'top-right' | Notification position |
| `maxNotifications` | number | 5 | Max visible |
| `defaultDuration` | number | 5000 | Default duration (ms) |

### Notification Types

| Type | Description | Icon |
|------|-------------|------|
| `success` | Positive outcomes | ✅ |
| `error` | Errors and failures | ❌ |
| `warning` | Warnings and cautions | ⚠️ |
| `info` | Informational messages | ℹ️ |

## 🎨 Customization

```css
:root {
  --aireact-notify-success: #4caf50;
  --aireact-notify-error: #f44336;
  --aireact-notify-warning: #ff9800;
  --aireact-notify-info: #2196f3;
}
```

## 📦 Related Packages

### React (@aireact)
- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/emotion-ui](https://www.npmjs.com/package/@aireact/emotion-ui) - Emotion UI
- [@aireact/chatbot](https://www.npmjs.com/package/@aireact/chatbot) - AI Chat
- [@aireact/voice-actions](https://www.npmjs.com/package/@aireact/voice-actions) - Voice Actions

### Vue.js (@aivue)
- [@aivue/smart-notify](https://www.npmjs.com/package/@aivue/smart-notify) - Vue Smart Notify
- [@aivue/core](https://www.npmjs.com/package/@aivue/core) - Vue Core AI Client

### Angular (@aiangular) - Coming Soon
- @aiangular/smart-notify - Angular Smart Notify

## 🔗 More Information

- [GitHub Repository](https://github.com/reachbrt/AIReact)
- [Full Documentation](https://github.com/reachbrt/AIReact/wiki)
- [Report Issues](https://github.com/reachbrt/AIReact/issues)

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

