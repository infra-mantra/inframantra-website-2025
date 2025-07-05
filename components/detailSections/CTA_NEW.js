import { RxCross2 } from "react-icons/rx";
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaPhoneAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import Ajax1 from '../helper/Ajax1';
import { useRouter } from 'next/router';
import { downloadBrochure } from '../helper/downloadBrochurePdf';
import ctaStyle from "./cta.module.css";

function App({ name, popUpenable = false, onClickOff, text, pdf }) {
  const [isPopupOpen, setIsPopupOpen] = useState(popUpenable);
  const [isAnimating, setIsAnimating] = useState(popUpenable);
  const [message, setMessage] = useState(popUpenable ? "Contact us by downloading Brochures." : "");
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_SITE_KEY;

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    projectName: name,
  });

  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (recaptchaRef.current) {
      try {
        const token = await recaptchaRef.current.executeAsync();
        setCaptchaToken(token);
        const action = {
          method: 'POST',
          url: '/enquiry/project',
          data: { ...formData, captchaToken: token, message },
          token: false,
        };

        const response = await Ajax1(action);

        if (response.data.status === 'success') {
          toast.success('Form submitted successfully');
          setFormData({ name: '', phoneNumber: '', email: '' });

          if (popUpenable) downloadBrochure(pdf, name);

          setTimeout(() => {
            router.push('/thank-you');
          }, 5000);
        } else {
          toast.error('Form submission failed');
        }
      } catch (error) {
        toast.error('Error submitting form');
        console.error('Error submitting form:', error);
      }
    } else {
      alert('reCAPTCHA not loaded properly.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      setIsPopupOpen(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    if (popUpenable) onClickOff(false);
    setTimeout(() => setIsPopupOpen(false), 300);
  };

  return (
    <div className={ctaStyle.app}>
      {isPopupOpen && (
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
                  id="username"
                  name="username"
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
                  id="mobile"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, phoneNumber: onlyNumbers });
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="10"
                  required
                />
              </div>
              <div className={ctaStyle.formGroup}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="recaptcha-container">
                <ReCAPTCHA
                  sitekey="6LfrSTUqAAAAAOy2-j9cNvTIujOI5GKjtMVsn2Uk"
                  size="invisible"
                  ref={recaptchaRef}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#E7B554",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
              <p className={ctaStyle.propertyPageHeaderContactUsDisclaimer} style={{ padding: "10px" }}>
                *By submitting, I accept Inframantra{' '}
                <a href="https://inframantra.com/page/terms-conditions" target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
                  Terms & Conditions
                </a>{' '}and{' '}
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
                    <span role="img" aria-label="phone" style={{ color: "green", marginRight: "1rem" }}>
                      <FaPhoneAlt />
                    </span>
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
