import React ,{useState}from "react";
import PopUpForm from '../../detailSections/CTA_NEW'

const RightSlideModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
    const [popForm, setPopForm] = useState(false);
     const onClickOff = (val) =>setPopForm(val)
     const handleform = () => setPopForm(true);

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
                type="button"
                onClick={handleform}
              >
                Request Callback
              </button>
            </div>
      </div>
       <PopUpForm
        popUpenable={popForm}
        onClickOff={onClickOff}
        text="To download brochure"
  
        name={name}
        />
    </>
  );
};

export default RightSlideModal;
