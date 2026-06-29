import { useState, useRef, useCallback } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const startListening = useCallback((lang = 'hi-IN') => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('आपका ब्राउज़र Speech Recognition सपोर्ट नहीं करता। Chrome उपयोग करें।');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onend = () => setIsListening(false);

    recognition.onresult = (e) => {
      const t = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join('');

      setTranscript(t);
    };

    recognition.onerror = (e) => {
      console.error('Speech error:', e.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
  };
}

export function useSpeechSynthesis() {
  const speak = useCallback((text, lang = 'hi-IN') => {
    if (!window.speechSynthesis || !text) return;

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/`/g, '')
      .replace(/\n/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();

    console.log('Speaking:', cleanText);

    const utterance = new SpeechSynthesisUtterance(cleanText);

    const voices = window.speechSynthesis.getVoices();

    const selectedVoice =
      voices.find((v) => v.lang === lang) ||
      voices.find((v) => v.lang.startsWith('hi')) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.lang = lang;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  return { speak, stop };
}