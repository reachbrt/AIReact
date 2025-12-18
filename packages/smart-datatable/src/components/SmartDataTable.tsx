/**
 * SmartDataTable Component - AI-native data table
 * Based on DETAILED_DOCUMENTATION.md and ANGULAR_REACT_IMPLEMENTATION_GUIDE.md
 */

import { useState, useMemo, useCallback } from 'react';
import { SmartDataTableProps, Column, TableSchema, AIInsight, SortDefinition } from '../types';
import { useAiTableQuery, applyFilter } from '../hooks/useAiTableQuery';
import { useAiInsights } from '../hooks/useAiInsights';
import { useAiRowAgents } from '../hooks/useAiRowAgents';
import '../styles/smart-datatable.css';

/**
 * Convert data to CSV format
 */
function convertToCSV<T extends Record<string, any>>(
  data: T[],
  columns: Column<T>[]
): string {
  if (data.length === 0) return '';

  const visibleCols = columns.filter(c => c.visible !== false);
  const headers = visibleCols.map(col => col.label || col.header || col.key).join(',');
  const rows = data.map(row =>
    visibleCols.map(col => {
      const value = row[col.key];
      const formatted = col.formatter ? col.formatter(value, row) : String(value ?? '');
      // Escape commas and quotes in CSV
      if (formatted.includes(',') || formatted.includes('"') || formatted.includes('\n')) {
        return `"${formatted.replace(/"/g, '""')}"`;
      }
      return formatted;
    }).join(',')
  );

  return [headers, ...rows].join('\n');
}

/**
 * Convert data to JSON format
 */
function convertToJSON<T>(data: T[]): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Download a file
 */
function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Build table schema from data and columns
 */
function buildSchema<T extends Record<string, any>>(
  data: T[],
  columns: Column<T>[]
): TableSchema {
  return {
    columns: columns.map(col => ({
      key: col.key,
      type: col.type || 'string',
      label: col.label || col.header || col.key,
      examples: data.slice(0, 5).map(row => row[col.key])
    })),
    rowCount: data.length,
    sampleRows: data.slice(0, 5)
  };
}

/**
 * Auto-generate columns from data
 */
function autoGenerateColumns<T extends Record<string, any>>(data: T[]): Column<T>[] {
  if (data.length === 0) return [];
  const firstRow = data[0];
  return Object.keys(firstRow).map(key => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    sortable: true,
    type: typeof firstRow[key] === 'number' ? 'number' : 'string'
  }));
}

