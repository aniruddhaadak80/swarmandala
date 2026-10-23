"use client";

import { type Bol, noteToHz } from "@repo/core";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AudioEngine } from "./engine";

interface AudioApi {
  muted: boolean;
  droneOn: boolean;
  saHz: number;
  volume: number;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
  setSa: (hz: number) => void;
  setVolume: (volume: number) => void;
  startDrone: () => void;
  stopDrone: () => void;
  toggleDrone: () => void;
  playNote: (note: string) => void;
  playPhrase: (notes: readonly string[], gapSeconds?: number) => void;
  playBol: (bol: Bol, delaySeconds?: number) => void;
}

const AudioContext = createContext<AudioApi | null>(null);

const SA_KEY = "swarmandala.sa";
const VOLUME_KEY = "swarmandala.volume";

export function AudioProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<AudioEngine | null>(null);
  const [muted, setMutedState] = useState(true);
  const [droneOn, setDroneOn] = useState(false);
  const [saHz, setSaState] = useState(138.59);
  const [volume, setVolumeState] = useState(0.85);

  const engine = useCallback((): AudioEngine => {
    if (!engineRef.current) engineRef.current = new AudioEngine();
    return engineRef.current;
  }, []);

  useEffect(() => {
    try {
      const savedSa = Number(window.localStorage.getItem(SA_KEY));
      if (Number.isFinite(savedSa) && savedSa > 60 && savedSa < 400) setSaState(savedSa);
      const savedVolume = Number(window.localStorage.getItem(VOLUME_KEY));
      if (Number.isFinite(savedVolume) && savedVolume > 0 && savedVolume <= 1) {
        setVolumeState(savedVolume);
      }
    } catch {
      // Defaults are fine.
    }
  }, []);

  useEffect(() => {
    const stop = () => {
      engineRef.current?.stopDrone();
    };
    window.addEventListener("pagehide", stop);
    return () => window.removeEventListener("pagehide", stop);
  }, []);

  const setMuted = useCallback(
    (next: boolean) => {
      setMutedState(next);
      engine().setMuted(next);
    },
    [engine],
  );

  const ensureAudible = useCallback(() => {
    const audio = engine();
    audio.ensureContext();
    audio.setVolume(volume);
    if (muted) {
      audio.setMuted(false);
      setMutedState(false);
    }
  }, [engine, muted, volume]);

  const toggleMuted = useCallback(() => {
    if (muted) ensureAudible();
    else setMuted(true);
  }, [ensureAudible, muted, setMuted]);

  const setSa = useCallback(
    (hz: number) => {
      setSaState(hz);
      try {
        window.localStorage.setItem(SA_KEY, String(hz));
      } catch {
        // Ignore.
      }
      if (droneOn) {
        const audio = engine();
        audio.startDrone(hz);
      }
    },
    [droneOn, engine],
  );

  const setVolume = useCallback(
    (next: number) => {
      const clamped = Math.min(1, Math.max(0.05, next));
      setVolumeState(clamped);
      engine().setVolume(clamped);
      try {
        window.localStorage.setItem(VOLUME_KEY, String(clamped));
      } catch {
        // Ignore.
      }
    },
    [engine],
  );

  const startDrone = useCallback(() => {
    const audio = engine();
    audio.ensureContext();
    audio.setVolume(volume);
    audio.setMuted(false);
    audio.startDrone(saHz);
    setMutedState(false);
    setDroneOn(true);
  }, [engine, saHz, volume]);

  const stopDrone = useCallback(() => {
    engine().stopDrone();
    setDroneOn(false);
  }, [engine]);

  const toggleDrone = useCallback(() => {
    if (droneOn) stopDrone();
    else startDrone();
  }, [droneOn, startDrone, stopDrone]);

  const playNote = useCallback(
    (note: string) => {
      ensureAudible();
      engine().playNote(noteToHz(note, saHz));
    },
    [engine, ensureAudible, saHz],
  );

  const playPhrase = useCallback(
    (notes: readonly string[], gapSeconds = 0.3) => {
      ensureAudible();
      engine().playPhrase(
        notes.map((note) => noteToHz(note, saHz)),
        gapSeconds,
      );
    },
    [engine, ensureAudible, saHz],
  );

  const playBol = useCallback(
    (bol: Bol, delaySeconds = 0) => {
      ensureAudible();
      engine().playBol(bol, delaySeconds);
    },
    [engine, ensureAudible],
  );

  const value = useMemo<AudioApi>(
    () => ({
      muted,
      droneOn,
      saHz,
      volume,
      setMuted,
      toggleMuted,
      setSa,
      setVolume,
      startDrone,
      stopDrone,
      toggleDrone,
      playNote,
      playPhrase,
      playBol,
    }),
    [
      muted,
      droneOn,
      saHz,
      volume,
      setMuted,
      toggleMuted,
      setSa,
      setVolume,
      startDrone,
      stopDrone,
      toggleDrone,
      playNote,
      playPhrase,
      playBol,
    ],
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio(): AudioApi {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used inside AudioProvider");
  return context;
}
