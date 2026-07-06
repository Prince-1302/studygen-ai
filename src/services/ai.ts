import { GoogleGenAI } from '@google/genai';

// ─── Main Study Material Prompt ───────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are an advanced AI study assistant. Generate a COMPREHENSIVE study material package from the provided content.
Respond with ONE valid JSON object only — no markdown, no code blocks, raw JSON only.

JSON structure:
{
  "questions": [
    GENERATE AT LEAST 25 questions. Include ALL 10 types below, minimum quantities shown:
    - 4x MCQ: { "type":"MCQ", "question":"...", "options":["A)...","B)...","C)...","D)..."], "answer":"full correct option text", "explanation":"...", "difficulty":"Easy|Medium|Hard" }
    - 3x Fill in the Blank: { "type":"Fill in the Blank", "question":"The ___ is responsible for...", "answer":"...", "explanation":"...", "difficulty":"..." }
    - 3x True/False: { "type":"True/False", "question":"...", "answer":"True or False", "explanation":"...", "difficulty":"..." }
    - 2x One Word Answer: { "type":"One Word Answer", "question":"...", "answer":"...", "explanation":"...", "difficulty":"..." }
    - 3x Short Answer: { "type":"Short Answer", "question":"...", "answer":"2-3 sentence answer", "explanation":"...", "difficulty":"..." }
    - 2x Long Answer: { "type":"Long Answer", "question":"...", "answer":"detailed paragraph answer", "explanation":"...", "difficulty":"..." }
    - 2x Assertion & Reason: { "type":"Assertion & Reason", "question":"Assertion (A): ...\\nReason (R): ...", "options":["Both A and R are true and R is the correct explanation of A","Both A and R are true but R is not the correct explanation of A","A is true but R is false","A is false but R is true"], "answer":"correct option text", "explanation":"...", "difficulty":"..." }
    - 2x Match the Following: { "type":"Match the Following", "question":"Match Column A with Column B", "matchData":{"columnA":["item1","item2","item3","item4"],"columnB":["match1","match2","match3","match4"]}, "options":["1-a,2-b,3-c,4-d","1-b,2-a,3-d,4-c","1-c,2-d,3-a,4-b","1-d,2-c,3-b,4-a"], "answer":"correct combination", "explanation":"...", "difficulty":"..." }
    - 2x HOTS: { "type":"HOTS", "question":"higher order thinking question", "answer":"...", "explanation":"...", "difficulty":"Hard" }
    - 2x Application Based: { "type":"Application Based", "question":"real-world application question", "answer":"...", "explanation":"...", "difficulty":"..." }
  ],
  "summary": {
    "oneLine": "single sentence summary capturing the absolute core essence",
    "bulletPoints": ["Extract ALL important points, events, facts, and characters. Do not limit the number of bullet points; scale them dynamically to ensure absolutely NOTHING important is missed."],
    "detailed": "A genuine, highly detailed, and comprehensive summary. Do NOT restrict the word limit. Write as much as needed (whether 100 words for a short poem or 1000+ words for a long story) to ensure every single crucial detail, theme, and event is accurately captured."
  },
  "vocabulary": [
    { "word":"...", "meaning":"...", "hindiMeaning":"meaning in pure Hindi script", "hinglish":"Hindi/Hinglish explanation", "synonym":"...", "antonym":"...", "pos":"Noun/Verb/Adjective/etc", "example":"example sentence" }
    (extract up to 10 important words)
  ],
  "keyPoints": {
    "concepts": ["up to 8 core concepts"],
    "definitions": ["up to 8 important definitions"],
    "facts": ["up to 8 important facts"],
    "importantSentences": ["up to 6 exam-important sentences from the content"]
  },
  "keywords": [
    { "keyword":"...", "meaning":"...", "hindiMeaning":"meaning in pure Hindi script", "hinglish":"...", "importance":"High|Medium|Low" }
    (extract up to 12 keywords)
  ]
}

