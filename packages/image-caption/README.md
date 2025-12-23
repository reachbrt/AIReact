# @aireact/image-caption

🚀 **AI-Powered Image Captioning for React**

Generate intelligent captions and descriptions for images using AI vision models.

<p>
  <a href="https://www.npmjs.com/package/@aireact/image-caption"><img src="https://img.shields.io/npm/v/@aireact/image-caption.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@aireact/image-caption"><img src="https://img.shields.io/npm/dm/@aireact/image-caption" alt="npm downloads"></a>
  <a href="https://github.com/reachbrt/AIReact/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@aireact/image-caption.svg?style=flat-square" alt="MIT License"></a>
  <a href="https://github.com/reachbrt/AIReact"><img src="https://img.shields.io/github/stars/reachbrt/AIReact?style=social" alt="GitHub Stars"></a>
</p>

## ✨ Features

- **🖼️ AI Vision**: Powered by OpenAI GPT-4 Vision, Claude, Gemini
- **📝 Rich Descriptions**: Detailed, context-aware captions
- **🏷️ Auto Tagging**: Generate relevant tags for images
- **♿ Accessibility**: Perfect for alt-text generation
- **🎨 Customizable**: Control caption style and length
- **🔧 TypeScript**: Full TypeScript support

## 📦 Installation

```bash
npm install @aireact/image-caption @aireact/core
```

## 🚀 Quick Start

```tsx
import { ImageCaption, useImageCaption } from '@aireact/image-caption';
import '@aireact/image-caption/style.css';

function App() {
  return (
    <ImageCaption
      provider="openai"
      apiKey={process.env.REACT_APP_OPENAI_API_KEY}
      model="gpt-4-vision-preview"
      src="/path/to/image.jpg"
      showCaption={true}
    />
  );
}
```

### Using the Hook

```tsx
import { useImageCaption } from '@aireact/image-caption';

function CustomCaption() {
  const {
    caption,
    tags,
    isLoading,
    generateCaption
  } = useImageCaption({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    model: 'gpt-4-vision-preview'
  });

  const handleImageUpload = async (file) => {
    await generateCaption(file);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleImageUpload(e.target.files[0])} />
      {isLoading && <span>Analyzing image...</span>}
      {caption && <p>{caption}</p>}
      {tags && (
        <div className="tags">
          {tags.map((tag, i) => <span key={i}>{tag}</span>)}
        </div>
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
| `model` | string | - | Vision model |
| `src` | string | - | Image source |
| `showCaption` | boolean | true | Display caption |
| `showTags` | boolean | false | Display tags |
| `style` | string | 'detailed' | Caption style |

## 🎨 Customization

```css
:root {
  --aireact-caption-bg: #f5f5f5;
  --aireact-caption-text: #333333;
  --aireact-caption-tag: #2196f3;
}
```

## 📦 Related Packages

### React (@aireact)
- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/360-spin](https://www.npmjs.com/package/@aireact/360-spin) - 360° Product Viewer
- [@aireact/doc-intelligence](https://www.npmjs.com/package/@aireact/doc-intelligence) - Document AI

### Vue.js (@aivue)
- [@aivue/image-caption](https://www.npmjs.com/package/@aivue/image-caption) - Vue Image Caption
- [@aivue/core](https://www.npmjs.com/package/@aivue/core) - Vue Core AI Client

### Angular (@aiangular) - Coming Soon
- @aiangular/image-caption - Angular Image Caption

## 🔗 More Information

- [GitHub Repository](https://github.com/reachbrt/AIReact)
- [Full Documentation](https://github.com/reachbrt/AIReact/wiki)
- [Report Issues](https://github.com/reachbrt/AIReact/issues)

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

