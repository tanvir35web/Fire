import React from 'react';
import {
  Volume2,
  VolumeX,
  Flame,
  CloudRain,
  Moon,
  Bird,
  RotateCcw,
} from 'lucide-react';

const NATURE_TRACKS = [
  { id: 'rain', name: 'Gentle Rain', icon: CloudRain, desc: 'Real soothing rainfall against the window' },
  { id: 'night', name: 'Night Ambiance', icon: Moon, desc: 'Authentic peaceful woods & nighttime crickets' },
  { id: 'birds', name: 'Forest Birds', icon: Bird, desc: 'Real morning birdsong in the countryside' },
];

const PRESETS = [
  { name: 'Pure Fire', fire: 1.0, rain: 0.0, night: 0.0, birds: 0.0 },
  { name: 'Rainy Hearth', fire: 0.85, rain: 0.7, night: 0.0, birds: 0.0 },
  { name: 'Summer Night', fire: 0.7, rain: 0.0, night: 0.75, birds: 0.0 },
  { name: 'Morning Cabin', fire: 0.75, rain: 0.0, night: 0.0, birds: 0.65 },
];

export default function SoundMixer({
  masterVolume,
  onChangeMasterVolume,
  natureVolumes,
  onChangeNatureVolume,
  isMuted,
  onToggleMute,
  onResetSounds,
}) {
  return (
    <div className="space-y-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-orange-500/15 pb-3">
        <div>
          <h3 className="text-base font-cinzel font-semibold text-amber-200 tracking-wide flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-orange-400" />
            Relaxing Sound Mix
          </h3>
          <p className="text-[11px] text-amber-400/60 mt-0.5">
            Real fireplace crackles blended with genuine rain, night, & bird recordings
          </p>
        </div>
        <button
          onClick={onToggleMute}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isMuted
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-orange-500/20 text-amber-300 border border-orange-500/30 hover:bg-orange-500/30'
          }`}
          title={isMuted ? 'Unmute All' : 'Mute All'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* 1. Real Fireplace Volume (Primary) */}
      <div className="p-3.5 rounded-xl bg-orange-950/40 border border-orange-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-100">
                Real Fireplace Crackle
              </span>
              <span className="ml-2 text-[9px] px-1.5 py-0.2 rounded font-bold bg-green-500/20 text-green-300 border border-green-500/30">
                REAL 4K
              </span>
            </div>
          </div>
          <span className="font-mono text-xs text-orange-300 font-bold">
            {isMuted ? 'Muted' : `${Math.round(masterVolume * 100)}%`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={isMuted ? 0 : masterVolume}
          onChange={(e) => onChangeMasterVolume(parseFloat(e.target.value))}
          className="w-full accent-orange-500 h-1.5 cursor-pointer"
        />
      </div>

      {/* 2. Real Nature Sounds (Rain, Night, Birds) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-amber-300/70 font-medium">
          <span>Real Nature Sound Layers</span>
          <button
            onClick={onResetSounds}
            className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Mute Nature Layers
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {NATURE_TRACKS.map((track) => {
            const Icon = track.icon;
            const currentVol = natureVolumes[track.id] ?? 0;
            const isActive = currentVol > 0 && !isMuted;

            return (
              <div
                key={track.id}
                className={`p-2.5 rounded-xl transition-all border ${
                  isActive
                    ? 'bg-orange-950/20 border-orange-500/40 shadow-sm'
                    : 'bg-black/40 border-stone-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isActive ? 'bg-orange-500/20 text-orange-300' : 'bg-stone-900 text-stone-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-stone-200">{track.name}</div>
                      <div className="text-[10px] text-stone-500">{track.desc}</div>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isActive ? 'text-orange-300' : 'text-stone-500'
                    }`}
                  >
                    {isMuted ? '0%' : `${Math.round(currentVol * 100)}%`}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={isMuted ? 0 : currentVol}
                  onChange={(e) => onChangeNatureVolume(track.id, parseFloat(e.target.value))}
                  className="w-full accent-orange-500 h-1.5 cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 1-Click Cozy Atmosphere Presets */}
      <div className="pt-2 border-t border-orange-500/10">
        <div className="text-[11px] text-stone-400 mb-2 font-medium">Quick Atmosphere Presets:</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                onChangeMasterVolume(preset.fire);
                onChangeNatureVolume('rain', preset.rain);
                onChangeNatureVolume('night', preset.night);
                onChangeNatureVolume('birds', preset.birds);
              }}
              className="py-1.5 px-2 rounded-lg bg-stone-900/80 border border-orange-500/20 text-[11px] font-medium text-stone-300 hover:text-amber-200 hover:border-orange-500/40 transition-all cursor-pointer text-center truncate"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
