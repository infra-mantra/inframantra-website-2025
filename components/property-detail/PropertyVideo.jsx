"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import pv from "./PropertyVideo.module.css";

// react-player pulls in YouTube's embed, which was fetching ~876 KB of script on
// every property page — the single largest third-party cost on the route, for a
// section that sits well below the fold. For YouTube links we now show a poster
// (the video's own thumbnail + a play button) and only load the player when
// someone clicks play. Other links keep the old behaviour: load the player when
// the section is about to scroll into view.
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const DEFAULT_URL = "https://www.youtube.com/watch?v=zEBrU6GEZdk&ab_channel=INFRAMANTRA";

// YouTube video id from watch?v=, youtu.be/, /embed/, /shorts/ or /live/ URLs.
const getYouTubeId = (url) => {
  const match = String(url || "").match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
};

function PropertyVideo({ videoUrl }) {
  const url = videoUrl || DEFAULT_URL;
  const youTubeId = getYouTubeId(url);

  const wrapperRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  // maxresdefault doesn't exist for every video; fall back to hqdefault.
  const [poster, setPoster] = useState(
    youTubeId ? `https://i.ytimg.com/vi/${youTubeId}/maxresdefault.jpg` : null
  );

  useEffect(() => {
    setPlaying(false);
    setPoster(youTubeId ? `https://i.ytimg.com/vi/${youTubeId}/maxresdefault.jpg` : null);
  }, [youTubeId]);

  // Non-YouTube links: mount the player shortly before the section is visible.
  useEffect(() => {
    if (youTubeId) return;
    const el = wrapperRef.current;
    if (!el) return;

    // Browsers without IntersectionObserver just load the player immediately —
    // the old behaviour — rather than never showing it.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [youTubeId]);

  const showPlayer = youTubeId ? playing : inView;

  return (
    <div className="pd">
      <h2 className="Header">Property Walk Through</h2>

      {/* The wrapper keeps its CSS dimensions whether or not the player has
          mounted, so deferring it causes no layout shift. */}
      <div className={`propertyVideoWrapper ${pv["video-frame"]}`} ref={wrapperRef}>
        {showPlayer ? (
          <ReactPlayer url={url} width="100%" height="100%" controls playing={!!youTubeId} />
        ) : (
          youTubeId && (
            <button
              type="button"
              className={pv["video-poster"]}
              onClick={() => setPlaying(true)}
              aria-label="Play property walk through video"
            >
              <img
                src={poster}
                alt=""
                loading="lazy"
                onLoad={(e) => {
                  // YouTube serves a 120x90 grey placeholder when maxres is missing
                  if (e.currentTarget.naturalWidth <= 120 && poster.includes("maxres")) {
                    setPoster(`https://i.ytimg.com/vi/${youTubeId}/hqdefault.jpg`);
                  }
                }}
                onError={() => setPoster(`https://i.ytimg.com/vi/${youTubeId}/hqdefault.jpg`)}
              />
              <span className={pv["video-shade"]} aria-hidden="true" />
              <span className={pv["video-play"]} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="30" height="30">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              </span>
              <span className={pv["video-caption"]}>
                <span className={pv["video-caption-title"]}>Watch the walkthrough</span>
                <span className={pv["video-caption-sub"]}>Tour the project on video</span>
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default PropertyVideo;
