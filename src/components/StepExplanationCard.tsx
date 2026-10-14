import React, { useState } from 'react';
import { Volume2, Square, Sparkles, CheckCircle2, HeartHandshake } from 'lucide-react';
import { PrayerStep } from '../types';
import { ttsService } from '../services/ttsService';

interface StepExplanationCardProps {
  currentStep: PrayerStep;
  isSpeaking: boolean;
  onNext: () => void;
  onOpenLiveVoice: () => void;
}

export const StepExplanationCard: React.FC<StepExplanationCardProps> = ({
  currentStep,
  isSpeaking,
  onNext,
  onOpenLiveVoice,
}) => {
  const [ttsLoading, setTtsLoading] = useState(false);

  const handleSpeak = async () => {
    if (isSpeaking) {
      ttsService.stop();
      return;
    }

    try {
      setTtsLoading(true);
      // Speak the step explanation + dhikr in loving Egyptian colloquial
      const speechPrompt = `${currentStep.title}. ${currentStep.egyptianExplanation} وبنقول: ${currentStep.dhikr}. ${currentStep.kidActionPrompt}`;
      await ttsService.speakText(speechPrompt, {
        speaker: 'Kore',
        style: 'Warm, encouraging, loving Egyptian Arabic cartoon teacher for 5 year old kid',
      });
    } catch (e) {
      console.error('TTS error:', e);
    } finally {
      setTtsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-amber-200 flex flex-col gap-5">
      {/* Step Header & Speech Button */}
      <div className="flex items-start justify-between gap-3 border-b border-amber-100 pb-4">
        <div>
          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
            خطوة الصلاة المباركة
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
            {currentStep.title}
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-0.5">
            {currentStep.subtitle}
          </p>
        </div>

        {/* Listen to Voice Narration (Gemini TTS) */}
        <button
          onClick={handleSpeak}
          disabled={ttsLoading}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 ${
            isSpeaking
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-emerald-300/50'
          }`}
          title="استمع إلى الشرح بصوت الراوي"
        >
          {isSpeaking ? (
            <>
              <Square className="w-4 h-4 fill-white" />
              <span>إيقاف الصوت</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>{ttsLoading ? 'جاري التجهيز...' : 'اسمع الشرح 🔊'}</span>
            </>
          )}
        </button>
      </div>

      {/* Egyptian Colloquial Narrative */}
      <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80">
        <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm mb-1.5">
          <span>🗣️</span>
          <span>شرح مبسط بالعامية المصرية الجميلة:</span>
        </div>
        <p className="text-base sm:text-lg font-bold text-slate-700 leading-relaxed">
          {currentStep.egyptianExplanation}
        </p>
      </div>

      {/* Grid: Dhikr to Say & Kid Action Prompt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dhikr Box */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>ماذا نقول بالصوت الهادئ؟</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-900 mb-1">
            {currentStep.dhikr}
          </div>
          <div className="text-xs font-semibold text-emerald-700">
            {currentStep.dhikrMeaning}
          </div>
        </div>

        {/* Action Prompt for the 5-year-old child */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-200">
          <div className="flex items-center gap-1.5 text-xs font-black text-purple-800 mb-1">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span>تحدي البطل الصغير الآن:</span>
          </div>
          <div className="text-base font-extrabold text-purple-950 mb-1">
            {currentStep.kidActionPrompt}
          </div>
          <div className="text-xs font-medium text-purple-700">
            {currentStep.funFact}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onOpenLiveVoice}
          className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>اسأل رفيق الصلاة المباشر (سمسم)</span>
        </button>

        <button
          onClick={onNext}
          className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow transition"
        >
          الخطوة التالية ➔
        </button>
      </div>
    </div>
  );
};
