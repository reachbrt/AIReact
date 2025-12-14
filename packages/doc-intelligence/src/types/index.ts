/**
 * Document Intelligence Types
 */

export interface DocumentField {
  name: string;
  value: string;
  confidence: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export interface ExtractedDocument {
  id: string;
  type: 'invoice' | 'receipt' | 'id-card' | 'form' | 'contract' | 'unknown';
  fields: DocumentField[];
  rawText: string;
  confidence: number;
  processedAt: Date;
}

export interface DocumentScannerProps {
  onExtract: (document: ExtractedDocument) => void;
  onError?: (error: Error) => void;
  documentTypes?: Array<'invoice' | 'receipt' | 'id-card' | 'form' | 'contract'>;
  extractFields?: string[];
  showPreview?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export interface DocumentExtractorConfig {
  provider?: 'openai' | 'anthropic' | 'google';
  apiKey?: string;
  model?: string;
  language?: string;
}

