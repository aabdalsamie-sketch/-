import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Compass,
} from 'lucide-react';
import { PRAYER_STEPS, TOTAL_VIDEO_DURATION_SECONDS } from '../data/prayerSteps';

interface VideoPlayerControlsProps {
  currentTime: number;
  isPlaying: boolean;
  isBgmActive: boolean;
  playbackSpeed: number;
  currentStepIndex: number;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onRestart: () => void;
  onToggleBgm: () => void;
  onChangeSpeed: (speed: number) => void;
  onOpenLiveBuddy: () => void;
  onOpenExplorer: () => void;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  currentTime,
  isPlaying,
  isBgmActive,
  playbackSpeed,
  currentStepIndex,
  onTogglePlay,
  onSeek,
  onNextStep,
  onPrevStep,
  onRestart,
  onToggleBgm,
  onChangeSpeed,
  onOpenLiveBuddy,
  onOpenExplorer,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(
    100,
    (currentTime / TOTAL_VIDEO_DURATION_SECONDS) * 100
  );

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-amber-200 flex flex-col gap-4">
      {/* 5-Minute Visual Scrubber with Step Markers */}
      <div className="relative flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600">
          <span className="flex items-center gap-1.5 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            الوقت: <span className="font-mono font-extrabold">{formatTime(currentTime)}</span>
          </span>
          <span className="text-slate-400">
            المدة الكاملة: <span className="font-mono font-bold">{formatTime(TOTAL_VIDEO_DURATION_SECONDS)} (٥ دقائق)</span>
          </span>
        </div>

        {/* Timeline track */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            // Handle RTL direction
            const width = rect.width;
            const ratio = 1 - clickX / width; // RTL: right is 0, left is 1
            const newSeconds = Math.max(0, Math.min(TOTAL_VIDEO_DURATION_SECONDS, ratio * TOTAL_VIDEO_DURATION_SECONDS));
            onSeek(newSeconds);
          }}
          className="relative w-full h-5 bg-amber-100 rounded-full cursor-pointer overflow-hidden p-0.5 border border-amber-300 shadow-inner group"
        >
          {/* Progress fill */}
          <div
            className="h-full bg-gradient-to-l from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-200 relative"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Sparkle handle on end */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-emerald-600 group-hover:scale-125 transition-transform flex items-center justify-center text-[8px]">
              ★
            </div>
          </div>

          {/* Step ticks */}
          {PRAYER_STEPS.map((step, idx) => {
            const tickPercent = (step.startTime / TOTAL_VIDEO_DURATION_SECONDS) * 100;
            return (
              <div
                key={step.id}
                style={{ right: `${tickPercent}%` }}
                className={`absolute top-0 bottom-0 w-0.5 pointer-events-none transition-colors ${
                  idx <= currentStepIndex ? 'bg-white/80' : 'bg-amber-300'
                }`}
                title={step.title}
              />
            );
          })}
        </div>

        {/* Mini Step Label preview */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 overflow-x-auto py-1 scrollbar-none gap-2">
          {PRAYER_STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => onSeek(step.startTime)}
              className={`flex-shrink-0 px-2 py-0.5 rounded-lg font-bold transition-all ${
                idx === currentStepIndex
                  ? 'bg-amber-500 text-white shadow-sm scale-105'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              {idx + 1}. {step.title.split('..')[0].split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-amber-100">
        {/* Playback Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Previous Step */}
          <button
            onClick={onPrevStep}
            disabled={currentStepIndex === 0}
            className="p-2 sm:p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-slate-700 disabled:opacity-40 transition shadow-sm active:scale-95"
            title="الخطوة السابقة"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* BIG PLAY / PAUSE BUTTON */}
          <button
            onClick={onTogglePlay}
            className={`px-5 sm:px-7 py-3 rounded-2xl font-black text-white text-base sm:text-lg flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
              isPlaying
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-orange-300/50'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-300/50'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-6 h-6 fill-white" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-white ml-0.5" />
                <span>شغّل الفيديو (٥ د)</span>
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            onClick={onNextStep}
            disabled={currentStepIndex === PRAYER_STEPS.length - 1}
            className="p-2 sm:p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-slate-700 disabled:opacity-40 transition shadow-sm active:scale-95"
            title="الخطوة التالية"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition shadow-sm active:scale-95"
            title="إعادة من البداية"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Audio & Speed Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Melodic Kids BGM Synthesizer toggle */}
          <button
            onClick={onToggleBgm}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm transition shadow-sm border ${
              isBgmActive
                ? 'bg-teal-50 text-teal-800 border-teal-300'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
            title="موسيقى هادئة للأطفال"
          >
            {isBgmActive ? (
              <>
                <Volume2 className="w-4 h-4 text-teal-600 animate-pulse" />
                <span>الموسيقى: تعمل 🎵</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span>الموسيقى: صامتة</span>
              </>
            )}
          </button>

          {/* Speed selector (0.75x, 1x, 1.25x) */}
          <div className="flex items-center bg-slate-100 rounded-2xl p-1 text-xs font-bold text-slate-700">
            {[0.75, 1, 1.25].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-1 rounded-xl transition ${
                  playbackSpeed === spd
                    ? 'bg-white shadow-sm text-amber-700'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Quick Shortcuts for Voice Buddy & Explorer */}
          <button
            onClick={onOpenLiveBuddy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>رفيق الصلاة المباشر</span>
          </button>

          <button
            onClick={onOpenExplorer}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>مستكشف جوجل</span>
          </button>
        </div>
      </div>
    </div>
  );
};
