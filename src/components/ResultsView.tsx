import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  Printer,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import {
  ChatMessage,
  Language,
  SCHEME_CATEGORIES,
  Scheme,
  SchemeCategory,
  SchemesPayload,
  UserProfile,
} from '../types/yojana';
import { FollowUpChat } from './FollowUpChat';
import { SchemeCard } from './SchemeCard';

interface ResultsViewProps {
  language: Language;
  profile: UserProfile | null;
  results: SchemesPayload | null;
  error: string | null;
  savedSchemes: Scheme[];
  speakingId: string | null;
  speechSupported: boolean;
  chatHistory: ChatMessage[];
  onChatHistoryChange: (next: ChatMessage[]) => void;
  onSelectScheme: (scheme: Scheme) => void;
  onToggleSave: (scheme: Scheme) => void;
  onReadAloud: (scheme: Scheme) => void;
  onEditProfile: () => void;
  onStartOver: () => void;
  onRetry: () => void;
}

function parseNumericBenefit(amountText: string): number {
  const cleaned = amountText.replace(/,/g, '');
  const matches = cleaned.match(/\d+(\.\d+)?/g);
  if (!matches || matches.length === 0) return 0;
  const nums = matches.map((m) => Number(m)).filter((n) => !Number.isNaN(n));
  if (nums.length === 0) return 0;
  let maxVal = Math.max(...nums);
  if (/lakh/i.test(amountText)) maxVal *= 100000;
  else if (/crore/i.test(amountText)) maxVal *= 10000000;
  return maxVal;
}

