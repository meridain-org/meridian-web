"use client";

import { useEffect, useRef, useState } from "react";

type SeamlessHeroVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  crossfadeDurationMs?: number;
};

export function SeamlessHeroVideo({
  src,
  poster,
  className = "absolute inset-0 h-full w-full object-cover",
  crossfadeDurationMs = 400,
}: SeamlessHeroVideoProps) {
  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);

  // 0 = Video A is visible, 1 = Video B is visible
  const [activePlayer, setActivePlayer] = useState<0 | 1>(0);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const switchingRef = useRef(false);

  useEffect(() => {
    const videoA = videoRefA.current;
    const videoB = videoRefB.current;
    if (!videoA || !videoB) return;

    switchingRef.current = false;
    setActivePlayer(0);

    videoA.currentTime = 0;
    videoB.currentTime = 0;

    const playPromise = videoA.play();
    if (playPromise) {
      playPromise
        .then(() => setHasStartedPlaying(true))
        .catch(() => {
          // Autoplay policy or low power mode
        });
    }

    const crossfadeSec = crossfadeDurationMs / 1000;

    const handleTimeUpdateA = () => {
      if (switchingRef.current) return;
      if (!videoA.duration || Number.isNaN(videoA.duration)) return;

      const remaining = videoA.duration - videoA.currentTime;
      if (remaining <= crossfadeSec && remaining > 0) {
        switchingRef.current = true;
        videoB.currentTime = 0;
        const p = videoB.play();
        if (p) p.catch(() => {});
        setActivePlayer(1);

        setTimeout(() => {
          videoA.pause();
          videoA.currentTime = 0;
          switchingRef.current = false;
        }, crossfadeDurationMs);
      }
    };

    const handleTimeUpdateB = () => {
      if (switchingRef.current) return;
      if (!videoB.duration || Number.isNaN(videoB.duration)) return;

      const remaining = videoB.duration - videoB.currentTime;
      if (remaining <= crossfadeSec && remaining > 0) {
        switchingRef.current = true;
        videoA.currentTime = 0;
        const p = videoA.play();
        if (p) p.catch(() => {});
        setActivePlayer(0);

        setTimeout(() => {
          videoB.pause();
          videoB.currentTime = 0;
          switchingRef.current = false;
        }, crossfadeDurationMs);
      }
    };

    // Fallback if timeupdate interval skips the window
    const handleEndedA = () => {
      if (activePlayer === 0) {
        videoB.currentTime = 0;
        videoB.play().catch(() => {});
        setActivePlayer(1);
      }
    };

    const handleEndedB = () => {
      if (activePlayer === 1) {
        videoA.currentTime = 0;
        videoA.play().catch(() => {});
        setActivePlayer(0);
      }
    };

    videoA.addEventListener("timeupdate", handleTimeUpdateA);
    videoB.addEventListener("timeupdate", handleTimeUpdateB);
    videoA.addEventListener("ended", handleEndedA);
    videoB.addEventListener("ended", handleEndedB);

    return () => {
      videoA.removeEventListener("timeupdate", handleTimeUpdateA);
      videoB.removeEventListener("timeupdate", handleTimeUpdateB);
      videoA.removeEventListener("ended", handleEndedA);
      videoB.removeEventListener("ended", handleEndedB);
    };
  }, [src, crossfadeDurationMs]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#03182c]" aria-hidden="true">
      {/* Background Poster (only visible before video starts playing) */}
      {poster && !hasStartedPlaying && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        />
      )}

      {/* Video Player A */}
      <video
        ref={videoRefA}
        src={src}
        muted
        playsInline
        preload="auto"
        className={`${className} transition-opacity duration-500 ease-in-out`}
        style={{
          opacity: activePlayer === 0 ? 1 : 0,
          pointerEvents: "none",
        }}
      />

      {/* Video Player B (Crossfade twin) */}
      <video
        ref={videoRefB}
        src={src}
        muted
        playsInline
        preload="auto"
        className={`${className} transition-opacity duration-500 ease-in-out`}
        style={{
          opacity: activePlayer === 1 ? 1 : 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
