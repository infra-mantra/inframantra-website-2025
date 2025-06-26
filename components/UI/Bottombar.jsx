import React, { useState } from "react";
import useMediaQuery from "../../utils/useMediaQuery";

function BottomBar({ onSearchClick, onShareClick }) {
  const isMobile = !useMediaQuery(768); // Only render on mobile viewports
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: "Share This Article",
        text: "Check out this amazing article!",
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  return (
    isMobile && (
      <div className="bottom-bar">
        <div className="bottom-bar-item" onClick={handleSearchToggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
          >
            <path
              d="M10.1997 10.7829L6.16664 6.75037C5.84461 7.0247 5.47428 7.237 5.05565 7.38726C4.63702 7.53752 4.21624 7.61265 3.79331 7.61265C2.76197 7.61265 1.88907 7.25567 1.1746 6.54172C0.460138 5.82777 0.102905 4.95519 0.102905 3.92398C0.102905 2.89277 0.459709 2.01976 1.17332 1.30495C1.88692 0.590139 2.7594 0.232305 3.79074 0.231447C4.82207 0.230588 5.69541 0.587778 6.41073 1.30302C7.12606 2.01825 7.48372 2.89126 7.48372 3.92205C7.48372 4.36939 7.4045 4.80235 7.24606 5.22094C7.08763 5.63952 6.87938 5.99757 6.62134 6.29508L10.6544 10.327L10.1997 10.7829ZM3.79396 6.96803C4.6484 6.96803 5.36973 6.67395 5.95796 6.08579C6.5462 5.49763 6.84031 4.77617 6.84031 3.9214C6.84031 3.06664 6.5462 2.34539 5.95796 1.75766C5.36973 1.16993 4.6484 0.875847 3.79396 0.875418C2.93952 0.874989 2.21797 1.16907 1.6293 1.75766C1.04064 2.34625 0.746526 3.0675 0.746955 3.9214C0.747385 4.77531 1.0415 5.49656 1.6293 6.08515C2.21711 6.67374 2.93844 6.96782 3.79331 6.96739"
              fill="#959595"
            />
          </svg>
          <p>Search</p>
        </div>

        <div className="bottombar-divider" style={{ width: '1.791px', height: '18.465px', background: '#B9B9B9' }}></div>

        <div className="bottom-bar-item" onClick={handleShareClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="11"
            viewBox="0 0 13 11"
            fill="none"
          >
            <path
              d="M12.7702 5.15547L8.15392 0.231445V3.04517C3.53765 3.7486 1.55925 7.26576 0.89978 10.7829C2.54845 8.32091 4.85658 7.19542 8.15392 7.19542V10.0795L12.7702 5.15547Z"
              fill="black"
              fill-opacity="0.35"
            />
          </svg>
          <p>Share</p>
        </div>
      </div>
    )
  );
}

export default BottomBar;
