"use client";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

function PropertyVideo({ videoUrl }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreen(); // initial
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="pd">
      <h2 className="Header">Property Walk Through</h2>

      <div className="propertyVideoWrapper">
        <ReactPlayer
          url={
            videoUrl ||
            "https://www.youtube.com/watch?v=zEBrU6GEZdk&ab_channel=INFRAMANTRA"
          }
          width="100%"
          height="100%"
          controls
        />
      </div>
    </div>
  );
}

export default PropertyVideo;
