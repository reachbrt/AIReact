/**
 * DocIntelligence Demo Component
 */

import React from 'react';
import { DocumentScanner, useDocumentExtractor } from '@aireact/doc-intelligence';

interface DocIntelligenceDemoProps {
  apiKey: string;
}

export const DocIntelligenceDemo: React.FC<DocIntelligenceDemoProps> = ({ apiKey }) => {
  const { extractedData, isExtracting, error } = useDocumentExtractor({ apiKey, provider: 'openai' });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Document Intelligence</h3>
        <p className="text-slate-500 text-sm">
          Upload documents for AI-powered OCR and intelligent data extraction.
        </p>
      </div>

      {/* Document Scanner */}
      <div className="max-w-lg mx-auto">
        <DocumentScanner
          apiKey={apiKey}
          provider="openai"
          onExtract={(data) => console.log('Extracted:', data)}
          acceptedFormats={['.pdf', '.png', '.jpg', '.jpeg']}
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors"
        />
      </div>

      {/* Extraction Status */}
      {isExtracting && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Extracting document data...
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
          {error.message}
        </div>
      )}

      {/* Extracted Data */}
      {extractedData && (
        <div className="bg-slate-50 p-4 rounded-xl">
          <h4 className="font-semibold text-slate-700 mb-3">Extracted Fields:</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(extractedData.fields || {}).map(([key, value]) => (
              <div key={key} className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-xs text-slate-400 uppercase">{key}</div>
                <div className="text-slate-700 font-medium">{String(value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample Document Types */}
      <div className="text-center text-sm text-slate-500">
        <p>Supported: Invoices, Receipts, IDs, Business Cards, Forms</p>
      </div>
    </div>
  );
};

