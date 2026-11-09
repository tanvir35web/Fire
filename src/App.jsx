import React, { useState, useEffect, useRef, useCallback } from 'react';
import RealFireplaceVideo from './components/RealFireplaceVideo';
import ControlsOverlay from './components/ControlsOverlay';
import ClockOverlay from './components/ClockOverlay';
import BreathingGuide from './components/BreathingGuide';
import { natureSounds } from './audio/NatureSounds';

export default function App() {
  const realVideoRef = useRef(null);

  // Real 4K Fireplace video settings (Default: Warm Golden Hearth)
  const [videoId, setVideoId] = useState('hVTV9fKsjYg'); // "Warm Golden Hearth 4K"
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(105);
  const [colorWarmthBoost, setColorWarmthBoost] = useState(10);

  // Optical Glow & Atmosphere settings (Golden warm amber glow)
  const [glowIntensity, setGlowIntensity] = useState(0.85);
  const [glowWarmth, setGlowWarmth] = useState('#eab308');
  const [vignetteStrength, setVignetteStrength] = useState(0.65);
  const [showCinematicGrain, setShowCinematicGrain] = useState(false);

  // Real Audio parameters (100% Real Authentic Recorded Fire Audio)
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1.0); // 100% volume for authentic real fire sound

  // Real Nature Sound Layers (Rain, Night, Birds - Real MP3s, 0% default)
  const [natureVolumes, setNatureVolumes] = useState({
    rain: 0,
    night: 0,
    birds: 0,
  });

  // Breathing guide overlay
  const [showBreathing, setShowBreathing] = useState(false);

  // Sleep & Timer parameters
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState(0);
  const [enableFadeOut, setEnableFadeOut] = useState(true);
  const [nightLightMode, setNightLightMode] = useState(true);

  // Interface & HUD parameters
  const [showClock, setShowClock] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHudVisible, setIsHudVisible] = useState(true);

  const inactivityTimerRef = useRef(null);
  const wakeLockRef = useRef(null);

  // Screen WakeLock: Keeps screen awake while fireplace is relaxing
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && !wakeLockRef.current) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch (err) {}
    };

    if (isPlayingAudio && !isTimerActive) {
      requestWakeLock();
    }

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [isPlayingAudio, isTimerActive]);

  // Real Audio Controls Handlers
  const toggleAudio = useCallback(() => {
    if (isPlayingAudio) {
      realVideoRef.current?.pause();
      natureSounds.pauseAll();
      setIsPlayingAudio(false);
    } else {
      realVideoRef.current?.play();
      realVideoRef.current?.unmute();
      natureSounds.resumeAll();
      setIsPlayingAudio(true);
      setIsMuted(false);
    }
  }, [isPlayingAudio]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (nextMuted) {
        realVideoRef.current?.mute();
        natureSounds.setMute(true);
      } else {
        realVideoRef.current?.unmute();
        realVideoRef.current?.setVolume(Math.round(masterVolume * 100));
        natureSounds.setMute(false);
      }
      return nextMuted;
    });
  }, [masterVolume]);

  const handleMasterVolumeChange = useCallback((val) => {
    setMasterVolume(val);
    const volPercent = Math.round(val * 100);
    realVideoRef.current?.setVolume(volPercent);
    if (val > 0 && isMuted) {
      realVideoRef.current?.unmute();
      natureSounds.setMute(false);
      setIsMuted(false);
    }
  }, [isMuted]);

  // Real Nature Sounds Volume handler
  const handleNatureVolumeChange = useCallback((soundKey, val) => {
    setNatureVolumes((prev) => ({
      ...prev,
      [soundKey]: val,
    }));
    natureSounds.setVolume(soundKey, val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
      natureSounds.setMute(false);
    }
  }, [isMuted]);

  const handleResetNatureSounds = useCallback(() => {
    setNatureVolumes({ rain: 0, night: 0, birds: 0 });
    natureSounds.stopAll();
  }, []);

  // Fullscreen Handler
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Sleep Timer logic
  const startSleepTimer = useCallback((seconds) => {
    setTimerSecondsRemaining(seconds);
    setIsTimerActive(true);
  }, []);

  const cancelSleepTimer = useCallback(() => {
    setIsTimerActive(false);
    setTimerSecondsRemaining(0);
    realVideoRef.current?.setVolume(Math.round(masterVolume * 100));
  }, [masterVolume]);

  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      setTimerSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerActive(false);

          realVideoRef.current?.pause();
          natureSounds.stopAll();
          setIsPlayingAudio(false);

          if (nightLightMode) {
            setBrightness(30);
            setGlowIntensity(0.3);
            setVideoId('vEsOAvYwuQM'); // Switch to gentle sleep coals
          }
          return 0;
        }

        // Trigger gentle fade-out during last 5 minutes (300 seconds)
        if (enableFadeOut && prev <= 300) {
          const fadeProgress = prev / 300;
          const currentVol = Math.round(masterVolume * 100 * fadeProgress);
          realVideoRef.current?.setVolume(Math.max(1, currentVol));
          // Fade nature sounds too
          Object.keys(natureVolumes).forEach((key) => {
            natureSounds.setVolume(key, natureVolumes[key] * fadeProgress);
          });
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, enableFadeOut, nightLightMode, masterVolume, natureVolumes]);

  // Auto-hide HUD on mouse inactivity (3.5 seconds)
  const resetInactivityTimer = useCallback(() => {
    setIsHudVisible(true);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      setIsHudVisible(false);
    }, 3500);
  }, []);

  useEffect(() => {
    const handleActivity = () => resetInactivityTimer();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('keydown', handleActivity);

    resetInactivityTimer();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [resetInactivityTimer]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;

      switch (e.key.toLowerCase()) {
        case 'f':
          toggleFullscreen();
          break;
        case ' ':
          e.preventDefault();
          toggleAudio();
          break;
        case 'm':
          toggleMute();
          break;
        case 'h':
          setIsHudVisible((prev) => !prev);
          break;
        case 'c':
          setShowClock((prev) => !prev);
          break;
        case 'b':
          setShowBreathing((prev) => !prev);
          break;
        case '1':
          setVideoId('hVTV9fKsjYg'); // Warm Golden
          setGlowWarmth('#eab308');
          break;
        case '2':
          setVideoId('55icVPoxIp8'); // Classic
          setGlowWarmth('#f97316');
          break;
        case '3':
          setVideoId('wsode8b-C-0'); // Deep Embers
          setGlowWarmth('#ea580c');
          break;
        case '4':
          setVideoId('NWwAZtzga1M'); // Winter Cabin
          setGlowWarmth('#f97316');
          break;
        case '5':
          setVideoId('vEsOAvYwuQM'); // Gentle Sleep
          setGlowWarmth('#ef4444');
          break;
        case '6':
          setVideoId('sHEfQqzSjwQ'); // Campfire
          setGlowWarmth('#f59e0b');
          break;
        case 'arrowup':
          e.preventDefault();
          handleMasterVolumeChange(Math.min(1.0, masterVolume + 0.05));
          break;
        case 'arrowdown':
          e.preventDefault();
          handleMasterVolumeChange(Math.max(0.0, masterVolume - 0.05));
          break;
        case 'arrowright':
          e.preventDefault();
          setGlowIntensity((prev) => Math.min(1.5, parseFloat((prev + 0.05).toFixed(2))));
          break;
        case 'arrowleft':
          e.preventDefault();
          setGlowIntensity((prev) => Math.max(0.0, parseFloat((prev - 0.05).toFixed(2))));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen, toggleAudio, toggleMute, handleMasterVolumeChange, masterVolume]);

  return (
    <main
      className="relative w-screen h-screen overflow-hidden bg-black select-none cursor-default"
      onClick={() => {
        if (!isHudVisible) setIsHudVisible(true);
      }}
      onDoubleClick={toggleFullscreen}
    >
      {/* Real 4K Fireplace Video Player with Genuine Recorded Sound & Dynamic Glow */}
      <RealFireplaceVideo
        ref={realVideoRef}
        videoId={videoId}
        customVideoUrl={customVideoUrl}
        isPlaying={isPlayingAudio}
        isMuted={isMuted}
        volume={Math.round(masterVolume * 100)}
        glowIntensity={glowIntensity}
        glowWarmth={glowWarmth}
        vignetteStrength={vignetteStrength}
        colorWarmthBoost={colorWarmthBoost}
        brightness={brightness}
        contrast={contrast}
        showCinematicGrain={showCinematicGrain}
        onSoundStateChange={(unmuted) => {
          if (unmuted) {
            setIsMuted(false);
            natureSounds.setMute(false);
          }
        }}
      />

      {/* Optional Ambient Clock / Relaxation Quote */}
      <ClockOverlay isVisible={showClock} />

      {/* Optional Guided Sleep Breathing Circle (4-7-8) */}
      <BreathingGuide
        isOpen={showBreathing}
        onClose={() => setShowBreathing(false)}
      />

      {/* Floating HUD Controls */}
      <ControlsOverlay
        videoId={videoId}
        setVideoId={setVideoId}
        customVideoUrl={customVideoUrl}
        setCustomVideoUrl={setCustomVideoUrl}
        brightness={brightness}
        setBrightness={setBrightness}
        contrast={contrast}
        setContrast={setContrast}
        colorWarmthBoost={colorWarmthBoost}
        setColorWarmthBoost={setColorWarmthBoost}
        glowIntensity={glowIntensity}
        setGlowIntensity={setGlowIntensity}
        glowWarmth={glowWarmth}
        setGlowWarmth={setGlowWarmth}
        vignetteStrength={vignetteStrength}
        setVignetteStrength={setVignetteStrength}
        showCinematicGrain={showCinematicGrain}
        setShowCinematicGrain={setShowCinematicGrain}
        isPlayingAudio={isPlayingAudio}
        toggleAudio={toggleAudio}
        isMuted={isMuted}
        toggleMute={toggleMute}
        masterVolume={masterVolume}
        setMasterVolume={handleMasterVolumeChange}
        natureVolumes={natureVolumes}
        onChangeNatureVolume={handleNatureVolumeChange}
        onResetNatureSounds={handleResetNatureSounds}
        onToggleBreathing={() => setShowBreathing((prev) => !prev)}
        showClock={showClock}
        setShowClock={setShowClock}
        timerSecondsRemaining={timerSecondsRemaining}
        isTimerActive={isTimerActive}
        startSleepTimer={startSleepTimer}
        cancelSleepTimer={cancelSleepTimer}
        enableFadeOut={enableFadeOut}
        setEnableFadeOut={setEnableFadeOut}
        nightLightMode={nightLightMode}
        setNightLightMode={setNightLightMode}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        isHudVisible={isHudVisible}
      />
    </main>
  );
}
