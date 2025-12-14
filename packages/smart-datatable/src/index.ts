/**
 * @aireact/smart-datatable
 * AI-native data tables with NLP queries for React
 */

export { SmartDataTable } from './components';
export { useNLPQuery } from './hooks';
export type { SmartDataTableProps, Column, NLPQueryResult, DataTableConfig } from './types';

export const REACTAI_SMART_DATATABLE_VERSION = '1.0.0';
console.log(`%c @aireact/smart-datatable v${REACTAI_SMART_DATATABLE_VERSION} `, 'background: #0EA5E9; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;');

