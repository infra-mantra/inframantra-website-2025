import { useEffect, useRef, useState } from "react";
import s from "./LazyOnVisible.module.css";

/**
 * Defers rendering (and therefore the code-split chunk download + hydration) of
 * its children until they scroll near the viewport. Below-the-fold homepage
 * sections were being server-rendered and hydrated on initial load, which piled
 * onto Total Blocking Time — the heaviest mobile-Lighthouse factor.
 *
 * Zero layout shift: the wrapper reserves `minHeight` until the real section has
 * replaced every skeleton inside it (any element with `data-skeleton`). Set
 * `minHeight` to the section's real height so nothing moves when it arrives.
 *
 * minHeight: a number (px, all screens) or [phone, tablet, desktop] in px
 *            (phone < 768px, tablet 768–1199px, desktop ≥ 1200px).
 */
export default function LazyOnVisible({
  children,
  minHeight = 500,
  rootMargin = "600px",
  placeholder = null, // optional skeleton shown in the reserved space until visible
}) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false); // true once no skeleton is left inside

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;

    // Older/edge browsers without IO: render immediately rather than never.
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  // After mounting, keep the reserved height until the skeletons are gone.
  useEffect(() => {
    if (!show || ready) return;
    const el = ref.current;
    const check = () => {
      if (el && !el.querySelector("[data-skeleton]")) setReady(true);
    };
    check();
    const mo = new MutationObserver(check);
    mo.observe(el, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [show, ready]);

  // Turn minHeight into CSS variables read by the media queries in the CSS file.
  const [m, t, d] = Array.isArray(minHeight) ? minHeight : [minHeight, minHeight, minHeight];
  const reserve = { "--lov-m": `${m}px`, "--lov-t": `${t}px`, "--lov-d": `${d}px` };

  return (
    <div ref={ref} className={ready ? undefined : s.reserve} style={ready ? undefined : reserve}>
      {show ? children : placeholder}
    </div>
  );
}
