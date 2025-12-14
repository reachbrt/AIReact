# @aireact/doc-intelligence

🚀 **AI-Powered Document Intelligence for React**

Extract, analyze, and understand documents using AI with OCR and document processing.

[![npm version](https://img.shields.io/npm/v/@aireact/doc-intelligence.svg?style=flat-square)](https://www.npmjs.com/package/@aireact/doc-intelligence)
[![MIT License](https://img.shields.io/npm/l/@aireact/doc-intelligence.svg?style=flat-square)](https://github.com/reachbrt/reactai/blob/main/LICENSE)

## ✨ Features

- **📄 Document Extraction**: Extract text from PDFs, images, documents
- **🔍 OCR**: Optical Character Recognition with AI enhancement
- **📊 Data Extraction**: Extract structured data from documents
- **🏷️ Classification**: Automatic document categorization
- **📝 Summarization**: AI-powered document summaries
- **🔧 TypeScript**: Full TypeScript support

## 📦 Installation

```bash
npm install @aireact/doc-intelligence @aireact/core
```

## 🚀 Quick Start

```tsx
import { DocumentScanner, useDocumentExtractor } from '@aireact/doc-intelligence';
import '@aireact/doc-intelligence/style.css';

function App() {
  return (
    <DocumentScanner
      provider="openai"
      apiKey={process.env.REACT_APP_OPENAI_API_KEY}
      onExtract={(data) => console.log('Extracted:', data)}
      accept=".pdf,.png,.jpg"
    />
  );
}
```

### Using the Hook

```tsx
import { useDocumentExtractor } from '@aireact/doc-intelligence';

function CustomExtractor() {
  const {
    extractedText,
    structuredData,
    isProcessing,
    extractDocument,
    summarize
  } = useDocumentExtractor({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    model: 'gpt-4-vision-preview'
  });

  const handleUpload = async (file) => {
    await extractDocument(file);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {isProcessing && <span>Processing document...</span>}
      {extractedText && (
        <div>
          <h3>Extracted Text</h3>
          <pre>{extractedText}</pre>
          <button onClick={() => summarize()}>Summarize</button>
        </div>
      )}
      {structuredData && (
        <div>
          <h3>Structured Data</h3>
          <pre>{JSON.stringify(structuredData, null, 2)}</pre>
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
| `accept` | string | '.pdf,.png,.jpg' | Accepted file types |
| `onExtract` | function | - | Extraction callback |
| `extractStructured` | boolean | true | Extract structured data |
| `autoSummarize` | boolean | false | Auto-summarize |

## 🎨 Customization

```css
:root {
  --aireact-doc-bg: #f5f5f5;
  --aireact-doc-border: #e0e0e0;
  --aireact-doc-accent: #2196f3;
}
```

## 📦 Related Packages

- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/image-caption](https://www.npmjs.com/package/@aireact/image-caption) - Image Captioning
- [@aireact/analytics](https://www.npmjs.com/package/@aireact/analytics) - AI Analytics

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

