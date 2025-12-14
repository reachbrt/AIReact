/**
 * Smart DataTable Types
 */

export interface Column<T = any> {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface SmartDataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  onNLPQuery?: (query: string, results: T[]) => void;
  enableNLPSearch?: boolean;
  enableExport?: boolean;
  pageSize?: number;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  theme?: 'light' | 'dark';
  className?: string;
}

export interface NLPQueryResult<T = any> {
  query: string;
  interpretation: string;
  results: T[];
  filters: Record<string, any>;
  sort?: { column: string; direction: 'asc' | 'desc' };
}

export interface DataTableConfig {
  provider?: 'openai' | 'anthropic' | 'local';
  apiKey?: string;
}

