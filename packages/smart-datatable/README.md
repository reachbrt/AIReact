# @aireact/smart-datatable

🚀 **AI-Powered Data Tables for React**

Intelligent data tables with natural language querying and AI-powered insights.

<p>
  <a href="https://www.npmjs.com/package/@aireact/smart-datatable"><img src="https://img.shields.io/npm/v/@aireact/smart-datatable.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@aireact/smart-datatable"><img src="https://img.shields.io/npm/dm/@aireact/smart-datatable" alt="npm downloads"></a>
  <a href="https://github.com/reachbrt/AIReact/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@aireact/smart-datatable.svg?style=flat-square" alt="MIT License"></a>
  <a href="https://github.com/reachbrt/AIReact"><img src="https://img.shields.io/github/stars/reachbrt/AIReact?style=social" alt="GitHub Stars"></a>
</p>

## ✨ Features

- **💬 Natural Language Queries**: Query data using plain English
- **📊 AI Insights**: Automatic data insights and patterns
- **🔍 Smart Filtering**: AI-enhanced search and filtering
- **📈 Trend Detection**: Automatic trend identification
- **🎨 Customizable**: Fully stylable components
- **🔧 TypeScript**: Full TypeScript support

## 📦 Installation

```bash
npm install @aireact/smart-datatable @aireact/core
```

## 🚀 Quick Start

```tsx
import { SmartDataTable, useNLPQuery } from '@aireact/smart-datatable';
import '@aireact/smart-datatable/style.css';

const data = [
  { id: 1, name: 'Alice', sales: 1200, region: 'North' },
  { id: 2, name: 'Bob', sales: 980, region: 'South' },
  { id: 3, name: 'Charlie', sales: 1500, region: 'East' },
];

function App() {
  return (
    <SmartDataTable
      provider="openai"
      apiKey={process.env.REACT_APP_OPENAI_API_KEY}
      data={data}
      columns={['name', 'sales', 'region']}
      enableNLQuery={true}
      queryPlaceholder="Ask about your data..."
    />
  );
}
```

### Using the Hook

```tsx
import { useNLPQuery } from '@aireact/smart-datatable';

function CustomTable() {
  const {
    filteredData,
    insights,
    isQuerying,
    query,
    clearQuery
  } = useNLPQuery({
    provider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    data: salesData
  });

  return (
    <div>
      <input
        placeholder="e.g., Show top 5 by sales"
        onKeyDown={(e) => {
          if (e.key === 'Enter') query(e.target.value);
        }}
      />
      {isQuerying && <span>Processing query...</span>}
      <table>
        <tbody>
          {filteredData.map((row, i) => (
            <tr key={i}>
              <td>{row.name}</td>
              <td>{row.sales}</td>
              <td>{row.region}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {insights.length > 0 && (
        <div className="insights">
          {insights.map((insight, i) => (
            <p key={i}>{insight}</p>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 💬 Example Queries

- "Show all records where sales > 1000"
- "Sort by sales descending"
- "Find top 5 performers"
- "Group by region and sum sales"
- "Show records from last month"

## 📖 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | string | - | AI provider |
| `apiKey` | string | - | API key |
| `data` | array | - | Table data |
| `columns` | array | - | Column definitions |
| `enableNLQuery` | boolean | true | Enable NL queries |
| `showInsights` | boolean | true | Show AI insights |
| `pageSize` | number | 10 | Rows per page |

## 🎨 Customization

```css
:root {
  --aireact-table-header: #f5f5f5;
  --aireact-table-border: #e0e0e0;
  --aireact-table-hover: #f0f0f0;
}
```

## 📦 Related Packages

### React (@aireact)
- [@aireact/core](https://www.npmjs.com/package/@aireact/core) - Core AI Client
- [@aireact/analytics](https://www.npmjs.com/package/@aireact/analytics) - AI Analytics
- [@aireact/autosuggest](https://www.npmjs.com/package/@aireact/autosuggest) - AI Suggestions
- [@aireact/chatbot](https://www.npmjs.com/package/@aireact/chatbot) - AI Chat

### Vue.js (@aivue)
- [@aivue/smart-datatable](https://www.npmjs.com/package/@aivue/smart-datatable) - Vue Smart DataTable
- [@aivue/core](https://www.npmjs.com/package/@aivue/core) - Vue Core AI Client

### Angular (@aiangular) - Coming Soon
- @aiangular/smart-datatable - Angular Smart DataTable

## 🔗 More Information

- [GitHub Repository](https://github.com/reachbrt/AIReact)
- [Full Documentation](https://github.com/reachbrt/AIReact/wiki)
- [Report Issues](https://github.com/reachbrt/AIReact/issues)

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

