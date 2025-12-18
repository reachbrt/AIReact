/**
 * useAiTableQuery Hook
 * Converts natural language queries into structured filters
 * Based on DETAILED_DOCUMENTATION.md
 */

import { useState, useCallback } from 'react';
import {
  AISearchResult,
  FilterDefinition,
  FilterCondition,
  SortDefinition,
  UseAiTableQueryOptions,
  TableSchema
} from '../types';

/**
 * Apply a filter definition to an array of data
 */
export function applyFilter<T extends Record<string, any>>(
  data: T[],
  filter: FilterDefinition
): T[] {
  if (!filter.conditions.length) return data;

  return data.filter(row => {
    const results = filter.conditions.map(condition => {
      const value = row[condition.column];
      return evaluateCondition(value, condition);
    });

    return filter.operator === 'AND'
      ? results.every(Boolean)
      : results.some(Boolean);
  });
}

/**
 * Evaluate a single filter condition
 */
function evaluateCondition(value: any, condition: FilterCondition): boolean {
  const { operator, value: filterValue } = condition;

  if (value === null || value === undefined) return false;

  const strValue = String(value).toLowerCase();
  const strFilterValue = String(filterValue).toLowerCase();

  switch (operator) {
    case 'equals':
      return strValue === strFilterValue;
    case 'contains':
      return strValue.includes(strFilterValue);
    case 'gt':
      return Number(value) > Number(filterValue);
    case 'lt':
      return Number(value) < Number(filterValue);
    case 'gte':
      return Number(value) >= Number(filterValue);
    case 'lte':
      return Number(value) <= Number(filterValue);
    case 'in':
      return Array.isArray(filterValue) && filterValue.some(v => 
        String(v).toLowerCase() === strValue
      );
    case 'between':
      if (Array.isArray(filterValue) && filterValue.length === 2) {
        const num = Number(value);
        return num >= Number(filterValue[0]) && num <= Number(filterValue[1]);
      }
      return false;
    case 'regex':
      try {
        return new RegExp(filterValue, 'i').test(strValue);
      } catch {
        return false;
      }
    default:
      return false;
  }
}

/**
 * Parse natural language query into structured filter (local fallback)
 */
