import React from 'react';
// import './backdrop.css';

const CustomBackdrop = ({ open, onClose, children }) => {
  if (!open) return null;

  const handleClickOutside = (e) => {
    if (e.target.className.includes('custom-backdrop')) {
      onClose();
    }
  };

  return (
    <div
      className={`custom-backdrop ${open ? 'open' : ''}`}
      onClick={handleClickOutside}
    >
      <div className="custom-backdrop-content">{children}</div>
    </div>
  );
};

export default CustomBackdrop;
