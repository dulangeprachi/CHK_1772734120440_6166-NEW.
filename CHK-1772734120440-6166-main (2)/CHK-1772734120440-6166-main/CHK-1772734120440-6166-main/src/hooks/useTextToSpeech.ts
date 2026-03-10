import { useState, useCallback, useRef } from "react";

export function useTextToSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, id: string, rate = 1) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.onstart = () => {
      setSpeaking(true);
      setCurrentId(id);
    };
    utterance.onend = () => {
      setSpeaking(false);
      setCurrentId(null);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setCurrentId(null);
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setCurrentId(null);
  }, []);

  return { speak, stop, speaking, currentId };
}