function parseQueryLocally(
  query: string,
  schema: TableSchema
): { filter?: FilterDefinition; sort?: SortDefinition; explanation: string; limit?: number } {
  const lowerQuery = query.toLowerCase();
  const conditions: FilterCondition[] = [];
  let sort: SortDefinition | undefined;
  let limit: number | undefined;
  const explanationParts: string[] = [];

  // Parse sort
  const sortMatch = lowerQuery.match(/(?:sort|order)\s+(?:by\s+)?(\w+)(?:\s+(asc|desc))?/i);
  if (sortMatch) {
    const colName = sortMatch[1];
    const col = schema.columns.find(c =>
      c.key.toLowerCase() === colName || c.label.toLowerCase() === colName
    );
    if (col) {
      sort = { column: col.key, order: (sortMatch[2] as 'asc' | 'desc') || 'asc' };
      explanationParts.push(`Sorted by ${col.label} (${sort.order})`);
    }
  }

  // Parse limit/top
  const limitMatch = lowerQuery.match(/(?:top|first|limit)\s*(\d+)/);
  if (limitMatch) {
    limit = parseInt(limitMatch[1], 10);
    explanationParts.push(`Top ${limit} results`);
  }

  // Helper to escape regex special characters
  const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Parse column-based natural language patterns
  // Patterns: "show customer named as bharat", "customer named bharat", "find customer bharat"
  // "where customer is bharat", "customer contains bharat", "customer like bharat"
  for (const col of schema.columns) {
    const colKey = escapeRegex(col.key.toLowerCase());
    const colLabel = escapeRegex(col.label.toLowerCase());

    // Pattern: "[column] named/called/as [value]" - e.g., "customer named bharat"
    const namedPattern = new RegExp(
      `(?:${colKey}|${colLabel})\\s+(?:named|called|as)\\s+(?:as\\s+)?["']?([\\w\\s]+?)["']?(?:\\s|$|,|\\.)`,
      'i'
    );
    const namedMatch = lowerQuery.match(namedPattern);
    if (namedMatch) {
      const value = namedMatch[1].trim();
      conditions.push({ column: col.key, operator: 'contains', value });
      explanationParts.push(`${col.label} contains "${value}"`);
      continue;
    }

    // Pattern: "[column] is/equals [value]" - e.g., "status is completed"
    const isPattern = new RegExp(
      `(?:${colKey}|${colLabel})\\s+(?:is|equals?|=|==)\\s+["']?([\\w\\s]+?)["']?(?:\\s|$|,|\\.)`,
      'i'
    );
    const isMatch = lowerQuery.match(isPattern);
    if (isMatch) {
      const value = isMatch[1].trim();
      conditions.push({ column: col.key, operator: 'equals', value });
      explanationParts.push(`${col.label} = "${value}"`);
      continue;
    }

    // Pattern: "[column] contains/like/has [value]" - e.g., "customer contains bhar"
    const containsPattern = new RegExp(
      `(?:${colKey}|${colLabel})\\s+(?:contains?|like|has|includes?)\\s+["']?([\\w\\s]+?)["']?(?:\\s|$|,|\\.)`,
      'i'
    );
    const containsMatch = lowerQuery.match(containsPattern);
    if (containsMatch) {
      const value = containsMatch[1].trim();
      conditions.push({ column: col.key, operator: 'contains', value });
      explanationParts.push(`${col.label} contains "${value}"`);
      continue;
    }

    // Pattern: "find/show/get [column] [value]" - e.g., "find customer bharat"
    const findPattern = new RegExp(
      `(?:find|show|get|search)\\s+(?:${colKey}|${colLabel})\\s+["']?([\\w\\s]+?)["']?(?:\\s|$|,|\\.)`,
      'i'
    );
    const findMatch = lowerQuery.match(findPattern);
    if (findMatch) {
      const value = findMatch[1].trim();
      conditions.push({ column: col.key, operator: 'contains', value });
      explanationParts.push(`${col.label} contains "${value}"`);
      continue;
    }

    // Pattern: "where [column] = [value]" or "[column] = [value]"
    const whereEqPattern = new RegExp(
      `(?:where\\s+)?(?:${colKey}|${colLabel})\\s*(?:=|==)\\s*["']?([\\w]+)["']?`,
      'i'
    );
    const whereEqMatch = lowerQuery.match(whereEqPattern);
    if (whereEqMatch) {
      conditions.push({ column: col.key, operator: 'equals', value: whereEqMatch[1].trim() });
      explanationParts.push(`${col.label} = "${whereEqMatch[1].trim()}"`);
      continue;
    }

    // Greater than: "total > 500" or "total greater than 500"
    const gtPattern = new RegExp(
      `(?:${colKey}|${colLabel})\\s*(?:>|greater than|more than|above)\\s*(\\d+(?:\\.\\d+)?)`,
      'i'
    );
    const gtMatch = lowerQuery.match(gtPattern);
    if (gtMatch) {
      conditions.push({ column: col.key, operator: 'gt', value: parseFloat(gtMatch[1]) });
      explanationParts.push(`${col.label} > ${gtMatch[1]}`);
      continue;
    }

    // Less than: "total < 500"
    const ltPattern = new RegExp(
      `(?:${colKey}|${colLabel})\\s*(?:<|less than|below|under)\\s*(\\d+(?:\\.\\d+)?)`,
      'i'
    );
    const ltMatch = lowerQuery.match(ltPattern);
    if (ltMatch) {
      conditions.push({ column: col.key, operator: 'lt', value: parseFloat(ltMatch[1]) });
      explanationParts.push(`${col.label} < ${ltMatch[1]}`);
      continue;
    }

    // Greater than or equal: "total >= 500"
    const gtePattern = new RegExp(
      `(?:${colKey}|${colLabel})\\s*(?:>=|at least|minimum)\\s*(\\d+(?:\\.\\d+)?)`,
      'i'
    );
    const gteMatch = lowerQuery.match(gtePattern);
    if (gteMatch) {
      conditions.push({ column: col.key, operator: 'gte', value: parseFloat(gteMatch[1]) });
      explanationParts.push(`${col.label} >= ${gteMatch[1]}`);
      continue;
    }

    // Less than or equal: "total <= 500"
    const ltePattern = new RegExp(
      `(?:${colKey}|${colLabel})\\s*(?:<=|at most|maximum)\\s*(\\d+(?:\\.\\d+)?)`,
      'i'
    );
    const lteMatch = lowerQuery.match(ltePattern);
    if (lteMatch) {
      conditions.push({ column: col.key, operator: 'lte', value: parseFloat(lteMatch[1]) });
      explanationParts.push(`${col.label} <= ${lteMatch[1]}`);
      continue;
    }
  }

  // Parse "from [country]" pattern - matches any column containing that value
  const fromMatch = lowerQuery.match(/(?:from|in)\s+([A-Za-z]+)/i);
  if (fromMatch && conditions.length === 0) {
    const searchValue = fromMatch[1].trim();
    // Find a column that might contain country/location data
    const locationCol = schema.columns.find(c =>
      ['country', 'location', 'region', 'city', 'state'].includes(c.key.toLowerCase())
    );
    if (locationCol) {
      conditions.push({ column: locationCol.key, operator: 'contains', value: searchValue });
      explanationParts.push(`${locationCol.label} contains "${searchValue}"`);
    }
  }

  // Parse "show [status] orders" or "[status] orders" pattern
  const statusPatterns = ['completed', 'pending', 'shipped', 'cancelled', 'active', 'inactive', 'approved', 'rejected'];
  for (const status of statusPatterns) {
    if (lowerQuery.includes(status) && conditions.length === 0) {
      const statusCol = schema.columns.find(c =>
        ['status', 'state', 'order_status', 'orderstatus'].includes(c.key.toLowerCase())
      );
      if (statusCol) {
        conditions.push({ column: statusCol.key, operator: 'equals', value: status });
        explanationParts.push(`${statusCol.label} = "${status}"`);
        break;
      }
    }
  }

  // Generic text search - if no conditions matched, search across all string columns
  if (conditions.length === 0) {
    // Extract potential search terms (words that aren't common query words)
    const ignoreWords = ['show', 'find', 'get', 'list', 'all', 'the', 'with', 'where', 'and', 'or', 'orders', 'items', 'data', 'records', 'me', 'please', 'can', 'you'];
    const words = lowerQuery.split(/\s+/).filter(w => !ignoreWords.includes(w) && w.length > 2);

    if (words.length > 0) {
      // Search for the last meaningful word (usually the value) across string columns
      const searchTerm = words[words.length - 1];
      const stringCols = schema.columns.filter(c => c.type === 'string');

      if (stringCols.length > 0) {
        // Create an OR condition across all string columns
        stringCols.forEach(col => {
          conditions.push({ column: col.key, operator: 'contains', value: searchTerm });
        });
        explanationParts.push(`Searching for "${searchTerm}"`);
      }
    }
  }

  const filter: FilterDefinition | undefined = conditions.length > 0
    ? { conditions, operator: conditions.length > 1 && lowerQuery.includes(' or ') ? 'OR' : 'AND' }
    : undefined;

  return {
    filter,
    sort,
    limit,
    explanation: explanationParts.length > 0
      ? explanationParts.join(', ')
      : `Showing all results`
  };
}

export function useAiTableQuery(options: UseAiTableQueryOptions) {
  const { schema, onQueryResult } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');
  const [lastResult, setLastResult] = useState<AISearchResult | null>(null);

  const queryToFilter = useCallback(async (query: string): Promise<AISearchResult> => {
    setLoading(true);
    setError(null);
    setLastQuery(query);

    try {
      // Use local parsing (AI integration can be added later)
      const parsed = parseQueryLocally(query, schema);

      const result: AISearchResult = {
        query,
        filter: parsed.filter,
        sort: parsed.sort,
        explanation: parsed.explanation
      };

      setLastResult(result);
      onQueryResult?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Query processing failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [schema, onQueryResult]);

  const getSuggestions = useCallback(async (_partialQuery: string): Promise<string[]> => {
    // Basic suggestions based on schema
    return schema.columns.map(col => `Show ${col.label}`);
  }, [schema]);

  const clearFilter = useCallback(() => {
    setLastQuery('');
    setLastResult(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    lastQuery,
    lastResult,
    queryToFilter,
    getSuggestions,
    clearFilter,
    applyFilter
  };
}

