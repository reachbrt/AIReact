/**
 * useAiRowAgents Hook
 * AI operations on individual rows (explain, predict, classify)
 * Based on DETAILED_DOCUMENTATION.md
 */

import { useState, useCallback } from 'react';
import {
  RowAgent,
  AgentResult,
  UseAiRowAgentsOptions
} from '../types';

/**
 * Interpolate placeholders in a template with row data
 * Template: "Explain order {{customer}} for ${{total}}"
 * Row: { customer: "Acme", total: 1299 }
 * Result: "Explain order Acme for $1299"
 */
function interpolateTemplate(template: string, row: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = row[key];
    return value !== undefined ? String(value) : `{{${key}}}`;
  });
}

/**
 * Generate a mock AI response for local use
 * In production, this would call the actual AI provider
 */
function generateLocalResponse(prompt: string, agent: RowAgent): string {
  // Simple local responses based on agent type
  if (agent.id.includes('explain')) {
    return `This record shows: ${prompt.slice(0, 100)}... This is a standard entry in the dataset.`;
  }
  if (agent.id.includes('predict')) {
    return `Based on the data, prediction: Likely to complete within 5-7 business days.`;
  }
  if (agent.id.includes('classify') || agent.id.includes('categorize')) {
    return `Classification: Standard category based on the provided attributes.`;
  }
  if (agent.id.includes('email') || agent.id.includes('draft')) {
    return `Dear Customer,\n\nThank you for your inquiry. We have reviewed your request and will process it shortly.\n\nBest regards,\nSupport Team`;
  }
  if (agent.id.includes('summarize')) {
    return `Summary: ${prompt.slice(0, 150)}...`;
  }
  return `AI Response for: ${prompt.slice(0, 100)}...`;
}

export function useAiRowAgents(options: UseAiRowAgentsOptions) {
  const { agents: initialAgents } = options;

  const [agents, setAgents] = useState<RowAgent[]>(initialAgents);
  const [results, setResults] = useState<Map<string, AgentResult>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Execute an agent on a single row
   */
  const executeAgent = useCallback(async (
    agent: RowAgent,
    row: Record<string, any>,
    rowId?: any
  ): Promise<AgentResult> => {
    setLoading(true);
    setError(null);

    try {
      const prompt = interpolateTemplate(agent.promptTemplate, row);
      
      // Use local response (AI integration can be added later)
      const responseText = generateLocalResponse(prompt, agent);

      const result: AgentResult = {
        agentId: agent.id,
        rowId: rowId ?? row.id,
        result: responseText,
        timestamp: new Date()
      };

      // Store result
      const key = `${agent.id}-${result.rowId}`;
      setResults(prev => new Map(prev).set(key, result));

      // Call custom handler if provided
      agent.handler?.(row, responseText);

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Agent execution failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Execute an agent on multiple rows
   */
  const executeAgentBatch = useCallback(async (
    agent: RowAgent,
    rows: Record<string, any>[]
  ): Promise<AgentResult[]> => {
    setLoading(true);
    setError(null);

    try {
      const batchResults: AgentResult[] = [];

      for (let i = 0; i < rows.length; i++) {
        const result = await executeAgent(agent, rows[i], rows[i].id ?? i);
        batchResults.push(result);
      }

      return batchResults;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Batch execution failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [executeAgent]);

  /**
   * Register a new agent
   */
  const registerAgent = useCallback((agent: RowAgent) => {
    setAgents(prev => [...prev.filter(a => a.id !== agent.id), agent]);
  }, []);

  /**
   * Unregister an agent
   */
  const unregisterAgent = useCallback((agentId: string) => {
    setAgents(prev => prev.filter(a => a.id !== agentId));
  }, []);

  /**
   * Get all results for a specific row
   */
  const getRowResults = useCallback((row: Record<string, any>): AgentResult[] => {
    const rowId = row.id;
    return Array.from(results.values()).filter(r => r.rowId === rowId);
  }, [results]);

  /**
   * Clear all results
   */
  const clearResults = useCallback(() => {
    setResults(new Map());
  }, []);

  return {
    agents,
    results: Array.from(results.values()),
    loading,
    error,
    executeAgent,
    executeAgentBatch,
    registerAgent,
    unregisterAgent,
    getRowResults,
    clearResults
  };
}

