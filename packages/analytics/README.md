# @aireact/analytics

🚀 **AI-Powered Analytics Dashboard for React**

Intelligent analytics components with AI-driven insights and natural language queries.

[![npm version](https://img.shields.io/npm/v/@aireact/analytics.svg?style=flat-square)](https://www.npmjs.com/package/@aireact/analytics)
[![MIT License](https://img.shields.io/npm/l/@aireact/analytics.svg?style=flat-square)](https://github.com/reachbrt/reactai/blob/main/LICENSE)

## ✨ Features

- **📊 AI Insights**: Automatic insights from your data
- **💬 Natural Language**: Query data with plain English
- **📈 Smart Visualizations**: AI-suggested chart types
- **🎯 Trend Detection**: Automatic trend and anomaly detection
- **🎨 Customizable**: Fully stylable components
- **🔧 TypeScript**: Full TypeScript support

## 📦 Installation

```bash
npm install @aireact/analytics @aireact/core
```

## 🚀 Quick Start

```tsx
import { AnalyticsDashboard, useAnalytics } from '@aireact/analytics';
import '@aireact/analytics/style.css';

function App() {
  const data = [
    { date: '2024-01', sales: 1200, visitors: 4500 },
    { date: '2024-02', sales: 1400, visitors: 5200 },
    // ... more data
  ];

  return (
    <AnalyticsDashboard
      provider="openai"
      apiKey={process.env.REACT_APP_OPENAI_API_KEY}
      data={data}
      title="Sales Analytics"
    />
  );
}
```

### Using the Hook

```tsx
import { useAnalytics } from '@aireact/analytics';

function CustomAnalytics() {
  const {
    insights,
    isAnalyzing,
    queryData,
    getInsights
  } = useAnalytics({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    data: salesData
  });

  return (
    <div>
      <input
        placeholder="Ask about your data..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') queryData(e.target.value);
        }}
      />
      {insights.map((insight, i) => (
        <div key={i} className="insight">{insight}</div>
      ))}
    </div>
  );
}
```

## 📖 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | string | - | AI provider |
| `apiKey` | string | - | API key |
| `data` | array | - | Data to analyze |
| `title` | string | 'Analytics' | Dashboard title |
| `chartTypes` | array | ['line', 'bar'] | Allowed chart types |
| `showInsights` | boolean | true | Show AI insights |

## 🎨 Customization

```css
:root {
  --aireact-analytics-bg: #ffffff;
  --aireact-analytics-primary: #2196f3;
  --aireact-analytics-accent: #ff9800;
}
```

## 📦 Related Packages

- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/smart-datatable](https://www.npmjs.com/package/@aireact/smart-datatable) - Smart Data Tables
- [@aireact/chatbot](https://www.npmjs.com/package/@aireact/chatbot) - AI Chat

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

