import React, { useState } from 'react';
import {
  Flame,
  Sun,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Moon,
  Clock,
  Keyboard,
  X,
  Play,
  Pause,
  Sliders,
  Wind,
} from 'lucide-react';

import FireSelector from './FireSelector';
import GlowControls from './GlowControls';
import SoundMixer from './SoundMixer';
import SleepTimerModal from './SleepTimerModal';
import ShortcutsModal from './ShortcutsModal';

export default function ControlsOverlay({
  // Video selection
  videoId,
  setVideoId,
  customVideoUrl,
  setCustomVideoUrl,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  colorWarmthBoost,
  setColorWarmthBoost,

  // Glow & lighting
  glowIntensity,
  setGlowIntensity,
  glowWarmth,
  setGlowWarmth,
  vignetteStrength,
  setVignetteStrength,
  showCinematicGrain,
  setShowCinematicGrain,

  // Real Audio controls
  isPlayingAudio,
  toggleAudio,
  isMuted,
  toggleMute,
  masterVolume,
  setMasterVolume,
  natureVolumes,
  onChangeNatureVolume,
  onResetNatureSounds,

  // Breathing & Clock
  onToggleBreathing,
  showClock,
  setShowClock,

  // Sleep Timer
  timerSecondsRemaining,
  isTimerActive,
  startSleepTimer,
  cancelSleepTimer,
  enableFadeOut,
  setEnableFadeOut,
  nightLightMode,
  setNightLightMode,

  // Fullscreen
  isFullscreen,
  toggleFullscreen,

  // HUD visibility
  isHudVisible,
}) {
  const [activeTab, setActiveTab] = useState(null); // 'fire' | 'glow' | 'sound' | 'timer' | 'shortcuts' | null

  const handleTabClick = (tab) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-30 transition-opacity duration-700 ${
        isHudVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Top Header - Ultra Clean & Minimal */}
      <header className="absolute top-0 left-0 right-0 p-5 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316] animate-pulse" />
          <h1 className="text-xs sm:text-sm font-cinzel font-bold tracking-[0.25em] text-amber-100/90 drop-shadow">
            BURNING FIREPLACE
          </h1>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
            4K UHD
          </span>
        </div>

        {/* Top Right Quick Minimal Actions */}
        <div className="flex items-center gap-1.5">
          {isTimerActive && (
            <button
              onClick={() => setActiveTab('timer')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-panel-subtle text-orange-300 text-xs font-mono border border-orange-500/40 animate-pulse hover:bg-orange-950/40 cursor-pointer"
            >
              <Moon className="w-3 h-3" />
              <span>
                {Math.floor(timerSecondsRemaining / 60)}:
                {(timerSecondsRemaining % 60).toString().padStart(2, '0')}
              </span>
            </button>
          )}

          {/* 4-7-8 Breathing Guide */}
          <button
            onClick={onToggleBreathing}
            className="p-2 rounded-xl glass-panel-subtle text-stone-300 hover:text-amber-200 transition-all cursor-pointer"
            title="Guided Sleep Breathing (B)"
          >
            <Wind className="w-4 h-4 text-orange-400" />
          </button>

          {/* Clock Toggle */}
          <button
            onClick={() => setShowClock(!showClock)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              showClock
                ? 'bg-orange-500/25 text-amber-200 border border-orange-500/40'
                : 'glass-panel-subtle text-stone-400 hover:text-amber-200'
            }`}
            title="Toggle Bedroom Clock (C)"
          >
            <Clock className="w-4 h-4" />
          </button>

          {/* Keyboard Shortcuts */}
          <button
            onClick={() => setActiveTab('shortcuts')}
            className="p-2 rounded-xl glass-panel-subtle text-stone-400 hover:text-amber-200 transition-all cursor-pointer"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl glass-panel-subtle text-stone-400 hover:text-amber-200 transition-all cursor-pointer"
            title="Toggle 4K Fullscreen (F)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Floating Modal / Panel for Active Tab */}
      {activeTab && (
        <div
          className="absolute inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pointer-events-auto z-40 animate-in fade-in duration-150"
          onClick={() => setActiveTab(null)}
        >
          <div
            className="relative w-full max-w-md max-h-[85vh] overflow-y-auto glass-panel p-5 sm:p-6 rounded-3xl shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveTab(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>

            {activeTab === 'fire' && (
              <FireSelector
                currentVideoId={videoId}
                onSelectVideoId={(id) => setVideoId(id)}
                customVideoUrl={customVideoUrl}
                onSetCustomVideoUrl={setCustomVideoUrl}
                brightness={brightness}
                onChangeBrightness={setBrightness}
                contrast={contrast}
                onChangeContrast={setContrast}
                colorWarmthBoost={colorWarmthBoost}
                onChangeWarmthBoost={setColorWarmthBoost}
              />
            )}

            {activeTab === 'glow' && (
              <GlowControls
                glowIntensity={glowIntensity}
                onChangeGlowIntensity={setGlowIntensity}
                glowWarmth={glowWarmth}
                onChangeGlowWarmth={setGlowWarmth}
                vignetteStrength={vignetteStrength}
                onChangeVignetteStrength={setVignetteStrength}
                showCinematicGrain={showCinematicGrain}
                onToggleGrain={setShowCinematicGrain}
              />
            )}

            {activeTab === 'sound' && (
              <SoundMixer
                masterVolume={masterVolume}
                onChangeMasterVolume={setMasterVolume}
                natureVolumes={natureVolumes}
                onChangeNatureVolume={onChangeNatureVolume}
                isMuted={isMuted}
                onToggleMute={toggleMute}
                onResetSounds={onResetNatureSounds}
              />
            )}

            {activeTab === 'timer' && (
              <SleepTimerModal
                timerSecondsRemaining={timerSecondsRemaining}
                isTimerActive={isTimerActive}
                onStartTimer={startSleepTimer}
                onCancelTimer={cancelSleepTimer}
                enableFadeOut={enableFadeOut}
                onToggleFadeOut={setEnableFadeOut}
                nightLightMode={nightLightMode}
                onToggleNightLight={setNightLightMode}
              />
            )}

            {activeTab === 'shortcuts' && (
              <ShortcutsModal onClose={() => setActiveTab(null)} />
            )}
          </div>
        </div>
      )}

      {/* Bottom Main Floating Glassmorphic Pill Dock - Ultra Clean & Zen */}
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel shadow-2xl border border-orange-500/25">
          {/* Audio Play/Pause Button */}
          <button
            onClick={toggleAudio}
            className={`p-2.5 rounded-full transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/40 hover:bg-orange-500'
                : 'bg-stone-800 text-amber-200 hover:bg-stone-700'
            }`}
            title={isPlayingAudio ? 'Pause Sound (Space)' : 'Play Sound (Space)'}
          >
            {isPlayingAudio ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-amber-200" />}
          </button>

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-2.5 rounded-full transition-all cursor-pointer ${
              isMuted
                ? 'bg-red-950/70 text-red-400 border border-red-500/40'
                : 'text-stone-300 hover:text-amber-200 hover:bg-stone-800/60'
            }`}
            title="Mute / Unmute (M)"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="w-[1px] h-5 bg-orange-500/20 mx-1" />

          {/* Real Fireplaces Selector Button */}
          <button
            onClick={() => handleTabClick('fire')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'fire'
                ? 'bg-orange-500/25 text-amber-100 border border-orange-400/50 shadow-inner'
                : 'text-stone-300 hover:text-amber-200 hover:bg-stone-800/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Fire</span>
          </button>

          {/* Relaxing Nature Sounds Button */}
          <button
            onClick={() => handleTabClick('sound')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'sound'
                ? 'bg-orange-500/25 text-amber-100 border border-orange-400/50 shadow-inner'
                : 'text-stone-300 hover:text-amber-200 hover:bg-stone-800/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Sounds</span>
          </button>

          {/* Room Glow / Light Drawer Button */}
          <button
            onClick={() => handleTabClick('glow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'glow'
                ? 'bg-orange-500/25 text-amber-100 border border-orange-400/50 shadow-inner'
                : 'text-stone-300 hover:text-amber-200 hover:bg-stone-800/60'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Glow</span>
          </button>

          {/* Sleep Timer Drawer Button */}
          <button
            onClick={() => handleTabClick('timer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'timer' || isTimerActive
                ? 'bg-orange-500/25 text-amber-100 border border-orange-400/50 shadow-inner'
                : 'text-stone-300 hover:text-amber-200 hover:bg-stone-800/60'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-orange-300" />
            <span>Timer</span>
          </button>

          <div className="w-[1px] h-5 bg-orange-500/20 mx-1" />

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full text-stone-300 hover:text-amber-200 hover:bg-stone-800/60 transition-all cursor-pointer"
            title="Toggle 4K Fullscreen (F)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </footer>
    </div>
  );
}
