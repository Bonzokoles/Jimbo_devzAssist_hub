// Response Aggregator - Combine and analyze multiple AI responses

// Analyze response quality metrics
export const analyzeResponse = (response) => {
  if (!response || !response.response) {
    return {
      quality: 0,
      length: 0,
      hasCodeExamples: false,
      hasStructure: false,
      sentiment: 'neutral',
    };
  }
  
  const text = response.response;
  const length = text.length;
  
  // Check for code examples
  const hasCodeExamples = text.includes('```') || text.includes('function') || text.includes('class');
  
  // Check for structure (lists, headers, sections)
  const hasStructure = text.includes('\n-') || text.includes('\n*') || text.includes('\n#') || text.includes('\n1.');
  
  // Simple quality heuristic based on length and features
  let quality = Math.min(100, length / 10);
  if (hasCodeExamples) quality += 15;
  if (hasStructure) quality += 10;
  if (length > 500) quality += 10;
  
  return {
    quality: Math.min(100, quality),
    length,
    hasCodeExamples,
    hasStructure,
    sentiment: 'neutral', // Could be enhanced with sentiment analysis
  };
};

// Find the best response based on metrics
export const findBestResponse = (responses) => {
  const analyzed = responses
    .filter(r => r.success)
    .map(r => ({
      ...r,
      metrics: analyzeResponse(r),
    }))
    .sort((a, b) => b.metrics.quality - a.metrics.quality);
  
  return analyzed.length > 0 ? analyzed[0] : null;
};

// Merge responses into a single comprehensive answer
export const mergeResponses = (responses, method = 'concatenate') => {
  const successfulResponses = responses.filter(r => r.success);
  
  if (successfulResponses.length === 0) {
    return 'All models failed to respond.';
  }
  
  if (successfulResponses.length === 1) {
    return successfulResponses[0].response;
  }
  
  switch (method) {
    case 'concatenate':
      // Simply concatenate all responses with headers
      return successfulResponses
        .map((r, i) => `### Response from ${r.provider} (${r.model})\n\n${r.response}`)
        .join('\n\n---\n\n');
      
    case 'best':
      // Return only the best response
      const best = findBestResponse(successfulResponses);
      return best ? best.response : successfulResponses[0].response;
      
    case 'summary':
      // Create a summary (requires manual aggregation or AI)
      return `Multiple models provided responses:\n\n${successfulResponses
        .map((r, i) => `${i + 1}. **${r.provider} (${r.model})**: ${r.response.substring(0, 200)}...`)
        .join('\n\n')}`;
      
    default:
      return successfulResponses[0].response;
  }
};

// Compare responses to find agreements and disagreements
export const compareResponses = (responses) => {
  const successfulResponses = responses.filter(r => r.success);
  
  if (successfulResponses.length < 2) {
    return {
      agreements: [],
      disagreements: [],
      uniquePoints: [],
    };
  }
  
  // Simple keyword-based comparison
  const allWords = successfulResponses.map(r => {
    const words = r.response.toLowerCase().split(/\s+/);
    return new Set(words.filter(w => w.length > 5)); // Only significant words
  });
  
  // Find common words (agreements)
  const commonWords = new Set(
    Array.from(allWords[0]).filter(word =>
      allWords.every(wordSet => wordSet.has(word))
    )
  );
  
  // Find unique words per response
  const uniqueWords = allWords.map((wordSet, i) =>
    Array.from(wordSet).filter(word =>
      !allWords.some((otherSet, j) => i !== j && otherSet.has(word))
    )
  );
  
  return {
    agreements: Array.from(commonWords),
    uniquePoints: uniqueWords.map((words, i) => ({
      provider: successfulResponses[i].provider,
      model: successfulResponses[i].model,
      uniqueKeywords: words.slice(0, 10), // Top 10 unique keywords
    })),
    totalResponses: successfulResponses.length,
  };
};

// Calculate consensus score (0-100)
export const calculateConsensus = (responses) => {
  const comparison = compareResponses(responses);
  
  if (comparison.totalResponses < 2) return 0;
  
  // Consensus based on common keywords
  const avgUniqueWords = comparison.uniquePoints.reduce((sum, p) => sum + p.uniqueKeywords.length, 0) / comparison.totalResponses;
  const agreementRatio = comparison.agreements.length / Math.max(1, avgUniqueWords);
  
  return Math.min(100, agreementRatio * 50);
};

// Format MOA results for display
export const formatMOAResults = (results, strategy) => {
  switch (strategy) {
    case 'parallel':
      return {
        type: 'parallel',
        responses: results,
        best: findBestResponse(results),
        comparison: compareResponses(results),
        consensus: calculateConsensus(results),
      };
      
    case 'sequential':
      return {
        type: 'sequential',
        responses: results,
        final: results[results.length - 1],
        chain: results,
      };
      
    case 'voting':
      return {
        type: 'voting',
        originalResponses: results.originalResponses,
        aggregated: results.aggregatedResponse,
        best: findBestResponse(results.originalResponses),
      };
      
    case 'specialized':
      return {
        type: 'specialized',
        agents: results,
        successful: Object.entries(results).filter(([, r]) => r.success),
      };
      
    default:
      return results;
  }
};
