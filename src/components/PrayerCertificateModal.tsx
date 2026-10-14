import React, { useState } from 'react';
import { X, Printer, Sparkles, Award } from 'lucide-react';

interface PrayerCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChildName?: string;
}

export const PrayerCertificateModal: React.FC<PrayerCertificateModalProps> = ({
  isOpen,
  onClose,
  defaultChildName = 'البطل الصغير',
}) => {
  const [childName, setChildName] = useState(defaultChildName);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fade-in_0.2s_ease]">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top bar */}
        <div className="bg-amber-500 p-4 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2 font-black text-lg">
            <Award className="w-6 h-6 text-yellow-200" />
            <span>شهادة بطل الصلاة الصغير</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Name Customizer (no-print) */}
        <div className="bg-amber-50 p-3.5 border-b border-amber-200 flex items-center justify-between gap-3 no-print">
          <label className="text-xs sm:text-sm font-extrabold text-amber-900 flex items-center gap-1.5 flex-shrink-0">
            <span>✏️ اكتب اسم طفلك الجميل:</span>
          </label>
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-slate-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="مثال: أحمد / مريم / عمر"
          />
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100">
          <div
            id="printable-certificate"
            className="w-full border-8 border-double border-amber-500 rounded-3xl p-6 sm:p-8 bg-amber-50/50 shadow-inner relative text-center flex flex-col items-center justify-between gap-4"
          >
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 text-amber-500 text-xl">✦</div>
            <div className="absolute top-2 right-2 text-amber-500 text-xl">✦</div>
            <div className="absolute bottom-2 left-2 text-amber-500 text-xl">✦</div>
            <div className="absolute bottom-2 right-2 text-amber-500 text-xl">✦</div>

            {/* Header */}
            <div>
              <div className="text-xs font-black text-emerald-700 tracking-widest uppercase mb-1">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-900 tracking-wide">
                شهادة إتمام تعلم الصلاة
              </h2>
              <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full mt-2"></div>
            </div>

            {/* Content */}
            <div className="my-2">
              <p className="text-sm sm:text-base font-bold text-slate-600 mb-2">
                يشهد "بستان الصلاة للأطفال" بكل فخر واعتزاز أن البطل الصغير:
              </p>
              <div className="text-3xl sm:text-4xl font-black text-emerald-800 py-1 px-4 inline-block border-b-4 border-amber-400">
                {childName || 'البطل الصغير'}
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-600 mt-3 max-w-md mx-auto leading-relaxed">
                قد أتم بنجاح ومحبة مشاهدة وممارسة خطوات الصلاة (الوضوء، والقيام، والركوع، والسجود، والتشهد) بكل خشوع وأدب!
              </p>
            </div>

            {/* Golden Star Seal */}
            <div className="flex items-center justify-between w-full pt-4 border-t border-amber-200">
              <div className="text-right text-xs font-bold text-slate-500">
                <div>التاريخ: {currentDate}</div>
                <div className="text-emerald-700 font-extrabold mt-0.5">بارك الله فيك ونفع بك!</div>
              </div>

              {/* Big Golden Stamp */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-lg flex items-center justify-center transform -rotate-12">
                <div className="w-full h-full rounded-full border-2 border-dashed border-amber-800 flex flex-col items-center justify-center text-amber-950 font-black text-[9px] sm:text-[11px] leading-tight">
                  <Sparkles className="w-4 h-4 text-amber-800 mb-0.5" />
                  <span>بطل الصلاة</span>
                  <span>المتميز ⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (no-print) */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3 no-print">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الشهادة (أو حفظ PDF)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