Rules:
1. CRITICAL: The entire generated study material (questions, answers, summary, key points) MUST be in the PRIMARY LANGUAGE of the provided content. If the content is in Hindi, everything MUST be generated in Hindi. If English, in English.
2. For Vocabulary/Keywords of Hindi text: extract difficult Hindi words, provide their meaning in simple Hindi under "meaning", their English translation under "hindiMeaning", and Hinglish explanation in "hinglish".
3. All content must be based SOLELY on provided text. No invented facts. No repetition. Exam-oriented and student-friendly.
`;

// ─── Models (confirmed available) — tried in order ────────────────────────────
const MODEL_FALLBACK_ORDER = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const shouldFallback = (error: any): boolean => {
  const msg: string = (error?.message || '').toLowerCase();
  return (
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('unavailable') ||
    msg.includes('overloaded') ||
    msg.includes('high demand') ||
    msg.includes('resource_exhausted') ||
    msg.includes('quota') ||
    msg.includes('rate limit') ||
    msg.includes('rate_limit')
  );
};

const humanReadableError = (error: any): string => {
  const raw: string = error?.message || '';
  if (raw.startsWith('{') || raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw);
      const inner = parsed?.error?.message || parsed?.message || parsed?.[0]?.error?.message || '';
      if (inner) return cleanMsg(inner);
    } catch { /* fall through */ }
  }
  return cleanMsg(raw) || 'An unexpected error occurred. Please try again.';
};

const cleanMsg = (msg: string): string =>
  msg.split('\n')[0].replace(/https?:\/\/\S+/g, '').replace(/\s{2,}/g, ' ').trim().slice(0, 200);

const parseAIResponse = (raw: string): any => {
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
};

// ─── Helper: run any prompt through the fallback model chain ──────────────────
const runWithFallback = async (buildRequest: (model: string, ai: GoogleGenAI) => Promise<string | undefined>): Promise<any> => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) throw new Error('Gemini API key is missing. Please add your API key in Settings.');

  const ai = new GoogleGenAI({ apiKey });
  let lastError: any = null;

  for (let i = 0; i < MODEL_FALLBACK_ORDER.length; i++) {
    const model = MODEL_FALLBACK_ORDER[i];
    try {
      console.log(`Trying model: ${model}`);
      const resultText = await buildRequest(model, ai);
      if (!resultText) throw new Error('Empty response from AI');
      return parseAIResponse(resultText);
    } catch (error: any) {
      lastError = error;
      if (shouldFallback(error) && i < MODEL_FALLBACK_ORDER.length - 1) {
        console.warn(`Model ${model} unavailable/quota, falling back...`);
        await sleep(1200);
        continue;
      }
      break;
    }
  }

  if (shouldFallback(lastError)) {
    throw new Error(
      'Your API quota is exhausted or all models are busy. Please wait a few minutes and try again.'
    );
  }
  throw new Error(humanReadableError(lastError));
};

// ─── Generate study material from raw text ────────────────────────────────────
export const generateStudyMaterial = async (text: string): Promise<any> =>
  runWithFallback(async (model, ai) => {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: SYSTEM_PROMPT }, { text: `\n\nContent to Analyze:\n${text}` }] }],
      config: { responseMimeType: 'application/json' },
    });
    return response.text;
  });

// ─── Generate study material from an image (Gemini Vision) ───────────────────
export const generateStudyMaterialFromImage = async (imageFile: File): Promise<any> => {
  const base64 = await fileToBase64(imageFile);
  const mimeType = imageFile.type as 'image/jpeg' | 'image/png' | 'image/webp';

  return runWithFallback(async (model, ai) => {
    const response = await ai.models.generateContent({
      model,
      contents: [{
        role: 'user',
        parts: [
          { text: SYSTEM_PROMPT },
          { inlineData: { mimeType, data: base64 } },
          { text: 'Analyze the image content above and generate the complete study material as instructed.' },
        ],
      }],
      config: { responseMimeType: 'application/json' },
    });
    return response.text;
  });
};

// ─── Translate a summary object bi-directionally ───────────────────────────────
export const translateSummary = async (summary: {
  oneLine: string;
  bulletPoints: string[];
  detailed: string;
}): Promise<{ oneLine: string; bulletPoints: string[]; detailed: string }> => {
  const prompt = `Translate the following study summary into the OPPOSITE language. 
If the text is currently in English, translate it to clear Hindi (Devanagari script).
If the text is currently in Hindi, translate it to clear English.
Return ONLY a valid JSON object with the same structure — no markdown, no extra text:
{
  "oneLine": "translated text",
  "bulletPoints": ["translated bullet 1", "translated bullet 2", ...],
  "detailed": "translated text"
}

Summary to translate:
${JSON.stringify(summary)}`;

  return runWithFallback(async (model, ai) => {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' },
    });
    return response.text;
  });
};

// ─── Analyze a single vocabulary word ────────────────────────────────────────
export const analyzeWord = async (word: string): Promise<{
  word: string; meaning: string; hindiMeaning: string; hinglish: string;
  synonym: string; antonym: string; pos: string; example: string;
}> => {
  const prompt = `You are a vocabulary assistant. Analyze the English word "${word}" and return ONLY a valid JSON object — no markdown, no extra text:
{
  "word": "${word}",
  "meaning": "clear English definition",
  "hindiMeaning": "meaning in pure Hindi script",
  "hinglish": "meaning explained in Hinglish (mix of Hindi and English) — so an Indian student can understand it easily",
  "synonym": "one or two synonyms",
  "antonym": "one or two antonyms (or N/A if none)",
  "pos": "Part of Speech (Noun/Verb/Adjective/Adverb/etc)",
  "example": "a natural example sentence using the word"
}`;

  return runWithFallback(async (model, ai) => {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' },
    });
    return response.text;
  });
};

// ─── Utility: File → base64 ───────────────────────────────────────────────────
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
