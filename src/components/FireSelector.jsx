import React, { useState } from 'react';
import { Flame, Check, Link2, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { REAL_FIRE_PRESETS } from '../constants/firePresets';

export default function FireSelector({
  currentVideoId,
  onSelectVideoId,
  customVideoUrl,
  onSetCustomVideoUrl,
  brightness,
  onChangeBrightness,
  contrast,
  onChangeContrast,
  colorWarmthBoost,
  onChangeWarmthBoost,
}) {
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleApplyCustom = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const ytMatch = customInput.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      onSelectVideoId(ytMatch[1]);
      onSetCustomVideoUrl('');
    } else if (customInput.startsWith('http://') || customInput.startsWith('https://')) {
      onSetCustomVideoUrl(customInput);
    } else if (customInput.length === 11) {
      onSelectVideoId(customInput);
      onSetCustomVideoUrl('');
    }
    setCustomInput('');
  };

  return (
    <div className="space-y-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h3 className="text-base font-cinzel font-semibold text-amber-200 tracking-wide flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Real 4K Fireplaces
          </h3>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Select your preferred authentic burning wood fireplace
          </p>
        </div>
      </div>

      {/* Grid of Real Fireplaces */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {REAL_FIRE_PRESETS.map((item) => {
          const isSelected = currentVideoId === item.id && !customVideoUrl;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectVideoId(item.id);
                onSetCustomVideoUrl('');
              }}
              className={`flex flex-col text-left rounded-xl transition-all duration-200 relative group overflow-hidden border cursor-pointer ${
                isSelected
                  ? 'border-orange-500 bg-orange-950/40 ring-1 ring-orange-500/80 shadow-lg shadow-orange-950/50'
                  : 'border-white/5 bg-stone-900/40 hover:bg-stone-900/80 hover:border-white/10'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-full aspect-video overflow-hidden bg-stone-950">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-1 left-1.5 px-1.5 py-0.2 rounded text-[8px] font-bold bg-black/70 text-orange-400 border border-orange-500/30">
                  4K
                </span>
                {isSelected && (
                  <span className="absolute top-1 right-1.5 flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-orange-500 text-black">
                    <Check className="w-2.5 h-2.5 stroke-[3]" /> Active
                  </span>
                )}
              </div>

              {/* Title */}
              <div className="p-2">
                <div className="text-[11px] font-medium text-stone-200 group-hover:text-amber-200 truncate">
                  {item.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Optical Tuning Sliders - Compact & Minimal */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-400">
          <Sliders className="w-3 h-3 text-orange-400" />
          Video Adjustments
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Warmth */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>Warmth</span>
              <span className="font-mono text-orange-300">{colorWarmthBoost}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="2"
              value={colorWarmthBoost}
              onChange={(e) => onChangeWarmthBoost(parseInt(e.target.value, 10))}
              className="w-full accent-orange-500 h-1"
            />
          </div>

          {/* Brightness */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>Brightness</span>
              <span className="font-mono text-orange-300">{brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="130"
              step="2"
              value={brightness}
              onChange={(e) => onChangeBrightness(parseInt(e.target.value, 10))}
              className="w-full accent-orange-500 h-1"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>Contrast</span>
              <span className="font-mono text-orange-300">{contrast}%</span>
            </div>
            <input
              type="range"
              min="85"
              max="140"
              step="2"
              value={contrast}
              onChange={(e) => onChangeContrast(parseInt(e.target.value, 10))}
              className="w-full accent-orange-500 h-1"
            />
          </div>
        </div>
      </div>

      {/* Collapsible Custom Video Link */}
      <div className="pt-1">
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="flex items-center gap-1.5 text-[10px] text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
        >
          <Link2 className="w-3 h-3" />
          <span>Custom YouTube URL / Video ID</span>
          {showCustomInput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showCustomInput && (
          <form onSubmit={handleApplyCustom} className="flex gap-2 mt-2 animate-in fade-in duration-200">
            <input
              type="text"
              placeholder="Paste YouTube URL or ID..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-amber-200 placeholder-stone-600 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Play
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
