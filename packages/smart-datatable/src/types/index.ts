/**
 * Smart DataTable Types
 * Based on DETAILED_DOCUMENTATION.md
 */

import React from 'react';

// ============ Column Types ============

export type ColumnType = 'string' | 'number' | 'date' | 'boolean';
export type ColumnAlign = 'left' | 'center' | 'right';

export interface Column<T = any> {
  /** Data property key */
  key: string;
  /** Column header label (preferred) */
  label?: string;
  /** Legacy header property (alias for label) */
  header?: string;
  /** Enable sorting (default: true) */
  sortable?: boolean;
  /** Enable filtering */
  filterable?: boolean;
  /** Column visibility (default: true) */
  visible?: boolean;
  /** Data type for smart sorting/filtering */
  type?: ColumnType;
  /** Column width (e.g., '200px', '20%') */
  width?: string | number;
  /** Text alignment */
  align?: ColumnAlign;
  /** Custom value formatter */
  formatter?: (value: any, row: T) => string;
  /** Custom cell renderer */
  render?: (value: any, row: T) => React.ReactNode;
  /** Sample values for AI context */
  examples?: any[];
}

// ============ Filter Types ============

export type FilterOperator = 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between' | 'regex';
export type LogicalOperator = 'AND' | 'OR';

export interface FilterCondition {
  column: string;
  operator: FilterOperator;
  value: any;
}

export interface FilterDefinition {
  conditions: FilterCondition[];
  operator: LogicalOperator;
}

export interface SortDefinition {
  column: string;
  order: 'asc' | 'desc';
}

// ============ AI Search Types ============

export interface AISearchResult<T = any> {
  query: string;
  filter?: FilterDefinition;
  sort?: SortDefinition;
  explanation: string;
  results?: T[];
}

export interface NLPQueryResult<T = any> {
  query: string;
  interpretation: string;
  results: T[];
  filters: Record<string, any>;
  sort?: { column: string; direction: 'asc' | 'desc' };
}

// ============ AI Insight Types ============

export type InsightCategory = 'trends' | 'outliers' | 'patterns' | 'recommendations' | 'summary' | 'predictions';

export interface AIInsight {
  id: string;
  category: InsightCategory;
  title: string;
  description: string;
  confidence: number; // 0-1
  data?: any;
  actions?: Array<{
    label: string;
    handler: () => void;
  }>;
}

// ============ Row Agent Types ============

export type AgentScope = 'single' | 'multi';

export interface RowAgent {
  /** Unique agent identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon (emoji or text) */
  icon?: string;
  /** AI prompt with {{placeholders}} */
  promptTemplate: string;
  /** Single row or multiple rows */
  scope?: AgentScope;
  /** Custom result handler */
  handler?: (row: any, result: string) => void;
}

export interface AgentResult {
  agentId: string;
  rowId: any;
  result: string;
  timestamp: Date;
}

// ============ AI Transformation Types ============

export type TransformationScope = 'column' | 'row' | 'selection' | 'table';

export interface AITransformation {
  /** Unique transformation identifier */
  id: string;
  /** Display label */
  label: string;
  /** Transformation scope */
  scope: TransformationScope;
  /** Target column (for column scope) */
  targetColumn?: string;
  /** AI prompt with {{placeholders}} */
  promptTemplate: string;
  /** Show preview before applying */
  preview?: boolean;
  /** Custom handler */
  handler?: (changes: TransformationChange[]) => void;
}

export interface TransformationChange {
  rowIndex: number;
  column: string;
  oldValue: any;
  newValue: any;
}

// ============ Table Schema Types ============

export interface TableSchemaColumn {
  key: string;
  type: ColumnType;
  label: string;
  examples?: any[];
}

export interface TableSchema {
  columns: TableSchemaColumn[];
  rowCount: number;
  sampleRows: any[];
}

// ============ Action Types ============

export type ActionVariant = 'primary' | 'danger' | 'secondary';

export interface Action {
  label: string;
  icon?: string;
  handler: (row: any) => void;
  condition?: (row: any) => boolean;
  variant?: ActionVariant;
}

// ============ Main Component Props ============

export interface SmartDataTableProps<T = any> {
  /** Array of data objects to display */
  data: T[];
  /** Column definitions (auto-generated if empty) */
  columns?: Column<T>[];
  /** Table title displayed in header */
  title?: string;
  /** Unique identifier for rows */
  rowKey?: string;
  /** Visual theme */
  theme?: 'light' | 'dark';

  // Search & Filter Props
  /** Search input placeholder */
  searchPlaceholder?: string;
  /** Enable AI-powered natural language search */
  aiSearch?: boolean;
  /** Enable basic NLP search (legacy) */
  enableNLPSearch?: boolean;

  // AI Feature Props
  /** API key for AI provider */
  apiKey?: string;
  /** AI provider name */
  provider?: 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'ollama' | 'deepseek';
  /** AI model to use */
  model?: string;
  /** Enable AI insights generation */
  aiInsights?: boolean;
  /** Show chat interface for table queries */
  showChat?: boolean;
  /** AI agents for row operations */
  rowAgents?: RowAgent[];
  /** AI data transformations */
  aiTransformations?: AITransformation[];

  // Pagination Props
  /** Enable pagination */
  pagination?: boolean;
  /** Number of items per page */
  pageSize?: number;
  /** Available page size options */
  pageSizeOptions?: number[];

  // Selection Props
  /** Enable row selection */
  selectable?: boolean;
  /** Row action buttons */
  actions?: Action[];

  // Display Props
  /** Message when table is empty */
  emptyMessage?: string;
  /** Show loading state */
  loading?: boolean;
  /** Custom class name */
  className?: string;

  // Export Props
  /** Enable data export */
  enableExport?: boolean;

  // Event Handlers
  /** Emitted when a row is clicked */
  onRowClick?: (row: T) => void;
  /** Emitted when row selection changes */
  onSelectionChange?: (rows: T[]) => void;
  /** Emitted when data is exported */
  onExport?: (data: { data: T[]; format: string }) => void;
  /** Emitted when AI query is executed */
  onAiQuery?: (result: AISearchResult<T>) => void;
  /** Emitted when AI insights are generated */
  onAiInsight?: (insights: AIInsight[]) => void;
  /** Emitted when sorting changes */
  onSortChange?: (sort: SortDefinition) => void;
  /** Legacy NLP query handler */
  onNLPQuery?: (query: string, results: T[]) => void;
}

// ============ Config Types ============

export interface DataTableConfig {
  provider?: 'openai' | 'anthropic' | 'gemini' | 'huggingface' | 'ollama' | 'deepseek';
  apiKey?: string;
  model?: string;
  temperature?: number;
}

// ============ Hook Option Types ============

export interface UseAiTableQueryOptions {
  apiKey?: string;
  provider?: string;
  model?: string;
  schema: TableSchema;
  onQueryResult?: (result: AISearchResult) => void;
}

export interface UseAiInsightsOptions {
  apiKey?: string;
  provider?: string;
  model?: string;
  schema: TableSchema;
  data: any[];
  config?: {
    categories?: InsightCategory[];
  };
}

export interface UseAiRowAgentsOptions {
  apiKey?: string;
  provider?: string;
  model?: string;
  schema: TableSchema;
  agents: RowAgent[];
}

export interface UseAiTransformationsOptions {
  apiKey?: string;
  provider?: string;
  model?: string;
  schema: TableSchema;
  data: any[];
  transformations: AITransformation[];
}

