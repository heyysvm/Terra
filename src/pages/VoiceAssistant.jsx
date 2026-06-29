import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../context/LanguageContext";
import { useSpeechRecognition, useSpeechSynthesis } from "../hooks/useSpeech";
import { askGemini } from "../utils/gemini";

const suggestions = {
  hi: [
    "कल बारिश होगी क्या?",
    "धान में खाद कब डालें?",
    "मेरे लिए कौन सी योजना है?",
    "गेहूं का भाव क्या है?",
    "फसल को कीड़ों से कैसे बचाएं?",
  ],
  en: [
    "Will it rain tomorrow?",
    "When to add fertilizer to paddy?",
    "Which schemes am I eligible for?",
    "What is the wheat price today?",
    "How to protect crops from pests?",
  ],
};

export default function VoiceAssistant() {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
  } = useSpeechRecognition();
  const { speak, stop } = useSpeechSynthesis();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (transcript) setInputText(transcript);
  }, [transcript]);

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript) setTimeout(() => handleSend(transcript), 300);
    } else {
      stop();
      clearTranscript();
      setInputText("");
      startListening(lang === "hi" ? "hi-IN" : "en-IN");
    }
  };

  const handleSend = async (text) => {
    const query = (text || inputText).trim();
    if (!query || isThinking) return;

    clearTranscript();
    setInputText("");

    const userMsg = { role: "user", text: query, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    const conversationHistory = messages
      .map((msg) => `${msg.role}: ${msg.text}`)
      .join("\n");

    const answer = await askGemini(
      `Conversation History:
${conversationHistory}

Current User Message:
${query}`,
    );

    console.log("Gemini Answer:", answer);
    setIsThinking(false);

    const aiMsg = { role: "ai", text: answer, id: Date.now() + 1 };
    setMessages((prev) => [...prev, aiMsg]);
    speak(answer, lang === "hi" ? "hi-IN" : "en-IN");
  };

  const handleSuggestion = (s) => {
    setInputText(s);
    handleSend(s);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="font-heading font-bold text-2xl text-text-primary">
          {t("voiceAssistant")}
        </h1>
        <p className="text-text-secondary text-sm mt-0.5">
          {t("voiceSubtitle")}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="text-center pt-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-4xl">🌾</span>
            </motion.div>
            <p className="text-text-secondary text-sm mb-6">
              {lang === "hi"
                ? "नमस्ते! मैं Terra हूं। आप मुझसे खेती के बारे में कुछ भी पूछ सकते हैं।"
                : "Hello! I'm Terra. Ask me anything about farming."}
            </p>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                {lang === "hi" ? "सुझाव" : "Suggestions"}
              </p>
              {suggestions[lang].map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => handleSuggestion(s)}
                  className="block w-full text-left bg-surface border border-secondary/30 rounded-xl px-4 py-3 text-sm text-text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <span className="text-white text-xs font-bold">T</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-surface shadow-soft text-text-primary rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isThinking && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <div className="bg-surface shadow-soft rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-secondary/20 pt-4 space-y-3">
        <div className="flex justify-center">
          <button
            onClick={handleMicToggle}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-medium ${
              isListening
                ? "bg-danger pulse-animation scale-110"
                : "bg-primary hover:bg-primary-dark active:scale-95"
            }`}
          >
            {isListening ? (
              <div className="flex items-end gap-0.5 h-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="wave-bar w-1 bg-white rounded-full"
                    style={{ animationDelay: `${(i - 1) * 0.1}s` }}
                  />
                ))}
              </div>
            ) : (
              <span className="text-2xl">🎤</span>
            )}
          </button>
        </div>

        {isListening && (
          <p className="text-center text-sm text-danger font-medium animate-pulse">
            {t("listening")}
          </p>
        )}

        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t("typeQuestion")}
            rows={1}
            className="input-field resize-none text-sm py-3"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isThinking}
            className="btn-primary px-4 py-3 disabled:opacity-40 flex-shrink-0"
          >
            <span className="text-lg">➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}
