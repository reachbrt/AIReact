/**
 * SmartDataTable Demo Component
 */

import React, { useState } from 'react';
import { SmartDataTable } from '@aireact/smart-datatable';

interface SmartDataTableDemoProps {
  apiKey: string;
}

const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joined: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joined: '2023-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'Inactive', joined: '2023-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active', joined: '2023-04-05' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Active', joined: '2023-05-12' },
];

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'joined', label: 'Joined', sortable: true },
];

export const SmartDataTableDemo: React.FC<SmartDataTableDemoProps> = ({ apiKey }) => {
  const [query, setQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Smart Data Table</h3>
        <p className="text-slate-500 text-sm">
          Query your data using natural language. Try "show active admins" or "sort by name".
        </p>
      </div>

      {/* NLP Query Input */}
      <div className="max-w-lg mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about the data..."
            className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
      </div>

      {/* Example Queries */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          'Show active users',
          'Find admins',
          'Sort by joined date',
          'Filter by role = Editor',
        ].map((q) => (
          <button
            key={q}
            onClick={() => setQuery(q)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-600 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <SmartDataTable
          data={sampleData}
          columns={columns}
          nlpQuery={query}
          apiKey={apiKey}
          provider="openai"
          enableNLP={true}
          className="w-full"
        />
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
        {[
          { icon: '🗣️', label: 'NLP Queries' },
          { icon: '🔄', label: 'Auto Sort' },
          { icon: '🔍', label: 'Smart Filter' },
          { icon: '📊', label: 'Aggregations' },
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

