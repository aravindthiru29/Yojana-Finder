import { useCallback, useEffect, useState } from 'react';
import { DocumentGuideView } from './components/DocumentGuideView';
import { LandingPage } from './components/LandingPage';
import { LoadingResults } from './components/LoadingResults';
import { AppView, Navbar } from './components/Navbar';
import { ProfileWizard } from './components/ProfileWizard';
import { ResultsView } from './components/ResultsView';
import { SavedSchemesView } from './components/SavedSchemesView';
import { SchemeDetailDrawer } from './components/SchemeDetailDrawer';
import { useSpeechSynthesis } from './hooks/useSpeech';
import { TRANSLATIONS } from './i18n/translations';
import {
  DocChecklistMap,
  clearLastProfile,
  fetchMatchingSchemes,
  getProfileSignature,
  loadCachedResultsForSignature,
  loadDocChecklist,
  loadLanguage,
  loadLastProfile,
  loadLastResults,
  loadSavedSchemes,
  loadTheme,
  saveCachedResultsForSignature,
  saveDocChecklist,
  saveLanguage,
  saveLastProfile,
  saveLastResults,
  saveSavedSchemes,
  saveTheme,
} from './services/schemeApi';
import {
  ChatMessage,
  Language,
  Scheme,
  SchemesPayload,
  UserProfile,
} from './types/yojana';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => loadLanguage());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());
  const [view, setView] = useState<AppView>('landing');

  const [profile, setProfile] = useState<UserProfile | null>(() => loadLastProfile());
  const [results, setResults] = useState<SchemesPayload | null>(() => loadLastResults());
  const [resultsLanguage, setResultsLanguage] = useState<Language>(() => loadLanguage());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [savedSchemes, setSavedSchemes] = useState<Scheme[]>(() => loadSavedSchemes());
  const [docChecklist, setDocChecklist] = useState<DocChecklistMap>(() =>
    loadDocChecklist()
  );
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const { speakingId, speak, stop: stopSpeaking, isSupported: speechSupported } =
    useSpeechSynthesis(language);

  const t = TRANSLATIONS[language];

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  // Sync lang attribute on <html>
  useEffect(() => {
    document.documentElement.lang = language;
    saveLanguage(language);
  }, [language]);

  const runSearch = useCallback(
    async (targetProfile: UserProfile, targetLang: Language, forceRefresh = false) => {
      setProfile(targetProfile);
      saveLastProfile(targetProfile);
      setView('results');
      setError(null);
      stopSpeaking();

      const signature = getProfileSignature(targetProfile, targetLang);
      if (!forceRefresh) {
        const cached = loadCachedResultsForSignature(signature);
        if (cached) {
          setResults(cached);
          setResultsLanguage(targetLang);
          saveLastResults(cached);
          return;
        }
      }

      setIsLoading(true);

      try {
        const data = await fetchMatchingSchemes(targetProfile, targetLang);
        setResults(data);
        setResultsLanguage(targetLang);
        saveLastResults(data);
        saveCachedResultsForSignature(signature, data);
        setChatHistory([]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unable to fetch schemes.');
      } finally {
        setIsLoading(false);
      }
    },
    [stopSpeaking]
  );

  const handleLanguageChange = (nextLang: Language) => {
    setLanguage(nextLang);
    stopSpeaking();
    if (view === 'results' && profile && !isLoading && resultsLanguage !== nextLang) {
      void runSearch(profile, nextLang);
    }
  };

  const handleToggleSave = (scheme: Scheme) => {
    setSavedSchemes((prev) => {
      const exists = prev.some((s) => s.name === scheme.name);
      const next = exists
        ? prev.filter((s) => s.name !== scheme.name)
        : [scheme, ...prev];
      saveSavedSchemes(next);
      return next;
    });
  };

  const handleToggleDoc = (schemeName: string, docName: string) => {
    setDocChecklist((prev) => {
      const currentForScheme = prev[schemeName] ?? {};
      const next: DocChecklistMap = {
        ...prev,
        [schemeName]: {
          ...currentForScheme,
          [docName]: !currentForScheme[docName],
        },
      };
      saveDocChecklist(next);
      return next;
    });
  };

  const handleReadAloud = (scheme: Scheme) => {
    const speechText = `${scheme.name}. ${scheme.benefit_amount}. ${scheme.benefit_summary}. ${scheme.why_eligible}`;
    speak(scheme.name, speechText);
  };

  const handleStartOver = () => {
    stopSpeaking();
    clearLastProfile();
    setProfile(null);
    setResults(null);
    setChatHistory([]);
    setError(null);
    setView('wizard');
  };

  const handleResumeProfile = () => {
    if (results && resultsLanguage === language) {
      setView('results');
    } else if (profile) {
      setView('wizard');
    } else {
      setView('wizard');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar
        currentView={view}
        onNavigate={(nextView) => {
          stopSpeaking();
          setView(nextView);
        }}
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        savedCount={savedSchemes.length}
        hasResults={Boolean(results)}
      />

      <main className="flex-1">
        {view === 'landing' && (
          <LandingPage
            language={language}
            hasSavedProfile={Boolean(profile)}
            onStartFinder={() => setView('wizard')}
            onResumeProfile={handleResumeProfile}
          />
        )}

        {view === 'wizard' && (
          <ProfileWizard
            language={language}
            initialProfile={profile}
            onSubmit={(submittedProfile) => void runSearch(submittedProfile, language)}
            onResetAll={() => {
              clearLastProfile();
              setProfile(null);
              setResults(null);
              setChatHistory([]);
            }}
          />
        )}

        {view === 'results' &&
          (isLoading ? (
            <LoadingResults language={language} />
          ) : (
            <ResultsView
              language={language}
              profile={profile}
              results={results}
              error={error}
              savedSchemes={savedSchemes}
              speakingId={speakingId}
              speechSupported={speechSupported}
              chatHistory={chatHistory}
              onChatHistoryChange={setChatHistory}
              onSelectScheme={(s) => setSelectedScheme(s)}
              onToggleSave={handleToggleSave}
              onReadAloud={handleReadAloud}
              onEditProfile={() => setView('wizard')}
              onStartOver={handleStartOver}
              onRetry={() => {
                if (profile) void runSearch(profile, language, true);
              }}
            />
          ))}

        {view === 'saved' && (
          <SavedSchemesView
            language={language}
            savedSchemes={savedSchemes}
            docChecklist={docChecklist}
            speakingId={speakingId}
            speechSupported={speechSupported}
            onSelectScheme={(s) => setSelectedScheme(s)}
            onRemoveScheme={handleToggleSave}
            onReadAloud={handleReadAloud}
            onGoFind={() => setView('wizard')}
          />
        )}

        {view === 'documents' && (
          <DocumentGuideView language={language} profile={profile} />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6 dark:text-slate-400">
          <p className="max-w-2xl leading-relaxed">{t.footer.disclaimer}</p>
          <p className="font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap shrink-0">
            {t.footer.copyright}
          </p>
        </div>
      </footer>

      <SchemeDetailDrawer
        scheme={selectedScheme}
        language={language}
        isSaved={
          selectedScheme
            ? savedSchemes.some((s) => s.name === selectedScheme.name)
            : false
        }
        isSpeaking={selectedScheme ? speakingId === selectedScheme.name : false}
        speechSupported={speechSupported}
        docChecklist={docChecklist}
        onToggleDoc={handleToggleDoc}
        onToggleSave={handleToggleSave}
        onReadAloud={handleReadAloud}
        onClose={() => setSelectedScheme(null)}
      />
    </div>
  );
}
