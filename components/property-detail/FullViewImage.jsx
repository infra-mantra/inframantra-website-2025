import React, { useEffect } from "react";
// CSS module so this sheet ships with the pages that need it instead of with
// every page via _app.js. The `fv` binding must stay used: Next tree-shakes a
// CSS-module import whose binding is unused and then emits none of its CSS.
// WANT_HASH = false (next.config.js) means fv["x"] resolves to the identical
// unhashed name "x", so the rendered markup is byte-for-byte unchanged.
import fv from "./FullViewImage.module.css";

function ImageModal({ image, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window?.addEventListener("keydown", handleEsc);
    return () => window?.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!image) return null;

  return (
    <div className={fv["image-modal"]} onClick={onClose}>
      <button className={fv["close-btn"]} onClick={onClose}>
        ✕
      </button>
      <img src={image} alt="Fullscreen" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}
export default ImageModal;
