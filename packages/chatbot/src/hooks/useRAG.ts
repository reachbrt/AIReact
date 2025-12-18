/**
 * useRAG - React hook for RAG (Retrieval Augmented Generation) functionality
 * Provides document upload, text extraction, chunking, and context retrieval
 */

import { useState, useCallback } from 'react';
import { RAGDocument, RAGChunk, UseRAGOptions, UseRAGReturn } from '../types';

function generateId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Simple text extraction from common file types
 */
async function extractTextFromFile(file: File): Promise<string> {
  const type = file.type;
  
  // Text files
  if (type === 'text/plain' || type === 'text/markdown' || type === 'text/csv') {
    return await file.text();
  }
  
  // JSON files
  if (type === 'application/json') {
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      return JSON.stringify(json, null, 2);
    } catch {
      return text;
    }
  }
  
  // HTML files - strip tags
  if (type === 'text/html') {
    const text = await file.text();
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
  }
  
  // PDF - basic text extraction (fallback for when no PDF library)
  if (type === 'application/pdf') {
    // For now, return a message - real PDF extraction needs a library
    return `[PDF Document: ${file.name}]\n\nNote: Full PDF text extraction requires a PDF parsing library. Please copy/paste the text content or use a text-based format.`;
  }
  
  // Default: try to read as text
  try {
    return await file.text();
  } catch {
    return `[Unable to extract text from ${file.name}]`;
  }
}

/**
 * Split text into overlapping chunks
 */
function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      // Keep overlap from previous chunk
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlap / 10));
      currentChunk = overlapWords.join(' ') + ' ' + sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * Simple keyword-based similarity scoring
 */
function calculateSimilarity(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const textLower = text.toLowerCase();
  
  let score = 0;
  for (const word of queryWords) {
    if (textLower.includes(word)) {
      score += 1;
      // Bonus for exact word match
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = textLower.match(regex);
      if (matches) {
        score += matches.length * 0.5;
      }
    }
  }
  
  return score / Math.max(queryWords.length, 1);
}

export function useRAG(options: UseRAGOptions = {}): UseRAGReturn {
  const { chunkSize = 500, chunkOverlap = 50 } = options;
  
  const [documents, setDocuments] = useState<RAGDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addDocument = useCallback(async (file: File): Promise<RAGDocument | null> => {
    setIsProcessing(true);
    
    try {
      const content = await extractTextFromFile(file);
      const textChunks = chunkText(content, chunkSize, chunkOverlap);
      
      const docId = generateId();
      const chunks: RAGChunk[] = textChunks.map((text, index) => ({
        id: `${docId}_chunk_${index}`,
        documentId: docId,
        content: text,
      }));
      
      const doc: RAGDocument = {
        id: docId,
        name: file.name,
        content,
        chunks,
      };
      
      setDocuments(prev => [...prev, doc]);
      setIsProcessing(false);
      return doc;
    } catch (error) {
      console.error('Error processing document:', error);
      setIsProcessing(false);
      return null;
    }
  }, [chunkSize, chunkOverlap]);

  const removeDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  }, []);

  const getContext = useCallback((query: string, topK: number = 3): string => {
    // Get all chunks from all documents
    const allChunks = documents.flatMap(doc => doc.chunks);
    
    if (allChunks.length === 0) return '';
    
    // Score each chunk
    const scored = allChunks.map(chunk => ({
      chunk,
      score: calculateSimilarity(query, chunk.content),
    }));
    
    // Sort by score and take top K
    const topChunks = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .filter(s => s.score > 0);
    
    if (topChunks.length === 0) return '';
    
    return topChunks.map(s => s.chunk.content).join('\n\n---\n\n');
  }, [documents]);

  const clearDocuments = useCallback(() => {
    setDocuments([]);
  }, []);

  return {
    documents,
    isProcessing,
    addDocument,
    removeDocument,
    getContext,
    clearDocuments,
  };
}

