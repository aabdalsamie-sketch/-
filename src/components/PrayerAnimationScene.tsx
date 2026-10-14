import React from 'react';
import { CharacterId, PrayerStep } from '../types';

interface PrayerAnimationSceneProps {
  currentStep: PrayerStep;
  character: CharacterId;
  isPlaying: boolean;
  timeRemaining: number;
  onCharacterChange: (char: CharacterId) => void;
}

export const PrayerAnimationScene: React.FC<PrayerAnimationSceneProps> = ({
  currentStep,
  character,
  isPlaying,
  timeRemaining,
  onCharacterChange,
}) => {
  const isAhmad = character === 'ahmad';
  const posture = currentStep.posture;

  // Character palette
  const outfitColor = isAhmad ? '#10b981' : '#ec4899'; // Emerald green vs Bright Pink
  const secondaryColor = isAhmad ? '#f59e0b' : '#a855f7'; // Amber vs Purple
  const skinTone = '#fcd34d'; // Warm warm cartoon golden skin
  const blushColor = '#f43f5e';

  return (
    <div className="relative w-full aspect-video max-h-[580px] min-h-[380px] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 select-none flex flex-col justify-between">
      {/* Dynamic Animated Sky / Room Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Sun with smiling face */}
        <div className="absolute top-4 left-6 sm:left-12 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-lg shadow-yellow-200/50 flex items-center justify-center animate-pulse">
          <svg className="w-14 h-14 text-amber-700/70" viewBox="0 0 100 100" fill="none">
            {/* Sun rays */}
            <circle cx="50" cy="50" r="28" fill="#fef08a" />
            {/* Cute eyes & smile */}
            <circle cx="40" cy="46" r="4" fill="#854d0e" />
            <circle cx="60" cy="46" r="4" fill="#854d0e" />
            <path d="M 38 58 Q 50 68 62 58" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
            {/* Blushes */}
            <circle cx="34" cy="54" r="3" fill="#fb7185" />
            <circle cx="66" cy="54" r="3" fill="#fb7185" />
          </svg>
        </div>

        {/* Floating Cartoon Clouds */}
        <div className="absolute top-8 right-16 opacity-80 animate-[bounce_8s_ease-in-out_infinite]">
          <div className="w-28 h-10 bg-white rounded-full shadow-sm relative">
            <div className="w-12 h-12 bg-white rounded-full absolute -top-5 left-4"></div>
            <div className="w-14 h-14 bg-white rounded-full absolute -top-7 right-4"></div>
          </div>
        </div>
        <div className="absolute top-20 left-1/3 opacity-70 animate-[bounce_10s_ease-in-out_infinite] hidden sm:block">
          <div className="w-20 h-8 bg-white rounded-full shadow-sm relative">
            <div className="w-10 h-10 bg-white rounded-full absolute -top-4 left-3"></div>
          </div>
        </div>

        {/* Room Arch & Islamic Lantern (فانوس) */}
        <div className="absolute -top-4 right-8 sm:right-24 z-10 animate-[wiggle_4s_ease-in-out_infinite] origin-top">
          <svg className="w-12 h-24 sm:w-16 sm:h-32 drop-shadow-md" viewBox="0 0 80 160">
            <line x1="40" y1="0" x2="40" y2="40" stroke="#92400e" strokeWidth="3" />
            {/* Lantern body */}
            <path d="M 25 40 L 55 40 L 65 65 L 55 110 L 25 110 L 15 65 Z" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            {/* Glowing glass center */}
            <path d="M 30 50 L 50 50 L 58 70 L 50 100 L 30 100 L 22 70 Z" fill="#fef08a" opacity="0.9" />
            {/* Soft inner flame */}
            <circle cx="40" cy="75" r="8" fill="#f97316" className="animate-ping" opacity="0.6" />
            <circle cx="40" cy="75" r="6" fill="#fde047" />
            {/* Base and top cap */}
            <polygon points="35,110 45,110 40,125" fill="#b45309" />
            <circle cx="40" cy="38" r="6" fill="#b45309" />
          </svg>
        </div>

        {/* Beautiful Islamic Arched Window Frame */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-amber-100/90 to-transparent"></div>
        {/* Floor Line */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-amber-200 to-amber-100 border-t-2 border-amber-300"></div>
      </div>

      {/* Top Header Controls within the Video Viewport */}
      <div className="relative z-20 flex items-center justify-between p-3 sm:p-5">
        {/* Step Badge with friendly number */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-md border-2 border-amber-200">
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm shadow">
            ★
          </span>
          <div>
            <div className="text-xs text-amber-800 font-bold">خطوة التعليم</div>
            <div className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight">
              {currentStep.title}
            </div>
          </div>
        </div>

        {/* Character Switcher (أحمد / نور) */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-md border-2 border-amber-200">
          <button
            onClick={() => onCharacterChange('ahmad')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              isAhmad
                ? 'bg-emerald-500 text-white shadow-md scale-105'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
            title="اختر أحمد"
          >
            <span className="text-base">👦</span>
            <span>أحمد</span>
          </button>
          <button
            onClick={() => onCharacterChange('nour')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              !isAhmad
                ? 'bg-pink-500 text-white shadow-md scale-105'
                : 'text-slate-600 hover:bg-pink-50'
            }`}
            title="اختر نور"
          >
            <span className="text-base">👧</span>
            <span>نور</span>
          </button>
        </div>
      </div>

      {/* Central Interactive Animation Stage */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-end pb-3 sm:pb-6">
        {/* Floating Action / Dhikr Bubble */}
        <div className="mb-2 sm:mb-4 px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border-3 border-amber-400 max-w-[90%] text-center transform hover:scale-105 transition-transform animate-bounce">
          <span className="text-xs sm:text-sm font-bold text-amber-700 block">
            {currentStep.kidActionPrompt}
          </span>
          <span className="text-base sm:text-xl font-black text-emerald-700 block mt-0.5 tracking-wide">
            {currentStep.dhikr}
          </span>
        </div>

        {/* Prayer Rug & 2D Animated Character */}
        <div className="relative flex items-center justify-center w-full max-w-md">
          {/* Decorative Prayer Rug (سجادة الصلاة) */}
          <div
            className={`absolute bottom-0 w-64 sm:w-80 h-16 sm:h-20 rounded-3xl transform -skew-x-12 shadow-2xl transition-all duration-700 border-2 ${
              posture === 'sujud' ? 'scale-110 shadow-emerald-400/50' : 'scale-100'
            } bg-gradient-to-r from-teal-700 via-teal-600 to-teal-800 border-amber-300 flex items-center justify-around px-4 overflow-hidden`}
          >
            {/* Fringe details */}
            <div className="absolute left-0 inset-y-0 w-3 bg-amber-200 border-r border-amber-400"></div>
            <div className="absolute right-0 inset-y-0 w-3 bg-amber-200 border-l border-amber-400"></div>
            {/* Rug Arch design */}
            <div className="w-16 h-12 border-2 border-amber-300 rounded-t-full opacity-60"></div>
            <div className="text-amber-200 text-xs font-mono opacity-80">✦ ✦ ✦</div>
            <div className="w-16 h-12 border-2 border-amber-300 rounded-t-full opacity-60"></div>
          </div>

          {/* SVG Cartoon Character */}
          <div className="relative z-10 transform transition-all duration-500 mb-4 sm:mb-6">
            <svg
              className={`w-48 h-64 sm:w-56 sm:h-76 drop-shadow-2xl transition-transform duration-500 ${
                isPlaying ? 'animate-[subtle-bob_2.5s_ease-in-out_infinite]' : ''
              }`}
              viewBox="0 0 200 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Glowing Noor Aura around child during prayer */}
              <circle cx="100" cy="90" r="75" fill="url(#auraGlow)" className="animate-pulse" />

              {/* --- RENDER POSTURES --- */}

              {/* 1. STANDING / IDLE / INTRO / WUDU */}
              {(posture === 'standing' || posture === 'standing_straight') && (
                <g className="animate-[fade-in_0.4s_ease]">
                  {/* Feet */}
                  <ellipse cx="85" cy="245" rx="12" ry="6" fill="#475569" />
                  <ellipse cx="115" cy="245" rx="12" ry="6" fill="#475569" />

                  {/* Body / Thawb / Dress */}
                  <path
                    d="M 75 140 L 60 240 L 140 240 L 125 140 Z"
                    fill={outfitColor}
                    stroke="#047857"
                    strokeWidth="3"
                  />
                  {/* Golden belt / trim */}
                  <rect x="70" y="165" width="60" height="8" rx="4" fill={secondaryColor} />

                  {/* Arms at sides */}
                  <path d="M 70 145 Q 55 180 62 205" stroke={outfitColor} strokeWidth="14" strokeLinecap="round" />
                  <circle cx="62" cy="207" r="7" fill={skinTone} />
                  <path d="M 130 145 Q 145 180 138 205" stroke={outfitColor} strokeWidth="14" strokeLinecap="round" />
                  <circle cx="138" cy="207" r="7" fill={skinTone} />

                  {/* Character Head */}
                  <HeadElement
                    cx={100}
                    cy={95}
                    isAhmad={isAhmad}
                    skinTone={skinTone}
                    blushColor={blushColor}
                    secondaryColor={secondaryColor}
                    smileType="big"
                  />
                </g>
              )}

              {/* 2. TAKBIR (Hands raised to ears) */}
              {posture === 'takbir' && (
                <g className="animate-[fade-in_0.4s_ease]">
                  {/* Feet */}
                  <ellipse cx="85" cy="245" rx="12" ry="6" fill="#475569" />
                  <ellipse cx="115" cy="245" rx="12" ry="6" fill="#475569" />

                  {/* Body */}
                  <path
                    d="M 75 140 L 60 240 L 140 240 L 125 140 Z"
                    fill={outfitColor}
                    stroke="#047857"
                    strokeWidth="3"
                  />
                  <rect x="70" y="165" width="60" height="8" rx="4" fill={secondaryColor} />

                  {/* Raised Arms beside ears */}
                  {/* Left Arm (viewer's left) */}
                  <path d="M 70 145 Q 45 125 52 95" stroke={outfitColor} strokeWidth="14" strokeLinecap="round" />
                  {/* Hand palm facing front */}
                  <ellipse cx="52" cy="90" rx="9" ry="11" fill={skinTone} />
                  <circle cx="52" cy="83" r="3" fill={skinTone} />

                  {/* Right Arm (viewer's right) */}
                  <path d="M 130 145 Q 155 125 148 95" stroke={outfitColor} strokeWidth="14" strokeLinecap="round" />
                  <ellipse cx="148" cy="90" rx="9" ry="11" fill={skinTone} />
                  <circle cx="148" cy="83" r="3" fill={skinTone} />

                  {/* Head */}
                  <HeadElement
                    cx={100}
                    cy={95}
                    isAhmad={isAhmad}
                    skinTone={skinTone}
                    blushColor={blushColor}
                    secondaryColor={secondaryColor}
                    smileType="serene"
                  />
                </g>
              )}

              {/* 3. QIYAAM / FATIHA (Hands folded on chest, right over left) */}
              {posture === 'qiyam' && (
                <g className="animate-[fade-in_0.4s_ease]">
                  {/* Feet */}
                  <ellipse cx="85" cy="245" rx="12" ry="6" fill="#475569" />
                  <ellipse cx="115" cy="245" rx="12" ry="6" fill="#475569" />

                  {/* Body */}
                  <path
                    d="M 75 140 L 60 240 L 140 240 L 125 140 Z"
                    fill={outfitColor}
                    stroke="#047857"
                    strokeWidth="3"
                  />
                  <rect x="70" y="185" width="60" height="8" rx="4" fill={secondaryColor} />

                  {/* Arms folded on chest */}
                  <path d="M 70 145 Q 85 160 100 160" stroke={outfitColor} strokeWidth="14" strokeLinecap="round" />
                  <path d="M 130 145 Q 115 160 100 160" stroke={outfitColor} strokeWidth="14" strokeLinecap="round" />
                  {/* Right hand over left on chest */}
                  <rect x="88" y="152" width="24" height="15" rx="7" fill={skinTone} />

                  {/* Head looking down with humility at prayer rug */}
                  <HeadElement
                    cx={100}
                    cy={95}
                    isAhmad={isAhmad}
                    skinTone={skinTone}
                    blushColor={blushColor}
                    secondaryColor={secondaryColor}
                    smileType="peaceful_down"
                  />
                </g>
              )}

              {/* 4. RUKU (Bowing horizontally, straight back, hands on knees) */}
              {posture === 'ruku' && (
                <g className="animate-[fade-in_0.4s_ease]">
                  {/* Legs standing straight */}
                  <rect x="125" y="175" width="16" height="70" rx="8" fill="#047857" />
                  <rect x="145" y="175" width="16" height="70" rx="8" fill="#047857" />
                  <ellipse cx="132" cy="248" rx="12" ry="6" fill="#475569" />
                  <ellipse cx="152" cy="248" rx="12" ry="6" fill="#475569" />

                  {/* Torso horizontal */}
                  <path
                    d="M 145 185 L 145 155 L 75 155 L 70 185 Z"
                    fill={outfitColor}
                    stroke="#047857"
                    strokeWidth="3"
                  />
                  {/* Arms extending to knees */}
                  <line x1="85" y1="165" x2="130" y2="195" stroke={outfitColor} strokeWidth="12" strokeLinecap="round" />
                  {/* Hands grasping knee */}
                  <circle cx="130" cy="195" r="8" fill={skinTone} />

                  {/* Bowed Head */}
                  <HeadElement
                    cx={65}
                    cy={150}
                    isAhmad={isAhmad}
                    skinTone={skinTone}
                    blushColor={blushColor}
                    secondaryColor={secondaryColor}
                    smileType="subdued"
                  />
                </g>
              )}

              {/* 5. SUJUD (Forehead, nose, hands, knees on ground) */}
              {posture === 'sujud' && (
                <g className="animate-[fade-in_0.4s_ease]">
                  {/* Feet with toes pointed toward Qibla */}
                  <ellipse cx="160" cy="235" rx="8" ry="10" fill="#475569" />
                  <ellipse cx="150" cy="238" rx="8" ry="10" fill="#475569" />

                  {/* Arched Thawb / Back in prostration */}
                  <path
                    d="M 155 235 Q 120 175 80 230 Z"
                    fill={outfitColor}
                    stroke="#047857"
                    strokeWidth="3"
                  />

                  {/* Arms resting beside head on mat */}
                  <path d="M 85 210 Q 65 215 55 235" stroke={outfitColor} strokeWidth="12" strokeLinecap="round" />
                  {/* Hands on mat beside head */}
                  <ellipse cx="50" cy="238" rx="8" ry="5" fill={skinTone} />
                  <ellipse cx="75" cy="238" rx="8" ry="5" fill={skinTone} />

                  {/* Forehead on floor */}
                  <HeadElement
                    cx={60}
                    cy={225}
                    isAhmad={isAhmad}
                    skinTone={skinTone}
                    blushColor={blushColor}
                    secondaryColor={secondaryColor}
                    smileType="closed_eye_sujud"
                  />

                  {/* Little floating angel stars */}
                  <text x="35" y="195" fill="#f59e0b" fontSize="16" className="animate-ping">✦</text>
                  <text x="85" y="180" fill="#10b981" fontSize="18" className="animate-bounce">★</text>
                </g>
              )}

              {/* 6. SITTING / JALSA / TASHAHHUD */}
              {(posture === 'sitting' || posture === 'tashahhud' || posture === 'tasleem_right' || posture === 'tasleem_left') && (
                <g className="animate-[fade-in_0.4s_ease]">
                  {/* Folded legs sitting on heels */}
                  <ellipse cx="100" cy="235" rx="45" ry="18" fill="#047857" />
                  <ellipse cx="100" cy="232" rx="42" ry="16" fill={outfitColor} />

                  {/* Upright seated torso */}
                  <path
                    d="M 75 160 L 70 230 L 130 230 L 125 160 Z"
                    fill={outfitColor}
                    stroke="#047857"
                    strokeWidth="3"
                  />

                  {/* Arms on thighs */}
                  <line x1="75" y1="165" x2="82" y2="215" stroke={outfitColor} strokeWidth="12" strokeLinecap="round" />
                  <circle cx="82" cy="217" r="7" fill={skinTone} />

                  {posture === 'tashahhud' ? (
                    // Tashahhud pointing finger
                    <>
                      <line x1="125" y1="165" x2="116" y2="210" stroke={outfitColor} strokeWidth="12" strokeLinecap="round" />
                      {/* Hand with pointing index finger */}
                      <circle cx="116" cy="210" r="7" fill={skinTone} />
                      <line x1="116" y1="210" x2="116" y2="196" stroke={skinTone} strokeWidth="4" strokeLinecap="round" />
                      {/* Little star on index tip */}
                      <circle cx="116" cy="194" r="3" fill="#f59e0b" className="animate-ping" />
                    </>
                  ) : (
                    <>
                      <line x1="125" y1="165" x2="118" y2="215" stroke={outfitColor} strokeWidth="12" strokeLinecap="round" />
                      <circle cx="118" cy="217" r="7" fill={skinTone} />
                    </>
                  )}

                  {/* Head orientation */}
                  <HeadElement
                    cx={100}
                    cy={115}
                    isAhmad={isAhmad}
                    skinTone={skinTone}
                    blushColor={blushColor}
                    secondaryColor={secondaryColor}
                    smileType="big"
                    facingDirection={
                      posture === 'tasleem_right' ? 'right' : posture === 'tasleem_left' ? 'left' : 'center'
                    }
                  />
                </g>
              )}

              {/* 7. CELEBRATION / WINNER POSTURE */}
              {posture === 'celebrating' && (
                <g className="animate-[bounce_1s_infinite]">
                  {/* Feet jumping */}
                  <ellipse cx="85" cy="235" rx="12" ry="6" fill="#475569" />
                  <ellipse cx="115" cy="235" rx="12" ry="6" fill="#475569" />

                  {/* Body */}
                  <path
                    d="M 75 130 L 60 230 L 140 230 L 125 130 Z"
                    fill={outfitColor}
                    stroke="#047857"
                    strokeWidth="3"
                  />

                  {/* Cheerful victory arms raised high */}
                  <path d="M 70 135 Q 40 100 45 75" stroke={outfitColor} strokeWidth="14" strokeLinecap="round" />
                  <circle cx="45" cy="73" r="8" fill={skinTone} />

                  <path d="M 130 135 Q 160 100 155 75" stroke={outfitColor} strokeWidth="14" strokeLinecap="round" />
                  <circle cx="155" cy="73" r="8" fill={skinTone} />

                  {/* Head */}
                  <HeadElement
                    cx={100}
                    cy={90}
                    isAhmad={isAhmad}
                    skinTone={skinTone}
                    blushColor={blushColor}
                    secondaryColor={secondaryColor}
                    smileType="big"
                  />
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Subtitle Bar (Egyptian Colloquial dialogue subtitle) */}
      <div className="relative z-20 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 sm:px-6 sm:py-3 text-white flex items-center justify-between border-t-2 border-amber-400/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-lg flex-shrink-0">
            🎙️
          </span>
          <p className="text-xs sm:text-sm md:text-base font-semibold leading-relaxed line-clamp-2 text-amber-100">
            {currentStep.egyptianExplanation}
          </p>
        </div>

        {/* Small badge of time left */}
        <div className="hidden sm:flex flex-col items-end flex-shrink-0 mr-3">
          <span className="text-[11px] text-amber-300 font-bold">باقي للخطوة</span>
          <span className="text-sm font-extrabold text-white font-mono">
            {Math.max(0, Math.floor(timeRemaining))} ثانية
          </span>
        </div>
      </div>
    </div>
  );
};

// Reusable SVG Cartoon Head for Ahmad / Nour with cute Islamic cap or hijab
interface HeadProps {
  cx: number;
  cy: number;
  isAhmad: boolean;
  skinTone: string;
  blushColor: string;
  secondaryColor: string;
  smileType: 'big' | 'serene' | 'peaceful_down' | 'subdued' | 'closed_eye_sujud';
  facingDirection?: 'center' | 'right' | 'left';
}

const HeadElement: React.FC<HeadProps> = ({
  cx,
  cy,
  isAhmad,
  skinTone,
  blushColor,
  secondaryColor,
  smileType,
  facingDirection = 'center',
}) => {
  const eyeShift = facingDirection === 'right' ? 8 : facingDirection === 'left' ? -8 : 0;

  return (
    <g>
      {/* Head Circle */}
      <circle cx={cx} cy={cy} r="32" fill={skinTone} stroke="#b45309" strokeWidth="1.5" />

      {/* Girl: Hijab Frame / Boy: Taqiyah (Kufi cap) */}
      {isAhmad ? (
        // Ahmad's Cap (Taqiyah)
        <g>
          <path
            d={`M ${cx - 32} ${cy - 8} Q ${cx} ${cy - 48} ${cx + 32} ${cy - 8} Z`}
            fill="#ffffff"
            stroke="#047857"
            strokeWidth="2"
          />
          {/* Decorative band on cap */}
          <path
            d={`M ${cx - 30} ${cy - 8} Q ${cx} ${cy - 22} ${cx + 30} ${cy - 8}`}
            stroke={secondaryColor}
            strokeWidth="3"
            fill="none"
          />
          {/* Hair bangs */}
          <path
            d={`M ${cx - 24} ${cy - 6} Q ${cx - 10} ${cy + 6} ${cx} ${cy - 4} Q ${cx + 10} ${cy + 6} ${cx + 24} ${cy - 6}`}
            fill="#1e293b"
          />
        </g>
      ) : (
        // Nour's Hijab (Beautiful pink/lavender scarf)
        <g>
          <path
            d={`M ${cx - 36} ${cy + 10} Q ${cx - 38} ${cy - 44} ${cx} ${cy - 44} Q ${cx + 38} ${cy - 44} ${cx + 36} ${cy + 10} Q ${cx + 40} ${cy + 34} ${cx} ${cy + 36} Q ${cx - 40} ${cy + 34} ${cx - 36} ${cy + 10} Z`}
            fill="#ec4899"
            stroke="#be185d"
            strokeWidth="2"
          />
          {/* Cute Flower decoration on scarf */}
          <circle cx={cx - 22} cy={cy - 26} r="5" fill="#fef08a" />
          <circle cx={cx - 22} cy={cy - 26} r="2" fill="#f97316" />
        </g>
      )}

      {/* Big Cute Cartoon Eyes */}
      {smileType === 'closed_eye_sujud' || smileType === 'peaceful_down' ? (
        // Happy closed eyes curves
        <g>
          <path
            d={`M ${cx - 16 + eyeShift} ${cy + 2} Q ${cx - 10 + eyeShift} ${cy + 9} ${cx - 4 + eyeShift} ${cy + 2}`}
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx + 4 + eyeShift} ${cy + 2} Q ${cx + 10 + eyeShift} ${cy + 9} ${cx + 16 + eyeShift} ${cy + 2}`}
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ) : (
        // Open wide sparkling eyes
        <g>
          {/* Left Eye */}
          <circle cx={cx - 10 + eyeShift} cy={cy - 1} r="6" fill="#0f172a" />
          <circle cx={cx - 12 + eyeShift} cy={cy - 3} r="2.2" fill="#ffffff" />
          {/* Right Eye */}
          <circle cx={cx + 10 + eyeShift} cy={cy - 1} r="6" fill="#0f172a" />
          <circle cx={cx + 8 + eyeShift} cy={cy - 3} r="2.2" fill="#ffffff" />
          {/* Eyebrows */}
          <path
            d={`M ${cx - 16 + eyeShift} ${cy - 11} Q ${cx - 10 + eyeShift} ${cy - 15} ${cx - 4 + eyeShift} ${cy - 11}`}
            stroke="#334155"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx + 4 + eyeShift} ${cy - 11} Q ${cx + 10 + eyeShift} ${cy - 15} ${cx + 16 + eyeShift} ${cy - 11}`}
            stroke="#334155"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {/* Cute Rosy Cheeks */}
      <circle cx={cx - 18 + eyeShift} cy={cy + 8} r="5" fill={blushColor} opacity="0.6" />
      <circle cx={cx + 18 + eyeShift} cy={cy + 8} r="5" fill={blushColor} opacity="0.6" />

      {/* Cute Little Nose */}
      <circle cx={cx + eyeShift} cy={cy + 5} r="2" fill="#d97706" />

      {/* Smile Mouth */}
      {smileType === 'big' ? (
        <path
          d={`M ${cx - 8 + eyeShift} ${cy + 13} Q ${cx + eyeShift} ${cy + 24} ${cx + 8 + eyeShift} ${cy + 13} Z`}
          fill="#be123c"
        />
      ) : (
        <path
          d={`M ${cx - 7 + eyeShift} ${cy + 14} Q ${cx + eyeShift} ${cy + 20} ${cx + 7 + eyeShift} ${cy + 14}`}
          stroke="#be123c"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </g>
  );
};
