import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Mic,
  MicOff,
  RotateCcw,
  Search,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  EDUCATION_LEVELS,
  INCOME_RANGES,
  INDIA_STATES_AND_UTS,
  OCCUPATIONS,
  SOCIAL_CATEGORIES,
} from '../data/indiaData';
import { useSpeechRecognition } from '../hooks/useSpeech';
import { TRANSLATIONS } from '../i18n/translations';
import { Language, SpecialStatus, UserProfile } from '../types/yojana';

interface ProfileWizardProps {
  language: Language;
  initialProfile: UserProfile | null;
  onSubmit: (profile: UserProfile) => void;
  onResetAll: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  age: 30,
  gender: 'Female',
  state: 'Tamil Nadu',
  areaType: 'Rural',
  occupation: 'farmer',
  annualIncome: '1_to_2_5_lakh',
  category: 'OBC',
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

export function ProfileWizard({
  language,
  initialProfile,
  onSubmit,
  onResetAll,
}: ProfileWizardProps) {
  const t = TRANSLATIONS[language];
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(initialProfile ?? DEFAULT_PROFILE);
  const [ageInput, setAgeInput] = useState<string>(
    String(initialProfile?.age ?? DEFAULT_PROFILE.age)
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { isListening, isSupported: voiceSupported, startListening, stopListening } =
    useSpeechRecognition(language, (transcript) => {
      setProfile((prev) => ({
        ...prev,
        situationDescription: prev.situationDescription
          ? `${prev.situationDescription.trim()} ${transcript}`
          : transcript,
      }));
    });

  const progressPercent = ((step + 1) / 4) * 100;

  const validateStep = (targetStep: number): boolean => {
    setErrorMsg(null);
    if (targetStep === 0) {
      const parsedAge = Number(ageInput);
      if (
        !ageInput.trim() ||
        Number.isNaN(parsedAge) ||
        parsedAge < 0 ||
        parsedAge > 120
      ) {
        setErrorMsg(t.wizard.validationAge);
        return false;
      }
      if (!profile.state) {
        setErrorMsg(t.wizard.validationState);
        return false;
      }
      setProfile((prev) => ({ ...prev, age: Math.round(parsedAge) }));
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(0)) {
      setStep(0);
      return;
    }
    if (isListening) stopListening();
    const finalProfile: UserProfile = {
      ...profile,
      age: Math.round(Number(ageInput)),
    };
    onSubmit(finalProfile);
  };

  const handleReset = () => {
    if (isListening) stopListening();
    setProfile(DEFAULT_PROFILE);
    setAgeInput(String(DEFAULT_PROFILE.age));
    setStep(0);
    setErrorMsg(null);
    onResetAll();
  };

  const toggleSpecial = (key: keyof SpecialStatus) => {
    setProfile((prev) => ({
      ...prev,
      specialStatus: {
        ...prev.specialStatus,
        [key]: !prev.specialStatus[key],
      },
    }));
  };

  const selectedStateObj = INDIA_STATES_AND_UTS.find((s) => s.value === profile.state);
  const selectedStateLabel = selectedStateObj
    ? selectedStateObj[language]
    : profile.state;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
            {t.wizard.title}
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
            {t.wizard.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t.wizard.resetForm}</span>
        </button>
      </div>

      {/* Progress Bar & Step Indicators */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="tabular-nums">
            {t.wizard.stepOf} {step + 1} / 4 — {t.wizard.steps[step]}
          </span>
          <span className="font-mono tabular-nums">{Math.round(progressPercent)}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-blue-900 dark:bg-amber-500"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {t.wizard.steps.map((label, idx) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (idx < step || validateStep(step)) {
                  setStep(idx);
                }
              }}
              className={`min-h-[36px] rounded-lg px-2 py-1 text-left text-xs font-medium transition-colors truncate cursor-pointer ${
                idx === step
                  ? 'bg-blue-50 text-blue-900 dark:bg-slate-800 dark:text-amber-300'
                  : idx < step
                  ? 'text-emerald-700 hover:bg-slate-100 dark:text-emerald-400 dark:hover:bg-slate-900'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900'
              }`}
            >
              {idx + 1}. {label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900"
      >
        {errorMsg && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-200"
          >
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Personal & Location */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="wizard-age"
                  className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
                >
                  {t.wizard.ageLabel}
                </label>
                <input
                  id="wizard-age"
                  type="number"
                  min={0}
                  max={120}
                  inputMode="numeric"
                  value={ageInput}
                  onChange={(e) => setAgeInput(e.target.value)}
                  placeholder={t.wizard.agePlaceholder}
                  className="mt-2 block min-h-[46px] w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 tabular-nums focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t.wizard.genderLabel}
                </span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(['Female', 'Male', 'Other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setProfile((p) => ({ ...p, gender: g }))}
                      aria-pressed={profile.gender === g}
                      className={`min-h-[46px] rounded-xl border px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                        profile.gender === g
                          ? 'border-blue-900 bg-blue-900 text-white dark:border-amber-500 dark:bg-amber-500 dark:text-slate-950'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {t.wizard.genders[g]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="wizard-state"
                className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                {t.wizard.stateLabel}
              </label>
              <select
                id="wizard-state"
                value={profile.state}
                onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value }))}
                className="mt-2 block min-h-[46px] w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-400"
                required
              >
                <option value="" disabled>
                  {t.wizard.statePlaceholder}
                </option>
                {INDIA_STATES_AND_UTS.map((st) => (
                  <option key={st.value} value={st.value}>
                    {language === 'en' ? st.en : `${st[language]} (${st.en})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.wizard.areaLabel}
              </span>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(['Rural', 'Urban'] as const).map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, areaType: area }))}
                    aria-pressed={profile.areaType === area}
                    className={`flex min-h-[48px] items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${
                      profile.areaType === area
                        ? 'border-blue-900 bg-blue-50 text-blue-950 dark:border-amber-400 dark:bg-amber-500/15 dark:text-amber-300'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{t.wizard.areas[area]}</span>
                    {profile.areaType === area && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Occupation, Income & Education */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.wizard.occupationLabel}
              </span>
              <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {OCCUPATIONS.map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, occupation: occ }))}
                    aria-pressed={profile.occupation === occ}
                    className={`flex min-h-[46px] items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                      profile.occupation === occ
                        ? 'border-blue-900 bg-blue-900 text-white dark:border-amber-500 dark:bg-amber-500 dark:text-slate-950'
                        : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{t.wizard.occupations[occ]}</span>
                    {profile.occupation === occ && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="wizard-income"
                  className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
                >
                  {t.wizard.incomeLabel}
                </label>
                <select
                  id="wizard-income"
                  value={profile.annualIncome}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, annualIncome: e.target.value }))
                  }
                  className="mt-2 block min-h-[46px] w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-400"
                >
                  {INCOME_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {t.wizard.incomeRanges[range]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="wizard-education"
                  className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
                >
                  {t.wizard.educationLabel}
                </label>
                <select
                  id="wizard-education"
                  value={profile.education}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, education: e.target.value }))
                  }
                  className="mt-2 block min-h-[46px] w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-400"
                >
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {t.wizard.educationLevels[lvl]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Category & Special Status */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.wizard.categoryLabel}
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {SOCIAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, category: cat }))}
                    aria-pressed={profile.category === cat}
                    className={`min-h-[46px] rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                      profile.category === cat
                        ? 'border-blue-900 bg-blue-900 text-white dark:border-amber-500 dark:bg-amber-500 dark:text-slate-950'
                        : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t.wizard.categories[cat]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.wizard.specialStatusLabel}
              </span>
              <div className="mt-2 space-y-2.5">
                {(
                  Object.keys(t.wizard.specialStatuses) as Array<keyof SpecialStatus>
                ).map((key) => {
                  const checked = profile.specialStatus[key];
                  return (
                    <label
                      key={key}
                      className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                        checked
                          ? 'border-blue-900 bg-blue-50/70 dark:border-amber-400 dark:bg-amber-500/10'
                          : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSpecial(key)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-900 focus:ring-blue-700 dark:border-slate-600 dark:bg-slate-900 dark:text-amber-500"
                      />
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {t.wizard.specialStatuses[key]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Free-Text Situation with Voice Input & Summary Review */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="wizard-situation"
                  className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
                >
                  {t.wizard.situationLabel}
                </label>

                {voiceSupported ? (
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className={`inline-flex min-h-[38px] items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isListening
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t.wizard.voiceStop}</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t.wizard.voiceStart}</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {t.wizard.voiceUnsupported}
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t.wizard.situationHint}
              </p>

              {isListening && (
                <p
                  aria-live="polite"
                  className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400"
                >
                  {t.wizard.voiceListening}
                </p>
              )}

              <textarea
                id="wizard-situation"
                rows={4}
                value={profile.situationDescription ?? ''}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, situationDescription: e.target.value }))
                }
                placeholder={t.wizard.situationPlaceholder}
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-relaxed text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-amber-400"
              />
            </div>

            {/* Clean Profile Review Summary */}
            <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t.wizard.reviewTitle}
              </h2>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    {t.wizard.ageLabel}
                  </dt>
                  <dd className="font-medium text-slate-900 tabular-nums dark:text-slate-100">
                    {ageInput} · {t.wizard.genders[profile.gender]}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    {t.wizard.stateLabel}
                  </dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">
                    {selectedStateLabel} ({t.wizard.areas[profile.areaType].split(' ')[0]})
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    {t.wizard.occupationLabel}
                  </dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">
                    {t.wizard.occupations[profile.occupation] ?? profile.occupation}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    {t.wizard.incomeLabel}
                  </dt>
                  <dd className="font-medium text-slate-900 tabular-nums dark:text-slate-100">
                    {t.wizard.incomeRanges[profile.annualIncome] ?? profile.annualIncome}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    {t.wizard.categoryLabel}
                  </dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">
                    {t.wizard.categories[profile.category]}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    {t.wizard.educationLabel}
                  </dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">
                    {t.wizard.educationLevels[profile.education] ?? profile.education}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-200 pt-5 dark:border-slate-800">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>{t.wizard.back}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-blue-700 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{t.wizard.next}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>{t.wizard.submit}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
