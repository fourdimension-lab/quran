'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ChevronUp,
  Mic,
  Paperclip,
  History,
  Settings,
  RotateCcw,
  Languages
} from 'lucide-react';
import { AISearchResult } from '@/types/quran';
import { useLanguage } from '@/lib/language/language-context';
import { getSurahByNumber } from '@/lib/quran-data/surahs';

export function AIChatAssistant() {
  const { language, toggleLanguage, setLanguage, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AISearchResult | null>(null);
  
  // Gemini API Configuration
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [showConfig, setShowConfig] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // History tracking in browser storage
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

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

      try {
        const savedHistory = localStorage.getItem('quran_ai_history');
        if (savedHistory) {
          setQueryHistory(JSON.parse(savedHistory));
        }
      } catch {
        // safe fallback
      }
    }
  }, []);

  const handleSaveConfig = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_free_api_key', geminiApiKey.trim());
      localStorage.setItem('gemini_model', selectedModel);
      setKeySaved(true);
      setTimeout(() => {
        setKeySaved(false);
        setShowConfig(false);
      }, 1200);
    }
  };

  const handleAsk = async (questionText: string) => {
    const q = questionText.trim();
    if (!q) return;
    setIsLoading(true);
    setQuery(q);

    // Update query history
    const updated = [q, ...queryHistory.filter((item) => item !== q)].slice(0, 10);
    setQueryHistory(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('quran_ai_history', JSON.stringify(updated));
    }

    try {
      const res = await fetch('/api/ai/study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: q, 
          language,
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

  // Voice Search / Mic Trigger
  const handleMicClick = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            setQuery(transcript);
            handleAsk(transcript);
          }
        };
        recognition.start();
      } catch {
        setIsListening(false);
      }
    } else {
      const sample = language === 'bn' 
        ? 'বিপদে ধৈর্য ও সবর ধারণ সম্পর্কে কুরআনে কী বলা হয়েছে?' 
        : 'Which Ayahs discuss patience during hardship?';
      setQuery(sample);
      inputRef.current?.focus();
    }
  };

  const trendingPresets = language === 'bn' 
    ? [
        'বিপদে ধৈর্য ও সবর',
        'সূরা ইখলাসে তাওহীদ',
        'কুরআনে পিতা-মাতার অধিকার',
        'মহাবিশ্বের ক্রমসম্প্রসারণ',
        'কিয়ামতের দিন ও পরকাল',
        'রিযিক বৃদ্ধির দোয়া ও আমল'
      ]
    : [
        'Patience in Hardship',
        'Tawhid in Surah Ikhlas',
        'Parents in Quran',
        'Expanding Universe',
        'Day of Judgement',
        'Supplications for Provision'
      ];

  return (
    <div className="min-h-[85vh] py-6 sm:py-10 px-3 sm:px-6 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-50/70 via-purple-50/40 to-sky-50/60 dark:from-[#09140e] dark:via-[#0e1d15] dark:to-[#07120c] transition-colors">
      
      {/* Background Soft Ambient Light Blobs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-fuchsia-400/10 dark:bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-rose-400/10 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Canvas Container */}
      <div className="relative w-full max-w-5xl rounded-[32px] sm:rounded-[40px] bg-white/80 dark:bg-[#0c1813]/85 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.07)] dark:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.6)] p-6 sm:p-12 transition-all">
        
        {/* Left Vertical Dock (Mini utilities) */}
        <div className="hidden lg:flex flex-col items-center gap-4 absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-xs z-20">
          <button 
            onClick={() => setShowHelpModal(true)} 
            className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/40 transition-colors cursor-pointer"
            title={t('সহায়তা ও নির্দেশিকা', 'Help & Question Guidelines')}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setShowHistoryModal(true)} 
            className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
            title={t('অনুসন্ধানের ইতিহাস', 'Search History')}
          >
            <History className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setShowConfig(!showConfig)} 
            className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
            title={t('জেমিনাই এআই সেটিংস', 'Gemini AI Settings')}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Top Header inside the Viewport Window */}
        <div className="flex items-center justify-between pb-6 sm:pb-8">
          
          {/* Top Left: Logo + Model Version Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--foreground)] hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-fuchsia-500 to-rose-500 p-0.5 flex items-center justify-center shadow-xs">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-950 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-fuchsia-600" />
                </div>
              </div>
              <span>{language === 'bn' ? (selectedModel.includes('flash-lite') ? 'কুরআন এআই লাইট' : 'কুরআন এআই ৩.৫') : (selectedModel.includes('flash-lite') ? 'Quran AI Lite' : 'Quran AI v3.5')}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* Model Selector Popover */}
            {showModelDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] px-2 py-1">
                  {t('বুদ্ধিমত্তা ইঞ্জিন নির্বাচন করুন', 'Select Intelligence Engine')}
                </div>
                <button
                  onClick={() => {
                    setSelectedModel('gemini-3.5-flash');
                    setShowModelDropdown(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    selectedModel === 'gemini-3.5-flash'
                      ? 'bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-300'
                      : 'hover:bg-[var(--muted)] text-[var(--foreground)]'
                  }`}
                >
                  <div>
                    <div className="font-bold">Gemini 3.5 Flash</div>
                    <div className="text-[10px] text-[var(--muted-foreground)]">
                      {t('সুপারিশকৃত • নির্ভরযোগ্য RAG', 'Recommended • Grounded RAG')}
                    </div>
                  </div>
                  {selectedModel === 'gemini-3.5-flash' && <Check className="w-4 h-4 text-fuchsia-600" />}
                </button>
                <button
                  onClick={() => {
                    setSelectedModel('gemini-3.5-flash-lite');
                    setShowModelDropdown(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    selectedModel === 'gemini-3.5-flash-lite'
                      ? 'bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-300'
                      : 'hover:bg-[var(--muted)] text-[var(--foreground)]'
                  }`}
                >
                  <div>
                    <div className="font-bold">Gemini 3.5 Flash Lite</div>
                    <div className="text-[10px] text-[var(--muted-foreground)]">
                      {t('সবচেয়ে দ্রুত গতি', 'Fastest response time')}
                    </div>
                  </div>
                  {selectedModel === 'gemini-3.5-flash-lite' && <Check className="w-4 h-4 text-fuchsia-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Top Right: Language Switcher + Settings + User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-200 transition-all cursor-pointer font-bangla shadow-2xs"
              title={language === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় পরিবর্তন করুন'}
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'bn' ? 'বাংলা (BN)' : 'English (EN)'}</span>
            </button>

            <button
              onClick={() => setShowConfig(!showConfig)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 hover:bg-fuchsia-50 dark:hover:bg-white/20 border border-fuchsia-200/80 dark:border-white/20 text-xs font-bold text-fuchsia-700 dark:text-fuchsia-300 shadow-2xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-600 dark:text-fuchsia-400" />
              <span>{geminiApiKey ? t('কাস্টম এপিআই সক্রিয়', 'Custom API Active') : t('জেমিনাই ফ্রি ইঞ্জিন', 'Gemini Free Engine')}</span>
            </button>

            {/* User Profile Avatar with Verified Online Dot */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-800 text-white font-bold text-xs flex items-center justify-center border-2 border-white dark:border-[#0c1813] shadow-xs">
                SR
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c1813]" />
            </div>
          </div>
        </div>

        {/* Collapsible API Settings Tray */}
        {showConfig && (
          <div className="mb-8 p-5 rounded-3xl border border-fuchsia-200/80 dark:border-fuchsia-900/60 bg-white/90 dark:bg-[#102018] shadow-lg space-y-4 animate-in slide-in-from-top duration-200 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-fuchsia-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  {t('গুগল জেমিনাই ফ্রি এপিআই সেটআপ', 'Google Gemini Free API Setup')}
                </span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-fuchsia-600 hover:underline flex items-center gap-1"
              >
                <span>{t('গুগল এআই স্টুডিও থেকে ফ্রি কী নিন', 'Get Free Key from Google AI Studio')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-semibold text-[var(--muted-foreground)]">
                  {t('কাস্টম জেমিনাই এপিআই কী (ঐচ্ছিক — সার্ভারের নিজস্ব কী স্বয়ংক্রিয়ভাবে সক্রিয়)', 'Custom Gemini API Key (Optional — Server system key is automatically active)')}
                </label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder={t('AIzaSy... (সিস্টেম কী ব্যবহার করতে ফাঁকা রাখুন)', 'AIzaSy... (leave blank to use system key)')}
                  className="w-full text-xs font-mono p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-hidden focus:border-fuchsia-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[var(--muted-foreground)]">
                  {t('সক্রিয় মডেল', 'Active Model')}
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] font-semibold"
                >
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash ({t('সুপারিশকৃত', 'Recommended')})</option>
                  <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite ({t('দ্রুততম', 'Fastest')})</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[11px] text-[var(--muted-foreground)]">
                {t('আপনার এপিআই কী সম্পূর্ণ নিরাপদে আপনার নিজস্ব ব্রাউজার স্টোরেজে সংরক্ষিত থাকে।', 'Your key is strictly preserved locally in your browser storage.')}
              </span>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white text-xs font-bold hover:opacity-95 shadow-xs transition-opacity cursor-pointer"
              >
                {keySaved ? t('সংরক্ষিত হয়েছে!', 'Saved Locally!') : t('সেটিংস সংরক্ষণ করুন', 'Save Settings')}
              </button>
            </div>
          </div>
        )}

        {/* Central Greeting & Headline */}
        <div className="text-center space-y-3 py-6 sm:py-10 max-w-2xl mx-auto">
          <div className="inline-block text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-600 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
            {t('আসসালামু আলাইকুম', 'Assalamu Alaikum')}
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight">
            {t('আজ আপনার কুরআন গবেষণায় কীভাবে সহায়তা করতে পারি?', 'How can I assist your Quran journey today?')}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-bangla">
            {t(
              'যেকোনো বিষয় অনুসন্ধান করুন, প্রামাণ্য আয়াত ও তথ্যসূত্র জানুন, মূল শব্দ বিশ্লেষণ করুন বা নির্ভরযোগ্য তাফসীর সম্পর্কিত প্রশ্ন করুন।',
              'Search themes, explore authentic Ayah references, study root words, or ask classical Tafsir questions powered by grounded Islamic intelligence.'
            )}
          </p>
        </div>

        {/* Active Query Loading State */}
        {isLoading && (
          <div className="py-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="relative w-12 h-12 mx-auto">
              <div className="w-12 h-12 rounded-full border-3 border-fuchsia-500 border-t-transparent animate-spin" />
              <Sparkles className="w-5 h-5 text-fuchsia-500 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-[var(--foreground)] font-bangla">
              {t('প্রামাণ্য কুরআন ডেটাবেজ ও তাফসীর গ্রন্থাবলীর সমন্বয়ে উত্তর প্রস্তুত হচ্ছে...', 'Consulting Google Gemini with canonical Quran grounding & classical Tafsir...')}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] font-bangla">
              {t('যাচাইকৃত আয়াত, মূল শব্দ এবং ইবনে কাসীর ও আহসানুল বায়ান তাফসীর ক্রস-রেফারেন্স করা হচ্ছে।', 'Cross-referencing verified Ayahs, root morphology, and Ibn Kathir & Ahsanul Bayaan commentaries.')}
            </p>
          </div>
        )}

        {/* Answer Display Card (When result is available) */}
        {!isLoading && result && (
          <div className="my-6 p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#102018] border border-fuchsia-200/80 dark:border-fuchsia-900/60 shadow-xl space-y-6 text-left animate-in fade-in duration-200">
            
            {/* Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)]">
                    {t('প্রামাণ্য কুরআনীয় পর্যালোচনা', 'Grounded Quranic Synthesis')}
                  </h3>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {t('অনুসন্ধান:', 'Query:')} &ldquo;{query}&rdquo;
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setResult(null);
                    setQuery('');
                  }}
                  className="px-3 py-1.5 rounded-full bg-[var(--muted)] hover:bg-stone-200 text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('নতুন অনুসন্ধান', 'New Query')}</span>
                </button>
              </div>
            </div>

            {/* Explanation Body */}
            <div className="text-sm sm:text-base leading-relaxed text-[var(--foreground)] whitespace-pre-line font-bangla font-normal">
              {result.answer}
            </div>

            {/* Verified Quranic References */}
            {result.references.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                <div className="text-xs font-bold text-fuchsia-800 dark:text-fuchsia-300 tracking-wider uppercase flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {t('যাচাইকৃত কুরআনীয় তথ্যসূত্র', 'Verified Quranic References')} ({result.references.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {result.references.map((ref, i) => {
                    const sMeta = getSurahByNumber(ref.surah);
                    return (
                    <div
                      key={i}
                      className="p-4 rounded-2xl border border-fuchsia-200/70 dark:border-fuchsia-900/50 bg-[var(--card)] hover:border-fuchsia-500 transition-all space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-sm text-[var(--foreground)]">
                          {language === 'bn' 
                            ? `সূরা ${sMeta?.name_bn || ref.surah} [${ref.surah}:${ref.ayah}]` 
                            : `Surah ${sMeta?.name_en || ref.surah} [${ref.surah}:${ref.ayah}]`}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-800 dark:text-fuchsia-300 font-bold border border-fuchsia-200 dark:border-fuchsia-800">
                          {ref.relevance}
                        </span>
                      </div>
                      <p className="font-arabic text-lg sm:text-xl text-[var(--foreground)] text-right leading-loose" dir="rtl">
                        {ref.text_ar}
                      </p>
                      <p className="text-xs text-[var(--foreground)]/80 italic font-bangla">
                        &quot;{ref.translation}&quot;
                      </p>
                      <div className="pt-1 flex justify-end">
                        <Link
                          href={`/read/${ref.surah}#ayah-${ref.surah}-${ref.ayah}`}
                          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bangla"
                        >
                          <span>{t('কুরআন রিডারে আয়াতটি পড়ুন', 'Open in Quran Reader')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            )}

            {/* Scholarly Guardrails Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <p className="leading-relaxed font-bangla">
                {result.scholarly_caveat}
              </p>
            </div>

          </div>
        )}

        {/* FLOATING PILL SEARCH / INPUT BAR */}
        <div className="pt-4 sm:pt-6 max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(query);
            }}
            className="flex items-center gap-2 sm:gap-3"
          >
            {/* Detached Attachment / Reset Button */}
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResult(null);
                inputRef.current?.focus();
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-white/10 hover:bg-stone-100 dark:hover:bg-white/20 border border-stone-200 dark:border-white/10 text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center justify-center shadow-md transition-all cursor-pointer shrink-0"
              title={t('মুছে ফেলে নতুন অনুসন্ধান', 'Clear & New Search')}
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Main Floating Pill Bar */}
            <div className="relative flex-1 flex items-center px-4 py-2.5 sm:py-3 rounded-full bg-white dark:bg-white/10 border-2 border-stone-200/90 dark:border-white/15 focus-within:border-fuchsia-400 dark:focus-within:border-fuchsia-500 focus-within:ring-4 focus-within:ring-fuchsia-500/15 shadow-lg shadow-black/5 dark:shadow-black/20 transition-all">
              
              {/* Fuchsia Star Sparkle Icon */}
              <div className="pr-2 text-fuchsia-500 shrink-0">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>

              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('কুরআন, আয়াত, শব্দার্থ বা তাফসীর সম্পর্কিত যেকোনো প্রশ্ন করুন...', 'Ask anything about Quran, Ayahs, or Tafsir...')}
                className="w-full bg-transparent text-xs sm:text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none pr-2 font-medium font-bangla"
              />

              {/* Action Controls on the Right: Mic + Submit */}
              <div className="flex items-center gap-1.5 shrink-0 pl-1">
                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    isListening ? 'text-rose-600 animate-ping' : 'text-[var(--muted-foreground)] hover:text-fuchsia-600'
                  }`}
                  title={isListening ? t('শুনছি...', 'Listening...') : t('ভয়েস অনুসন্ধান (কথা বলে অনুসন্ধান)', 'Voice Search (Speech to Text)')}
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-fuchsia-600 via-rose-500 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white flex items-center justify-center disabled:opacity-30 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  title={t('এআই সহকারীকে জিজ্ঞাসা করুন', 'Ask AI Assistant')}
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 -ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Quick Presets Strip */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto pt-3 text-[11px] text-[var(--muted-foreground)]">
            <span className="font-semibold shrink-0">{t('জনপ্রিয় অনুসন্ধান:', 'Trending:')}</span>
            {trendingPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(preset);
                  handleAsk(preset);
                }}
                className="px-2.5 py-0.5 rounded-full bg-white/60 dark:bg-white/5 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/40 hover:text-fuchsia-600 border border-stone-200/80 dark:border-white/10 transition-colors whitespace-nowrap cursor-pointer font-medium font-bangla"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* History Slide-out Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  {t('সাম্প্রতিক অনুসন্ধানসমূহ', 'Recent Inquiries')}
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                {t('বন্ধ করুন', 'Close')}
              </button>
            </div>
            {queryHistory.length > 0 ? (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {queryHistory.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setShowHistoryModal(false);
                      setQuery(h);
                      handleAsk(h);
                    }}
                    className="w-full text-left p-2.5 rounded-xl text-xs hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate">{h}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-purple-600" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[var(--muted-foreground)] font-bangla">
                {t('এখনও কোনো অনুসন্ধানের ইতিহাস নেই।', 'No search history recorded yet.')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-fuchsia-600" />
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  {t('কুরআন এআই অনুসন্ধান কীভাবে ব্যবহার করবেন', 'How to use Quran AI Search')}
                </h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                {t('বন্ধ করুন', 'Close')}
              </button>
            </div>
            <div className="space-y-2.5 text-xs leading-relaxed text-[var(--muted-foreground)] font-bangla">
              <p>
                <strong>{t('১. প্রামাণ্য ভিত্তি:', '1. Canonical Grounding:')}</strong> {t(
                  'সকল উত্তর তানযিল যাচাইকৃত উসমানী লিপি, বিশুদ্ধ বঙ্গানুবাদ এবং ইবনে কাসীর ও আহসানুল বায়ানের মতো প্রামাণ্য তাফসীরের আলোকে প্রদান করা হয়।',
                  'Questions are grounded in Tanzil verified Uthmani scripture, Sahih translations, and classical commentaries (Ibn Kathir & Ahsanul Bayaan).'
                )}
              </p>
              <p>
                <strong>{t('২. বিষয়ভিত্তিক গবেষণা:', '2. Thematic Inquiries:')}</strong> {t(
                  'নৈতিক মূল্যবোধ, শারয়ী হুকুম, নবীদের কাহিনী বা বৈজ্ঞানিক নিদর্শন বিষয়ে সরাসরি প্রশ্ন করতে পারেন।',
                  'You can ask about ethical principles, rulings, prophetic stories, or scientific reflections.'
                )}
              </p>
              <p>
                <strong>{t('৩. ফ্রি এআই ইঞ্জিন:', '3. Free AI Engine:')}</strong> {t(
                  'গুগল জেমিনাই ফ্রি এপিআই দ্বারা চালিত। আপনি চাইলে সেটিংস থেকে আপনার নিজস্ব ফ্রি এপিআই কী-ও যুক্ত করতে পারেন।',
                  'Powered by Google Gemini Free API. You may also provide your own personal key via the settings panel.'
                )}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
