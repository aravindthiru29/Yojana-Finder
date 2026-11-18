import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  ShieldCheck,
  Sprout,
  Users,
  Wrench,
} from 'lucide-react';
import { motion } from 'motion/react';
import { TRANSLATIONS } from '../i18n/translations';
import { Language, SCHEME_CATEGORIES, SchemeCategory } from '../types/yojana';

interface LandingPageProps {
  language: Language;
  hasSavedProfile: boolean;
  onStartFinder: () => void;
  onResumeProfile: () => void;
}

const CATEGORY_ICON_MAP: Record<SchemeCategory, typeof Sprout> = {
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

export function LandingPage({
  language,
  hasSavedProfile,
  onStartFinder,
  onResumeProfile,
}: LandingPageProps) {
  const t = TRANSLATIONS[language];
  const [imgError, setImgError] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-14">
      {/* Hero Section */}
      <section className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center lg:col-span-7"
        >
          <p className="text-xs font-semibold tracking-wide text-orange-700 dark:text-amber-400">
            {t.landing.eyebrow}
          </p>
          <h1 className="font-display mt-3 text-[clamp(2.1rem,4vw,3.4rem)] font-extrabold leading-[1.12] tracking-tight text-slate-950 text-balance dark:text-white">
            {t.landing.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            {t.landing.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onStartFinder}
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-blue-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:scale-[0.99] dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{t.landing.ctaPrimary}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            {hasSavedProfile && (
              <button
                type="button"
                onClick={onResumeProfile}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
              >
                {t.landing.ctaResume}
              </button>
            )}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {t.landing.trustNote}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <div className="relative h-full min-h-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {!imgError ? (
              <img
                src="/src/assets/images/hero_yojana_citizens_1794976774194.jpg"
                alt="Indian citizens—student, farmer, and shopkeeper—in a sunlit civic courtyard"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover object-center lg:h-full"
              />
            ) : (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-emerald-50 p-8 text-center dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
                <Landmark className="h-12 w-12 text-blue-900 dark:text-amber-400" />
                <p className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-white">
                  {t.brand}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Metrics Strip */}
      <section className="mt-10 grid grid-cols-1 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-xs sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
        {t.landing.stats.map((stat) => (
          <div key={stat.label} className="px-6 py-5">
            <div className="font-mono text-2xl font-bold text-blue-900 tabular-nums dark:text-amber-400">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* 3-Step How It Works */}
      <section className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-800">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
            {t.landing.howItWorksTitle}
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            {t.landing.howItWorksSubtitle}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {t.landing.steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div className="font-mono text-sm font-semibold text-orange-700 tabular-nums dark:text-amber-400">
                {step.number}.
              </div>
              <h3 className="font-display mt-2 text-lg font-bold text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors Covered */}
      <section className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-800">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              {t.landing.coverageTitle}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
              {t.landing.coverageSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onStartFinder}
            className="inline-flex min-h-[40px] items-center gap-2 text-sm font-semibold text-blue-900 hover:underline dark:text-amber-400 cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>{t.landing.ctaPrimary}</span>
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {SCHEME_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICON_MAP[category];
            return (
              <div
                key={category}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400"
                  aria-hidden="true"
                />
                <span className="truncate">{t.categories[category]}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
