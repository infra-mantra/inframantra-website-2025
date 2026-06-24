import React, { useEffect, useRef, useState } from "react";

/* Smoothly tweens a displayed number toward `value`. On every change it
   re-targets from the CURRENT displayed value (not from zero), so rapid
   slider drags ease fluidly instead of snapping or restarting. SSR-safe:
   the initial render shows the final value (no flash). */
export function useAnimatedNumber(value, duration = 380) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const targetRef = useRef(value);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const displayRef = useRef(value);

  // keep a live ref of the latest displayed value
  displayRef.current = display;

  useEffect(() => {
    if (!isFinite(value)) return;
    fromRef.current = displayRef.current;
    targetRef.current = value;
    startRef.current = null;

    const tick = (t) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const p = duration > 0 ? Math.min(1, elapsed / duration) : 1;
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const next = fromRef.current + (targetRef.current - fromRef.current) * eased;
      setDisplay(p < 1 ? next : targetRef.current);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return display;
}

/* Renders a smoothly-animating number. `format` turns the numeric value into
   the final string (e.g. INR formatting). */
function AnimatedNumber({ value, format, duration }) {
  const display = useAnimatedNumber(Number(value) || 0, duration);
  return <>{format ? format(display) : Math.round(display)}</>;
}

export default AnimatedNumber;
