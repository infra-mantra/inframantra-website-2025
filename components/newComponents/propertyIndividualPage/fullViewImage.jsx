import React, {useEffect} from "react";

function ImageModal({ image, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window?.addEventListener('keydown', handleEsc);
    return () => window?.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!image) return null;

  return (
    <div className="image-modal" onClick={onClose}>
      <button className="close-btn" onClick={onClose}>✕</button>
      <img
        src={image}
        alt="Fullscreen"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
export default ImageModal
