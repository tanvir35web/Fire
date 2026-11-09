// Artificial sound synthesizer completely silenced per user request.
// Only authentic real recorded 4K fireplace audio is used.

class FireplaceAudioEngine {
  constructor() {
    this.isPlaying = false;
    this.isMuted = false;
  }
  init() {}
  async start() {}
  stop() {
    this.isPlaying = false;
  }
  setChannelVolume() {}
  setMasterVolume() {}
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
  triggerStokeSound() {}
  startFadeOut() {}
  cancelFadeOut() {}
}

export const soundEngine = new FireplaceAudioEngine();
