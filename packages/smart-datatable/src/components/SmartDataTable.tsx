/**
 * SmartDataTable Component - AI-native data table
 */

import { useState, useMemo } from 'react';
import { SmartDataTableProps } from '../types';
import { useNLPQuery } from '../hooks/useNLPQuery';
import '../styles/smart-datatable.css';

export function SmartDataTable<T extends Record<string, any>>({
  data,
  columns,
  onNLPQuery,
  enableNLPSearch = true,
  pageSize = 10,
  selectable = false,
  onSelectionChange,
  theme = 'light',
  className = ''
}: SmartDataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const { processQuery, isProcessing, lastQuery } = useNLPQuery(data, columns);

  const displayData = useMemo(() => {
    return lastQuery ? lastQuery.results : data;
  }, [lastQuery, data]);

  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    return displayData.slice(start, start + pageSize);
  }, [displayData, page, pageSize]);

  const totalPages = Math.ceil(displayData.length / pageSize);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const result = await processQuery(query);
    onNLPQuery?.(query, result.results);
    setPage(0);
  };

  const toggleSelect = (idx: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(idx)) newSelected.delete(idx);
    else newSelected.add(idx);
    setSelected(newSelected);
    onSelectionChange?.(Array.from(newSelected).map(i => displayData[i]));
  };

  return (
    <div className={`reactai-datatable ${theme === 'dark' ? 'dark' : ''} ${className}`}>
      {enableNLPSearch && (
        <div className="reactai-datatable-search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ask a question... e.g., 'Show top 5 sorted by name'"
            className="reactai-datatable-input"
          />
          <button onClick={handleSearch} disabled={isProcessing} className="reactai-datatable-btn">
            {isProcessing ? '...' : '🔍'}
          </button>
        </div>
      )}

      {lastQuery && (
        <div className="reactai-datatable-interpretation">
          💡 {lastQuery.interpretation}
        </div>
      )}

      <div className="reactai-datatable-container">
        <table className="reactai-datatable-table">
          <thead>
            <tr>
              {selectable && <th className="select-col"><input type="checkbox" /></th>}
              {columns.map(col => (
                <th key={col.key} style={{ width: col.width }}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={idx} className={selected.has(page * pageSize + idx) ? 'selected' : ''}>
                {selectable && (
                  <td className="select-col">
                    <input type="checkbox" checked={selected.has(page * pageSize + idx)} onChange={() => toggleSelect(page * pageSize + idx)} />
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="reactai-datatable-pagination">
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>←</button>
        <span>Page {page + 1} of {totalPages || 1}</span>
        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>→</button>
      </div>
    </div>
  );
}

