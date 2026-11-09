import React, { useState } from 'react';
import { Moon, Play, Square, BellOff } from 'lucide-react';

const PRESET_MINUTES = [15, 30, 45, 60, 90, 120];

export default function SleepTimerModal({
  timerSecondsRemaining,
  isTimerActive,
  onStartTimer,
  onCancelTimer,
  enableFadeOut,
  onToggleFadeOut,
}) {
  const [selectedMinutes, setSelectedMinutes] = useState(45);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="space-y-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h3 className="text-base font-cinzel font-semibold text-amber-200 tracking-wide flex items-center gap-2">
            <Moon className="w-4 h-4 text-orange-400" />
            Sleep Timer
          </h3>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Auto turn-off with gentle sound fade-out
          </p>
        </div>
      </div>

      {/* Active Timer Display */}
      {isTimerActive ? (
        <div className="p-6 rounded-2xl bg-black/40 border border-orange-500/30 text-center space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-orange-400 font-semibold">
            Timer Running
          </div>
          <div className="text-4xl font-mono font-bold text-amber-100 tracking-wider">
            {formatTime(timerSecondsRemaining)}
          </div>
          <p className="text-[11px] text-stone-400">
            {enableFadeOut ? 'Audio will soften automatically before sleep' : 'Fireplace stops at 0:00'}
          </p>
          <button
            onClick={onCancelTimer}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-red-950/60 text-red-300 border border-red-500/30 hover:bg-red-900/60 transition-colors cursor-pointer"
          >
            <Square className="w-3.5 h-3.5" />
            Cancel Timer
          </button>
        </div>
      ) : (
        <>
          {/* Duration Pills */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-stone-300">Choose Duration</span>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_MINUTES.map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSelectedMinutes(mins)}
                  className={`py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                    selectedMinutes === mins
                      ? 'border-orange-500 bg-orange-950/50 text-amber-100 ring-1 ring-orange-500/60 shadow-md shadow-orange-950/50'
                      : 'border-white/5 bg-stone-900/40 text-stone-400 hover:text-stone-200 hover:border-white/10'
                  }`}
                >
                  {mins >= 60 ? `${mins / 60} hour` : `${mins} min`}
                </button>
              ))}
            </div>
          </div>

          {/* Gentle Fade Out Option */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <BellOff className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs text-stone-300 group-hover:text-stone-200">
                  Gentle 5-Minute Sound Fade-Out
                </span>
              </div>
              <input
                type="checkbox"
                checked={enableFadeOut}
                onChange={(e) => onToggleFadeOut(e.target.checked)}
                className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Start Button */}
          <button
            onClick={() => onStartTimer(selectedMinutes * 60)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium text-xs shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Start Sleep Timer ({selectedMinutes >= 60 ? `${selectedMinutes / 60} hour` : `${selectedMinutes} min`})
          </button>
        </>
      )}
    </div>
  );
}
