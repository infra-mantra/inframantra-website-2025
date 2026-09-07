import React, { useState } from "react";
import PopUpForm from "../shared/forms/CTANEW.jsx";
// CSS module so this sheet ships with the pages that need it instead of with
// every page via _app.js. The `rsm` binding must stay used: Next tree-shakes a
// CSS-module import whose binding is unused and then emits none of its CSS.
// WANT_HASH = false (next.config.js) means rsm["x"] resolves to the identical
// unhashed name "x", so the rendered markup is byte-for-byte unchanged.
import rsm from "./Modal.module.css";
import fld from "../shared/forms/formFields.module.css";

const RightSlideModal = ({ isOpen, onClose, title, children, name, id = "defult" }) => {
  if (!isOpen) return null;
  const [popForm, setPopForm] = useState(false);
  const onClickOff = (val) => setPopForm(val);
  const handleform = () => setPopForm(true);

  return (
    <>
      <div className={`${rsm["slide-modal-overlay"]} ${rsm["open"]}`} onClick={onClose} />

      <div className={`${rsm["slide-modal"]} ${rsm["open"]}`} onClick={(e) => e.stopPropagation()}>
        <div className={rsm["slide-modal-header"]}>
          <h2>{title}</h2>
          <button className={rsm["close-btn"]} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={rsm["slide-modal-body"]}>{children}</div>
        {/* Shared submit primitive. This stacked three class sets that fight each other:
            .card is a CARD style (white background, border, 20px padding, 30px bottom
            margin, box-shadow) applied to a button, .card-ct-wt is a button style, and the
            gold was then set a third time inline. Its wrapper class .highlight-wrappers has
            no rule defined anywhere. */}
        <button type="button" onClick={handleform} className={fld.imFldSubmit}>
          Request Callback
        </button>
      </div>
      <PopUpForm
        popUpenable={popForm}
        onClickOff={onClickOff}
        text="TO CONNECT WITH OUR PROPERTY ADVISOR "
        name={name}
        id={id}
      />
    </>
  );
};

export default RightSlideModal;
