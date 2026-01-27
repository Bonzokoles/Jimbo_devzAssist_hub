/**
 * Enhanced MOA (Mixture of Agents) Engine
 * Supports per-model custom prompts and different execution strategies
 */
import { callOpenAI, callClaude } from '../aiClient';

/**
 * Execute a single model in the MOA pipeline
 */
export const executeModel = async (modelConfig, userPrompt, previousContext = null) => {
  const { provider, model, apiKey, systemPrompt, temperature, maxTokens } = modelConfig;
  
  // Build messages array
  const messages = [];
  
  // Add model-specific system prompt
  if (systemPrompt && systemPrompt.trim()) {
    messages.push({
      role: 'system',
      content: systemPrompt
    });
  }
  
  // Add context from previous model (for sequential execution)
  if (previousContext) {
    messages.push({
      role: 'user',
      content: previousContext
    });
  } else {
    messages.push({
      role: 'user',
      content: userPrompt
    });
  }
  
  // Call the appropriate provider
  try {
    let response;
    
    if (provider === 'openai') {
      response = await callOpenAI(apiKey, model, messages);
    } else if (provider === 'claude') {
      response = await callClaude(apiKey, model, messages);
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    
    return response;
  } catch (error) {
    console.error(`Model execution failed for ${modelConfig.role}:`, error);
    throw error;
  }
};

/**
 * Execute MOA in sequential mode
 * Each model receives the output of the previous model
 */
export const executeSequential = async (models, userPrompt, onProgress) => {
  const results = [];
  let context = userPrompt;
  
  for (let i = 0; i < models.length; i++) {
    const modelConfig = models[i];
    
    if (onProgress) {
      onProgress({
        step: i + 1,
        total: models.length,
        role: modelConfig.role,
        status: 'running'
      });
    }
    
    try {
      const response = await executeModel(modelConfig, userPrompt, i > 0 ? context : null);
      
      results.push({
        role: modelConfig.role,
        provider: modelConfig.provider,
        model: modelConfig.model,
        response: response,
        timestamp: new Date().toISOString()
      });
      
      // For sequential, pass response to next model
      if (i < models.length - 1) {
        context = `Previous step (${modelConfig.role}):\n${response}\n\nNow complete your task based on this.`;
      }
      
      if (onProgress) {
        onProgress({
          step: i + 1,
          total: models.length,
          role: modelConfig.role,
          status: 'completed'
        });
      }
    } catch (error) {
      if (onProgress) {
        onProgress({
          step: i + 1,
          total: models.length,
          role: modelConfig.role,
          status: 'failed',
          error: error.message
        });
      }
      throw error;
    }
  }
  
  return results;
};

/**
 * Execute MOA in parallel mode
 * All models process the user prompt simultaneously
 */
export const executeParallel = async (models, userPrompt, onProgress) => {
  const promises = models.map((modelConfig, index) => {
    if (onProgress) {
      onProgress({
        step: index + 1,
        total: models.length,
        role: modelConfig.role,
        status: 'running'
      });
    }
    
    return executeModel(modelConfig, userPrompt)
      .then(response => {
        if (onProgress) {
          onProgress({
            step: index + 1,
            total: models.length,
            role: modelConfig.role,
            status: 'completed'
          });
        }
        
        return {
          role: modelConfig.role,
          provider: modelConfig.provider,
          model: modelConfig.model,
          response: response,
          timestamp: new Date().toISOString()
        };
      })
      .catch(error => {
        if (onProgress) {
          onProgress({
            step: index + 1,
            total: models.length,
            role: modelConfig.role,
            status: 'failed',
            error: error.message
          });
        }
        throw error;
      });
  });
  
  return await Promise.all(promises);
};

/**
 * Main MOA execution function
 */
export const executeMOA = async (scenario, userPrompt, onProgress) => {
  const { strategy, models } = scenario;
  
  let results;
  
  if (strategy === 'sequential') {
    results = await executeSequential(models, userPrompt, onProgress);
  } else if (strategy === 'parallel') {
    results = await executeParallel(models, userPrompt, onProgress);
  } else {
    throw new Error(`Unknown strategy: ${strategy}`);
  }
  
  return results;
};
