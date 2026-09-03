"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// react-player pulls in YouTube's embed, which was fetching ~876 KB of script on
// every property page — the single largest third-party cost on the route, for a
// section that sits well below the fold. Loading it only when the section is
// about to scroll into view keeps that off the initial load entirely, and the
// player looks and behaves exactly as before once it is on screen.
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

function PropertyVideo({ videoUrl }) {
  const wrapperRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
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
      // Start loading slightly before it is visible so playback is ready by the
      // time the section is actually reached.
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pd">
      <h2 className="Header">Property Walk Through</h2>

      {/* The wrapper keeps its CSS dimensions whether or not the player has
          mounted, so deferring it causes no layout shift. */}
      <div className="propertyVideoWrapper" ref={wrapperRef}>
        {inView && (
          <ReactPlayer
            url={videoUrl || "https://www.youtube.com/watch?v=zEBrU6GEZdk&ab_channel=INFRAMANTRA"}
            width="100%"
            height="100%"
            controls
          />
        )}
      </div>
    </div>
  );
}

export default PropertyVideo;
