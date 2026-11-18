import { useState } from 'react';
import { ExternalLink, Loader2, MessageSquare, Send } from 'lucide-react';
import { CORE_DOCUMENTS } from '../data/indiaData';
import { TRANSLATIONS } from '../i18n/translations';
import { fetchFollowUpAnswer } from '../services/schemeApi';
import { ChatMessage, Language, Scheme, UserProfile } from '../types/yojana';

interface FollowUpChatProps {
  language: Language;
  profile: UserProfile | null;
  schemes: Scheme[];
  history: ChatMessage[];
  onHistoryChange: (next: ChatMessage[]) => void;
}

export function FollowUpChat({
  language,
  profile,
  schemes,
  history,
  onHistoryChange,
}: FollowUpChatProps) {
  const t = TRANSLATIONS[language];
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendQuestion = async (questionText: string, isDocumentGuide = false) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `${Date.now()}-u`,
      role: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };
    const nextHistory = [...history, userMsg];
    onHistoryChange(nextHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetchFollowUpAnswer({
        question: trimmed,
        profile,
        schemes,
        history: nextHistory,
        language,
        isDocumentGuide,
      });

      const assistantMsg: ChatMessage = {
        id: `${Date.now()}-a`,
        role: 'assistant',
        text: res.answer,
        sources: res.sources,
        timestamp: Date.now(),
      };
      onHistoryChange([...nextHistory, assistantMsg]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch answer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isDoc = /aadhaar|income|caste|ration|bank|certificate|card|ஆதார்|வருமான|சாதி|ரேஷன்|आधार|आय|जाति|राशन/i.test(
      input
    );
    void sendQuestion(input, isDoc);
  };

  return (
    <section className="no-print mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900 dark:bg-slate-800 dark:text-amber-400">
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
            {t.chat.title}
          </h2>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
            {t.chat.subtitle}
          </p>
        </div>
      </div>

      {/* Quick Prompts & Document Guide Chips */}
      <div className="mt-5 space-y-3">
        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.chat.quickPromptsTitle}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {t.chat.quickPrompts.map((q) => (
              <button
                key={q}
                type="button"
                disabled={isLoading}
                onClick={() => void sendQuestion(q, false)}
                className="min-h-[36px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-xs font-medium text-slate-800 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.chat.docChipsTitle}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {CORE_DOCUMENTS.map((docKey) => {
              const docInfo = t.docGuide.docs[docKey];
              return (
                <button
                  key={docKey}
                  type="button"
                  disabled={isLoading}
                  onClick={() => void sendQuestion(docInfo.prompt, true)}
                  className="min-h-[36px] rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-900 transition-colors hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/50 cursor-pointer"
                >
                  {docInfo.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conversation History */}
      {history.length > 0 && (
        <div className="mt-6 space-y-4 border-t border-slate-200 pt-5 dark:border-slate-800">
          {history.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'ml-auto max-w-2xl bg-blue-900 text-white dark:bg-amber-500 dark:text-slate-950'
                  : 'border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200 pt-2.5 text-xs dark:border-slate-800">
                  {msg.sources.slice(0, 4).map((src) => (
                    <a
                      key={src.uri}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-blue-800 hover:underline dark:text-amber-400"
                    >
                      <span className="max-w-[220px] truncate">{src.title}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>{t.chat.thinking}</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-200"
        >
          {error}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chat.placeholder}
          aria-label={t.chat.title}
          className="min-h-[46px] flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-400"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          <span>{t.chat.send}</span>
        </button>
      </form>
    </section>
  );
}
