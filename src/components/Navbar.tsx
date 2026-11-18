import { useState } from 'react';
import { Bookmark, FileCheck2, Menu, Moon, Sun, X } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { Language } from '../types/yojana';

export type AppView = 'landing' | 'wizard' | 'results' | 'saved' | 'documents';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  savedCount: number;
  hasResults: boolean;
}

const LANGUAGES: Array<{ code: Language; label: string; aria: string }> = [
  { code: 'en', label: 'EN', aria: 'English' },
  { code: 'ta', label: 'தமிழ்', aria: 'Tamil' },
  { code: 'hi', label: 'हिन्दी', aria: 'Hindi' },
];

export function Navbar({
  currentView,
  onNavigate,
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  savedCount,
  hasResults,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  const navItems: Array<{ id: AppView; label: string }> = [
    { id: 'landing', label: t.nav.home },
    { id: hasResults ? 'results' : 'wizard', label: t.nav.findSchemes },
    { id: 'saved', label: `${t.nav.saved}${savedCount > 0 ? ` (${savedCount})` : ''}` },
    { id: 'documents', label: t.nav.docGuide },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="h-[3px] w-full tricolor-bar" aria-hidden="true" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3 lg:gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <button
          type="button"
          onClick={() => handleNav('landing')}
          className="font-display text-base font-extrabold tracking-tight text-slate-900 transition-colors hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 sm:text-lg dark:text-white dark:hover:text-amber-400 whitespace-nowrap shrink-0 cursor-pointer"
        >
          {t.brand}
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive =
              currentView === item.id ||
              (item.id === 'wizard' && currentView === 'results') ||
              (item.id === 'results' && currentView === 'wizard');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${
                  isActive
                    ? 'text-blue-900 dark:text-amber-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-blue-900 dark:bg-amber-400"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language & Theme controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div
            role="group"
            aria-label="Language selector"
            className="flex items-center rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 dark:border-slate-800 dark:bg-slate-900"
          >
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => onLanguageChange(item.code)}
                aria-label={item.aria}
                aria-pressed={language === item.code}
                className={`min-h-[32px] rounded-md px-2 py-1 text-[11px] font-semibold transition-colors sm:min-h-[34px] sm:px-2.5 sm:text-xs whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700 ${
                  language === item.code
                    ? 'bg-white text-blue-950 shadow-xs dark:bg-slate-800 dark:text-amber-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t.theme.toLight : t.theme.toDark}
            title={theme === 'dark' ? t.theme.toLight : t.theme.toDark}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer shrink-0"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 md:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 cursor-pointer shrink-0"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className="flex min-h-[44px] items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900 cursor-pointer"
              >
                <span>{item.label}</span>
                {item.id === 'saved' && <Bookmark className="h-4 w-4 text-slate-400" />}
                {item.id === 'documents' && <FileCheck2 className="h-4 w-4 text-slate-400" />}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
