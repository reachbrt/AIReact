/**
 * @aireact/smart-datatable
 * AI-native data tables with NLP queries for React
 * Based on DETAILED_DOCUMENTATION.md
 */

// Components
export { SmartDataTable } from './components';

// Hooks
export {
  useNLPQuery,
  useAiTableQuery,
  useAiInsights,
  useAiRowAgents,
  useAiTransformations,
  applyFilter
} from './hooks';

// Types
export type {
  // Column types
  Column,
  ColumnType,
  ColumnAlign,

  // Filter types
  FilterDefinition,
  FilterCondition,
  FilterOperator,
  LogicalOperator,
  SortDefinition,

  // AI Search types
  AISearchResult,
  NLPQueryResult,

  // AI Insight types
  AIInsight,
  InsightCategory,

  // Row Agent types
  RowAgent,
  AgentResult,
  AgentScope,

  // Transformation types
  AITransformation,
  TransformationChange,
  TransformationScope,

  // Schema types
  TableSchema,
  TableSchemaColumn,

  // Action types
  Action,
  ActionVariant,

  // Config types
  DataTableConfig,
  SmartDataTableProps,

  // Hook option types
  UseAiTableQueryOptions,
  UseAiInsightsOptions,
  UseAiRowAgentsOptions,
  UseAiTransformationsOptions
} from './types';

export const REACTAI_SMART_DATATABLE_VERSION = '1.0.0';
console.log(`%c @aireact/smart-datatable v${REACTAI_SMART_DATATABLE_VERSION} `, 'background: #0EA5E9; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;');

