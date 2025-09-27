import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  // DeepSeek Configuration
  deepseekApiKey: process.env.DEEPSEEK_API_KEY,
  deepseekBaseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  
  // Google Gemini Configuration
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  
  // OpenAI Configuration (fallback)
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4',
  
  // AI Processing Settings
  maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 4000,
  temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
  
  // Resume Analysis Settings
  atsKeywords: [
    'experience', 'skills', 'education', 'achievements', 'responsibilities',
    'projects', 'certifications', 'languages', 'technical', 'leadership'
  ],
  
  // Job Matching Settings
  matchingThreshold: parseFloat(process.env.JOB_MATCHING_THRESHOLD) || 0.7,
  
  // Rate Limiting
  requestsPerMinute: parseInt(process.env.AI_REQUESTS_PER_MINUTE) || 10,
  requestsPerHour: parseInt(process.env.AI_REQUESTS_PER_HOUR) || 100,
}));