import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  SchemesPayloadSchema,
  type ChatMessage,
  type GroundingSource,
  type Language,
  type Scheme,
  type SchemesPayload,
  type UserProfile,
} from '../src/types/yojana.ts';

const PRIMARY_MODEL = 'gemini-4-hydrogen';
const FALLBACK_MODEL = 'gemini-3.1-flash-lite';

const SYSTEM_INSTRUCTION =
  "You are an expert on Indian central and state government welfare schemes. Based on the user's profile, return 8-12 schemes they are most likely eligible for, covering both central schemes and schemes of their specific state. Use Google Search to verify that each scheme is currently active and the details are accurate. Only include real schemes. Never invent a scheme, benefit amount, or URL. Use only official links (.gov.in, .nic.in, or the official state portal). Write all text fields in the language requested by the user. Return strictly the JSON schema provided.";

export class GeminiServiceError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 502, code = 'UPSTREAM_ERROR') {
    super(message);
    this.name = 'GeminiServiceError';
    this.status = status;
    this.code = code;
  }
}

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiServiceError(
      'GEMINI_API_KEY is not configured on the server. Please add it in Settings > Secrets.',
      500,
      'MISSING_API_KEY'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function parseGeminiError(err: unknown): { status: number; code: string; message: string } {
  const rawMessage = err instanceof Error ? err.message : String(err);

  // @google/genai often embeds a JSON payload in err.message
  const jsonStart = rawMessage.indexOf('{');
  if (jsonStart !== -1) {
    try {
      const parsed = JSON.parse(rawMessage.slice(jsonStart)) as {
        error?: { code?: number; message?: string; status?: string };
      };
      const apiCode = parsed?.error?.code;
      const apiStatus = parsed?.error?.status ?? '';
      const apiMsg = parsed?.error?.message ?? rawMessage;

      if (apiCode === 429 || apiStatus === 'RESOURCE_EXHAUSTED') {
        return {
          status: 429,
          code: 'QUOTA_EXCEEDED',
          message:
            'Gemini API rate limit or quota exceeded. Please wait a minute and try again, or select a billing-enabled API key in Settings > Secrets.',
        };
      }
      if (
        apiCode === 403 ||
        apiStatus === 'PERMISSION_DENIED' ||
        /API_KEY_INVALID|API key not valid/i.test(apiMsg)
      ) {
        return {
          status: 403,
          code: 'API_KEY_INVALID',
          message:
            'Your Gemini API key could not be authorized. Please verify or update your key in Settings > Secrets.',
        };
      }
      if (apiCode === 404 || apiStatus === 'NOT_FOUND') {
        return {
          status: 502,
          code: 'MODEL_NOT_FOUND',
          message: 'Configured Gemini model was unavailable.',
        };
      }
      if (apiCode === 400 || apiStatus === 'INVALID_ARGUMENT') {
        return {
          status: 400,
          code: 'INVALID_ARGUMENT',
          message: apiMsg,
        };
      }
      return {
        status: apiCode && apiCode >= 400 ? apiCode : 502,
        code: apiStatus || 'UPSTREAM_ERROR',
        message: apiMsg,
      };
    } catch {
      // Fall through to pattern matching
    }
  }

  if (/429|RESOURCE_EXHAUSTED|quota|rate limit/i.test(rawMessage)) {
    return {
      status: 429,
      code: 'QUOTA_EXCEEDED',
      message:
        'Gemini API rate limit or quota exceeded. Please wait a minute and try again, or select a billing-enabled API key in Settings > Secrets.',
    };
  }

  if (/403|PERMISSION_DENIED|API_KEY_INVALID|GEMINI_API_KEY/i.test(rawMessage)) {
    return {
      status: 403,
      code: 'API_KEY_INVALID',
      message:
        'Your Gemini API key could not be authorized. Please verify or update your key in Settings > Secrets.',
    };
  }

  return {
    status: 502,
    code: 'UPSTREAM_ERROR',
    message: rawMessage || 'Unexpected error communicating with Gemini API.',
  };
}

function getLanguageName(lang: Language): string {
  switch (lang) {
    case 'ta':
      return 'Tamil (தமிழ்) — write every descriptive text field, criteria, document name, step, tip, and summary in clear, natural Tamil. Keep official URLs as URLs and keep JSON enum keys (category, level, apply_mode) in English as defined by the schema.';
    case 'hi':
      return 'Hindi (हिन्दी) — write every descriptive text field, criteria, document name, step, tip, and summary in clear, natural Hindi (Devanagari). Keep official URLs as URLs and keep JSON enum keys (category, level, apply_mode) in English as defined by the schema.';
    default:
      return 'English (en-IN) — write all fields in clear, accessible Indian English.';
  }
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overall_summary: {
      type: Type.STRING,
      description: 'Concise 2-3 sentence summary tailored to the citizen profile in the requested language.',
    },
    total_schemes_found: {
      type: Type.INTEGER,
      description: 'Total count of schemes returned in the schemes array.',
    },
    estimated_total_annual_benefit_if_known: {
      type: Type.STRING,
      description: 'Estimated combined annual financial value in INR if determinable (e.g., "Up to ₹42,000/year + health cover"), or concise note if benefits are non-monetary.',
    },
    schemes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: {
            type: Type.STRING,
            description: 'Must be one of: Agriculture, Education, Health, Housing, Employment, Women & Child, Pension, Business, Skill, Social Security',
          },
          level: {
            type: Type.STRING,
            description: 'Must be Central or State',
          },
          ministry_or_department: { type: Type.STRING },
          benefit_summary: { type: Type.STRING },
          benefit_amount: { type: Type.STRING },
          why_eligible: { type: Type.STRING },
          eligibility_match_percent: { type: Type.INTEGER },
          eligibility_criteria: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          documents_required: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          how_to_apply_steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          apply_mode: {
            type: Type.STRING,
            description: 'Must be Online, Offline, or Both',
          },
          official_link: {
            type: Type.STRING,
            description: 'Official .gov.in, .nic.in, or official state government portal URL.',
          },
          helpline: { type: Type.STRING },
          last_date_or_deadline: { type: Type.STRING },
          tip: { type: Type.STRING },
        },
        required: [
          'name',
          'category',
          'level',
          'ministry_or_department',
          'benefit_summary',
          'benefit_amount',
          'why_eligible',
          'eligibility_match_percent',
          'eligibility_criteria',
          'documents_required',
          'how_to_apply_steps',
          'apply_mode',
          'official_link',
          'tip',
        ],
      },
    },
  },
  required: [
    'overall_summary',
    'total_schemes_found',
    'estimated_total_annual_benefit_if_known',
    'schemes',
  ],
};

