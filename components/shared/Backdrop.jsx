import React, { useEffect, useRef } from "react";
import bd from "./Backdrop.module.css";

/*
  Modal shell for the enquiry forms opened from property cards and listings.

  The previous version decided "did you click the backdrop?" with
  `e.target.className.includes("custom-backdrop")`. On an SVG element className is
  an SVGAnimatedString, not a string, so that threw a TypeError — and the icons
  inside these forms are react-icons SVGs. It also compared against a substring,
  so the inner panel (custom-backdrop-content) matched too and clicking the form
  itself could close it.

  Comparing against the overlay node directly is both correct and cheaper.
*/
const CustomBackdrop = ({ open, onClose, children, label = "Enquiry form" }) => {
  const overlayRef = useRef(null);

  // Close on Escape. Standard for a modal, and the only way out for someone not
  // using a pointer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /*
    Lock the page behind the modal. Without this the body keeps scrolling under
    the overlay on desktop, and on iOS the page scrolls instead of the form once
    the form has been scrolled to its end.

    The scrollbar it removes is compensated with padding so the page underneath
    does not visibly jump sideways as the modal opens.
  */
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [open]);

  if (!open) return null;

  // Only a click that starts and ends on the overlay itself closes it. Using the
  // ref rather than a class name also means dragging a text selection out of the
  // form and releasing over the backdrop does not dismiss the work in progress.
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  return (
    <div
      ref={overlayRef}
      className={bd.imBdOverlay}
      onMouseDown={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div className={bd.imBdPanel}>{children}</div>
    </div>
  );
};

export default CustomBackdrop;
