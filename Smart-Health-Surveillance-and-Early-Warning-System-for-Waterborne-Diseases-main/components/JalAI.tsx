
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Mic, X, Send, Volume2, VolumeX, Bot, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askJalAssistantWithVoice } from '../services/geminiService';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Expanded Language Support with Best Available Fallbacks for Voice
const LANGUAGES = [
  { code: 'en-US', label: 'English', voiceName: 'Google US English' },
  { code: 'hi-IN', label: 'Hindi', voiceName: 'Google हिन्दी' },
  { code: 'as-IN', label: 'Assamese', voiceName: 'Google हिन्दी' },
  { code: 'bn-IN', label: 'Bengali', voiceName: 'Google Bangla' },
  { code: 'brx-IN', label: 'Bodo', voiceName: 'Google हिन्दी' },
  { code: 'mni-IN', label: 'Meitei', voiceName: 'Google हिन्दी' },
  { code: 'lus-IN', label: 'Mizo', voiceName: 'Google US English' },
  { code: 'kha-IN', label: 'Khasi', voiceName: 'Google US English' },
  { code: 'grt-IN', label: 'Garo', voiceName: 'Google US English' },
  { code: 'nag-IN', label: 'Nagamese', voiceName: 'Google हिन्दी' },
  { code: 'njo-IN', label: 'Ao Naga', voiceName: 'Google US English' },
  { code: 'nsm-IN', label: 'Sumi', voiceName: 'Google US English' },
  { code: 'njh-IN', label: 'Lotha', voiceName: 'Google US English' },
  { code: 'nmf-IN', label: 'Tangkhul', voiceName: 'Google US English' },
  { code: 'trp-IN', label: 'Kokborok', voiceName: 'Google Bangla' },
  { code: 'mjw-IN', label: 'Karbi', voiceName: 'Google US English' },
  { code: 'mrg-IN', label: 'Mishing', voiceName: 'Google US English' },
  { code: 'dis-IN', label: 'Dimasa', voiceName: 'Google Bangla' },
  { code: 'twm-IN', label: 'Monpa', voiceName: 'Google US English' },
  { code: 'adi-IN', label: 'Adi', voiceName: 'Google US English' }
];

export const JalAI: React.FC = () => {
  const { waterQualityReports, statesData } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Namaste! I am Jal AI. I can check the dashboard data for you. Ask me anything!", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [isMuted, setIsMuted] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLang;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSend(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setPermissionError("Microphone access denied.");
        } else if (event.error === 'network') {
          setPermissionError("Network error. Check internet connection.");
        } else if (event.error === 'no-speech') {
          setPermissionError("No speech detected. Try again.");
        } else {
          setPermissionError(`Error: ${event.error}`);
        }
      };
    } else {
       setPermissionError("Voice not supported.");
    }
  }, [selectedLang]);

  const requestMicrophoneAccess = async () => {
    try {
      setPermissionError(null);
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (err) {
      console.error("Microphone permission denied:", err);
      setPermissionError("Please allow microphone.");
      return false;
    }
  };

  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      const hasPermission = await requestMicrophoneAccess();
      if (hasPermission && recognitionRef.current) {
        try {
          setPermissionError(null);
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error("Start error:", e);
          setPermissionError("Could not start. Try refreshing.");
        }
      }
    }
  };

  const speak = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang === selectedLang || v.name.includes(LANGUAGES.find(l => l.code === selectedLang)?.voiceName || ''));
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  };

  const playGeminiAudio = (audioBase64: string, mimeType: string = 'audio/wav') => {
    if (isMuted) return false;
    try {
      const binary = atob(audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      stopAudio();
      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
      };
      audio.play().catch((err) => {
        console.warn('Audio playback failed:', err);
      });
      return true;
    } catch (err) {
      console.warn('Gemini audio decode failed:', err);
      return false;
    }
  };

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setPermissionError(null);
    setIsThinking(true);

    const aiResponse = await askJalAssistantWithVoice(
        text, 
        { states: statesData, reports: waterQualityReports }, 
        selectedLang
    );

    setIsThinking(false);
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse.text,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMsg]);

    const played = aiResponse.audioBase64
      ? playGeminiAudio(aiResponse.audioBase64, aiResponse.audioMimeType)
      : false;

    if (!played) {
      speak(aiResponse.text);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-80 sm:w-96 mb-4 overflow-hidden flex flex-col animate-slide-up origin-bottom-right transition-colors">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Jal AI Assistant</h3>
                <p className="text-[10px] text-teal-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextMuted = !isMuted;
                  setIsMuted(nextMuted);
                  if (nextMuted) {
                    stopAudio();
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                  }
                }}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Language Bar */}
          <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`text-[10px] px-2 py-1 rounded-full whitespace-nowrap transition-colors ${
                    selectedLang === lang.code 
                    ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-200 font-bold border border-teal-200 dark:border-teal-700' 
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-teal-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.sender === 'user' 
                    ? 'bg-teal-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isThinking && (
               <div className="flex justify-start">
                   <div className="bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 rounded-2xl rounded-bl-none px-4 py-2.5 text-xs flex items-center gap-2">
                       <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                   </div>
               </div>
            )}

            {permissionError && (
              <div className="flex justify-center">
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-3 py-2 rounded-lg text-xs flex items-center gap-2 border border-red-100 dark:border-red-900 max-w-[90%]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {permissionError}
                </div>
              </div>
            )}

            {isListening && !permissionError && (
              <div className="flex justify-end">
                <div className="bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 animate-pulse border border-teal-100 dark:border-teal-800">
                  <Mic className="w-3 h-3" /> Listening...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 transition-colors">
            <button 
              onClick={toggleListening}
              className={`p-3 rounded-full transition-all ${
                  isListening 
                  ? 'bg-red-500 text-white shadow-lg scale-110' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-900/50 hover:text-teal-600'
              }`}
              title="Click to speak"
            >
              <Mic className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about pH, cases..."
              style={{ color: 'black' }}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-full px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isThinking}
              className="p-2.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto group relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full shadow-[0_4px_20px_rgba(20,184,166,0.4)] hover:shadow-[0_6px_25px_rgba(20,184,166,0.6)] hover:scale-110 transition-all duration-300"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <Bot className="w-7 h-7 text-white" />
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </>
        )}
      </button>
    </div>
  );
};
