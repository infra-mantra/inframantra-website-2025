import { useEffect, useRef, useState } from "react";

/**
 * Defers rendering (and therefore the code-split chunk download + hydration) of
 * its children until they scroll near the viewport. Below-the-fold homepage
 * sections were being server-rendered and hydrated on initial load, which piled
 * onto Total Blocking Time — the heaviest mobile-Lighthouse factor. Wrapping them
 * here keeps their JS off the critical load path; the reserved `minHeight` holds
 * layout space so mounting them produces no visible shift.
 */
export default function LazyOnVisible({
  children,
  minHeight = 500,
  rootMargin = "600px",
  placeholder = null, // optional skeleton shown in the reserved space until visible
}) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

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

  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show ? children : placeholder}
    </div>
  );
}
