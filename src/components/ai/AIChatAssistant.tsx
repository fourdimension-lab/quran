'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Send, 
  BookOpen, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight,
  RefreshCw,
  Compass,
  Key,
  ExternalLink,
  Check,
  Cpu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AISearchResult } from '@/types/quran';

export function AIChatAssistant() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AISearchResult | null>(null);
  
  // Gemini API Configuration
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [showConfig, setShowConfig] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('gemini_free_api_key');
      if (savedKey) setGeminiApiKey(savedKey);
      const savedModel = localStorage.getItem('gemini_model');
      if (savedModel && !savedModel.includes('1.5') && !savedModel.includes('2.0') && !savedModel.includes('2.5')) {
        setSelectedModel(savedModel);
      } else {
        setSelectedModel('gemini-3.5-flash');
      }
    }
  }, []);

  const handleSaveConfig = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_free_api_key', geminiApiKey.trim());
      localStorage.setItem('gemini_model', selectedModel);
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 2000);
    }
  };

  const suggestedQuestions = [
    'Which Ayahs discuss patience during hardship?',
    'What is the linguistic difference between Ar-Rahman and Ar-Rahim?',
    'Explain the concept of Tawhid in Surah Al-Ikhlas',
    'কুরআনে পিতা-মাতার অধিকার ও সেবা সম্পর্কে কী বলা হয়েছে?',
    'What do Quranic verses say about the expansion of the universe?'
  ];

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim()) return;
    setIsLoading(true);
    setQuery(questionText);

    try {
      const res = await fetch('/api/ai/study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: questionText, 
          language: 'en',
          customApiKey: geminiApiKey.trim() || undefined,
          modelName: selectedModel
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        throw new Error('Failed to fetch AI study answer');
      }
    } catch (err) {
      console.warn('AI study assistant error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-[var(--gold-light)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Google Gemini Free API & Grounded Exegesis</span>
          </div>

          {/* Active Provider Badge */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 hover:bg-black/30 text-xs font-medium backdrop-blur-xs text-emerald-100 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{geminiApiKey ? 'Gemini 3.5 Flash (Custom Key)' : 'Gemini 3.5 Flash (System Key Active)'}</span>
            {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          AI Quran Study Assistant
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
          Ask questions to explore thematic connections, linguistic nuances, and classical commentaries across the Holy Quran. Powered by Google Gemini Free API with strict canonical grounding in authentic verses and exegeses.
        </p>
      </div>

      {/* Collapsible Gemini Free API Configurator */}
      {showConfig && (
        <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-md space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                Google Gemini Free API Configuration
              </span>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <span>Get Free API Key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-[var(--muted-foreground)]">
                Gemini API Key (Optional — Server key is already active)
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to use preconfigured server key)"
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[var(--muted-foreground)]">
                Select Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] font-semibold"
              >
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Recommended)</option>
                <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite (Fastest)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-[11px] text-[var(--muted-foreground)]">
              Your key stays in your local browser and is never stored on our database.
            </span>
            <button
              onClick={handleSaveConfig}
              className="px-4 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[var(--primary-hover)] shadow-xs transition-colors"
            >
              {keySaved ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{keySaved ? 'Saved Locally!' : 'Save Key'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Query Input Box */}
      <div className="p-2 sm:p-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-md space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a Quranic study question (e.g. 'Ayahs on mercy', 'Meaning of Taqwa')..."
            className="w-full text-sm sm:text-base px-3 py-2 bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 transition-all shrink-0 shadow-xs"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Ask Assistant</span>
          </button>
        </form>

        {/* Preset Prompt Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 text-xs">
          <span className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1 shrink-0">
            <Compass className="w-3 h-3" /> Prompts:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(q)}
              className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/30 text-[11px] text-[var(--foreground)] whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Answer Spotlight Card */}
      {isLoading && (
        <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[var(--muted-foreground)]">
            Consulting Google Gemini with canonical Quran grounding and exegeses...
          </p>
        </div>
      )}

      {!isLoading && result && (
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-md space-y-6 animate-in fade-in duration-200">
          
          {/* Explanation Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Grounded Study Answer</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] font-medium">
                {geminiApiKey ? `${selectedModel} (Live Free API)` : 'Grounded RAG Exegesis'}
              </span>
            </div>
            <div className="text-sm sm:text-base leading-relaxed text-[var(--foreground)] whitespace-pre-line font-sans">
              {result.answer}
            </div>
          </div>

          {/* Verified References */}
          {result.references.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[var(--border)]">
              <div className="text-xs font-bold text-[var(--foreground)] tracking-wide uppercase">
                Verified Quranic References ({result.references.length})
              </div>
              <div className="grid grid-cols-1 gap-3">
                {result.references.map((ref, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[var(--primary)]">
                        Surah {ref.surah}, Ayah {ref.ayah}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] font-medium">
                        {ref.relevance}
                      </span>
                    </div>
                    <p className="font-arabic text-lg text-[var(--foreground)] text-right leading-loose">
                      {ref.text_ar}
                    </p>
                    <p className="text-xs text-[var(--foreground)]/80 italic">
                      &quot;{ref.translation}&quot;
                    </p>
                    <div className="pt-1 flex justify-end">
                      <Link
                        href={`/read/${ref.surah}#ayah-${ref.surah}-${ref.ayah}`}
                        className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                      >
                        <span>Open in Quran Reader</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strict Scholarly Disclaimer Alert */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p className="leading-relaxed">
              {result.scholarly_caveat}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
