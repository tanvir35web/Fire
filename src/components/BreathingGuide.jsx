import React, { useState, useEffect } from 'react';
import { Wind, X } from 'lucide-react';

const PHASES = [
  { label: 'Inhale Slowly...', duration: 4, scale: 'scale-125', text: 'Breathe in warmth and calmness' },
  { label: 'Hold Breath...', duration: 7, scale: 'scale-125 opacity-90', text: 'Feel the peaceful stillness' },
  { label: 'Exhale Gently...', duration: 8, scale: 'scale-75 opacity-50', text: 'Release all tension of the day' },
];

export default function BreathingGuide({ isOpen, onClose }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setPhaseIndex((p) => {
            const nextP = (p + 1) % PHASES.length;
            setCountdown(PHASES[nextP].duration);
            return nextP;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPhase = PHASES[phaseIndex];

  return (
    <div
      className="fixed inset-0 pointer-events-auto z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl max-w-sm text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-6 text-xs uppercase tracking-widest text-amber-300/80 font-semibold">
          <Wind className="w-4 h-4 text-orange-400" />
          4-7-8 Sleep Breathing Exercise
        </div>

        {/* Pulsing Breathing Ring */}
        <div className="relative w-44 h-44 flex items-center justify-center my-2">
          {/* Outer glow ring */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-orange-500/30 transition-all ease-in-out ${currentPhase.scale}`}
            style={{
              transitionDuration: `${currentPhase.duration}s`,
              boxShadow: '0 0 35px rgba(249, 115, 22, 0.35)',
            }}
          />
          {/* Inner core circle */}
          <div
            className={`w-28 h-28 rounded-full bg-gradient-to-tr from-orange-600/40 via-amber-500/30 to-amber-200/20 flex flex-col items-center justify-center border border-orange-400/50 backdrop-blur-md transition-all ease-in-out ${currentPhase.scale}`}
            style={{
              transitionDuration: `${currentPhase.duration}s`,
            }}
          >
            <span className="text-3xl font-mono font-bold text-amber-100">
              {countdown}
            </span>
            <span className="text-[10px] text-amber-300/70 uppercase tracking-wider">
              seconds
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-1">
          <div className="text-base font-semibold text-amber-100">
            {currentPhase.label}
          </div>
          <p className="text-xs text-stone-400">
            {currentPhase.text}
          </p>
        </div>
      </div>
    </div>
  );
}

