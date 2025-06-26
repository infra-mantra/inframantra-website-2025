import Link from "next/link";
import { useState } from "react";
import FloatingContactForm from "./FloatingContactForm";

const FloatingContactBtn = (props) => {

    const [openContactForm, setOpenContactForm] = useState(false);

    const openFormHandler = (formHandler) => {
        openContactForm ? setOpenContactForm(false) : setOpenContactForm(true)
    }

  return (
    <>
      <div className="floating-contact-btn guru-floating-img" onClick={openFormHandler}>
        <picture>
          <img src="/assets/guru-icon-4 (2).png" alt=""  />
        </picture>
          {/* <span>Contact Us</span> */}
      </div>
      <div className="floating-contact-btn-mob" onClick={openFormHandler}>
          <span>Contact Us</span>
      </div>
      {openContactForm && <FloatingContactForm onOpen={openFormHandler} heading="Contact Us" />}
    </>
  );
};

export default FloatingContactBtn;
