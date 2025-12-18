/**
 * SmartDataTable Demo Component
 * Demonstrates AI-native data table features
 */

import React from 'react';
import { SmartDataTable, Column, RowAgent } from '@aireact/smart-datatable';

interface SmartDataTableDemoProps {
  apiKey: string;
}

// Sample e-commerce orders data
const sampleData = [
  { id: 1, customer: 'Acme Corp', product: 'Laptop Pro', total: 1299, status: 'Completed', country: 'USA', orderDate: '2024-01-15' },
  { id: 2, customer: 'Tech Solutions', product: 'Monitor 4K', total: 599, status: 'Pending', country: 'India', orderDate: '2024-01-18' },
  { id: 3, customer: 'Global Trade', product: 'Keyboard Elite', total: 149, status: 'Completed', country: 'UK', orderDate: '2024-01-20' },
  { id: 4, customer: 'StartupXYZ', product: 'Mouse Pro', total: 89, status: 'Shipped', country: 'USA', orderDate: '2024-01-22' },
  { id: 5, customer: 'MegaCorp', product: 'Laptop Pro', total: 2598, status: 'Completed', country: 'India', orderDate: '2024-01-25' },
  { id: 6, customer: 'Digital First', product: 'Webcam HD', total: 129, status: 'Pending', country: 'Canada', orderDate: '2024-01-28' },
  { id: 7, customer: 'InnovateCo', product: 'Headphones BT', total: 199, status: 'Shipped', country: 'Germany', orderDate: '2024-02-01' },
  { id: 8, customer: 'CloudNet', product: 'USB Hub', total: 49, status: 'Completed', country: 'USA', orderDate: '2024-02-05' },
];

// Column definitions with types
const columns: Column<typeof sampleData[0]>[] = [
  { key: 'id', label: 'Order ID', sortable: true, type: 'number', width: 80 },
  { key: 'customer', label: 'Customer', sortable: true, type: 'string' },
  { key: 'product', label: 'Product', sortable: true, type: 'string' },
  { key: 'total', label: 'Total', sortable: true, type: 'number', formatter: (val) => `$${val.toLocaleString()}` },
  { key: 'status', label: 'Status', sortable: true, type: 'string' },
  { key: 'country', label: 'Country', sortable: true, type: 'string' },
  { key: 'orderDate', label: 'Date', sortable: true, type: 'date' },
];

// AI Row Agents
const rowAgents: RowAgent[] = [
  {
    id: 'explain',
    label: 'Explain',
    icon: '📝',
    promptTemplate: 'Explain this order: Customer {{customer}} ordered {{product}} for ${{total}}, status: {{status}}',
  },
  {
    id: 'predict-delivery',
    label: 'Predict',
    icon: '📅',
    promptTemplate: 'Predict delivery date for order {{id}} to {{country}}. Current status: {{status}}',
  },
];

export const SmartDataTableDemo: React.FC<SmartDataTableDemoProps> = ({ apiKey }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">AI-Native Smart Data Table</h3>
        <p className="text-slate-500 text-sm">
          Query your data using natural language. Try "show orders from USA" or "total &gt; 500".
        </p>
      </div>

      {/* Example Queries */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {[
          'Show completed orders',
          'Orders from India',
          'Sort by total desc',
          'total > 500',
          'Top 3 orders',
        ].map((q) => (
          <span
            key={q}
            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
          >
            {q}
          </span>
        ))}
      </div>

      {/* Data Table with AI Features */}
      <SmartDataTable
        data={sampleData}
        columns={columns}
        title="Order Management"
        rowKey="id"
        apiKey={apiKey}
        provider="openai"
        aiSearch={true}
        aiInsights={true}
        showChat={true}
        enableExport={true}
        rowAgents={rowAgents}
        selectable={true}
        pageSize={5}
        searchPlaceholder="Ask: show orders from USA where total > 500..."
        onAiQuery={(result) => console.log('AI Query:', result)}
        onAiInsight={(insights) => console.log('AI Insights:', insights)}
        onExport={(data) => console.log('Exported:', data.format, data.data.length, 'records')}
        className="w-full"
      />

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
        {[
          { icon: '🗣️', label: 'NLP Queries' },
          { icon: '✨', label: 'AI Insights' },
          { icon: '💬', label: 'Chat Interface' },
          { icon: '🤖', label: 'Row Agents' },
          { icon: '📊', label: 'Auto Schema' },
          { icon: '📥', label: 'Export Data' },
        ].map((feature) => (
          <div key={feature.label} className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-2xl mb-1">{feature.icon}</div>
            <div className="text-xs text-slate-600">{feature.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

