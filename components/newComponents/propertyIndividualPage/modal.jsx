import React from "react";


const RightSlideModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      
      <div
        className="slide-modal-overlay open"
        onClick={onClose}
      />

 
      <div
        className="slide-modal open"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="slide-modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="slide-modal-body">
          {children}
        </div>
         <div className="highlight-wrappers">
              <button
                style={{ background: '#e7b554' }}
                className="card-bg card card-ct-wt"
              >
                Request Callback
              </button>
            </div>
      </div>
    </>
  );
};

export default RightSlideModal;
