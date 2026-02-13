import { RxCross2 } from "react-icons/rx";
import React, { useEffect, useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaPhoneAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import Ajax1 from '../helper/Ajax1';
import { useRouter } from 'next/router';
import { downloadBrochure } from '../helper/downloadBrochurePdf';
import ctaStyle from "./cta.module.css";

function App({ name, popUpenable = false, onClickOff, text, pdf  }) {

  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); 

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    projectName: name,
  });

  const recaptchaRef = useRef(null);

  useEffect(() => {
     if(popUpenable){
      setIsAnimating(true);
      setMessage("");
     }
    else if (popUpenable && pdf) {
      setIsAnimating(true);
      setMessage("Contact us by downloading Brochures.");
    } else {
      setIsAnimating(false);
    }
  }, [popUpenable]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; 
   

    try {
      setLoading(true);
      const toastId = toast.loading("Submitting form...");
      const action = {
        method: 'POST',
        url: '/enquiry/project',
        data: { ...formData,  message },
        token: false,
      };

      const response = await Ajax1(action);

      if (response.data.status === 'success') {
        toast.update(toastId, {
          render: "Form submitted successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

        setFormData({ name: '', phoneNumber: '', email: '', projectName: name });

        if (popUpenable && pdf) downloadBrochure(pdf, name);

        setTimeout(() => {
          router.push('/thank-you');
        }, 3000);

      } else {
        toast.update(toastId, {
          render: "Form submission failed",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }

    } catch (error) {
      toast.error('Error submitting form');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    onClickOff(false);
  };

  return (
    <div className={ctaStyle.app}>
      {popUpenable && (
        <div className={`${ctaStyle.popupOverlay} ${isAnimating ? ctaStyle.popupAnimating : "popup-closing"}`}>
          <div className={`${ctaStyle.popupForm} ${isAnimating ? ctaStyle.popupAnimatingForm : ""}`}>
            
            <div className={ctaStyle.imageContainer}>
              <img src="/logos/pop-up-logo.png" alt="Inframantra-logo" />
              <div className={ctaStyle.crossBtn} onClick={handleClose}>
                <RxCross2 />
              </div>
            </div>

            <div className={ctaStyle.headingForm}>
              <p className={ctaStyle.popUpHead}>Please share your contact details</p>
              <p className={ctaStyle.popUpHead2}>{text ? text : "TO UNLOCK EXCLUSIVE DEALS"}</p>
            </div>

            <form onSubmit={handleSubmit}>
              
              <div className={ctaStyle.formGroup}>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => {
                    const alphabeticValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setFormData({ ...formData, name: alphabeticValue });
                  }}
                  required
                />
              </div>

              <div className={ctaStyle.formGroup}>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, phoneNumber: onlyNumbers });
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  minLength="10"
                  required
                />
              </div>

              <div className={ctaStyle.formGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

             

              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: loading ? "#ccc" : "#E7B554",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>

              <p className={ctaStyle.propertyPageHeaderContactUsDisclaimer} style={{ padding: "10px" }}>
                *By submitting, I accept Inframantra{" "}
                <a href="https://inframantra.com/page/terms-conditions" target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
                  Terms & Conditions
                </a>{" "}and{" "}
                <a href="https://inframantra.com/page/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
                  Privacy Policy.
                </a>
              </p>

            </form>

            <div className={ctaStyle.propertyPageHeaderContactIconContainer2}>
              <hr width="100%" color="#DCAA4C" size="1" />
              <div style={{ display: "flex" }}>
                <div className={ctaStyle.ctaText}>
                  <p className={ctaStyle.numberFor}>
                    <FaPhoneAlt style={{ color: "green", marginRight: "1rem" }} />
                    +91 86 9800 9900
                  </p>
                  <p className={ctaStyle.textForm}>Give us a call and book your visit now!</p>
                </div>
                <img src="/guruCollection/guru_call.png" alt="Call Icon" />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
