import { RxCross2 } from "react-icons/rx";
import React, { useEffect, useState, useRef } from "react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import Ajax1 from "../../lib/ajax1.js";
import { useRouter } from "next/router";
import { downloadBrochure } from "../../lib/downloadBrochurePdf.js";
import ctaStyle from "./Cta.module.css";
import fld from "./formFields.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function App({
  name,
  popUpenable = false,
  onClickOff,
  text,
  pdf,
  phone = "",
  id = "defaultId",
  countryCode = "in",
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // WhatsApp Consent State
  const [whatsappConsent, setWhatsappConsent] = useState(true);

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    projectName: name,
  });

  useEffect(() => {
    if (popUpenable) {
      setIsAnimating(true);
      setMessage("");
    } else if (popUpenable && pdf) {
      setIsAnimating(true);
      setMessage("Contact us by downloading Brochures.");
    } else {
      setIsAnimating(false);
    }
  }, [popUpenable]);

  const handleChange = (e) => {
    setFormData((prev) => ({
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
        method: "POST",
        url: "/enquiry/project",
        data: {
          ...formData,
          message: { message, whatsappConsent },
        },
        token: false,
      };

      const response = await Ajax1(action);

      if (response.data.status === "success") {
        toast.update(toastId, {
          render: "Form submitted successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

        setFormData({
          name: "",
          phoneNumber: "",
          email: "",
          projectName: name,
        });

        if (popUpenable && pdf) {
          downloadBrochure(pdf, name);
        }

        setTimeout(() => {
          router.push("/thank-you");
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
      toast.error("Error submitting form");
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
        <div
          className={`${ctaStyle.popupOverlay} ${isAnimating ? ctaStyle.popupAnimating : "popup-closing"}`}
        >
          <div
            className={`${ctaStyle.popupForm} ${isAnimating ? ctaStyle.popupAnimatingForm : ""}`}
          >
            {/* Logo */}
            <div className={ctaStyle.imageContainer}>
              <img src="/logos/pop-up-logo.png" alt="Inframantra-logo" />

              <div className={ctaStyle.crossBtn} onClick={handleClose}>
                <RxCross2 />
              </div>
            </div>

            {/* Heading */}
            <div className={ctaStyle.headingForm}>
              <p className={ctaStyle.popUpHead}>Please share your contact details</p>

              <p className={ctaStyle.popUpHead2}>{text ? text : "TO UNLOCK EXCLUSIVE DEALS"}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} id={id}>
              {/* Fields use the shared primitives from formFields.module.css, the same
                    ones the property enquiry modal uses, so the two popups stay visually
                    identical. Labels float rather than sitting above the input, which is
                    what took the height out; placeholder=" " is required for that — an
                    empty placeholder counts as absent and :placeholder-shown never
                    matches. */}
              <div className={fld.imFldStack}>
                <div className={fld.imFldGroup}>
                  <input
                    className={fld.imFldInput}
                    type="text"
                    id={`${id}-name`}
                    placeholder=" "
                    value={formData.name}
                    onChange={(e) => {
                      const alphabeticValue = e.target.value.replace(/[^a-zA-Z\s]/g, "");

                      setFormData({
                        ...formData,
                        name: alphabeticValue,
                      });
                    }}
                    required
                  />
                  <label className={fld.imFldLabel} htmlFor={`${id}-name`}>
                    Name<span aria-hidden="true">*</span>
                  </label>
                </div>

                <div className={`${fld.imFldGroup} ${fld.imFldPhone}`}>
                  <PhoneInput
                    country={countryCode}
                    enableSearch={true}
                    value={formData.phoneNumber}
                    onChange={(phone) =>
                      setFormData({
                        ...formData,
                        phoneNumber: phone,
                      })
                    }
                    placeholder="00000 00000"
                    inputProps={{ id: `${id}-phone`, name: "phone", autoComplete: "tel" }}
                  />
                  <label className={fld.imFldLabel} htmlFor={`${id}-phone`}>
                    Phone number<span aria-hidden="true">*</span>
                  </label>
                </div>

                <div className={fld.imFldGroup}>
                  <input
                    className={fld.imFldInput}
                    type="email"
                    name="email"
                    id={`${id}-email`}
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label className={fld.imFldLabel} htmlFor={`${id}-email`}>
                    Email address<span aria-hidden="true">*</span>
                  </label>
                </div>
              </div>

              {/* WhatsApp consent. Wording unchanged (it is a consent statement); only the
                  styling moved out of inline styles into the shared module. */}
              <label className={fld.imFldConsent} htmlFor="whatsappConsent">
                <input
                  type="checkbox"
                  id="whatsappConsent"
                  checked={whatsappConsent}
                  onChange={(e) => setWhatsappConsent(e.target.checked)}
                />
                <span className={fld.imFldConsentText}>
                  <FaWhatsapp className={fld.imFldConsentIcon} aria-hidden="true" />I
                  consent/authorize Inframantra to send me updates and promotional messages on
                  WhatsApp.
                </span>
              </label>

              {/* Submit Button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {/* Shared submit primitive — the inline styles here set a different radius,
                    padding and gold (#E7B554 vs #b8860b) to the enquiry modal, which is exactly
                    the drift the shared module exists to stop. */}
                <button type="submit" disabled={loading} className={fld.imFldSubmit}>
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
                </a>{" "}
                and{" "}
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
                        marginRight: "1rem",
                      }}
                    />

                    <p>{phone ? phone : <>+91 86 9800 9900</>}</p>
                  </p>

                  <p className={ctaStyle.textForm}>Give us a call and book your visit now!</p>
                </div>

                <img src="/guruCollection/guru_call.png" alt="Call Icon" className="callImage" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
