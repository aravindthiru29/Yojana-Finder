import { useEffect } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  Phone,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { TRANSLATIONS } from '../i18n/translations';
import { DocChecklistMap } from '../services/schemeApi';
import { Language, Scheme } from '../types/yojana';
import { MatchRing } from './SchemeCard';

interface SchemeDetailDrawerProps {
  scheme: Scheme | null;
  language: Language;
  isSaved: boolean;
  isSpeaking: boolean;
  speechSupported: boolean;
  docChecklist: DocChecklistMap;
  onToggleDoc: (schemeName: string, docName: string) => void;
  onToggleSave: (scheme: Scheme) => void;
  onReadAloud: (scheme: Scheme) => void;
  onClose: () => void;
}

export function SchemeDetailDrawer({
  scheme,
  language,
  isSaved,
  isSpeaking,
  speechSupported,
  docChecklist,
  onToggleDoc,
  onToggleSave,
  onReadAloud,
  onClose,
}: SchemeDetailDrawerProps) {
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (!scheme) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [scheme, onClose]);

  const checkedDocsForScheme = scheme ? docChecklist[scheme.name] ?? {} : {};
  const readyCount = scheme
    ? scheme.documents_required.filter((d) => Boolean(checkedDocsForScheme[d])).length
    : 0;

  return (
    <AnimatePresence>
      {scheme && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-scheme-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
          />

          {/* Slide-over Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl dark:bg-slate-950"
          >
            {/* Sticky Drawer Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6 dark:border-slate-800">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-blue-900 dark:text-amber-400">
                    {scheme.level === 'Central'
                      ? t.results.centralLabel
                      : t.results.stateLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{t.categories[scheme.category]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.drawer.applyModes[scheme.apply_mode]}</span>
                </div>
                <h2
                  id="drawer-scheme-title"
                  className="font-display mt-1 text-xl font-bold leading-snug text-slate-950 dark:text-white"
                >
                  {scheme.name}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {t.drawer.ministry}: {scheme.ministry_or_department}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label={t.drawer.close}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-6">
              {/* Benefit + Match Row */}
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {t.drawer.benefitHighlight}
                  </div>
                  <div className="mt-1 text-lg font-bold text-emerald-800 dark:text-emerald-400">
                    {scheme.benefit_amount}
                  </div>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {scheme.benefit_summary}
                  </p>
                </div>
                <MatchRing percent={scheme.eligibility_match_percent} />
              </div>

              {/* Why Eligible */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.drawer.whyEligible}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {scheme.why_eligible}
                </p>
              </div>

              {/* Eligibility Criteria */}
              <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.drawer.eligibilityCriteria}
                </h3>
                <ul className="mt-2.5 space-y-2">
                  {scheme.eligibility_criteria.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tick-able Documents Required Checklist (saved in localStorage) */}
              <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.drawer.documentsChecklist}
                  </h3>
                  <span className="font-mono text-xs font-semibold text-blue-900 tabular-nums dark:text-amber-400">
                    {readyCount} / {scheme.documents_required.length} {t.drawer.documentsProgress}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {scheme.documents_required.map((doc) => {
                    const checked = Boolean(checkedDocsForScheme[doc]);
                    return (
                      <label
                        key={doc}
                        className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                          checked
                            ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 line-through dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200'
                            : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleDoc(scheme.name, doc)}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 dark:border-slate-600 dark:bg-slate-950"
                        />
                        <span>{doc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Numbered How To Apply Steps */}
              <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.drawer.howToApply}
                </h3>
                <ol className="mt-3 space-y-3">
                  {scheme.how_to_apply_steps.map((stepText, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <span className="font-mono inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white tabular-nums dark:bg-amber-500 dark:text-slate-950">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5 leading-relaxed text-slate-700 dark:text-slate-300">
                        {stepText}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Helpline & Deadline */}
              <div className="grid grid-cols-1 gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2 dark:border-slate-800">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t.drawer.helpline}</span>
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                    {scheme.helpline?.trim() ? scheme.helpline : '—'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t.drawer.deadline}</span>
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {scheme.last_date_or_deadline?.trim()
                      ? scheme.last_date_or_deadline
                      : t.drawer.ongoing}
                  </div>
                </div>
              </div>

              {/* Expert Tip */}
              {scheme.tip?.trim() && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                    <Lightbulb className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{t.drawer.tip}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-amber-950 dark:text-amber-100">
                    {scheme.tip}
                  </p>
                </div>
              )}
            </div>

            {/* Sticky Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                {speechSupported && (
                  <button
                    type="button"
                    onClick={() => onReadAloud(scheme)}
                    className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="h-4 w-4" aria-hidden="true" />
                        <span>{t.results.stopReading}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4" aria-hidden="true" />
                        <span>{t.results.readAloud}</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onToggleSave(scheme)}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                      <span>{t.results.savedScheme}</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      <span>{t.results.saveScheme}</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={scheme.official_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 whitespace-nowrap shrink-0"
              >
                <span>{t.drawer.applyOfficial}</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
