import { useEffect, useRef, useState, type RefObject } from "react";
import { isFilmVisible, parallaxOffset } from "./film-motion";

interface FilmSceneControls {
  scene: RefObject<HTMLElement | null>;
  video: RefObject<HTMLVideoElement | null>;
  paused: boolean;
  failed: boolean;
  toggle: () => void;
  onError: () => void;
}

export function useFilmScene(
  blocked: boolean,
  parallaxStrength = 1,
): FilmSceneControls {
  const scene = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const [failed, setFailed] = useState(false);
  const manualPause = useRef(false);
  const requestedPlayback = useRef(false);
  const blockedRef = useRef(blocked);
  const refresh = useRef<() => void>(() => undefined);
  blockedRef.current = blocked;

  useEffect(() => {
    const element = scene.current;
    const media = video.current;
    if (!element || !media) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let disposed = false;
    let playbackRequested = false;
    const update = (): void => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const visible = isFilmVisible(rect.top, rect.height, innerHeight);
      const partiallyVisible = rect.bottom > 0 && rect.top < innerHeight;
      if (!partiallyVisible) requestedPlayback.current = false;
      element.style.setProperty(
        "--film-offset",
        `${preference.matches ? 0 : parallaxOffset(rect.top, rect.height, innerHeight) * parallaxStrength}px`,
      );
      element.style.setProperty(
        "--film-content-offset",
        `${preference.matches ? 0 : -rect.top}px`,
      );
      // Keep pinned titles clear of the controls as the frame leaves the viewport.
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0),
      );
      const titleOpacity = Math.max(
        0,
        Math.min(1, (visibleHeight / innerHeight - 0.65) / 0.2),
      );
      element.style.setProperty(
        "--film-title-opacity",
        String(preference.matches ? 1 : titleOpacity),
      );
      const shouldPlay =
        (visible || (requestedPlayback.current && partiallyVisible)) &&
        !document.hidden &&
        !blockedRef.current &&
        !manualPause.current &&
        (!preference.matches || requestedPlayback.current);
      if (shouldPlay && media.paused && !playbackRequested) {
        playbackRequested = true;
        void media
          .play()
          .catch(() => {
            if (!disposed) setPaused(true);
          })
          .finally(() => {
            playbackRequested = false;
          });
      } else if (!shouldPlay && !media.paused) {
        media.pause();
      }
    };
    const schedule = (): void => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    refresh.current = schedule;
    const onPlay = (): void => {
      setPaused(false);
      schedule();
    };
    const onPause = (): void => setPaused(true);
    const onPreferenceChange = (): void => {
      requestedPlayback.current = false;
      schedule();
    };
    media.addEventListener("play", onPlay);
    media.addEventListener("pause", onPause);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    preference.addEventListener("change", onPreferenceChange);
    update();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      refresh.current = () => undefined;
      media.pause();
      media.removeEventListener("play", onPlay);
      media.removeEventListener("pause", onPause);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, [parallaxStrength]);

  useEffect(() => {
    refresh.current();
  }, [blocked]);

  const toggle = (): void => {
    const media = video.current;
    if (!media) return;
    if (media.paused) {
      manualPause.current = false;
      requestedPlayback.current = true;
      void media.play().catch(() => setPaused(true));
    } else {
      manualPause.current = true;
      media.pause();
    }
  };

  return {
    scene,
    video,
    paused,
    failed,
    toggle,
    onError: (): void => setFailed(true),
  };
}
