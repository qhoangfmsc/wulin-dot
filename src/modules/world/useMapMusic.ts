import { useEffect, useRef } from "react";
import { useSettingsStore } from "@/modules/settings/store";

/** Loops a map's background music playlist via a plain `<audio>` element,
 * not Phaser's sound manager — `MapCanvas` destroys/recreates the Phaser
 * game on every room transition (see `MapScreen`'s `key={cellKey(...)}`),
 * so Phaser-owned audio would restart every room change. This is owned by
 * `MapScreen` itself and keyed on `mapKey`, so it survives room transitions
 * and only restarts when the map actually changes.
 *
 * Respects `settings.musicMuted` (toggled from `SettingsButton`, see
 * `CharacterPanel`) via `audio.muted` rather than pausing — keeps the
 * playlist's position/progress intact while off, so unmuting resumes
 * exactly where it left off instead of restarting the track. */
export function useMapMusic(playlist: string[], mapKey: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicMuted = useSettingsStore((s) => s.musicMuted);

  useEffect(() => {
    if (playlist.length === 0) return;
    const audio = new Audio();
    audio.volume = 0.5;
    audio.muted = useSettingsStore.getState().musicMuted;
    audioRef.current = audio;

    let trackIndex = 0;
    function playCurrent() {
      audio.src = playlist[trackIndex];
      void audio.play().catch(() => {
        // Autoplay can be blocked until a user gesture fires — the tap/click
        // gestures earlier in the flow (Tap to Start, story) already cover
        // this in practice, but fail quietly rather than throwing.
      });
    }
    function handleEnded() {
      trackIndex = (trackIndex + 1) % playlist.length;
      playCurrent();
    }

    audio.addEventListener("ended", handleEnded);
    playCurrent();

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapKey]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = musicMuted;
  }, [musicMuted]);
}
