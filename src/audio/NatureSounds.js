// Real Nature Sounds Audio Manager
// Uses real high-definition recorded MP3 audio tracks with seamless looping.
// 100% genuine real recordings (No synthetic oscillators, no buzzing).

class NatureSoundsManager {
  constructor() {
    this.sounds = {
      rain: { audio: null, src: '/sounds/rain.mp3', volume: 0 },
      night: { audio: null, src: '/sounds/night.mp3', volume: 0 },
      birds: { audio: null, src: '/sounds/birds.mp3', volume: 0 },
    };
    this.isMuted = false;
    this.isStarted = false;
  }

  init() {
    if (this.isStarted) return;
    this.isStarted = true;

    Object.keys(this.sounds).forEach((key) => {
      const item = this.sounds[key];
      const audio = new Audio(item.src);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0;
      item.audio = audio;
    });
  }

  setVolume(soundKey, volume) {
    this.init();
    const item = this.sounds[soundKey];
    if (!item) return;

    item.volume = Math.max(0, Math.min(1, volume));

    if (!item.audio) return;

    if (item.volume > 0 && !this.isMuted) {
      item.audio.volume = item.volume;
      if (item.audio.paused) {
        item.audio.play().catch(() => {});
      }
    } else {
      item.audio.volume = 0;
      if (item.volume === 0) {
        item.audio.pause();
      }
    }
  }

  setMute(isMuted) {
    this.isMuted = isMuted;
    Object.keys(this.sounds).forEach((key) => {
      const item = this.sounds[key];
      if (!item.audio) return;
      if (isMuted) {
        item.audio.volume = 0;
      } else {
        item.audio.volume = item.volume;
        if (item.volume > 0 && item.audio.paused) {
          item.audio.play().catch(() => {});
        }
      }
    });
  }

  stopAll() {
    Object.keys(this.sounds).forEach((key) => {
      const item = this.sounds[key];
      if (item.audio) {
        item.audio.pause();
        item.audio.currentTime = 0;
        item.volume = 0;
      }
    });
  }

  pauseAll() {
    Object.keys(this.sounds).forEach((key) => {
      const item = this.sounds[key];
      if (item.audio) {
        item.audio.pause();
      }
    });
  }

  resumeAll() {
    if (this.isMuted) return;
    Object.keys(this.sounds).forEach((key) => {
      const item = this.sounds[key];
      if (item.audio && item.volume > 0) {
        item.audio.volume = item.volume;
        item.audio.play().catch(() => {});
      }
    });
  }
}

export const natureSounds = new NatureSoundsManager();