export function SmartDataTable<T extends Record<string, any>>({
  data,
  columns: propColumns,
  title,
  rowKey = 'id',
  theme = 'light',
  searchPlaceholder = 'Ask a question about the data...',
  aiSearch = false,
  enableNLPSearch = true,
  apiKey,
  provider = 'openai',
  aiInsights = false,
  showChat = false,
  rowAgents = [],
  pageSize = 10,
  selectable = false,
  actions = [],
  emptyMessage = 'No data available',
  loading: externalLoading = false,
  className = '',
  enableExport = false,
  onRowClick,
  onSelectionChange,
  onAiQuery,
  onAiInsight,
  onSortChange,
  onNLPQuery,
  onExport
}: SmartDataTableProps<T>) {
  // Auto-generate columns if not provided
  const columns = useMemo(() => {
    return propColumns && propColumns.length > 0 ? propColumns : autoGenerateColumns(data);
  }, [propColumns, data]);

  // Build schema for AI hooks
  const schema = useMemo(() => buildSchema(data, columns), [data, columns]);

  // State
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortDefinition | null>(null);
  const [showInsightsPanel, setShowInsightsPanel] = useState(false);
  const [agentResultModal, setAgentResultModal] = useState<{ title: string; content: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [hasActiveFilter, setHasActiveFilter] = useState(false);

  // AI Hooks
  const aiQueryEnabled = aiSearch || enableNLPSearch;
  const {
    loading: queryLoading,
    lastResult: queryResult,
    queryToFilter,
    clearFilter
  } = useAiTableQuery({
    apiKey,
    provider,
    schema,
    onQueryResult: onAiQuery
  });

  const {
    insights,
    loading: insightsLoading,
    generateInsights
  } = useAiInsights({
    apiKey,
    provider,
    schema,
    data,
    config: { categories: ['trends', 'outliers', 'patterns', 'recommendations', 'summary'] }
  });

  const {
    executeAgent,
    loading: agentLoading
  } = useAiRowAgents({
    apiKey,
    provider,
    schema,
    agents: rowAgents
  });

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply AI filter if present
    if (queryResult?.filter) {
      result = applyFilter(result, queryResult.filter);
    }

    // Apply sort
    const activeSort = queryResult?.sort || sortConfig;
    if (activeSort) {
      result.sort((a, b) => {
        const aVal = a[activeSort.column];
        const bVal = b[activeSort.column];
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return activeSort.order === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [data, queryResult, sortConfig]);

  // Paginate
  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, page, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  // Handlers
  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    await queryToFilter(query);
    onNLPQuery?.(query, processedData);
    setPage(0);
    setHasActiveFilter(true);
  }, [query, queryToFilter, onNLPQuery, processedData]);

  const handleClearFilter = useCallback(() => {
    setQuery('');
    clearFilter();
    setSortConfig(null);
    setPage(0);
    setHasActiveFilter(false);
  }, [clearFilter]);

  const handleSort = useCallback((colKey: string) => {
    setSortConfig(prev => {
      const newSort: SortDefinition = {
        column: colKey,
        order: prev?.column === colKey && prev.order === 'asc' ? 'desc' : 'asc'
      };
      onSortChange?.(newSort);
      return newSort;
    });
  }, [onSortChange]);

  const toggleSelect = useCallback((idx: number) => {
    setSelected(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(idx)) newSelected.delete(idx);
      else newSelected.add(idx);
      onSelectionChange?.(Array.from(newSelected).map(i => processedData[i]));
      return newSelected;
    });
  }, [processedData, onSelectionChange]);

  const handleGenerateInsights = useCallback(async () => {
    const generated = await generateInsights();
    onAiInsight?.(generated);
    setShowInsightsPanel(true);
  }, [generateInsights, onAiInsight]);

  const handleAgentClick = useCallback(async (agent: typeof rowAgents[0], row: T) => {
    const result = await executeAgent(agent, row, row[rowKey]);
    setAgentResultModal({ title: agent.label, content: result.result });
  }, [executeAgent, rowKey]);

  const handleExport = useCallback((format: 'csv' | 'json') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      content = convertToCSV(processedData, columns);
      filename = 'data.csv';
      mimeType = 'text/csv';
    } else {
      content = convertToJSON(processedData);
      filename = 'data.json';
      mimeType = 'application/json';
    }

    downloadFile(content, filename, mimeType);
    onExport?.({ data: processedData, format });
  }, [processedData, columns, onExport]);

  const handleChatSend = useCallback(async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');

    // Use AI query to process - this also filters the table
    const result = await queryToFilter(userMessage);
    setHasActiveFilter(true);
    setPage(0);

    // Calculate filtered count after applying
    const filteredCount = result?.filter
      ? applyFilter(data, result.filter).length
      : data.length;

    const response = result?.explanation
      ? `${result.explanation}. Found ${filteredCount} matching records.`
      : `Found ${filteredCount} records.`;
    setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
  }, [chatInput, queryToFilter, data]);

  const isLoading = externalLoading || queryLoading || insightsLoading || agentLoading;

  // Get column header text
  const getColumnHeader = (col: Column<T>) => col.label || col.header || col.key;

  return (
    <div className={`reactai-datatable ${theme === 'dark' ? 'dark' : ''} ${className}`}>
      {/* Header with title and actions */}
      {(title || aiInsights || enableExport) && (
        <div className="reactai-datatable-header">
          {title && <h3 className="reactai-datatable-title">{title}</h3>}
          <div className="reactai-datatable-header-actions">
            {aiInsights && (
              <button
                onClick={handleGenerateInsights}
                disabled={insightsLoading}
                className="reactai-datatable-insights-btn"
              >
                {insightsLoading ? '⏳' : '✨'} AI Insights
              </button>
            )}
            {enableExport && (
              <div className="reactai-datatable-export-dropdown">
                <button className="reactai-datatable-export-btn">
                  📥 Export
                </button>
                <div className="reactai-datatable-export-menu">
                  <button onClick={() => handleExport('csv')}>📄 CSV</button>
                  <button onClick={() => handleExport('json')}>📋 JSON</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Search */}
      {aiQueryEnabled && (
        <div className="reactai-datatable-search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={searchPlaceholder}
            className="reactai-datatable-input"
          />
          <button onClick={handleSearch} disabled={queryLoading} className="reactai-datatable-btn">
            {queryLoading ? '⏳' : '🔍'}
          </button>
          {hasActiveFilter && (
            <button onClick={handleClearFilter} className="reactai-datatable-btn reactai-datatable-clear-btn">
              ✕ Clear
            </button>
          )}
        </div>
      )}

      {/* Query explanation */}
      {queryResult?.explanation && hasActiveFilter && (
        <div className="reactai-datatable-interpretation">
          💡 {queryResult.explanation} ({processedData.length} results)
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="reactai-datatable-loading">
          <span className="reactai-datatable-spinner"></span> Processing...
        </div>
      )}

      {/* Insights Panel */}
      {showInsightsPanel && insights.length > 0 && (
        <div className="reactai-datatable-insights-panel">
          <div className="reactai-datatable-insights-header">
            <h4>🔮 AI Insights</h4>
            <button onClick={() => setShowInsightsPanel(false)}>×</button>
          </div>
          <div className="reactai-datatable-insights-list">
            {insights.map((insight: AIInsight) => (
              <div key={insight.id} className={`reactai-datatable-insight reactai-datatable-insight-${insight.category}`}>
                <div className="reactai-datatable-insight-title">
                  {insight.category === 'trends' && '📈'}
                  {insight.category === 'outliers' && '⚠️'}
                  {insight.category === 'patterns' && '🔄'}
                  {insight.category === 'recommendations' && '💡'}
                  {insight.category === 'summary' && '📊'}
                  {' '}{insight.title}
                </div>
                <div className="reactai-datatable-insight-desc">{insight.description}</div>
                <div className="reactai-datatable-insight-confidence">
                  Confidence: {(insight.confidence * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="reactai-datatable-container">
        <table className="reactai-datatable-table">
          <thead>
            <tr>
              {selectable && <th className="select-col"><input type="checkbox" /></th>}
              {columns.filter(c => c.visible !== false).map(col => (
                <th
                  key={col.key}
                  style={{ width: col.width, textAlign: col.align }}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={col.sortable !== false ? 'sortable' : ''}
                >
                  {getColumnHeader(col)}
                  {sortConfig?.column === col.key && (
                    <span className="sort-indicator">{sortConfig.order === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
              ))}
              {(actions.length > 0 || rowAgents.length > 0) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 || rowAgents.length > 0 ? 1 : 0)} className="empty-message">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const globalIdx = page * pageSize + idx;
                return (
                  <tr
                    key={row[rowKey] ?? idx}
                    className={selected.has(globalIdx) ? 'selected' : ''}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="select-col" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(globalIdx)}
                          onChange={() => toggleSelect(globalIdx)}
                        />
                      </td>
                    )}
                    {columns.filter(c => c.visible !== false).map(col => {
                      const value = row[col.key];
                      const displayValue = col.render
                        ? col.render(value, row)
                        : col.formatter
                          ? col.formatter(value, row)
                          : String(value ?? '');
                      return (
                        <td key={col.key} style={{ textAlign: col.align }}>
                          {displayValue}
                        </td>
                      );
                    })}
                    {(actions.length > 0 || rowAgents.length > 0) && (
                      <td className="actions-col" onClick={e => e.stopPropagation()}>
                        {actions.map((action, i) => (
                          (!action.condition || action.condition(row)) && (
                            <button
                              key={i}
                              onClick={() => action.handler(row)}
                              className={`action-btn action-${action.variant || 'secondary'}`}
                            >
                              {action.icon} {action.label}
                            </button>
                          )
                        ))}
                        {rowAgents.map(agent => (
                          <button
                            key={agent.id}
                            onClick={() => handleAgentClick(agent, row)}
                            className="action-btn action-ai"
                            disabled={agentLoading}
                          >
                            {agent.icon || '🤖'} {agent.label}
                          </button>
                        ))}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="reactai-datatable-pagination">
        <span className="reactai-datatable-count">
          {processedData.length} records
        </span>
        <div className="reactai-datatable-pagination-controls">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>←</button>
          <span>Page {page + 1} of {totalPages || 1}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>→</button>
        </div>
      </div>

      {/* Agent Result Modal */}
      {agentResultModal && (
        <div className="reactai-datatable-modal-overlay" onClick={() => setAgentResultModal(null)}>
          <div className="reactai-datatable-modal" onClick={e => e.stopPropagation()}>
            <div className="reactai-datatable-modal-header">
              <h4>{agentResultModal.title}</h4>
              <button onClick={() => setAgentResultModal(null)}>×</button>
            </div>
            <div className="reactai-datatable-modal-content">
              {agentResultModal.content}
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {showChat && !chatOpen && (
        <button
          className="reactai-datatable-chat-fab"
          onClick={() => setChatOpen(true)}
        >
          💬
        </button>
      )}

      {/* Floating Chat Interface */}
      {showChat && chatOpen && (
        <div className="reactai-datatable-chat-floating">
          <div className="reactai-datatable-chat-header">
            <span>💬 Chat with your data</span>
            <button
              className="reactai-datatable-chat-close"
              onClick={() => setChatOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="reactai-datatable-chat-messages">
            {chatMessages.length === 0 ? (
              <div className="reactai-datatable-chat-empty">
                Ask questions like:<br/>
                • "Show orders from USA"<br/>
                • "Filter completed orders"<br/>
                • "Total greater than 500"
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div key={idx} className={`reactai-datatable-chat-message reactai-datatable-chat-${msg.role}`}>
                  <span className="reactai-datatable-chat-role">{msg.role === 'user' ? '👤' : '🤖'}</span>
                  <span className="reactai-datatable-chat-content">{msg.content}</span>
                </div>
              ))
            )}
          </div>
          <div className="reactai-datatable-chat-input">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
              placeholder="Ask about your data..."
              className="reactai-datatable-input"
            />
            <button onClick={handleChatSend} disabled={queryLoading} className="reactai-datatable-btn">
              {queryLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

