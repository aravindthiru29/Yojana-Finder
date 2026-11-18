import { useState } from 'react';
import { ExternalLink, FileCheck2, Loader2, Send } from 'lucide-react';
import { CORE_DOCUMENTS, INDIA_STATES_AND_UTS } from '../data/indiaData';
import { TRANSLATIONS } from '../i18n/translations';
import { fetchFollowUpAnswer } from '../services/schemeApi';
import { GroundingSource, Language, UserProfile } from '../types/yojana';

interface DocumentGuideViewProps {
  language: Language;
  profile: UserProfile | null;
}

export function DocumentGuideView({ language, profile }: DocumentGuideViewProps) {
  const t = TRANSLATIONS[language];
  const [selectedState, setSelectedState] = useState<string>(
    profile?.state || 'Tamil Nadu'
  );
  const [activeDocKey, setActiveDocKey] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadGuide = async (promptText: string, docKey: string | null) => {
    if (!promptText.trim() || isLoading) return;
    setActiveDocKey(docKey);
    setIsLoading(true);
    setError(null);

    const syntheticProfile: UserProfile = profile
      ? { ...profile, state: selectedState }
      : {
          age: 30,
          gender: 'Female',
          state: selectedState,
          areaType: 'Urban',
          occupation: 'other',
          annualIncome: '1_to_2_5_lakh',
          category: 'General',
          education: 'secondary_10th',
          specialStatus: {
            disability: false,
            widow: false,
            bpl: false,
            pregnantOrLactating: false,
            exServiceman: false,
          },
          situationDescription: '',
        };

    try {
      const res = await fetchFollowUpAnswer({
        question: `${promptText} (For resident of ${selectedState}, India)`,
        profile: syntheticProfile,
        schemes: [],
        history: [],
        language,
        isDocumentGuide: true,
      });
      setAnswer(res.answer);
      setSources(res.sources);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not fetch document guide.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void loadGuide(customQuery, null);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
            {t.docGuide.title}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
            {t.docGuide.subtitle}
          </p>
        </div>

        <div className="min-w-[240px]">
          <label
            htmlFor="doc-guide-state"
            className="block text-xs font-semibold text-slate-500 dark:text-slate-400"
          >
            {t.docGuide.stateContext}
          </label>
          <select
            id="doc-guide-state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="mt-1 block min-h-[42px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            {INDIA_STATES_AND_UTS.map((st) => (
              <option key={st.value} value={st.value}>
                {language === 'en' ? st.en : `${st[language]} (${st.en})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Preset Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CORE_DOCUMENTS.map((docKey) => {
          const doc = t.docGuide.docs[docKey];
          const isActive = activeDocKey === docKey;
          return (
            <div
              key={docKey}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-colors ${
                isActive
                  ? 'border-blue-900 bg-blue-50/50 dark:border-amber-400 dark:bg-amber-500/10'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 text-blue-900 dark:text-amber-400">
                  <FileCheck2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
                    {doc.title}
                  </h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {doc.summary}
                </p>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => void loadGuide(doc.prompt, docKey)}
                className="mt-5 inline-flex min-h-[40px] w-full items-center justify-center rounded-xl bg-blue-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 cursor-pointer"
              >
                {t.docGuide.askButton}
              </button>
            </div>
          );
        })}
      </div>

      {/* Custom Document Question */}
      <form
        onSubmit={handleCustomSubmit}
        className="mt-8 flex flex-col gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row dark:border-slate-800 dark:bg-slate-900"
      >
        <input
          type="text"
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          placeholder={t.docGuide.customPlaceholder}
          className="min-h-[44px] flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading || !customQuery.trim()}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          <span>{t.docGuide.askCustom}</span>
        </button>
      </form>

      {/* Output Area */}
      {isLoading && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <Loader2 className="h-5 w-5 animate-spin text-blue-900 dark:text-amber-400" />
          <span>{t.chat.thinking}</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-200"
        >
          {error}
        </div>
      )}

      {answer && !isLoading && (
        <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="whitespace-pre-line text-sm leading-relaxed text-slate-800 sm:text-base dark:text-slate-200">
            {answer}
          </div>

          {sources.length > 0 && (
            <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t.results.sourcesTitle}
              </div>
              <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                {sources.map((src) => (
                  <li key={src.uri}>
                    <a
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-900 hover:underline dark:text-amber-400"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      <span className="max-w-[260px] truncate">{src.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      )}
    </div>
  );
}
