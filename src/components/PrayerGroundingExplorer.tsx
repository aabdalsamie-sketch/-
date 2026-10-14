import React, { useState } from 'react';
import { X, Search, Globe, ExternalLink, Sparkles, Loader2, BookOpen } from 'lucide-react';
import { askPrayerGrounding } from '../services/groundingService';
import { GroundingResponse } from '../types';

interface PrayerGroundingExplorerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrayerGroundingExplorer: React.FC<PrayerGroundingExplorerProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GroundingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await askPrayerGrounding(q);
      setResult(res);
    } catch (err: any) {
      console.error('Grounding search error:', err);
      setError(err?.message || 'تعذر استرجاع نتائج البحث الموثوقة');
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'كيف أشجع طفلي في سن 5 سنوات على حب الصلاة بالخطوات؟',
    'ما هي أوقات وأسماء الصلوات الخمس وعدد ركعات كل صلاة؟',
    'قصة الإسراء والمعراج وفرض الصلاة بأسلوب شيق للأطفال',
    'ما هي شروط صحة الصلاة وسننها المؤكدة ببساطة؟',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fade-in_0.2s_ease]">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/30">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] bg-white text-amber-900 font-black px-2 py-0.5 rounded-full">
                  Gemini-3.8-Flash + Google Search
                </span>
                <span className="text-xs text-amber-100 font-semibold">بيانات موثوقة ومباشرة</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black">
                مستكشف أسئلة الصلاة للأطفال والمربين
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search input & Sample chips */}
        <div className="p-4 sm:p-5 bg-amber-50/60 border-b border-amber-100 flex flex-col gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="اكتب سؤالاً عن الصلاة، مواقيتها، أو التربية الإيمانية..."
                className="w-full pl-4 pr-10 py-3 rounded-2xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none bg-white text-slate-800 font-bold text-sm shadow-inner"
              />
              <Search className="w-5 h-5 text-amber-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>بحث جوجل</span>
            </button>
          </form>

          {/* Preset question chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs font-black text-amber-900 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>أسئلة شائعة:</span>
            </span>
            {sampleQuestions.map((qText, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(qText);
                  handleSearch(qText);
                }}
                className="text-xs font-bold text-slate-700 bg-white hover:bg-amber-100 hover:text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200 transition shadow-sm text-right"
              >
                {qText}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-sm font-bold text-amber-800">
                جاري البحث والتحقق من مصادر جوجل الموثوقة...
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold text-right">
              {error}
            </div>
          )}

          {result && !loading && (
            <div className="flex flex-col gap-4 text-right">
              {/* Answer card */}
              <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>الإجابة الموثوقة الموجهة للطفل والأسرة:</span>
                </div>
                <div className="text-slate-800 font-semibold leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {result.answer}
                </div>
              </div>

              {/* Verified Sources from Google Search */}
              {result.sources && result.sources.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="text-xs font-black text-slate-700 mb-2 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>المصادر والمراجع المستند إليها من بحث جوجل (Grounding Sources):</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-blue-700 hover:text-blue-900 hover:border-blue-400 transition shadow-sm"
                      >
                        <ExternalLink className="w-3 h-3 text-blue-500" />
                        <span className="truncate max-w-[220px]">{src.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!result && !loading && !error && (
            <div className="py-12 text-center text-slate-400 font-bold text-sm">
              اختر سؤالاً أو اكتب استفسارك للبحث في مصادر الصلاة المعتمدة
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
