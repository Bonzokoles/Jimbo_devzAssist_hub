// MOA Engine - Orchestrate multiple AI models for better results

import { callAI } from '../aiClient';

// MOA Strategies
export const MOA_STRATEGIES = {
  PARALLEL: 'parallel',       // All models answer simultaneously
  SEQUENTIAL: 'sequential',   // Models refine each other's answers
  VOTING: 'voting',          // Models vote on the best answer
  SPECIALIZED: 'specialized', // Different models for different roles
};

// Run MOA with parallel strategy
export const runParallelMOA = async (prompt, models) => {
  const responses = await Promise.all(
    models.map(async (modelConfig) => {
      try {
        const response = await callAI(
          modelConfig.provider,
          modelConfig.apiKey,
          modelConfig.model,
          [{ role: 'user', content: prompt }],
          modelConfig.baseUrl
        );
        
        return {
          provider: modelConfig.provider,
          model: modelConfig.model,
          response,
          success: true,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return {
          provider: modelConfig.provider,
          model: modelConfig.model,
          response: null,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        };
      }
    })
  );
  
  return responses;
};

// Run MOA with sequential strategy (chain of refinement)
export const runSequentialMOA = async (prompt, models) => {
  const responses = [];
  let context = prompt;
  
  for (const modelConfig of models) {
    try {
      const response = await callAI(
        modelConfig.provider,
        modelConfig.apiKey,
        modelConfig.model,
        [{ role: 'user', content: context }],
        modelConfig.baseUrl
      );
      
      responses.push({
        provider: modelConfig.provider,
        model: modelConfig.model,
        response,
        success: true,
        timestamp: new Date().toISOString(),
      });
      
      // Build context for next model
      context = `Original request: ${prompt}\n\nPrevious model's response:\n${response}\n\nPlease review, improve, and refine the above response.`;
    } catch (error) {
      responses.push({
        provider: modelConfig.provider,
        model: modelConfig.model,
        response: null,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      break; // Stop chain on error
    }
  }
  
  return responses;
};

// Run MOA with voting strategy
export const runVotingMOA = async (prompt, models, aggregatorConfig) => {
  // First, get responses from all models
  const responses = await runParallelMOA(prompt, models);
  
  // Filter successful responses
  const successfulResponses = responses.filter(r => r.success);
  
  if (successfulResponses.length === 0) {
    throw new Error('All models failed to respond');
  }
  
  // Use an aggregator model to vote/combine
  const votingPrompt = `
Multiple AI models have responded to the following query:
"${prompt}"

Here are their responses:

${successfulResponses.map((r, i) => `
**Model ${i + 1}** (${r.provider} - ${r.model}):
${r.response}
`).join('\n---\n')}

Please analyze these responses and provide:
1. The best consolidated answer combining the strongest points from each
2. Which model(s) provided the most accurate/helpful information
3. Any contradictions or disagreements between models
4. A confidence score (0-100) for your final answer

Format your response as:
FINAL ANSWER:
[Your consolidated answer here]

ANALYSIS:
[Your analysis here]

CONFIDENCE: [0-100]
`;

  try {
    const aggregatedResponse = await callAI(
      aggregatorConfig.provider,
      aggregatorConfig.apiKey,
      aggregatorConfig.model,
      [{ role: 'user', content: votingPrompt }],
      aggregatorConfig.baseUrl
    );
    
    return {
      originalResponses: responses,
      aggregatedResponse,
      strategy: 'voting',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    // Fallback: return all responses without aggregation
    return {
      originalResponses: responses,
      aggregatedResponse: null,
      aggregationError: error.message,
      strategy: 'voting',
      timestamp: new Date().toISOString(),
    };
  }
};

// Run MOA with specialized agents
export const runSpecializedMOA = async (prompt, agentRoles) => {
  const results = {};
  
  for (const [role, config] of Object.entries(agentRoles)) {
    const rolePrompt = config.systemPrompt 
      ? `${config.systemPrompt}\n\n${prompt}`
      : prompt;
    
    try {
      const response = await callAI(
        config.provider,
        config.apiKey,
        config.model,
        [{ role: 'user', content: rolePrompt }],
        config.baseUrl
      );
      
      results[role] = {
        response,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      results[role] = {
        response: null,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
  
  return results;
};

// Main MOA runner
export const runMOA = async (prompt, config) => {
  const { strategy, models, aggregatorConfig, agentRoles } = config;
  
  switch (strategy) {
    case MOA_STRATEGIES.PARALLEL:
      return await runParallelMOA(prompt, models);
      
    case MOA_STRATEGIES.SEQUENTIAL:
      return await runSequentialMOA(prompt, models);
      
    case MOA_STRATEGIES.VOTING:
      return await runVotingMOA(prompt, models, aggregatorConfig);
      
    case MOA_STRATEGIES.SPECIALIZED:
      return await runSpecializedMOA(prompt, agentRoles);
      
    default:
      throw new Error(`Unknown MOA strategy: ${strategy}`);
  }
};

// Helper: Check if MOA is configured
export const isMOAConfigured = (config) => {
  if (!config || !config.strategy) return false;
  
  switch (config.strategy) {
    case MOA_STRATEGIES.PARALLEL:
    case MOA_STRATEGIES.SEQUENTIAL:
      return config.models && config.models.length >= 2;
      
    case MOA_STRATEGIES.VOTING:
      return config.models && config.models.length >= 2 && config.aggregatorConfig;
      
    case MOA_STRATEGIES.SPECIALIZED:
      return config.agentRoles && Object.keys(config.agentRoles).length >= 2;
      
    default:
      return false;
  }
};
