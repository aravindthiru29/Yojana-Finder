import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { Language } from '../types/yojana';

interface LoadingResultsProps {
  language: Language;
}

export function LoadingResults({ language }: LoadingResultsProps) {
  const t = TRANSLATIONS[language];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % t.loading.messages.length);
    }, 2600);
    return () => clearInterval(id);
  }, [t.loading.messages.length]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <Loader2
            className="h-6 w-6 animate-spin text-blue-900 dark:text-amber-400"
            aria-hidden="true"
          />
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
              {t.loading.title}
            </h2>
            <p
              aria-live="polite"
              className="mt-1 text-sm text-slate-600 dark:text-slate-300"
            >
              {t.loading.messages[msgIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Skeleton cards matching final grid geometry */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2.5 flex-1">
                <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3.5 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            </div>
            <div className="mt-5 h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-800/70" />
            <div className="mt-4 space-y-2">
              <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="h-9 w-36 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-9 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
