import React from 'react';
import { Sun, Palette, Eye, Film } from 'lucide-react';

const GLOW_PRESETS = [
  { name: 'Warm Amber', color: '#f97316' },
  { name: 'Candlelight Gold', color: '#eab308' },
  { name: 'Deep Crimson', color: '#ef4444' },
  { name: 'Honey Hearth', color: '#fb923c' },
  { name: 'Midnight Violet', color: '#8b5cf6' },
  { name: 'Warm Peach', color: '#f43f5e' },
];

export default function GlowControls({
  glowIntensity,
  onChangeGlowIntensity,
  glowWarmth,
  onChangeGlowWarmth,
  vignetteStrength,
  onChangeVignetteStrength,
  showCinematicGrain,
  onToggleGrain,
}) {
  return (
    <div className="space-y-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h3 className="text-base font-cinzel font-semibold text-amber-200 tracking-wide flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            Room Glow & Lighting
          </h3>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Adjust the warm room illumination and bedroom darkness
          </p>
        </div>
      </div>

      {/* 1. Ambient Glow Intensity */}
      <div className="space-y-2 p-3 rounded-xl bg-black/40 border border-white/5">
        <div className="flex justify-between text-xs text-stone-300 font-medium">
          <span className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            Room Illumination Glow
          </span>
          <span className="font-mono text-orange-300 font-bold">
            {Math.round(glowIntensity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.0"
          max="1.5"
          step="0.05"
          value={glowIntensity}
          onChange={(e) => onChangeGlowIntensity(parseFloat(e.target.value))}
          className="w-full accent-orange-500 h-1.5 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-stone-500 pt-0.5">
          <span>Dim Accent</span>
          <span>Balanced</span>
          <span>Radiant</span>
        </div>
      </div>

      {/* 2. Glow Warmth Palette Swatches */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-stone-300 font-medium">
          <span className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-orange-400" />
            Glow Warmth Tone
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-stone-500">Custom:</span>
            <input
              type="color"
              value={glowWarmth}
              onChange={(e) => onChangeGlowWarmth(e.target.value)}
              className="w-5 h-5 rounded-full cursor-pointer bg-transparent border-0 p-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {GLOW_PRESETS.map((preset) => {
            const isSelected = glowWarmth.toLowerCase() === preset.color.toLowerCase();

            return (
              <button
                key={preset.color}
                onClick={() => onChangeGlowWarmth(preset.color)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-orange-500 bg-orange-950/40 shadow-md shadow-orange-950/60 ring-1 ring-orange-400/50'
                    : 'border-white/5 bg-stone-900/40 hover:bg-stone-900 hover:border-white/10'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full shadow-sm transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: preset.color,
                    boxShadow: isSelected ? `0 0 12px ${preset.color}` : 'none',
                  }}
                />
                <span className="text-[9px] text-stone-300 truncate w-full text-center">
                  {preset.name.split(' ')[1] || preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Vignette Slider */}
      <div className="space-y-2 p-3 rounded-xl bg-black/40 border border-white/5">
        <div className="flex justify-between text-xs text-stone-300 font-medium">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-orange-400" />
            Edge Vignette (Dark Room Focus)
          </span>
          <span className="font-mono text-orange-300 font-bold">
            {Math.round(vignetteStrength * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={vignetteStrength}
          onChange={(e) => onChangeVignetteStrength(parseFloat(e.target.value))}
          className="w-full accent-orange-500 h-1.5 cursor-pointer"
        />
      </div>

      {/* 4. Film Grain Toggle */}
      <div className="pt-1">
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 cursor-pointer group hover:border-orange-500/20 transition-all">
          <div className="flex items-center gap-2">
            <Film className="w-3.5 h-3.5 text-stone-400 group-hover:text-orange-400 transition-colors" />
            <span className="text-xs text-stone-300 group-hover:text-stone-200">
              Cinematic 4K Film Grain
            </span>
          </div>
          <input
            type="checkbox"
            checked={showCinematicGrain}
            onChange={(e) => onToggleGrain(e.target.checked)}
            className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
