import {
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  ChevronRight,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  ShieldCheck,
  Sprout,
  Users,
  Volume2,
  VolumeX,
  Wrench,
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { Language, Scheme, SchemeCategory } from '../types/yojana';

interface SchemeCardProps {
  scheme: Scheme;
  language: Language;
  isSaved: boolean;
  isSpeaking: boolean;
  speechSupported: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
  onReadAloud: () => void;
}

const CATEGORY_ICONS: Record<SchemeCategory, typeof Sprout> = {
  Agriculture: Sprout,
  Education: GraduationCap,
  Health: HeartPulse,
  Housing: Home,
  Employment: Briefcase,
  'Women & Child': Users,
  Pension: Landmark,
  Business: Building2,
  Skill: Wrench,
  'Social Security': ShieldCheck,
};

export function MatchRing({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const strokeClass =
    clamped >= 80
      ? 'stroke-emerald-600 dark:stroke-emerald-400'
      : clamped >= 55
      ? 'stroke-blue-800 dark:stroke-amber-400'
      : 'stroke-amber-600 dark:stroke-amber-500';

  return (
    <div
      className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center"
      aria-label={`${clamped}% eligibility match`}
    >
      <svg className="h-14 w-14 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          strokeWidth="4"
          className="stroke-slate-200 dark:stroke-slate-800"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${strokeClass} transition-all duration-500`}
        />
      </svg>
      <span className="font-mono absolute text-xs font-bold text-slate-900 tabular-nums dark:text-slate-100">
        {clamped}%
      </span>
    </div>
  );
}

export function SchemeCard({
  scheme,
  language,
  isSaved,
  isSpeaking,
  speechSupported,
  onSelect,
  onToggleSave,
  onReadAloud,
}: SchemeCardProps) {
  const t = TRANSLATIONS[language];
  const Icon = CATEGORY_ICONS[scheme.category] ?? ShieldCheck;
  const levelLabel =
    scheme.level === 'Central' ? t.results.centralLabel : t.results.stateLabel;

  return (
    <article className="print-break-inside-avoid flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-150 hover:border-slate-300 hover:shadow-md sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div>
        {/* Header Row: Unboxed metadata kicker + Title + Match Ring */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <Icon
                className="h-3.5 w-3.5 shrink-0 text-blue-900 dark:text-amber-400"
                aria-hidden="true"
              />
              <span
                className={
                  scheme.level === 'Central'
                    ? 'font-semibold text-blue-900 dark:text-amber-400'
                    : 'font-semibold text-emerald-700 dark:text-emerald-400'
                }
              >
                {levelLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{t.categories[scheme.category]}</span>
            </div>

            <h3 className="font-display mt-2 text-lg font-bold leading-snug text-slate-950 dark:text-white">
              <button
                type="button"
                onClick={onSelect}
                className="text-left hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-blue-700 dark:hover:text-amber-400 cursor-pointer"
              >
                {scheme.name}
              </button>
            </h3>

            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
              {scheme.ministry_or_department}
            </p>
          </div>

          <MatchRing percent={scheme.eligibility_match_percent} />
        </div>

        {/* Benefit Highlight */}
        <div className="mt-4 border-y border-slate-100 py-3 dark:border-slate-800/90">
          <div className="text-sm font-bold text-emerald-800 dark:text-emerald-400">
            {scheme.benefit_amount}
          </div>
          <p className="mt-0.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {scheme.benefit_summary}
          </p>
        </div>

        {/* Why Eligible */}
        <div className="mt-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.results.whyQualify}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {scheme.why_eligible}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="no-print mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-blue-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-blue-700 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>{t.results.viewDetails}</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2">
          {speechSupported && (
            <button
              type="button"
              onClick={onReadAloud}
              aria-pressed={isSpeaking}
              className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isSpeaking
                  ? 'border-orange-300 bg-orange-50 text-orange-800 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.results.stopReading}</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.results.readAloud}</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onToggleSave}
            aria-pressed={isSaved}
            className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isSaved
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t.results.savedScheme}</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t.results.saveScheme}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
