import {
  ChatMessage,
  GroundingSource,
  Language,
  Scheme,
  SchemesPayload,
  SchemesPayloadSchema,
  UserProfile,
  UserProfileSchema,
} from '../types/yojana';

const KEYS = {
  profile: 'yojana_last_profile_v1',
  results: 'yojana_last_results_v1',
  resultsCache: 'yojana_results_cache_v1',
  saved: 'yojana_saved_schemes_v1',
  docs: 'yojana_doc_checklist_v1',
  language: 'yojana_language_v1',
  theme: 'yojana_theme_v1',
};

export class ApiClientError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = 'UPSTREAM_ERROR', status = 500) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
  }
}

function formatReadableError(raw: unknown, status: number): { message: string; code: string } {
  if (raw && typeof raw === 'object') {
    const obj = raw as { error?: unknown; code?: unknown };
    const code = typeof obj.code === 'string' ? obj.code : 'UPSTREAM_ERROR';
    if (typeof obj.error === 'string' && obj.error.trim()) {
      // Guard against embedded raw JSON payloads from upstream
      if (obj.error.trim().startsWith('{')) {
        try {
          const inner = JSON.parse(obj.error) as {
            error?: { code?: number; status?: string; message?: string };
          };
          if (inner?.error?.code === 429 || inner?.error?.status === 'RESOURCE_EXHAUSTED') {
            return {
              code: 'QUOTA_EXCEEDED',
              message:
                'Gemini API rate limit or quota exceeded. Please wait a minute and try again, or select a billing-enabled API key in Settings > Secrets.',
            };
          }
          if (inner?.error?.message) {
            return { code, message: inner.error.message };
          }
        } catch {
          // ignore
        }
      }
      return { code, message: obj.error };
    }
  }
  return {
    code: status === 429 ? 'QUOTA_EXCEEDED' : 'UPSTREAM_ERROR',
    message:
      status === 429
        ? 'Gemini API rate limit or quota exceeded. Please wait a minute and try again, or select a billing-enabled API key in Settings > Secrets.'
        : `Request failed with status ${status}`,
  };
}

export function getProfileSignature(profile: UserProfile, language: Language): string {
  return JSON.stringify({ ...profile, language });
}

export function loadCachedResultsForSignature(signature: string): SchemesPayload | null {
  try {
    const raw = localStorage.getItem(KEYS.resultsCache);
    if (!raw) return null;
    const cache = JSON.parse(raw) as Record<string, unknown>;
    const candidate = cache?.[signature];
    if (!candidate) return null;
    const parsed = SchemesPayloadSchema.safeParse(candidate);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveCachedResultsForSignature(
  signature: string,
  payload: SchemesPayload
): void {
  try {
    const raw = localStorage.getItem(KEYS.resultsCache);
    const cache: Record<string, unknown> = raw ? JSON.parse(raw) : {};
    // Keep only the 3 most recent cached queries to avoid bloating localStorage
    const keys = Object.keys(cache);
    if (keys.length >= 3 && !cache[signature]) {
      delete cache[keys[0]];
    }
    cache[signature] = payload;
    localStorage.setItem(KEYS.resultsCache, JSON.stringify(cache));
  } catch {
    // Ignore storage quota errors
  }
}

export async function fetchMatchingSchemes(
  profile: UserProfile,
  language: Language
): Promise<SchemesPayload> {
  const response = await fetch('/api/schemes/find', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, language }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const formatted = formatReadableError(data, response.status);
    throw new ApiClientError(formatted.message, formatted.code, response.status);
  }

  // Client-side typed schema validation before rendering
  const parsed = SchemesPayloadSchema.safeParse(data);
  if (!parsed.success) {
    throw new ApiClientError('Received invalid scheme structure from server.', 'SCHEMA_ERROR', 502);
  }

  return parsed.data;
}

export async function fetchFollowUpAnswer(params: {
  question: string;
  profile: UserProfile | null;
  schemes: Scheme[];
  history: ChatMessage[];
  language: Language;
  isDocumentGuide?: boolean;
}): Promise<{ answer: string; sources: GroundingSource[] }> {
  const response = await fetch('/api/schemes/followup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const formatted = formatReadableError(data, response.status);
    throw new ApiClientError(formatted.message, formatted.code, response.status);
  }

  return {
    answer: typeof data.answer === 'string' ? data.answer : '',
    sources: Array.isArray(data.sources) ? data.sources : [],
  };
}

// LocalStorage Persistence Helpers

export function loadLastProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(KEYS.profile);
    if (!raw) return null;
    const parsed = UserProfileSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveLastProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(KEYS.profile, JSON.stringify(profile));
  } catch {
    // Ignore storage quota issues
  }
}

export function clearLastProfile(): void {
  try {
    localStorage.removeItem(KEYS.profile);
    localStorage.removeItem(KEYS.results);
    localStorage.removeItem(KEYS.resultsCache);
  } catch {
    // Ignore
  }
}

export function loadLastResults(): SchemesPayload | null {
  try {
    const raw = localStorage.getItem(KEYS.results);
    if (!raw) return null;
    const parsed = SchemesPayloadSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveLastResults(payload: SchemesPayload): void {
  try {
    localStorage.setItem(KEYS.results, JSON.stringify(payload));
  } catch {
    // Ignore
  }
}

export function loadSavedSchemes(): Scheme[] {
  try {
    const raw = localStorage.getItem(KEYS.saved);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSavedSchemes(schemes: Scheme[]): void {
  try {
    localStorage.setItem(KEYS.saved, JSON.stringify(schemes));
  } catch {
    // Ignore
  }
}

export type DocChecklistMap = Record<string, Record<string, boolean>>;

export function loadDocChecklist(): DocChecklistMap {
  try {
    const raw = localStorage.getItem(KEYS.docs);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveDocChecklist(map: DocChecklistMap): void {
  try {
    localStorage.setItem(KEYS.docs, JSON.stringify(map));
  } catch {
    // Ignore
  }
}

export function loadLanguage(): Language {
  try {
    const val = localStorage.getItem(KEYS.language);
    if (val === 'ta' || val === 'hi' || val === 'en') return val;
  } catch {
    // Ignore
  }
  return 'en';
}

export function saveLanguage(lang: Language): void {
  try {
    localStorage.setItem(KEYS.language, lang);
  } catch {
    // Ignore
  }
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const val = localStorage.getItem(KEYS.theme);
    if (val === 'dark' || val === 'light') return val;
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch {
    // Ignore
  }
  return 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(KEYS.theme, theme);
  } catch {
    // Ignore
  }
}