function buildProfilePrompt(profile: UserProfile, language: Language): string {
  const statuses: string[] = [];
  if (profile.specialStatus.disability) statuses.push('Person with Disability (PwD / Divyangjan)');
  if (profile.specialStatus.widow) statuses.push('Widow');
  if (profile.specialStatus.bpl) statuses.push('BPL Ration Card Holder');
  if (profile.specialStatus.pregnantOrLactating) statuses.push('Pregnant or Lactating Mother');
  if (profile.specialStatus.exServiceman) statuses.push('Ex-Serviceman / Defence Dependent');

  return `
Find 8 to 12 currently active Indian Central Government and ${profile.state} State Government welfare schemes for this citizen profile.

CITIZEN PROFILE:
- Age: ${profile.age} years
- Gender: ${profile.gender}
- State / Union Territory: ${profile.state}
- Area Type: ${profile.areaType}
- Occupation: ${profile.occupation}
- Annual Family Income: ${profile.annualIncome}
- Social Category: ${profile.category}
- Education Level: ${profile.education}
- Special Status: ${statuses.length > 0 ? statuses.join(', ') : 'None specified'}
- Additional Situation Details: ${profile.situationDescription?.trim() || 'None provided'}

OUTPUT LANGUAGE REQUIREMENT:
${getLanguageName(language)}

IMPORTANT VERIFICATION RULES:
1. Confirm active status, current benefit amounts, and authentic official government portal links (.gov.in, .nic.in, or official state portals like tn.gov.in, up.gov.in, maharashtra.gov.in, myscheme.gov.in).
2. Include a balanced mix of flagship Central schemes AND specific ${profile.state} state welfare schemes relevant to this profile.
3. In "why_eligible", explicitly connect the scheme to this person's age, state (${profile.state}), occupation, income, category, or special status.
4. Keep "category" strictly as one of: "Agriculture", "Education", "Health", "Housing", "Employment", "Women & Child", "Pension", "Business", "Skill", "Social Security".
5. Keep "level" strictly as "Central" or "State".
6. Keep "apply_mode" strictly as "Online", "Offline", or "Both".
7. Set "total_schemes_found" equal to the number of items in "schemes".
`.trim();
}

function extractGroundingSources(response: unknown): GroundingSource[] {
  const sources: GroundingSource[] = [];
  const seen = new Set<string>();
  const r = response as {
    candidates?: Array<{
      groundingMetadata?: {
        groundingChunks?: Array<{
          web?: { uri?: string; title?: string };
        }>;
      };
    }>;
  };
  const chunks = r?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  for (const chunk of chunks) {
    const uri = chunk?.web?.uri?.trim();
    const title = chunk?.web?.title?.trim() || uri;
    if (uri && !seen.has(uri)) {
      seen.add(uri);
      sources.push({ title: title || uri, uri });
    }
  }
  return sources;
}

