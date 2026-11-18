import { useCallback, useEffect, useRef, useState } from 'react';
import { Language } from '../types/yojana';

function getLocaleCode(lang: Language): string {
  switch (lang) {
    case 'ta':
      return 'ta-IN';
    case 'hi':
      return 'hi-IN';
    default:
      return 'en-IN';
  }
}

export function useSpeechSynthesis(language: Language) {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, [isSupported]);

  const speak = useCallback(
    (id: string, text: string) => {
      if (!isSupported) return;
      if (speakingId === id) {
        stop();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const locale = getLocaleCode(language);
      utterance.lang = locale;
      utterance.rate = 0.96;

      const voices = window.speechSynthesis.getVoices();
      const matchingVoice =
        voices.find((v) => v.lang.toLowerCase() === locale.toLowerCase()) ||
        voices.find((v) =>
          v.lang.toLowerCase().startsWith(locale.split('-')[0])
        );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, language, speakingId, stop]
  );

  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return { speakingId, speak, stop, isSupported };
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function useSpeechRecognition(
  language: Language,
  onTranscript: (text: string) => void
) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const SpeechRecConstructor =
    typeof window !== 'undefined'
      ? ((window as unknown as Record<string, unknown>).SpeechRecognition ||
          (window as unknown as Record<string, unknown>)
            .webkitSpeechRecognition) as (new () => SpeechRecognitionLike) | undefined
      : undefined;

  const isSupported = Boolean(SpeechRecConstructor);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore already stopped
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecConstructor) return;
    if (isListening) {
      stopListening();
      return;
    }

    const recognition = new SpeechRecConstructor();
    recognition.lang = getLocaleCode(language);
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let combined = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          combined += event.results[i][0].transcript + ' ';
        }
      }
      if (combined.trim()) {
        onTranscript(combined.trim());
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  }, [SpeechRecConstructor, isListening, language, onTranscript, stopListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  return { isListening, isSupported, startListening, stopListening };
}
