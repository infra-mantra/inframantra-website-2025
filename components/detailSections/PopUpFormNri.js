import { RxCross2 } from "react-icons/rx";
import React, { useEffect, useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { toast } from 'react-toastify';
import Ajax1 from '../helper/Ajax1';
import { useRouter } from 'next/router';
import { downloadBrochure } from '../helper/downloadBrochurePdf';
import ctaStyle from "./cta.module.css";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function App({
  name,
  popUpenable = false,
  onClickOff,
  text,
  pdf,
  phone = "",
  id = "defaultId",
  countryCode = "in"
}) {

  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // WhatsApp Consent State
  const [whatsappConsent, setWhatsappConsent] = useState(true);

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    projectName: name,
  });

  const recaptchaRef = useRef(null);

  useEffect(() => {
    if (popUpenable) {
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
        data: {
          ...formData,
          message:{message,whatsAppConsent:whatsappConsent},
          
        },
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

        setFormData({
          name: '',
          phoneNumber: '',
          email: '',
          projectName: name
        });

        if (popUpenable && pdf) {
          downloadBrochure(pdf, name);
        }

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

            {/* Logo */}
            <div className={ctaStyle.imageContainer}>
              <img src="/logos/pop-up-logo.png" alt="Inframantra-logo" />

              <div className={ctaStyle.crossBtn} onClick={handleClose}>
                <RxCross2 />
              </div>
            </div>

            {/* Heading */}
            <div className={ctaStyle.headingForm}>
              <p className={ctaStyle.popUpHead}>
                Please share your contact details
              </p>

              <p className={ctaStyle.popUpHead2}>
                {text ? text : "TO UNLOCK EXCLUSIVE DEALS"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} id={id}>

              {/* Name */}
              <div className={ctaStyle.formGroup}>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => {
                    const alphabeticValue =
                      e.target.value.replace(/[^a-zA-Z\s]/g, '');

                    setFormData({
                      ...formData,
                      name: alphabeticValue
                    });
                  }}
                  required
                />
              </div>

              {/* Phone */}
              <div className={ctaStyle.formGroup}>

                <PhoneInput
                  country={countryCode}
                  enableSearch={true}
                  value={formData.phoneNumber}
                  onChange={(phone) =>
                    setFormData({
                      ...formData,
                      phoneNumber: phone
                    })
                  }
                  inputClass={ctaStyle.input}
                  containerClass={ctaStyle.phoneContainer}
                  buttonClass={ctaStyle.flagDropdown}
                  placeholder="Enter phone number"
                />

              </div>

              {/* Email */}
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

              {/* WhatsApp Consent */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  marginBottom: "15px",
                  marginTop: "10px",
                }}
              >

                <input
                  type="checkbox"
                  id="whatsappConsent"
                  checked={whatsappConsent}
                  onChange={(e) =>
                    setWhatsappConsent(e.target.checked)
                  }
                  style={{
                    marginTop: "4px",
                    cursor: "pointer",
                    accentColor: "green",
                    minWidth: "16px",
                    height: "16px"
                  }}
                />

                <label
                  htmlFor="whatsappConsent"
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.5",
                    color: "#444",
                    cursor: "pointer",
                  }}
                >

                  <FaWhatsapp
                    style={{
                      color: "green",
                      marginRight: "6px",
                      fontSize: "16px",
                      verticalAlign: "middle",
                    }}
                  />

                  I consent/authorize Inframantra to send me updates and
                  promotional messages on WhatsApp.

                </label>

              </div>

              {/* Submit Button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}
              >

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

              {/* Disclaimer */}
              <p
                className={ctaStyle.propertyPageHeaderContactUsDisclaimer}
                style={{ padding: "10px" }}
              >

                *By submitting, I accept Inframantra{" "}

                <a
                  href="https://inframantra.com/page/terms-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "blue" }}
                >
                  Terms & Conditions
                </a>

                {" "}and{" "}

                <a
                  href="https://inframantra.com/page/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "blue" }}
                >
                  Privacy Policy
                </a>

                .

              </p>

            </form>

            {/* Bottom Contact Section */}
            <div className={ctaStyle.propertyPageHeaderContactIconContainer2}>

              <hr width="100%" color="#DCAA4C" size="1" />

              <div style={{ display: "flex" }}>

                <div className={ctaStyle.ctaText}>

                  <p className={ctaStyle.numberFor}>

                    <FaPhoneAlt
                      style={{
                        color: "green",
                        marginRight: "1rem"
                      }}
                    />

                    <p>
                      {phone ? (
                        phone
                      ) : (
                        <>
                          +91 86 9800 9900 <br />
                          +1 (213) 6575060
                        </>
                      )}
                    </p>

                  </p>

                  <p className={ctaStyle.textForm}>
                    Give us a call and book your visit now!
                  </p>

                </div>

                <img
                  src="/guruCollection/guru_call.png"
                  alt="Call Icon"
                       className="callImage"
                />

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;