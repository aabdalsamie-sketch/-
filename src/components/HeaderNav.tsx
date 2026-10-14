import React from 'react';
import { Sparkles, Music, VolumeX, HelpCircle, Award, Compass, MessageCircleHeart } from 'lucide-react';

interface HeaderNavProps {
  isBgmActive: boolean;
  onToggleBgm: () => void;
  onOpenLiveBuddy: () => void;
  onOpenExplorer: () => void;
  onOpenQuiz: () => void;
  onOpenCertificate: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  isBgmActive,
  onToggleBgm,
  onOpenLiveBuddy,
  onOpenExplorer,
  onOpenQuiz,
  onOpenCertificate,
}) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b-2 border-amber-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* App Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-xl sm:text-2xl shadow-md border-2 border-amber-300 animate-[bounce_4s_ease-in-out_infinite]">
            🕌
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black text-slate-800 leading-tight flex items-center gap-1.5">
              <span>بستان الصلاة للأطفال</span>
              <span className="text-[10px] sm:text-xs bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                ٥ سنوات
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-bold hidden sm:block">
              فيديو كرتوني أنيميشن ٥ دقائق • شرح بالعامية المصرية • موسيقى هادئة
            </p>
          </div>
        </div>

        {/* Action Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Melodic Synth BGM Toggle */}
          <button
            onClick={onToggleBgm}
            className={`p-2 sm:px-3 sm:py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm border ${
              isBgmActive
                ? 'bg-teal-50 text-teal-800 border-teal-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="تشغيل / إيقاف الموسيقى الهادئة"
          >
            {isBgmActive ? (
              <>
                <Music className="w-4 h-4 text-teal-600 animate-spin" />
                <span className="hidden md:inline">موسيقى هادئة</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">تشغيل الموسيقى</span>
              </>
            )}
          </button>

          {/* Live Voice Buddy with Gemini Live */}
          <button
            onClick={onOpenLiveBuddy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition active:scale-95"
            title="تحدث مع سمسم رفيق الصلاة"
          >
            <MessageCircleHeart className="w-4 h-4" />
            <span className="hidden sm:inline">رفيق الصلاة (سمسم)</span>
          </button>

          {/* Google Search Grounding Explorer */}
          <button
            onClick={onOpenExplorer}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition active:scale-95"
            title="مستكشف أسئلة الصلاة وبحث جوجل"
          >
            <Compass className="w-4 h-4" />
            <span className="hidden md:inline">بحث جوجل</span>
          </button>

          {/* Quiz Game */}
          <button
            onClick={onOpenQuiz}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 font-extrabold text-xs transition flex items-center gap-1"
            title="لعبة اختبار الصلاة للأطفال"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">لعبة الصلاة</span>
          </button>

          {/* Certificate Award */}
          <button
            onClick={onOpenCertificate}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 font-extrabold text-xs transition flex items-center gap-1"
            title="شهادة بطل الصلاة"
          >
            <Award className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">الشهادة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
