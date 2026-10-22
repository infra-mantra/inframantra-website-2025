import React, { startTransition, useEffect, useRef, useState } from "react";
import cx from "./CardExtras.module.css";

/*
  Small pieces shared by the desktop and phone listing cards (prefixed cx-):
  - PhotoLocation: the location as a glass chip on the photo's bottom-left.
  - ClampedDescription: the 2-line description with a "Read more" link that
    only appears when the text is actually cut off; it opens the details modal.
*/

export function PhotoLocation({ property }) {
  const text = [property.subLocality?.name, property.city?.name].filter(Boolean).join(", ");
  if (!text) return null;
  return (
    <span className={cx.cxLoc}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
      </svg>
      <span className={cx.cxLocText}>{text}</span>
    </span>
  );
}

export function ClampedDescription({ text, className, onReadMore }) {
  const ref = useRef(null);
  const [cut, setCut] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // transition: may run while the list is still hydrating
    const check = () => startTransition(() => setCut(el.scrollHeight - el.clientHeight > 2));
    check();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  if (!text) return null;
  return (
    <div className={cx.cxDesc}>
      <p ref={ref} className={className}>
        {text}
      </p>
      {cut && (
        <button type="button" className={cx.cxMore} onClick={onReadMore}>
          Read more
        </button>
      )}
    </div>
  );
}
