import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { REAL_FIRE_PRESETS } from '../constants/firePresets';

const RealFireplaceVideo = forwardRef(function RealFireplaceVideo(
  {
    videoId = 'hVTV9fKsjYg',
    customVideoUrl = '',
    isPlaying = true,
    isMuted = false,
    volume = 100,
    glowIntensity = 0.85,
    glowWarmth = '#eab308',
    vignetteStrength = 0.65,
    colorWarmthBoost = 10,
    brightness = 100,
    contrast = 105,
    showCinematicGrain = false,
    onSoundStateChange,
  },
  ref
) {
  const playerRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const isDirectVideo = !!customVideoUrl && (customVideoUrl.endsWith('.mp4') || customVideoUrl.endsWith('.webm'));

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    unmute: () => {
      setHasInteracted(true);
      if (playerRef.current && playerRef.current.unMute) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume || 100);
        playerRef.current.playVideo();
      }
    },
    mute: () => {
      if (playerRef.current && playerRef.current.mute) {
        playerRef.current.mute();
      }
    },
    setVolume: (val) => {
      if (playerRef.current && playerRef.current.setVolume) {
        playerRef.current.setVolume(val);
      }
    },
    play: () => {
      if (playerRef.current && playerRef.current.playVideo) {
        playerRef.current.playVideo();
      }
    },
    pause: () => {
      if (playerRef.current && playerRef.current.pauseVideo) {
        playerRef.current.pauseVideo();
      }
    },
  }));

  // Initialise YouTube IFrame API
  useEffect(() => {
    if (isDirectVideo) return;

    let isMounted = true;

    const createPlayer = () => {
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player('yt-fireplace-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: videoId,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          mute: 1, // Start muted to ensure browser allows autoplay, then unmute on first gesture
        },
        events: {
          onReady: (event) => {
            if (!isMounted) return;
            setIsPlayerReady(true);
            event.target.playVideo();

            // If user already interacted, unmute immediately
            if (hasInteracted && !isMuted) {
              event.target.unMute();
              event.target.setVolume(volume);
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else if (window.YT.Player) {
      createPlayer();
    }

    return () => {
      isMounted = false;
    };
  }, [isDirectVideo]);

  // Handle Video switching
  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById && !isDirectVideo) {
      try {
        playerRef.current.loadVideoById({
          videoId: videoId,
          startSeconds: 5,
        });
        if (hasInteracted && !isMuted) {
          playerRef.current.unMute();
          playerRef.current.setVolume(volume);
        }
      } catch (err) {
        console.warn('YT switch video error:', err);
      }
    }
  }, [videoId, isDirectVideo, hasInteracted, isMuted, volume]);

  // Handle Play/Pause
  useEffect(() => {
    if (!playerRef.current || isDirectVideo) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (e) {}
  }, [isPlaying, isDirectVideo]);

  // Handle Mute & Volume
  useEffect(() => {
    if (!playerRef.current || isDirectVideo) return;
    try {
      if (isMuted) {
        playerRef.current.mute();
      } else if (hasInteracted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      }
    } catch (e) {}
  }, [isMuted, volume, hasInteracted, isDirectVideo]);

  // Global click-to-unmute trigger
  const handleUserUnmute = () => {
    setHasInteracted(true);
    if (playerRef.current && playerRef.current.unMute) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume || 100);
      playerRef.current.playVideo();
    }
    if (onSoundStateChange) onSoundStateChange(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black select-none pointer-events-none">
      {/* 1. Real Video Player */}
      <div
        className="absolute inset-0 w-full h-full transition-all duration-700 pointer-events-none"
        style={{
          filter: `brightness(${brightness}%) contrast(${contrast}%) sepia(${colorWarmthBoost}%)`,
        }}
      >
        {/* Instant high-res poster backdrop while video initialises */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('/fireplace_classic.jpg')`,
          }}
        />

        {isDirectVideo ? (
          <video
            src={customVideoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover relative z-10"
          />
        ) : (
          <div className="relative w-full h-full pointer-events-none overflow-hidden z-10">
            {/* Scale 1.28 to completely crop out YouTube player titles and subtle edge watermarks */}
            <div
              id="yt-fireplace-player"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130vw] h-[130vh] pointer-events-none"
            />
          </div>
        )}
      </div>

      {/* 2. Dynamic Room Glow & Warmth Light Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 50% 65%, ${glowWarmth}44 0%, ${glowWarmth}22 35%, transparent 70%)`,
          opacity: glowIntensity,
        }}
      />

      {/* 3. Screen Edge Room Illumination (Light casting on walls and floor) */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 90%, ${glowWarmth}55 0%, transparent 65%)`,
          opacity: glowIntensity * 0.8,
        }}
      />

      {/* 4. Cinematic Vignette (Focus on glowing hearth) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 40%, rgba(5, 2, 1, 0.95) 95%)`,
          opacity: vignetteStrength,
        }}
      />

      {/* 5. Optional Film Grain Texture for cozy 4K film aesthetic */}
      {showCinematicGrain && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </div>
  );
});

export default RealFireplaceVideo;
