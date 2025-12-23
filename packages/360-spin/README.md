# @aireact/360-spin

🚀 **AI-Powered 360° Product Viewer for React**

Generate and display 360° product views with AI image generation for e-commerce.

<p>
  <a href="https://www.npmjs.com/package/@aireact/360-spin"><img src="https://img.shields.io/npm/v/@aireact/360-spin.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@aireact/360-spin"><img src="https://img.shields.io/npm/dm/@aireact/360-spin" alt="npm downloads"></a>
  <a href="https://github.com/reachbrt/AIReact/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@aireact/360-spin.svg?style=flat-square" alt="MIT License"></a>
  <a href="https://github.com/reachbrt/AIReact"><img src="https://img.shields.io/github/stars/reachbrt/AIReact?style=social" alt="GitHub Stars"></a>
</p>

## ✨ Features

- **🎨 AI Generation**: Generate 360° views from a single image
- **🔄 Smooth Rotation**: Drag to rotate product smoothly
- **📱 Touch Support**: Mobile-friendly swipe gestures
- **🖼️ Premium Quality**: Professional e-commerce style
- **⚡ Optimized**: Lazy loading and smooth animations
- **🔧 TypeScript**: Full TypeScript support

## 📦 Installation

```bash
npm install @aireact/360-spin @aireact/core
```

## 🚀 Quick Start

### SpinViewer - Display 360° Images

```tsx
import { SpinViewer } from '@aireact/360-spin';
import '@aireact/360-spin/style.css';

function App() {
  const frames = [
    '/product/frame-0.jpg',
    '/product/frame-1.jpg',
    '/product/frame-2.jpg',
    // ... up to 8-36 frames
  ];

  return (
    <SpinViewer
      frames={frames}
      width={600}
      height={600}
      sensitivity={8}
    />
  );
}
```

### SpinGenerator - AI-Generate 360° Views

```tsx
import { SpinGenerator, useSpinGenerator } from '@aireact/360-spin';

function App() {
  return (
    <SpinGenerator
      provider="openai"
      apiKey={process.env.REACT_APP_OPENAI_API_KEY}
      onGenerate={(frames) => console.log('Generated:', frames)}
    />
  );
}
```

### Using the Hook

```tsx
import { useSpinGenerator, use360Spin } from '@aireact/360-spin';

function Custom360() {
  const {
    frames,
    isGenerating,
    progress,
    generateFrames
  } = useSpinGenerator({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    frameCount: 8
  });

  const {
    currentFrame,
    isDragging,
    handlers
  } = use360Spin({
    frames,
    sensitivity: 8
  });

  return (
    <div>
      <input
        type="file"
        onChange={(e) => generateFrames(e.target.files[0])}
      />
      {isGenerating && <progress value={progress} max={100} />}
      {frames.length > 0 && (
        <div {...handlers} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
          <img src={frames[currentFrame]} alt="360 view" />
        </div>
      )}
    </div>
  );
}
```

## 🎯 Interaction

| Action | Result |
|--------|--------|
| Drag left/right | Rotate product |
| Swipe (mobile) | Rotate product |
| Mouse wheel | Zoom (if enabled) |

## 📖 SpinViewer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `frames` | string[] | - | Array of frame URLs |
| `width` | number | 500 | Viewer width |
| `height` | number | 500 | Viewer height |
| `sensitivity` | number | 8 | Drag sensitivity |
| `reverse` | boolean | false | Reverse direction |
| `autoPlay` | boolean | false | Auto-rotate |
| `autoPlaySpeed` | number | 100 | Auto-play speed (ms) |

## 📖 SpinGenerator Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | string | - | AI provider |
| `apiKey` | string | - | API key |
| `frameCount` | number | 8 | Number of frames |
| `onGenerate` | function | - | Generation callback |
| `quality` | string | 'high' | Image quality |

## 🎨 Customization

```css
:root {
  --aireact-spin-bg: #ffffff;
  --aireact-spin-border: #e0e0e0;
  --aireact-spin-loader: #2196f3;
}
```

## 📦 Related Packages

### React (@aireact)
- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/image-caption](https://www.npmjs.com/package/@aireact/image-caption) - Image Captioning
- [@aireact/chatbot](https://www.npmjs.com/package/@aireact/chatbot) - AI Chat

### Vue.js (@aivue)
- [@aivue/360-spin](https://www.npmjs.com/package/@aivue/360-spin) - Vue 360° Viewer
- [@aivue/core](https://www.npmjs.com/package/@aivue/core) - Vue Core AI Client

### Angular (@aiangular) - Coming Soon
- @aiangular/360-spin - Angular 360° Viewer

## 🔗 More Information

- [GitHub Repository](https://github.com/reachbrt/AIReact)
- [Full Documentation](https://github.com/reachbrt/AIReact/wiki)
- [Report Issues](https://github.com/reachbrt/AIReact/issues)

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

