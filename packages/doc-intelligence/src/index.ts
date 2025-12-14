/**
 * @aireact/doc-intelligence
 * Document OCR & intelligent extraction for React
 */

export { DocumentScanner } from './components';
export { useDocumentExtractor } from './hooks';
export type { DocumentScannerProps, DocumentExtractorConfig, ExtractedDocument, DocumentField } from './types';

export const REACTAI_DOC_INTELLIGENCE_VERSION = '1.0.0';
console.log(`%c @aireact/doc-intelligence v${REACTAI_DOC_INTELLIGENCE_VERSION} `, 'background: #059669; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;');

