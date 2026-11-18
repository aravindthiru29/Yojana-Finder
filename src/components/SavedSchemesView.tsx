import { Bookmark, ChevronRight, Trash2, Volume2, VolumeX } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { DocChecklistMap } from '../services/schemeApi';
import { Language, Scheme } from '../types/yojana';
import { MatchRing } from './SchemeCard';

interface SavedSchemesViewProps {
  language: Language;
  savedSchemes: Scheme[];
  docChecklist: DocChecklistMap;
  speakingId: string | null;
  speechSupported: boolean;
  onSelectScheme: (scheme: Scheme) => void;
  onRemoveScheme: (scheme: Scheme) => void;
  onReadAloud: (scheme: Scheme) => void;
  onGoFind: () => void;
}

export function SavedSchemesView({
  language,
  savedSchemes,
  docChecklist,
  speakingId,
  speechSupported,
  onSelectScheme,
  onRemoveScheme,
  onReadAloud,
  onGoFind,
}: SavedSchemesViewProps) {
  const t = TRANSLATIONS[language];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
          {t.saved.title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
          {t.saved.subtitle}
        </p>
      </div>

      {savedSchemes.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <Bookmark
            className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
          <h2 className="font-display mt-3 text-lg font-bold text-slate-900 dark:text-white">
            {t.saved.emptyTitle}
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600 dark:text-slate-300">
            {t.saved.emptyBody}
          </p>
          <button
            type="button"
            onClick={onGoFind}
            className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 cursor-pointer"
          >
            {t.saved.findCta}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {savedSchemes.map((scheme) => {
            const checkedMap = docChecklist[scheme.name] ?? {};
            const readyCount = scheme.documents_required.filter((d) =>
              Boolean(checkedMap[d])
            ).length;
            const isSpeaking = speakingId === scheme.name;

            return (
              <article
                key={scheme.name}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-blue-900 dark:text-amber-400">
                          {scheme.level === 'Central'
                            ? t.results.centralLabel
                            : t.results.stateLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{t.categories[scheme.category]}</span>
                      </div>
                      <h2 className="font-display mt-1.5 text-lg font-bold text-slate-950 dark:text-white">
                        {scheme.name}
                      </h2>
                      <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                        {scheme.ministry_or_department}
                      </p>
                    </div>
                    <MatchRing percent={scheme.eligibility_match_percent} />
                  </div>

                  <div className="mt-4 text-sm font-bold text-emerald-800 dark:text-emerald-400">
                    {scheme.benefit_amount}
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {scheme.benefit_summary}
                  </p>

                  <div className="mt-4 font-mono text-xs font-semibold text-slate-700 tabular-nums dark:text-slate-300">
                    {readyCount} / {scheme.documents_required.length} {t.saved.docsReady}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onSelectScheme(scheme)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-blue-900 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>{t.results.viewDetails}</span>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  <div className="flex items-center gap-2">
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={() => onReadAloud(scheme)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
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
                      onClick={() => onRemoveScheme(scheme)}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 dark:border-red-900/50 dark:bg-slate-950 dark:text-red-400 dark:hover:bg-red-950/40 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t.saved.remove}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
