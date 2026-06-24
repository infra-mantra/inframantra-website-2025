import React from "react";

/* Top overlay: left-side fade (keeps the hero text readable) and the
   gold accent line along the bottom edge. Rendered last so it sits on top. */
function HeroOverlay() {
  return (
    <g>
      <rect width="1920" height="640" fill="url(#ha-leftfade)" />
      <rect x="0" y="636" width="1920" height="4" fill="url(#ha-gold)" />
    </g>
  );
}

export default HeroOverlay;
