/**
 * useNLPQuery Hook - Natural language queries for data
 */

import { useState, useCallback } from 'react';
import { NLPQueryResult, Column } from '../types';

export function useNLPQuery<T extends Record<string, any>>(data: T[], columns: Column<T>[]) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastQuery, setLastQuery] = useState<NLPQueryResult<T> | null>(null);

  const processQuery = useCallback(async (query: string): Promise<NLPQueryResult<T>> => {
    setIsProcessing(true);
    const lowerQuery = query.toLowerCase();

    // Simple NLP parsing (in real implementation, use AI)
    let results = [...data];
    let interpretation = '';
    const filters: Record<string, any> = {};
    let sort: { column: string; direction: 'asc' | 'desc' } | undefined;

    // Sort detection
    if (lowerQuery.includes('sort by') || lowerQuery.includes('order by')) {
      const sortMatch = lowerQuery.match(/(?:sort|order) by (\w+)/);
      if (sortMatch) {
        const sortColumn = columns.find(c =>
          c.key.toLowerCase() === sortMatch[1] ||
          (c.header && c.header.toLowerCase() === sortMatch[1])
        );
        if (sortColumn) {
          const direction = lowerQuery.includes('desc') ? 'desc' : 'asc';
          sort = { column: sortColumn.key, direction };
          results.sort((a, b) => {
            const aVal = a[sortColumn.key];
            const bVal = b[sortColumn.key];
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return direction === 'asc' ? cmp : -cmp;
          });
          interpretation = `Sorted by ${sortColumn.header} (${direction})`;
        }
      }
    }

    // Filter detection
    if (lowerQuery.includes('where') || lowerQuery.includes('with') || lowerQuery.includes('filter')) {
      for (const col of columns) {
        const regex = new RegExp(`${col.key.toLowerCase()}\\s*(?:=|is|equals?)\\s*["']?([\\w\\s]+)["']?`, 'i');
        const match = lowerQuery.match(regex);
        if (match) {
          const filterValue = match[1].trim().toLowerCase();
          filters[col.key] = filterValue;
          results = results.filter(row => 
            String(row[col.key]).toLowerCase().includes(filterValue)
          );
          interpretation += ` Filtered ${col.header} = "${filterValue}"`;
        }
      }
    }

    // Top/limit detection
    const limitMatch = lowerQuery.match(/(?:top|first|limit)\s*(\d+)/);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1]);
      results = results.slice(0, limit);
      interpretation += ` (showing top ${limit})`;
    }

    if (!interpretation) {
      interpretation = `Showing all ${results.length} results`;
    }

    const result: NLPQueryResult<T> = {
      query,
      interpretation: interpretation.trim(),
      results,
      filters,
      sort
    };

    setLastQuery(result);
    setIsProcessing(false);
    return result;
  }, [data, columns]);

  return {
    processQuery,
    isProcessing,
    lastQuery
  };
}

