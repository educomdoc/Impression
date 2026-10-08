import meditationBg: from '../assets/images/명상.mp3';

export interface MeditationAudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  customFile: File | null;
}

type AudioListener = (state: MeditationAudioState) => void;

class MeditationAudioService {
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<AudioListener> = new Set();
  private state: MeditationAudioState = {
    isPlaying: false,
    isMuted: false,
    volume: 0.8,
    customFile: null,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio(meditationBg);
      this.audio.loop = true;
      this.audio.volume = this.state.volume;

      this.audio.addEventListener('play', () => {
        this.state.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.state.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('ended', () => {
        this.state.isPlaying = false;
        this.notify();
      });
    }
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  public getState(): MeditationAudioState {
    return { ...this.state };
  }

  public play() {
    if (!this.audio) return;
    this.audio.play().catch((err) => console.warn('Audio play blocked:', err));
  }

  public pause() {
    if (!this.audio) return;
    this.audio.pause();
  }

  public stop() {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  public toggleMute() {
    if (!this.audio) return;
    this.state.isMuted = !this.state.isMuted;
    this.audio.muted = this.state.isMuted;
    this.notify();
  }

  public setVolume(volume: number) {
    if (!this.audio) return;
    const clamped = Math.max(0, Math.min(1, volume));
    this.state.volume = clamped;
    this.audio.volume = clamped;
    this.notify();
  }

  public setCustomFile(file: File) {
    if (!this.audio) return;
    const isPlayingBefore = this.state.isPlaying;
    this.stop();

    const objectUrl = URL.createObjectURL(file);
    this.audio.src = objectUrl;
    this.state.customFile = file;

    if (isPlayingBefore) {
      this.play();
    } else {
      this.notify();
    }
  }
}

export const meditationAudio = new MeditationAudioService();