export function ResultsView({
  language,
  profile,
  results,
  error,
  savedSchemes,
  speakingId,
  speechSupported,
  chatHistory,
  onChatHistoryChange,
  onSelectScheme,
  onToggleSave,
  onReadAloud,
  onEditProfile,
  onStartOver,
  onRetry,
}: ResultsViewProps) {
  const t = TRANSLATIONS[language];
  const [levelFilter, setLevelFilter] = useState<'All' | 'Central' | 'State'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | SchemeCategory>('All');
  const [sortBy, setSortBy] = useState<'match' | 'benefit'>('match');
  const [copied, setCopied] = useState(false);

  const targetCount = results?.schemes.length ?? 0;
  const [displayCount, setDisplayCount] = useState(0);

  // Smooth animated counter for "You may be eligible for N schemes"
  useEffect(() => {
    if (targetCount === 0) {
      setDisplayCount(0);
      return;
    }
    let current = 0;
    const stepTime = Math.max(25, Math.floor(450 / targetCount));
    const timer = setInterval(() => {
      current += 1;
      setDisplayCount(current);
      if (current >= targetCount) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [targetCount]);

  const savedNames = useMemo(
    () => new Set(savedSchemes.map((s) => s.name)),
    [savedSchemes]
  );

  const availableCategories = useMemo(() => {
    if (!results) return [];
    const present = new Set(results.schemes.map((s) => s.category));
    return SCHEME_CATEGORIES.filter((cat) => present.has(cat));
  }, [results]);

  const filteredSchemes = useMemo(() => {
    if (!results) return [];
    const list = results.schemes.filter((s) => {
      if (levelFilter !== 'All' && s.level !== levelFilter) return false;
      if (categoryFilter !== 'All' && s.category !== categoryFilter) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'benefit') {
        return (
          parseNumericBenefit(b.benefit_amount) -
          parseNumericBenefit(a.benefit_amount)
        );
      }
      return b.eligibility_match_percent - a.eligibility_match_percent;
    });
  }, [results, levelFilter, categoryFilter, sortBy]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-center shadow-xs sm:p-8 dark:border-red-900/50 dark:bg-slate-900">
          <AlertTriangle
            className="mx-auto h-10 w-10 text-red-600 dark:text-red-400"
            aria-hidden="true"
          />
          <h2 className="font-display mt-3 text-xl font-bold text-slate-950 dark:text-white">
            {t.results.errorTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {error}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="min-h-[44px] rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 dark:bg-amber-500 dark:text-slate-950 cursor-pointer"
            >
              {t.results.retry}
            </button>
            <button
              type="button"
              onClick={onEditProfile}
              className="min-h-[44px] rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 cursor-pointer"
            >
              {t.results.editProfile}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!results || results.schemes.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            {t.results.emptyTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {t.results.emptyBody}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={onEditProfile}
              className="min-h-[44px] rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 dark:bg-amber-500 dark:text-slate-950 cursor-pointer"
            >
              {t.results.editProfile}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const shareMessage = `${t.brand} (${profile?.state ?? 'India'}): ${
    results.schemes.length
  } ${t.results.eligibleSuffix}\n\n${results.schemes
    .slice(0, 6)
    .map((s, idx) => `${idx + 1}. ${s.name} — ${s.benefit_amount} (${s.official_link})`)
    .join('\n')}\n\n${window.location.href}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback ignored if clipboard unavailable
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Summary Banner */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                {t.results.eligiblePrefix}{' '}
                <span className="font-mono text-3xl text-emerald-700 tabular-nums sm:text-4xl dark:text-emerald-400">
                  {displayCount}
                </span>{' '}
                {t.results.eligibleSuffix}
              </h1>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base dark:text-slate-300">
              {results.overall_summary}
            </p>

            {results.estimated_total_annual_benefit_if_known && (
              <div className="mt-4 inline-flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  {t.results.estimatedBenefit}:
                </span>
                <span className="font-bold text-blue-900 dark:text-amber-400">
                  {results.estimated_total_annual_benefit_if_known}
                </span>
              </div>
            )}
          </div>

          {/* Profile & Export Actions */}
          <div className="no-print flex flex-wrap items-center gap-2 lg:justify-end">
            <button
              type="button"
              onClick={onEditProfile}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.results.editProfile}</span>
            </button>

            <button
              type="button"
              onClick={onStartOver}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.results.startOver}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.results.printPdf}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-600 whitespace-nowrap shrink-0"
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.results.shareWhatsapp}</span>
            </a>

            <button
              type="button"
              onClick={() => void handleCopy()}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>{t.results.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.results.copySummary}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Filters & Sort Toolbar */}
      <section className="no-print mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Central / State Segmented Control */}
          <div
            role="group"
            aria-label="Filter by government level"
            className="inline-flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-950"
          >
            {(['All', 'Central', 'State'] as const).map((lvl) => {
              const label =
                lvl === 'All'
                  ? t.results.allLevels
                  : lvl === 'Central'
                  ? t.results.centralLabel
                  : t.results.stateLabel;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl)}
                  aria-pressed={levelFilter === lvl}
                  className={`min-h-[36px] rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    levelFilter === lvl
                      ? 'bg-white text-blue-950 shadow-xs dark:bg-slate-800 dark:text-amber-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Sort Select */}
          <div>
            <select
              aria-label="Sort schemes"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'match' | 'benefit')}
              className="min-h-[38px] rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-blue-700 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="match">{t.results.sortMatch}</option>
              <option value="benefit">{t.results.sortBenefit}</option>
            </select>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setCategoryFilter('All')}
            aria-pressed={categoryFilter === 'All'}
            className={`min-h-[34px] rounded-lg px-3 py-1 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              categoryFilter === 'All'
                ? 'bg-blue-900 text-white dark:bg-amber-500 dark:text-slate-950'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {t.results.allCategories}
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              aria-pressed={categoryFilter === cat}
              className={`min-h-[34px] rounded-lg px-3 py-1 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                categoryFilter === cat
                  ? 'bg-blue-900 text-white dark:bg-amber-500 dark:text-slate-950'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {t.categories[cat]}
            </button>
          ))}
        </div>
      </section>

      {/* Schemes Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t.results.noMatchesFilter}
          </p>
          <button
            type="button"
            onClick={() => {
              setLevelFilter('All');
              setCategoryFilter('All');
            }}
            className="mt-4 min-h-[40px] rounded-xl bg-blue-900 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-amber-500 dark:text-slate-950 cursor-pointer"
          >
            {t.results.resetFilters}
          </button>
        </div>
      ) : (
        <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.name}
              scheme={scheme}
              language={language}
              isSaved={savedNames.has(scheme.name)}
              isSpeaking={speakingId === scheme.name}
              speechSupported={speechSupported}
              onSelect={() => onSelectScheme(scheme)}
              onToggleSave={() => onToggleSave(scheme)}
              onReadAloud={() => onReadAloud(scheme)}
            />
          ))}
        </section>
      )}

      {/* Grounding Sources Section */}
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
          {t.results.sourcesTitle}
        </h2>
        {results.sources && results.sources.length > 0 ? (
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {results.sources.map((src) => (
              <li key={src.uri}>
                <a
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-blue-900 hover:underline dark:text-amber-400"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{src.title || src.uri}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {t.results.sourcesEmpty}
          </p>
        )}
      </section>

      {/* Ask a follow-up Chat Box */}
      <FollowUpChat
        language={language}
        profile={profile}
        schemes={results.schemes}
        history={chatHistory}
        onHistoryChange={onChatHistoryChange}
      />
    </div>
  );
}
