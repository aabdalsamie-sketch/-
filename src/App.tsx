import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  BookOpen,
  Award,
  Heart,
  Volume2,
  Clock,
  Compass,
  CheckCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { CharacterId, PrayerStep } from './types';
import { PRAYER_STEPS, TOTAL_VIDEO_DURATION_SECONDS } from './data/prayerSteps';
import { soundSynth } from './services/soundSynth';
import { ttsService } from './services/ttsService';

import { HeaderNav } from './components/HeaderNav';
import { PrayerAnimationScene } from './components/PrayerAnimationScene';
import { VideoPlayerControls } from './components/VideoPlayerControls';
import { StepExplanationCard } from './components/StepExplanationCard';
import { LiveVoiceBuddyModal } from './components/LiveVoiceBuddyModal';
import { PrayerGroundingExplorer } from './components/PrayerGroundingExplorer';
import { KidsPrayerQuizModal } from './components/KidsPrayerQuizModal';
import { PrayerCertificateModal } from './components/PrayerCertificateModal';

export default function App() {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [character, setCharacter] = useState<CharacterId>('ahmad');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isBgmActive, setIsBgmActive] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Modals state
  const [isLiveBuddyOpen, setIsLiveBuddyOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const prevStepIdRef = useRef<string>(PRAYER_STEPS[0].id);

  // Subscribe to TTS status
  useEffect(() => {
    const unsub = ttsService.subscribe(setIsSpeaking);
    return () => {
      unsub();
    };
  }, []);

  // Determine current step based on currentTime
  const currentStepIndex = Math.max(
    0,
    PRAYER_STEPS.findIndex((step, idx) => {
      const nextStep = PRAYER_STEPS[idx + 1];
      if (!nextStep) return true;
      return currentTime >= step.startTime && currentTime < nextStep.startTime;
    })
  );

  const currentStep = PRAYER_STEPS[currentStepIndex] || PRAYER_STEPS[0];

  // Calculate time remaining in this step
  const nextStepTime =
    currentStepIndex < PRAYER_STEPS.length - 1
      ? PRAYER_STEPS[currentStepIndex + 1].startTime
      : TOTAL_VIDEO_DURATION_SECONDS;
  const timeRemainingInStep = Math.max(0, nextStepTime - currentTime);

  // Play step transition sound when step changes
  useEffect(() => {
    if (currentStep.id !== prevStepIdRef.current) {
      prevStepIdRef.current = currentStep.id;
      soundSynth.playStepChime();
    }
  }, [currentStep.id]);

  // Video playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 200;
    const increment = (intervalMs / 1000) * playbackSpeed;

    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + increment;
        if (next >= TOTAL_VIDEO_DURATION_SECONDS) {
          setIsPlaying(false);
          soundSynth.playFanfare();
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 },
          });
          return TOTAL_VIDEO_DURATION_SECONDS;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const handleTogglePlay = () => {
    if (currentTime >= TOTAL_VIDEO_DURATION_SECONDS) {
      setCurrentTime(0);
    }
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);

    // Auto start background lullaby on first play if user desires
    if (nextPlay && !isBgmActive) {
      soundSynth.startBgm();
      setIsBgmActive(true);
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(Math.min(TOTAL_VIDEO_DURATION_SECONDS, Math.max(0, seconds)));
  };

  const handleNextStep = () => {
    if (currentStepIndex < PRAYER_STEPS.length - 1) {
      const nextStep = PRAYER_STEPS[currentStepIndex + 1];
      setCurrentTime(nextStep.startTime);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevStep = PRAYER_STEPS[currentStepIndex - 1];
      setCurrentTime(prevStep.startTime);
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleToggleBgm = () => {
    const active = soundSynth.toggleBgm();
    setIsBgmActive(active);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-amber-100/50 flex flex-col font-['Baloo_Bhaijaan_2',_'Tajawal',_sans-serif]">
      {/* Top Navigation */}
      <HeaderNav
        isBgmActive={isBgmActive}
        onToggleBgm={handleToggleBgm}
        onOpenLiveBuddy={() => setIsLiveBuddyOpen(true)}
        onOpenExplorer={() => setIsExplorerOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Hero Banner for 5yo Kids */}
        <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative z-10 text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-emerald-950 font-black text-xs px-3 py-1 rounded-full shadow-sm">
                فيديو كرتوني تفاعلي • ٥ دقائق بالتمام
              </span>
              <span className="text-emerald-100 text-xs font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> مدة مخصصة لتركيز طفل ٥ سنوات
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black">
              يلا يا بطل.. نتعلم الصلاة سوا ببساطة وباللهجة العامية!
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-semibold mt-1 max-w-xl">
              شاهد أحمد ونور وهم يصلون خطوة بخطوة، مع موسيقى هادئة، وشرح دافئ بالعامية المصرية، ورفيق صوتي ذكي يجيب عن أسئلتك!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
            <button
              onClick={handleTogglePlay}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm sm:text-base shadow-xl flex items-center gap-2 transition transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? 'إيقاف مؤقت ⏸' : 'ابدأ الفيديو الآن ▶'}
            </button>
            <button
              onClick={() => setIsLiveBuddyOpen(true)}
              className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-extrabold text-sm border border-white/30 backdrop-blur-md transition flex items-center gap-2"
            >
              <span>كلم سمسم 🦊</span>
            </button>
          </div>

          {/* Decorative background shapes */}
          <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-white/10 pointer-events-none"></div>
          <div className="absolute right-1/2 -top-12 w-32 h-32 rounded-full bg-amber-400/20 pointer-events-none"></div>
        </section>

        {/* 1. Animated Video Stage */}
        <section aria-label="شاشة الرسوم المتحركة للصلاة">
          <PrayerAnimationScene
            currentStep={currentStep}
            character={character}
            isPlaying={isPlaying}
            timeRemaining={timeRemainingInStep}
            onCharacterChange={(c) => setCharacter(c)}
          />
        </section>

        {/* 2. Video Player Controls (5 Minutes Scrubber & Synthesizer) */}
        <section aria-label="لوحة التحكم في الفيديو">
          <VideoPlayerControls
            currentTime={currentTime}
            isPlaying={isPlaying}
            isBgmActive={isBgmActive}
            playbackSpeed={playbackSpeed}
            currentStepIndex={currentStepIndex}
            onTogglePlay={handleTogglePlay}
            onSeek={handleSeek}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            onRestart={handleRestart}
            onToggleBgm={handleToggleBgm}
            onChangeSpeed={(spd) => setPlaybackSpeed(spd)}
            onOpenLiveBuddy={() => setIsLiveBuddyOpen(true)}
            onOpenExplorer={() => setIsExplorerOpen(true)}
          />
        </section>

        {/* 3. Detailed Step Explanation in Warm Egyptian Colloquial & Dhikr */}
        <section aria-label="شرح الخطوة الحالية">
          <StepExplanationCard
            currentStep={currentStep}
            isSpeaking={isSpeaking}
            onNext={handleNextStep}
            onOpenLiveVoice={() => setIsLiveBuddyOpen(true)}
          />
        </section>

        {/* 4. Interactive Step Grid Navigation for Kids & Parents */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-amber-200">
          <div className="flex items-center justify-between mb-4 border-b border-amber-100 pb-3">
            <div className="flex items-center gap-2 text-slate-800">
              <span className="text-xl">🗺️</span>
              <h3 className="text-lg sm:text-xl font-black">
                خريطة خطوات الصلاة (اضغط للقفز لأي خطوة)
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
              {currentStepIndex + 1} من {PRAYER_STEPS.length} خطوات
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {PRAYER_STEPS.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isCompleted = idx < currentStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => handleSeek(step.startTime)}
                  className={`p-3 rounded-2xl border-2 text-right transition-all flex flex-col justify-between h-28 relative group shadow-sm ${
                    isCurrent
                      ? 'bg-amber-100/80 border-amber-500 shadow-md ring-2 ring-amber-300 scale-102'
                      : isCompleted
                      ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-400'
                      : 'bg-slate-50 border-slate-200 hover:bg-amber-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                        isCurrent
                          ? 'bg-amber-500 text-white'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-extrabold text-slate-800 line-clamp-1 leading-snug">
                      {step.title.split('..')[0]}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 mt-0.5 line-clamp-1">
                      {step.subtitle}
                    </div>
                  </div>

                  <div className="text-[9px] font-mono font-bold text-amber-800 text-left">
                    {Math.floor(step.startTime / 60)}:
                    {(step.startTime % 60).toString().padStart(2, '0')}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. Parent & Educator Guide for 5-Year-Olds */}
        <section className="bg-gradient-to-br from-amber-100/60 to-orange-100/60 rounded-3xl p-5 sm:p-6 border-2 border-amber-300">
          <div className="flex items-center gap-2 text-amber-900 font-black text-lg mb-3">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>نصائح ذهبية لتعليم طفل ٥ سنوات الصلاة بحب وفرح</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-700 text-sm font-bold">
            <div className="bg-white/90 p-4 rounded-2xl shadow-sm border border-amber-200">
              <span className="text-lg block mb-1">🎁 التشجيع والمدح</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                امدح الطفل عندما يقف على السجادة وافرش له سجادة ملونة خاصة به تناسب حجمه ليرتبط بها وجدانياً.
              </p>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl shadow-sm border border-amber-200">
              <span className="text-lg block mb-1">🕊️ القدورة الصامتة</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                الأطفال في سن 5 يقلدون حركات الوالدين تلقائياً، اجعله يقف بجانبك دون توبيخ أو تدقيق في الأخطاء.
              </p>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl shadow-sm border border-amber-200">
              <span className="text-lg block mb-1">⭐ التدرج والمرح</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                ركعة واحدة بفرح خير من إجباره على أربع ركعات؛ اجعل الصلاة مصحوبة بابتسامة وعناق دافئ بعد السلام.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-amber-200 py-6 text-center text-xs text-slate-500 font-bold">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            بستان الصلاة للأطفال © ٢٠٢٦ • مصمم خصيصاً لتعليم الصلاة بالعامية المصرية البسيطة مع الصوت والموسيقى
          </p>
          <div className="flex items-center gap-4 text-amber-800">
            <button onClick={() => setIsLiveBuddyOpen(true)} className="hover:underline">
              رفيق الصلاة المباشر
            </button>
            <button onClick={() => setIsExplorerOpen(true)} className="hover:underline">
              مستكشف جوجل
            </button>
            <button onClick={() => setIsQuizOpen(true)} className="hover:underline">
              لعبة الصلاة
            </button>
            <button onClick={() => setIsCertificateOpen(true)} className="hover:underline">
              شهادة بطل الصلاة
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LiveVoiceBuddyModal
        isOpen={isLiveBuddyOpen}
        onClose={() => setIsLiveBuddyOpen(false)}
      />

      <PrayerGroundingExplorer
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
      />

      <KidsPrayerQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      <PrayerCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        defaultChildName={character === 'ahmad' ? 'أحمد البطل' : 'نور الزهرة'}
      />
    </div>
  );
}
