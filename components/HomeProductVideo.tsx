"use client";

import { trackAction } from "./WebsiteAnalytics";
import { useEffect, useRef, useState } from "react";

export function HomeProductVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const syncPlaybackRef = useRef<(() => void) | null>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let visible = false;
    let pageActive = true;
    let disposed = false;
    let requestVersion = 0;
    let sourceAttached = false;
    function attachSource() {
      if (sourceAttached) return;
      sourceAttached = true;
      video!.preload = "metadata";
      video!.src = "/videos/mobile-world-products-original-128.mp4";
      video!.load();
    }
    const shouldPlay = () => visible && pageActive && !document.hidden && !disposed;

    function syncPlayback() {
      const version = ++requestVersion;
      if (!shouldPlay()) {
        // Keep the same element, source and currentTime: pause preserves its last frame.
        video!.pause();
        return;
      }
      attachSource();
      if (!video!.paused) return;

      void video!.play().then(() => {
        if (!disposed && !shouldPlay()) video!.pause();
      }).catch((error: unknown) => {
        // Ignore an interrupted play after a fast scroll. If audible autoplay is
        // restricted, continue silently and keep the sound button truthful.
        if (disposed || version !== requestVersion || !shouldPlay()) return;
        if (error instanceof DOMException && error.name === "NotAllowedError" && !video!.muted) {
          video!.muted = true;
          setMuted(true);
          syncPlayback();
        }
      });
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio > 0;
      syncPlayback();
    }, { threshold: [0, 0.001] });

    const loader = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { attachSource(); loader.disconnect(); }
    }, { rootMargin: "600px 0px" });
    loader.observe(video);
    const onPlay = () => trackAction("video", "product video: playing");
    const onPause = () => { if (video.currentTime > 0) trackAction("video", "product video: paused"); };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    const guardPlayback = () => { if (!shouldPlay()) video.pause(); };
    const syncSound = () => setMuted(video.muted);
    const hidePage = () => { pageActive = false; syncPlayback(); };
    const showPage = () => { pageActive = true; syncPlayback(); };

    syncPlaybackRef.current = syncPlayback;
    observer.observe(video);
    video.addEventListener("loadeddata", syncPlayback);
    video.addEventListener("canplay", syncPlayback);
    video.addEventListener("playing", guardPlayback);
    video.addEventListener("volumechange", syncSound);
    document.addEventListener("visibilitychange", syncPlayback);
    window.addEventListener("pagehide", hidePage);
    window.addEventListener("pageshow", showPage);

    return () => {
      disposed = true;
      syncPlaybackRef.current = null;
      observer.disconnect();
      loader.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("loadeddata", syncPlayback);
      video.removeEventListener("canplay", syncPlayback);
      video.removeEventListener("playing", guardPlayback);
      video.removeEventListener("volumechange", syncSound);
      document.removeEventListener("visibilitychange", syncPlayback);
      window.removeEventListener("pagehide", hidePage);
      window.removeEventListener("pageshow", showPage);
      video.pause();
    };
  }, []);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    trackAction("video", video.muted ? "product video: sound off" : "product video: sound on");
    setMuted(video.muted);
    syncPlaybackRef.current?.();
  }

  return (
    <section id="mobile-world-video" className="mw-home-video" aria-label="Mobile World का product video">
      <video
        ref={videoRef}
        className="mw-home-video-player"
        loop
        muted={muted}
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        poster="/images/mobile-world-product-video-poster.jpg"
        width={854}
        height={480}
        tabIndex={-1}
        aria-label="Mobile World का product video"
      >
        आपका browser यह video नहीं चला पा रहा है।
      </video>
      <button
        className="mw-home-video-sound"
        type="button"
        onClick={toggleSound}
        aria-label="Video की आवाज़"
        aria-pressed={!muted}
        title={muted ? "Sound On करें" : "Sound Off करें"}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          {muted ? <path d="m16 9 5 6m0-6-5 6" /> : <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></>}
        </svg>
        <span>{muted ? "Sound Off" : "Sound On"}</span>
      </button>
    </section>
  );
}