function extractJsonText(raw: string): string {
  let cleaned = raw.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    cleaned = fenceMatch[1].trim();
  }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

function sanitizeOfficialLink(url: string): string {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[a-z0-9.-]+\.(gov\.in|nic\.in|org\.in|in)/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return 'https://www.myscheme.gov.in';
}

interface QueryAttemptOptions {
  model: string;
  useSearch: boolean;
  useStructuredSchema: boolean;
}

async function runSchemeQuery(
  ai: GoogleGenAI,
  prompt: string,
  opts: QueryAttemptOptions
) {
  const isGemini4 = opts.model.startsWith('gemini-4');

  const schemaPrompt = opts.useStructuredSchema
    ? prompt
    : `${prompt}

Return ONLY a valid JSON object (no markdown commentary before or after) matching this exact structure:
{
  "overall_summary": "string",
  "total_schemes_found": number,
  "estimated_total_annual_benefit_if_known": "string",
  "schemes": [
    {
      "name": "string",
      "category": "Agriculture|Education|Health|Housing|Employment|Women & Child|Pension|Business|Skill|Social Security",
      "level": "Central|State",
      "ministry_or_department": "string",
      "benefit_summary": "string",
      "benefit_amount": "string",
      "why_eligible": "string",
      "eligibility_match_percent": number,
      "eligibility_criteria": ["string"],
      "documents_required": ["string"],
      "how_to_apply_steps": ["string"],
      "apply_mode": "Online|Offline|Both",
      "official_link": "string (.gov.in or .nic.in or official state portal)",
      "helpline": "string",
      "last_date_or_deadline": "string",
      "tip": "string"
    }
  ]
}`;

  const config: Record<string, unknown> = {
    systemInstruction: SYSTEM_INSTRUCTION,
  };

  if (opts.useSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  if (opts.useStructuredSchema) {
    config.responseMimeType = 'application/json';
    config.responseSchema = RESPONSE_SCHEMA;
  }

  if (isGemini4) {
    config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
  }

  return ai.models.generateContent({
    model: opts.model,
    contents: schemaPrompt,
    config,
  });
}

export async function findSchemesForProfile(
  profile: UserProfile,
  language: Language
): Promise<SchemesPayload> {
  const ai = getClient();
  const prompt = buildProfilePrompt(profile, language);

  // Ordered candidate strategies:
  // 1. Primary model (gemini-4-hydrogen) with Google Search + JSON Schema
  // 2. Fallback model (gemini-3.1-flash-lite) with Google Search + JSON Schema
  // 3. Fallback model without search if search grounding quota is exhausted on free tier
  const strategies: QueryAttemptOptions[] = [
    { model: PRIMARY_MODEL, useSearch: true, useStructuredSchema: true },
    { model: FALLBACK_MODEL, useSearch: true, useStructuredSchema: true },
    { model: FALLBACK_MODEL, useSearch: false, useStructuredSchema: true },
  ];

  let lastParsedErr: { status: number; code: string; message: string } | null = null;

  for (const strategy of strategies) {
    // Allow 1 automatic retry ONLY if JSON parsing/validation fails
    let currentOpts = { ...strategy };
    for (let jsonAttempt = 0; jsonAttempt < 2; jsonAttempt++) {
      try {
        let response;
        try {
          response = await runSchemeQuery(ai, prompt, currentOpts);
        } catch (apiErr: unknown) {
          const parsedApiErr = parseGeminiError(apiErr);
          if (
            currentOpts.useStructuredSchema &&
            parsedApiErr.code === 'INVALID_ARGUMENT'
          ) {
            currentOpts = { ...currentOpts, useStructuredSchema: false };
            response = await runSchemeQuery(ai, prompt, currentOpts);
          } else {
            throw apiErr;
          }
        }

        const rawText = response.text ?? '';
        if (!rawText.trim()) {
          throw new Error('EMPTY_RESPONSE');
        }

        const jsonText = extractJsonText(rawText);
        const parsedJson = JSON.parse(jsonText);
        const validated = SchemesPayloadSchema.parse(parsedJson);

        const sources = extractGroundingSources(response);
        const cleanedSchemes = validated.schemes.map((s) => ({
          ...s,
          official_link: sanitizeOfficialLink(s.official_link),
        }));

        return {
          ...validated,
          total_schemes_found: cleanedSchemes.length,
          schemes: cleanedSchemes,
          sources,
        };
      } catch (err: unknown) {
        const isJsonOrZod =
          err instanceof SyntaxError ||
          (err instanceof Error &&
            (err.name === 'ZodError' || err.message === 'EMPTY_RESPONSE'));

        if (isJsonOrZod && jsonAttempt === 0) {
          // Retry once automatically with prompt-based JSON extraction
          currentOpts = { ...currentOpts, useStructuredSchema: false };
          continue;
        }

        const parsedErr = parseGeminiError(err);
        lastParsedErr = parsedErr;

        // Immediately abort without trying fallback models on invalid API key
        if (parsedErr.code === 'API_KEY_INVALID') {
          throw new GeminiServiceError(parsedErr.message, parsedErr.status, parsedErr.code);
        }

        // On 429 quota/rate-limit or 5xx/404, break inner loop and try next strategy
        break;
      }
    }
  }

  throw new GeminiServiceError(
    lastParsedErr?.message ?? 'Failed to retrieve schemes. Please try again shortly.',
    lastParsedErr?.status ?? 502,
    lastParsedErr?.code ?? 'UPSTREAM_ERROR'
  );
}

export async function askFollowUpQuestion(params: {
  question: string;
  profile: UserProfile | null;
  schemes: Scheme[];
  history: ChatMessage[];
  language: Language;
  isDocumentGuide?: boolean;
}): Promise<{ answer: string; sources: GroundingSource[] }> {
  const ai = getClient();
  const { question, profile, schemes, history, language, isDocumentGuide } = params;

  const profileSummary = profile
    ? `User Profile: Age ${profile.age}, ${profile.gender}, State: ${profile.state} (${profile.areaType}), Occupation: ${profile.occupation}, Annual Income: ${profile.annualIncome}, Category: ${profile.category}, Education: ${profile.education}, Situation: ${profile.situationDescription || 'N/A'}.`
    : 'User Profile: Not yet specified (answer generally for India, mentioning state e-District / CSC / DigiLocker channels).';

  const schemesSummary =
    schemes.length > 0
      ? `Matched Schemes: ${schemes
          .slice(0, 12)
          .map((s) => `${s.name} (${s.level}, ${s.benefit_amount})`)
          .join('; ')}.`
      : '';

  const recentHistory = history
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'Citizen' : 'Advisor'}: ${m.text}`)
    .join('\n');

  const systemInstruction = `You are a helpful, accurate Indian government welfare and citizen services advisor.
Verify current portals, fees, processing times, and rules in India${profile?.state ? ` (especially for ${profile.state})` : ''}.
${isDocumentGuide ? 'When explaining how to obtain an Indian official document (like Aadhaar, Income Certificate, Caste Certificate, Ration Card, or Bank Account), structure the answer clearly with: 1) Where to apply (official portal like e-District, UIDAI, DigiLocker, or CSC/e-Sevai/Akshaya center), 2) Supporting documents needed, 3) Step-by-step process, 4) Typical fee & timeline.' : ''}
Never invent URLs or benefit amounts. Only cite real official portals (.gov.in, .nic.in).
Respond exclusively in ${language === 'ta' ? 'Tamil (தமிழ்)' : language === 'hi' ? 'Hindi (हिन्दी)' : 'English'}. Keep formatting clean with short paragraphs and numbered steps where useful.`;

  const prompt = `${profileSummary}
${schemesSummary}

${recentHistory ? `Conversation so far:\n${recentHistory}\n` : ''}
Citizen Question: ${question}`;

  const strategies: Array<{ model: string; useSearch: boolean }> = [
    { model: PRIMARY_MODEL, useSearch: true },
    { model: FALLBACK_MODEL, useSearch: true },
    { model: FALLBACK_MODEL, useSearch: false },
  ];

  let lastParsedErr: { status: number; code: string; message: string } | null = null;

  for (const strategy of strategies) {
    try {
      const config: Record<string, unknown> = { systemInstruction };
      if (strategy.useSearch) {
        config.tools = [{ googleSearch: {} }];
      }
      if (strategy.model.startsWith('gemini-4')) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      const response = await ai.models.generateContent({
        model: strategy.model,
        contents: prompt,
        config,
      });

      const answer = response.text?.trim();
      if (!answer) {
        throw new Error('No response generated by advisor.');
      }

      return {
        answer,
        sources: extractGroundingSources(response),
      };
    } catch (err: unknown) {
      const parsedErr = parseGeminiError(err);
      lastParsedErr = parsedErr;
      if (parsedErr.code === 'API_KEY_INVALID') {
        throw new GeminiServiceError(parsedErr.message, parsedErr.status, parsedErr.code);
      }
    }
  }

  throw new GeminiServiceError(
    lastParsedErr?.message ?? 'Could not generate an answer right now.',
    lastParsedErr?.status ?? 502,
    lastParsedErr?.code ?? 'UPSTREAM_ERROR'
  );
}
