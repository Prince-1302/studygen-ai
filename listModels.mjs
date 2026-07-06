// Quick script to list available Gemini models
import { GoogleGenAI } from '@google/genai';

const apiKey = process.argv[2];
if (!apiKey) {
  console.error('Usage: node listModels.mjs <API_KEY>');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const models = await ai.models.list();
const results = [];
for await (const model of models) {
  results.push(model.name);
}
console.log('Available models:');
results.forEach(m => console.log(' -', m));
