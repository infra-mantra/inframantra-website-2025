import React, { useEffect, useState, useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/style.css";

import Ajax1 from "../../lib/ajax1.js";
import { downloadBrochure } from "../../lib/downloadBrochurePdf.js";

import ctaStyle from "./Cta.module.css";
import fld from "./formFields.module.css";

const locations = [
  {
    city: "SEATTLE",
    dates: ["30th May, 2026", "31st May, 2026"],
    venue: "InterContinental Seattle Bellevue by IHG",
  },
  {
    city: "SAN JOSE",
    dates: ["6th June, 2026", "7th June, 2026"],
    venue: "The Domain Hotel Sunnyvale",
  },
];

function StickyProperty({
  name,
  popUpenable = true,
  onClickOff,
  text,
  pdf,
  phone = "",
  id = "defaultId",
  countryCode = "in",
}) {
  const router = useRouter();

  const [isAnimating, setIsAnimating] = useState(false);

  const [loading, setLoading] = useState(false);

  const [availableDates, setAvailableDates] = useState([]);

  const [whatsappConsent, setWhatsappConsent] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    projectName: name,
  });

  // =====================================
  // POPUP ANIMATION
  // =====================================
  useEffect(() => {
    if (popUpenable) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [popUpenable]);

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================
  // DATE CHANGE
  // =====================================
  const handleDateChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      eventDate: e.target.value,
    }));
  };

  // =====================================
  // HANDLE SUBMIT
  // =====================================
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
          message: ``,
        },
        token: false,
      };

      console.log("form-data", formData);

      const response = await Ajax1(action);

      if (response?.data?.status === "success") {
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

        setAvailableDates([]);

        if (pdf) {
          downloadBrochure(pdf, name);
        }

        setTimeout(() => {
          router.push("/thank-you");
        }, 2000);
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

  // =====================================
  // CLOSE FORM
  // =====================================
  const handleClose = () => {
    setIsAnimating(false);

    if (onClickOff) {
      onClickOff(false);
    }
  };

  return (
    <div className={ctaStyle.stickyPropertyForm}>
      {/* TOP */}
      <div className={ctaStyle.imageContainer}>
        <img src="/logos/pop-up-logo.png" alt="Inframantra-logo" />

        {onClickOff && (
          <button
            type="button"
            className={ctaStyle.crossBtn}
            onClick={handleClose}
            aria-label="Close"
          >
            <RxCross2 />
          </button>
        )}
      </div>

      {/* HEADING */}
      <div className={ctaStyle.headingForm}>
        <p className={ctaStyle.popUpHead}>Please share your contact details</p>

        <p className={ctaStyle.popUpHead2}>{text || "To Unlock Exclusive Deals"}</p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} id={id}>
        {/* Same floating-label field primitives as the enquiry popup (CTANEW). */}
        <div className={fld.imFldStack}>
          {/* NAME */}
          <div className={fld.imFldGroup}>
            <input
              className={fld.imFldInput}
              type="text"
              id={`${id}-name`}
              placeholder=" "
              value={formData.name}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");

                setFormData((prev) => ({
                  ...prev,
                  name: value,
                }));
              }}
              required
            />
            <label className={fld.imFldLabel} htmlFor={`${id}-name`}>
              Name<span aria-hidden="true">*</span>
            </label>
          </div>

          {/* PHONE */}
          <div className={`${fld.imFldGroup} ${fld.imFldPhone}`}>
            <PhoneInput
              country={countryCode}
              enableSearch={true}
              value={formData.phoneNumber}
              onChange={(phone) =>
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: phone,
                }))
              }
              placeholder="00000 00000"
              inputProps={{ id: `${id}-phone`, name: "phone", autoComplete: "tel" }}
            />
            <label className={fld.imFldLabel} htmlFor={`${id}-phone`}>
              Phone number<span aria-hidden="true">*</span>
            </label>
          </div>

          {/* EMAIL */}
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

        {/* WHATSAPP CONSENT — wording unchanged */}
        <label className={fld.imFldConsent} htmlFor={`${id}-whatsapp`}>
          <input
            type="checkbox"
            id={`${id}-whatsapp`}
            checked={whatsappConsent}
            onChange={(e) => setWhatsappConsent(e.target.checked)}
          />
          <span className={fld.imFldConsentText}>
            <FaWhatsapp className={fld.imFldConsentIcon} aria-hidden="true" />I consent/authorize
            Inframantra to send me updates and promotional messages on WhatsApp.
          </span>
        </label>

        <button type="submit" disabled={loading} aria-busy={loading} className={fld.imFldSubmit}>
          {loading ? "Submitting..." : "Submit"}
        </button>

        {/* DISCLAIMER */}
        <p className={ctaStyle.propertyPageHeaderContactUsDisclaimer}>
          *By submitting, I accept Inframantra{" "}
          <a
            href="https://inframantra.com/page/terms-conditions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="https://inframantra.com/page/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
}

export default StickyProperty;
