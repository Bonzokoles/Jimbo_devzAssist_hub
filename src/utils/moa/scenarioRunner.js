/**
 * MOA Scenario Runner
 * Executes complete MOA scenarios with aggregation
 */
import { executeMOA } from './moaEngine';
import { aggregateResponses } from './responseAggregator';

/**
 * Run a complete MOA scenario
 */
export const runMOAScenario = async (scenario, userPrompt, apiKeys, onProgress) => {
  try {
    // Inject API keys into model configs
    const modelsWithKeys = scenario.models.map(model => ({
      ...model,
      apiKey: apiKeys[model.provider]
    }));
    
    const scenarioWithKeys = {
      ...scenario,
      models: modelsWithKeys
    };
    
    // Execute the MOA
    if (onProgress) {
      onProgress({ stage: 'execution', status: 'started' });
    }
    
    const individualResults = await executeMOA(scenarioWithKeys, userPrompt, onProgress);
    
    if (onProgress) {
      onProgress({ stage: 'execution', status: 'completed' });
    }
    
    // Aggregate if enabled
    let aggregated = null;
    if (scenario.aggregation?.enabled) {
      if (onProgress) {
        onProgress({ stage: 'aggregation', status: 'started' });
      }
      
      const aggregationConfigWithKey = {
        ...scenario.aggregation,
        apiKey: apiKeys[scenario.aggregation.provider]
      };
      
      aggregated = await aggregateResponses(
        individualResults,
        aggregationConfigWithKey,
        userPrompt
      );
      
      if (onProgress) {
        onProgress({ stage: 'aggregation', status: 'completed' });
      }
    }
    
    return {
      scenario: scenario.name,
      strategy: scenario.strategy,
      individual: individualResults,
      aggregated: aggregated,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('MOA scenario execution failed:', error);
    if (onProgress) {
      onProgress({ 
        stage: 'error', 
        status: 'failed',
        error: error.message 
      });
    }
    throw error;
  }
};

/**
 * Run multiple scenarios and compare results
 */
export const runMultipleScenarios = async (scenarios, userPrompt, apiKeys, onProgress) => {
  const results = [];
  
  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    
    if (onProgress) {
      onProgress({
        scenarioIndex: i,
        totalScenarios: scenarios.length,
        scenarioName: scenario.name,
        status: 'running'
      });
    }
    
    try {
      const result = await runMOAScenario(scenario, userPrompt, apiKeys, onProgress);
      results.push(result);
      
      if (onProgress) {
        onProgress({
          scenarioIndex: i,
          totalScenarios: scenarios.length,
          scenarioName: scenario.name,
          status: 'completed'
        });
      }
    } catch (error) {
      if (onProgress) {
        onProgress({
          scenarioIndex: i,
          totalScenarios: scenarios.length,
          scenarioName: scenario.name,
          status: 'failed',
          error: error.message
        });
      }
      // Continue with other scenarios even if one fails
    }
  }
  
  return results;
};
