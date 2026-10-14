import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Award, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { soundSynth } from '../services/soundSynth';

interface KidsPrayerQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCertificate: () => void;
}

interface QuizQuestion {
  question: string;
  egyptianPrompt: string;
  options: { text: string; icon: string; isCorrect: boolean }[];
  congratsMessage: string;
}

export const KidsPrayerQuizModal: React.FC<KidsPrayerQuizModalProps> = ({
  isOpen,
  onClose,
  onOpenCertificate,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const questions: QuizQuestion[] = [
    {
      question: 'لما نبدأ الصلاة ونرفع إيدينا الحلوين جمب ودانا.. بنقول إيه؟',
      egyptianPrompt: 'يلا يا شاطر فكر.. أول كلمة بنبدأ بيها صلاتنا إيه؟',
      options: [
        { text: 'اللهُ أَكْبَرُ! (تكبيرة الإحرام)', icon: '🌟', isCorrect: true },
        { text: 'باي باي ومع السلامة', icon: '👋', isCorrect: false },
      ],
      congratsMessage: 'شاطر أوي وبطل! بنقول: الله أكبر ونبدأ نكلم ربنا!',
    },
    {
      question: 'في الركوع.. بنحط إيدينا فين وضهرنا بيكون عامل إزاي؟',
      egyptianPrompt: 'ضهرنا مفرود مستقيم وإيدينا على...',
      options: [
        { text: 'كفوفنا على ركبنا وضهرنا مستقيم', icon: '📐', isCorrect: true },
        { text: 'نحط إيدينا في جيبنا ونقف عوج', icon: '🙈', isCorrect: false },
      ],
      congratsMessage: 'يا سلام عليك! بنركع وضهرنا مستقيم ونقول: سبحان ربي العظيم!',
    },
    {
      question: 'أقرب ما نكون لربنا حبيبنا.. بنكون بنعمل إيه على سجادة الصلاة؟',
      egyptianPrompt: 'جبهتنا ومناخيرنا وكفوفنا على الأرض.. ده وضع إيه؟',
      options: [
        { text: 'السجود الجميل وندعي ربنا بكل حب', icon: '🤲', isCorrect: true },
        { text: 'بنجري ونلعب كورة', icon: '⚽', isCorrect: false },
      ],
      congratsMessage: 'أحسنت يا بطل الأبطال! السجود أحلى وأقرب لحظة لربنا!',
    },
  ];

  const currentQ = questions[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = currentQ.options[index].isCorrect;
    if (isCorrect) {
      setScore((s) => s + 1);
      soundSynth.playStepChime();
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      soundSynth.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fade-in_0.2s_ease]">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎯</span>
            <div>
              <span className="text-xs bg-white/20 font-black px-2 py-0.5 rounded-full">
                لعبة الشطار للأطفال
              </span>
              <h3 className="text-lg font-black">اختبار بطل الصلاة الصغير</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Quiz Body */}
        <div className="p-5 sm:p-6 flex flex-col gap-5">
          {!isFinished ? (
            <>
              {/* Question progress */}
              <div className="flex items-center justify-between text-xs font-black text-slate-500">
                <span>
                  السؤال {currentIdx + 1} من {questions.length}
                </span>
                <span className="text-amber-700 bg-amber-100 px-2.5 py-1 rounded-xl">
                  النجوم: {score} ⭐
                </span>
              </div>

              {/* Question text */}
              <div className="text-right">
                <h4 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
                  {currentQ.question}
                </h4>
                <p className="text-xs sm:text-sm font-bold text-amber-800 mt-1">
                  {currentQ.egyptianPrompt}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {currentQ.options.map((opt, i) => {
                  let btnColor = 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800';
                  if (isAnswered) {
                    if (opt.isCorrect) {
                      btnColor = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black scale-102';
                    } else if (selectedOption === i) {
                      btnColor = 'bg-rose-100 border-rose-400 text-rose-900';
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      disabled={isAnswered}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-right text-base font-extrabold shadow-sm ${btnColor}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.icon}</span>
                        <span>{opt.text}</span>
                      </div>
                      {isAnswered && opt.isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 animate-bounce" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback banner */}
              {isAnswered && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-sm font-black text-right flex items-center justify-between animate-[fade-in_0.3s_ease]">
                  <span>{currentQ.congratsMessage}</span>
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition"
                  >
                    {currentIdx < questions.length - 1 ? 'السؤال التالي ➔' : 'عرض النتيجة 🏆'}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Celebration Screen */
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-5xl shadow-xl animate-bounce">
                🏆
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-800">
                  ما شاء الله تبارك الله يا بطل!
                </h4>
                <p className="text-sm font-bold text-slate-600 mt-1">
                  أجبت على أسئلة الصلاة بنجاح وحصلت على {score} من {questions.length} نجمة كاملة!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenCertificate();
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  <span>استلم شهادة بطل الصلاة 🎖️</span>
                </button>

                <button
                  onClick={handleReset}
                  className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة اللعبة</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
