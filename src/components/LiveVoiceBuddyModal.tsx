import React, { useEffect, useState } from 'react';
import { X, Mic, MicOff, Volume2, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import { liveService, LiveStatus } from '../services/liveService';
import { ttsService } from '../services/ttsService';

interface LiveVoiceBuddyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceBuddyModal: React.FC<LiveVoiceBuddyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [status, setStatus] = useState<LiveStatus>({
    connected: false,
    isListening: false,
    isSpeaking: false,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<'mic' | 'quickQuestions'>('mic');
  const [customReply, setCustomReply] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      liveService.stopMic();
      return;
    }

    const unsub = liveService.subscribe(setStatus);
    // Connect to WebSocket on open
    liveService.connect();

    return () => {
      unsub();
      liveService.stopMic();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMic = async () => {
    if (status.isListening) {
      liveService.stopMic();
    } else {
      await liveService.startMic();
    }
  };

  const quickQuestions = [
    {
      q: 'يا سمسم، ليه بنتوضأ قبل الصلاة؟',
      reply:
        'يا حبيبي يا شطور! بنتوضأ بالماء النظيف عشان قلوبنا وجسمنا ينوروا ونكون طاهرين وقمرات قدام ربنا حبيبنا!',
    },
    {
      q: 'كم عدد ركعات الصلوات الخمس يا سمسم؟',
      reply:
        'احفظها معايا يا بطل: الفجر ركعتين، والظهر أربعة، والعصر أربعة، والمغرب ثلاثة، والعشاء أربعة.. وكل ركعة بتملى ميزان حسناتك بالذهب!',
    },
    {
      q: 'أقول إيه لما أركع وأسجد؟',
      reply:
        'في الركوع بنقول: سبحان ربي العظيم ٣ مرات، وفي السجود الجميل بنقول: سبحان ربي الأعلى ٣ مرات وندعي بكل حاجة بنحبها!',
    },
    {
      q: 'شجعني يا سمسم أنا صليت ركعتين كاملين!',
      reply:
        'يا سلاااام! مبروك يا أحسن بطل صلاة في الدنيا! أنا فخور بيك أوي، وماما وبابا وكل الملائكة فرحانين بيك يا قمر!',
    },
  ];

  const handleQuickQuestion = async (item: { q: string; reply: string }) => {
    setCustomReply(item.reply);
    // Speak Semsem's cheerful reply in colloquial Egyptian using Gemini TTS
    ttsService.speakText(`يا بطل: ${item.reply}`, {
      speaker: 'Puck',
      style: 'Playful, cheerful, high-energy cartoon buddy Semsem for 5 year old child',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fade-in_0.2s_ease]">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-purple-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/30">
              🦊
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs bg-amber-400 text-purple-950 font-black px-2 py-0.5 rounded-full">
                  Gemini-3.8-Live API
                </span>
                <span className="text-xs text-purple-200 font-semibold">محادثة صوتية فورية</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black">
                تحدث مع سمسم (رفيق الصلاة)
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

        {/* Tab selection: Live Mic vs Quick Questions */}
        <div className="flex bg-purple-50 p-1.5 border-b border-purple-100">
          <button
            onClick={() => setActiveTab('mic')}
            className={`flex-1 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'mic'
                ? 'bg-white text-purple-900 shadow-sm'
                : 'text-purple-600 hover:bg-purple-100/50'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>الميكروفون المباشر (تحدث بصوتك)</span>
          </button>
          <button
            onClick={() => setActiveTab('quickQuestions')}
            className={`flex-1 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'quickQuestions'
                ? 'bg-white text-purple-900 shadow-sm'
                : 'text-purple-600 hover:bg-purple-100/50'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>أسئلة سريعة لسمسم</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col items-center">
          {activeTab === 'mic' ? (
            <div className="w-full flex flex-col items-center gap-5 text-center">
              {/* Friendly Semsem Avatar & Speaking animation */}
              <div className="relative mt-2">
                <div
                  className={`w-36 h-36 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-300 p-1 shadow-xl flex items-center justify-center transition-all ${
                    status.isSpeaking
                      ? 'ring-8 ring-amber-400 scale-110 animate-bounce'
                      : status.isListening
                      ? 'ring-8 ring-emerald-400 animate-pulse'
                      : ''
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-purple-100 flex flex-col items-center justify-center overflow-hidden relative">
                    <span className="text-6xl select-none">🦊</span>
                    {status.isSpeaking && (
                      <span className="absolute bottom-2 text-xs font-black text-purple-900 bg-amber-300 px-2 py-0.5 rounded-full shadow">
                        سمسم يتحدث... 🔊
                      </span>
                    )}
                  </div>
                </div>

                {/* Status indicator dot */}
                <div
                  className={`absolute bottom-1 right-2 px-2.5 py-1 rounded-full text-xs font-black text-white shadow-md flex items-center gap-1 ${
                    status.connected
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>{status.connected ? 'متصل' : 'جاري الاتصال...'}</span>
                </div>
              </div>

              {/* Status prompt */}
              <div>
                <p className="text-base sm:text-lg font-black text-slate-800">
                  {status.isSpeaking
                    ? 'اسمع سمسم بيرد عليك يا شطور!'
                    : status.isListening
                    ? 'سمسم بيسمعك دلوقتي.. اتكلم واسأله عن الصلاة!'
                    : 'اضغط على زر الميكروفون تحت واتكلم مع سمسم!'}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  يتحدث باللهجة المصرية العامية المبسطة للأطفال من سن 5 سنوات.
                </p>
              </div>

              {/* Error warning if any */}
              {status.error && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm p-3 rounded-2xl flex items-center gap-2 text-right">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span>{status.error}</span>
                </div>
              )}

              {/* Big Mic Button */}
              <button
                onClick={handleToggleMic}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${
                  status.isListening
                    ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white ring-4 ring-purple-200'
                }`}
                title={status.isListening ? 'إيقاف الميكروفون' : 'تشغيل الميكروفون والتحدث'}
              >
                {status.isListening ? (
                  <MicOff className="w-9 h-9" />
                ) : (
                  <Mic className="w-9 h-9" />
                )}
              </button>

              <div className="text-xs font-bold text-slate-400">
                {status.isListening ? 'اضغط للإيقاف' : 'اضغط للتحدث بصوتك'}
              </div>
            </div>
          ) : (
            /* Quick Questions list */
            <div className="w-full flex flex-col gap-3">
              <p className="text-xs sm:text-sm font-bold text-purple-900 text-right">
                اختر سؤالاً لطفلك ليسمع إجابة سمسم بصوت مرح وبالعامية المصرية:
              </p>

              {quickQuestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(item)}
                  className="w-full text-right p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 text-slate-800 transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-purple-200 text-purple-800 font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-black text-slate-800 group-hover:text-purple-950">
                      {item.q}
                    </span>
                  </div>
                  <Volume2 className="w-5 h-5 text-purple-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                </button>
              ))}

              {customReply && (
                <div className="mt-2 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-right animate-[fade-in_0.3s_ease]">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>رد سمسم الصديق:</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-800">
                    {customReply}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-3 text-center border-t border-slate-200 text-[11px] text-slate-500 font-medium">
          مدعوم بنموذج الذكاء الاصطناعي المباشر Gemini-3.8-Live مع نقل الصوت الفوري
        </div>
      </div>
    </div>
  );
};
