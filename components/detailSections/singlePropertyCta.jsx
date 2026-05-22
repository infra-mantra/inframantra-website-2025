import { useState, useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { toast } from 'react-toastify';
import ctaStyle from "./cta.module.css";
import style from "./ctaForHome.module.css";
import Ajax1 from '../helper/Ajax1';
import { useRouter } from 'next/router';
import { FaWhatsapp } from "react-icons/fa";

function App({
  name,
  id = "defaultId",
  countryCode = "in"
}) {

  const [isDesktop, setIsDesktop] =
    useState(true);

  const [isMobile, setIsMobile] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [whatsappConsent,
    setWhatsappConsent] =
    useState(true);

  const checkScreenWidth = () => {

    setIsDesktop(
      window.innerWidth >= 768
    );

    setIsMobile(
      window.innerWidth <= 768
    );

  };

  const router = useRouter();

  useEffect(() => {

    checkScreenWidth();

    window.addEventListener(
      'resize',
      checkScreenWidth
    );

    return () =>
      window.removeEventListener(
        'resize',
        checkScreenWidth
      );

  }, []);

  useEffect(() => {

    const alreadyClosed =
      localStorage.getItem(
        "ctaClosed"
      );

    if (!alreadyClosed) {

      const timer =
        setTimeout(() => {

        }, 3000);

      return () =>
        clearTimeout(timer);

    }

  }, []);

  const [formData, setFormData] =
    useState({
      name: '',
      phoneNumber: '',
      email: '',
      projectName: name,
    });

  const [captchaToken,
    setCaptchaToken] =
    useState(null);

  const recaptchaRef = useRef(null);

  const handleChange = (e) => {

    setFormData(
      (prevFormData) => ({
        ...prevFormData,
        [e.target.name]:
          e.target.value,
      })
    );

  };

  const handleCaptchaChange =
    (token) => {

      setCaptchaToken(token);

    };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    try {

      setLoading(true);

      const toastId =
        toast.loading(
          "Submitting form..."
        );

      const action = {
        method: 'POST',
        url: '/enquiry/project',
        data: {
          ...formData,
          message:whatsappConsent
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

        setTimeout(() => {

          router.push('/thank-you');

        }, 3000);

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

      console.error(
        'Error submitting form:',
        error
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className={style.homeApp}>

      <div
        className={`${style.homeCtaMainWrapper} ${style.pt}`}
      >

        <div
          className={
            style.homeCtaInnerWrapper
          }
          style={{ width: "100%" }}
        >

          <form
            onSubmit={handleSubmit}
            id={id}
          >

            {/* HEADING */}
            <div
              className={
                ctaStyle.headingForm
              }
            >

              <p
                style={{
                  marginTop: '0px'
                }}
                className={
                  style.homePopUpHead
                }
              >
                Please share your
                contact details
              </p>

              <p
                className={
                  style.homePopUpHead2
                }
              >
                TO UNLOCK EXCLUSIVE
                DEALS
              </p>

            </div>

            {/* NAME */}
            <div
              className={
                ctaStyle.formGroup
              }
            >

              <input
                type="text"
                id="username"
                name="username"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => {

                  const alphabeticValue =
                    e.target.value.replace(
                      /[^a-zA-Z\s]/g,
                      ''
                    );

                  setFormData({
                    ...formData,
                    name:
                      alphabeticValue
                  });

                }}
                required
              />

            </div>

            {/* PHONE INPUT */}
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
                  setFormData({
                    ...formData,
                    phoneNumber:
                      phone
                  })
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
                id="email"
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

            {/* RECAPTCHA */}
            <div
              className="recaptcha-container"
            >

              <ReCAPTCHA
                sitekey="6LfrSTUqAAAAAOy2-j9cNvTIujOI5GKjtMVsn2Uk"
                size="invisible"
                ref={recaptchaRef}
                onChange={
                  handleCaptchaChange
                }
              />

            </div>

            {/* BUTTON */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "center"
              }}
            >

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px",
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
                  justifyContent:
                    'center',
                  display: 'flex'
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
                style.homePropertyPageHeaderContactUsDisclaimer
              }
              style={{
                padding: "10px"
              }}
            >

              *By submitting, I accept
              Inframantra{' '}

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

              {' '}and{' '}

              <a
                href="https://inframantra.com/page/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "blue"
                }}
              >
                Privacy Policy.
              </a>

            </p>

          </form>

          {/* FOOTER */}
          <div
            className={
              style.homePagePropertyPageHeaderContactIconContainer2
            }
          >

            <hr
              width="100%"
              color="#DCAA4C"
              size="1"
            />

            <div
              style={{
                display: "flex"
              }}
            >

              <div
                className={
                  style.homeCtaText
                }
              >

                <p
                  className={
                    style.hometextForm
                  }
                >
                  Give us a call and
                  book your visit now!
                </p>

              </div>

              <img
                src="https://inframantra.com/guruCollection/guru_call.png"
                alt="Call Icon"
              />

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default App;