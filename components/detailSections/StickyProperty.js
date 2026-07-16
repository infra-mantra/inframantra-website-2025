import React, { useEffect, useState, useRef } from 'react';
import { RxCross2 } from "react-icons/rx";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import ReCAPTCHA from 'react-google-recaptcha';
import PhoneInput from 'react-phone-input-2';

import 'react-phone-input-2/lib/style.css';

import Ajax1 from '../helper/Ajax1';
import { downloadBrochure } from '../helper/downloadBrochurePdf';

import ctaStyle from "./cta.module.css";

const locations = [
  {
    city: 'SEATTLE',
    dates: ['30th May, 2026', '31st May, 2026'],
    venue: 'InterContinental Seattle Bellevue by IHG',
  },
  {
    city: 'SAN JOSE',
    dates: ['6th June, 2026', '7th June, 2026'],
    venue: 'The Domain Hotel Sunnyvale',
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
  countryCode = "in"
}) {

  const router = useRouter();

  const recaptchaRef = useRef(null);

  const [isAnimating, setIsAnimating] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [availableDates,
    setAvailableDates] =
    useState([]);

  const [whatsappConsent,
    setWhatsappConsent] =
    useState(true);

  const [formData, setFormData] =
    useState({
      name: '',
      phoneNumber: '',
      email: '',
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

      const toastId =
        toast.loading("Submitting form...");

      const action = {
        method: 'POST',
        url: '/enquiry/project',
        data: {
          ...formData,
          message: ``,
        },
        token: false,
      };


      const response =
        await Ajax1(action);

      if (
        response?.data?.status ===
        'success'
      ) {

        toast.update(toastId, {
          render:
            "Form submitted successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

        setFormData({
          name: '',
          phoneNumber: '',
          email: '',
          projectName: name,
        });

        setAvailableDates([]);

        if (pdf) {

          downloadBrochure(
            pdf,
            name
          );

        }

        setTimeout(() => {

          router.push('/thank-you');

        }, 2000);

      } else {

        toast.update(toastId, {
          render:
            "Form submission failed",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });

      }

    } catch (error) {

      toast.error(
        'Error submitting form'
      );

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

    <div
      className={ctaStyle.stickyPropertyForm}
    >

      {/* TOP */}
      <div
        className={
          ctaStyle.imageContainer
        }
      >

        <img
          src="/logos/pop-up-logo.png"
          alt="Inframantra-logo"
        />

        {onClickOff && (

          <div
            className={
              ctaStyle.crossBtn
            }
            onClick={handleClose}
          >
            <RxCross2 />
          </div>

        )}

      </div>

      {/* HEADING */}
      <div
        className={ctaStyle.headingForm}
      >

        <p
          className={
            ctaStyle.popUpHead
          }
        >
          Please share your contact
          details
        </p>

        <p
          className={
            ctaStyle.popUpHead2
          }
        >
          {text ||
            "TO UNLOCK EXCLUSIVE DEALS"}
        </p>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        id={id}
      >

        {/* NAME */}
        <div
          className={
            ctaStyle.formGroup
          }
        >

          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => {

              const value =
                e.target.value.replace(
                  /[^a-zA-Z\s]/g,
                  ''
                );

              setFormData((prev) => ({
                ...prev,
                name: value,
              }));

            }}
            required
          />

        </div>

        {/* PHONE */}
        <div
          className={
            ctaStyle.formGroup
          }
        >

          <PhoneInput
            country={countryCode}
            enableSearch={true}
            value={
              formData.phoneNumber
            }
            onChange={(phone) =>
              setFormData((prev) => ({
                ...prev,
                phoneNumber: phone,
              }))
            }
            inputClass={
              ctaStyle.input
            }
            containerClass={
              ctaStyle.phoneContainer
            }
            buttonClass={
              ctaStyle.flagDropdown
            }
            placeholder="Enter phone number"
          />

        </div>

        {/* EMAIL */}
        <div
          className={
            ctaStyle.formGroup
          }
        >

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

        </div>

      

        {/* WHATSAPP CONSENT */}
        <div
          style={{
            display: "flex",
            alignItems:
              "flex-start",
            gap: "10px",
            marginBottom:
              "15px",
            marginTop: "10px",
          }}
        >

          <input
            type="checkbox"
            id="whatsappConsent"
            checked={
              whatsappConsent
            }
            onChange={(e) =>
              setWhatsappConsent(
                e.target.checked
              )
            }
            style={{
              marginTop: "4px",
              cursor: "pointer",
              accentColor:
                "green",
              minWidth: "16px",
              height: "16px",
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
                marginRight:
                  "6px",
                fontSize:
                  "16px",
                verticalAlign:
                  "middle",
              }}
            />

            I consent/authorize
            Inframantra to send me
            updates and promotional
            messages on WhatsApp.

          </label>

        </div>

        {/* BUTTON */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
          }}
        >

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor:
                loading
                  ? "#ccc"
                  : "#E7B554",
              color: "#fff",
              border: "none",
              borderRadius:
                "4px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontWeight: "600",
            }}
          >

            {loading
              ? "Submitting..."
              : "Submit"}

          </button>

        </div>

        {/* DISCLAIMER */}
        <p
          className={
            ctaStyle.propertyPageHeaderContactUsDisclaimer
          }
          style={{
            padding: "10px"
          }}
        >

          *By submitting, I accept
          Inframantra{" "}

          <a
            href="https://inframantra.com/page/terms-conditions"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "blue"
            }}
          >
            Terms & Conditions
          </a>

          {" "}and{" "}

          <a
            href="https://inframantra.com/page/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "blue"
            }}
          >
            Privacy Policy
          </a>

        </p>

      </form>

    </div>

  );

}

export default StickyProperty;