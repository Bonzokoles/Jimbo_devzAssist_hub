/**
 * Response aggregator for MOA
 * Combines multiple model responses into a single coherent output
 */
import { callOpenAI, callClaude } from '../aiClient';

/**
 * Aggregate multiple responses using a specified aggregation model
 */
export const aggregateResponses = async (results, aggregationConfig, userPrompt) => {
  if (!aggregationConfig || !aggregationConfig.enabled) {
    return null;
  }
  
  const { provider, model, apiKey, prompt: aggregationPrompt } = aggregationConfig;
  
  // Build the aggregation prompt
  const responsesText = results.map((r, i) => {
    return `### Response ${i + 1}: ${r.role} (${r.provider} - ${r.model})
${r.response}`;
  }).join('\n\n---\n\n');
  
  const fullPrompt = `${aggregationPrompt || 'Combine and synthesize the following responses into a single, coherent, and comprehensive answer:'}

Original User Query:
${userPrompt}

Individual Model Responses:

${responsesText}

Please provide a final, consolidated answer that takes the best from all responses:`;
  
  const messages = [
    {
      role: 'user',
      content: fullPrompt
    }
  ];
  
  try {
    let response;
    
    if (provider === 'openai') {
      response = await callOpenAI(apiKey, model, messages);
    } else if (provider === 'claude') {
      response = await callClaude(apiKey, model, messages);
    } else {
      throw new Error(`Unsupported aggregation provider: ${provider}`);
    }
    
    return {
      aggregated: response,
      timestamp: new Date().toISOString(),
      provider: provider,
      model: model
    };
  } catch (error) {
    console.error('Aggregation failed:', error);
    throw error;
  }
};

/**
 * Simple text-based aggregation without using an AI model
 * Just combines the responses with headers
 */
export const simpleAggregation = (results) => {
  const combined = results.map((r, i) => {
    return `## ${r.role} (${r.provider}):\n\n${r.response}`;
  }).join('\n\n---\n\n');
  
  return {
    aggregated: combined,
    timestamp: new Date().toISOString(),
    provider: 'simple',
    model: 'text-concatenation'
  };
};
