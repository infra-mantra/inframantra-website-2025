import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { TEL_HREF, WHATSAPP_URL } from "../../lib/siteConfig.js";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import Ajax1 from "../../lib/ajax1.js";
import { useRouter } from "next/router";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import ctaStyle from "./Cta.module.css";
import style from "./CtaForHome.module.css";

import { MdLocationOn } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { MdMail, MdLock } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
import { FaWhatsapp } from "react-icons/fa";
import { useRecaptchaEnabled } from "../../lib/recaptcha.js";

import MapFacade from "../MapFacade.jsx";
function App({ name, displayMap = true, countryCode = "in" }) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const [whatsappConsent, setWhatsappConsent] = useState(true);

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 768);
    setIsMobile(window.innerWidth <= 768);
  };

  // Layout effect: pick the phone/desktop layout BEFORE the first paint, so the
  // form never paints in the wrong layout and then jumps (this file is ssr:false).
  useLayoutEffect(() => {
    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    projectName: name,
  });

  const [captchaToken, setCaptchaToken] = useState(null);

  // Defer loading the (invisible) reCAPTCHA script until the user actually
  // engages the form. It's only needed on submit (executeAsync), so this cuts
  // ~1 MB + ~1 s of main-thread work off initial page load with no UI change.
  const [captchaReady, setCaptchaReady] = useState(false);

  const recaptchaRef = useRef(null);
  const recaptchaEnabled = useRecaptchaEnabled();

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
          method: "POST",
          url: "/enquiry/project",
          data: {
            ...formData,
            captchaToken: token,
            message: whatsappConsent,
          },
          token: false,
        };

        const response = await Ajax1(action);

        if (response.data.status === "success") {
          toast.success("Form submitted successfully");

          setFormData({
            name: "",
            phoneNumber: "",
            email: "",
          });

          setTimeout(() => {
            router.push("/thank-you");
          }, 5000);
        } else {
          toast.error("Form submission failed");
        }
      } catch (error) {
        toast.error("Error submitting form");

        console.error("Error submitting form:", error);
      }
    } else {
      alert("reCAPTCHA not loaded properly.");
    }
  };

  return (
    <section className={`${style.homeApp} ${style.ctaSection}`} aria-labelledby="cta-home-title">
      <div className={style.ctaInner}>
        {/* SECTION HEADING */}
        <div className={style.ctaHeader}>
          <h2 id="cta-home-title" className={style.ctaTitle}>
            Talk to a <span>Property Advisor</span>
          </h2>
          <p className={style.ctaSubtitle}>
            Tell us what you are looking for and we will call you back with options that fit.
          </p>
        </div>

        {/* BODY — form card + map/contact card. Form comes first in the DOM so it is
            first on phones; on wide screens CSS puts the map card on the left. */}
        <div className={style.ctaBody}>
          {/* FORM CARD */}
          <div className={style.ctaFormCard}>
            <form
              onSubmit={handleSubmit}
              onFocusCapture={() => setCaptchaReady(true)}
              onMouseEnter={() => setCaptchaReady(true)}
            >
              {/* HEADING */}
              <div className={style.ctaFormHead}>
                <p className={style.ctaFormTitle}>Please share your contact details</p>
                <p className={style.ctaFormSub}>To Unlock Exclusive Deals</p>
              </div>

              {/* NAME */}
              <div className={ctaStyle.formGroup}>
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="name"
                  placeholder="Name"
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
              </div>

              {/* PHONE */}
              <div className={ctaStyle.formGroup}>
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
                  inputProps={{ id: "phone", name: "phone", autoComplete: "tel" }}
                  inputClass={ctaStyle.input}
                  containerClass={ctaStyle.phoneContainer}
                  buttonClass={ctaStyle.flagDropdown}
                  placeholder="Enter phone number"
                />
              </div>

              {/* EMAIL */}
              <div className={ctaStyle.formGroup}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* WHATSAPP CONSENT */}
              <div className={style.ctaConsent}>
                <input
                  type="checkbox"
                  id="whatsappConsent"
                  checked={whatsappConsent}
                  onChange={(e) => setWhatsappConsent(e.target.checked)}
                />
                <label htmlFor="whatsappConsent">
                  <FaWhatsapp className={style.ctaConsentIcon} aria-hidden="true" />I
                  consent/authorize Inframantra to send me updates and promotional messages on
                  WhatsApp.
                </label>
              </div>

              {/* RECAPTCHA — mounted only once the user engages the form */}
              <div className="recaptcha-container">
                {captchaReady && recaptchaEnabled && (
                  <ReCAPTCHA
                    sitekey="6LfrSTUqAAAAAOy2-j9cNvTIujOI5GKjtMVsn2Uk"
                    size="invisible"
                    ref={recaptchaRef}
                    onChange={handleCaptchaChange}
                  />
                )}
              </div>

              <button type="submit" className={style.homeCtaSubmitBtn}>
                Submit
              </button>
              <p className={style.ctaTrust}>
                <MdLock aria-hidden="true" /> Your details are safe with us
              </p>

              {/* DISCLAIMER */}
              <p className={style.ctaDisclaimer}>
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
                  Privacy Policy.
                </a>
              </p>
            </form>

            {/* CALL ROW — text + brand ambassador picture, sitting on the card's bottom edge */}
            <div className={style.ctaCallRow}>
              <p className={style.ctaCallText}>Give us a call and book your visit now!</p>
              <img
                src="/guruCollection/guru_call.png"
                alt="Guru Randhawa, Inframantra brand ambassador"
                className={style.ctaCallImg}
                width="146"
                height="115"
              />
            </div>
          </div>

          {/* MAP + CONTACT DETAILS */}
          {displayMap !== false && (
            <div className={style.ctaInfoCard}>
              {/* Desktop only, as it always was — phones never rendered the map. */}
              {isDesktop && (
                <div className={style.ctaMap}>
                  <MapFacade width={560} height={280} />
                </div>
              )}

              <ul className={style.ctaContactList}>
                <li>
                  <span className={style.ctaIcon}>
                    <MdLocationOn />
                  </span>
                  <span className={style.ctaContactText}>
                    <span className={style.ctaLabel}>Our office</span>
                    <span className={style.ctaValue}>
                      95, Institutional Area, Sector 32, Gurugram
                    </span>
                    <a
                      className={style.ctaDirections}
                      href="https://maps.app.goo.gl/inframantra"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get directions <span aria-hidden="true">→</span>
                    </a>
                  </span>
                </li>
                <li>
                  <span className={style.ctaIcon}>
                    <IoMdCall />
                  </span>
                  <span className={style.ctaContactText}>
                    <span className={style.ctaLabel}>Call us</span>
                    <a className={style.ctaValue} href={TEL_HREF}>
                      +91 86 9800 9900
                    </a>
                  </span>
                </li>
                <li>
                  <span className={style.ctaIcon}>
                    <FaWhatsapp />
                  </span>
                  <span className={style.ctaContactText}>
                    <span className={style.ctaLabel}>WhatsApp</span>
                    <a
                      className={style.ctaValue}
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat with an advisor
                    </a>
                  </span>
                </li>
                <li>
                  <span className={style.ctaIcon}>
                    <MdMail />
                  </span>
                  <span className={style.ctaContactText}>
                    <span className={style.ctaLabel}>Email us</span>
                    <a className={style.ctaValue} href="mailto:marketing@inframantra.com">
                      marketing@inframantra.com
                    </a>
                  </span>
                </li>
                <li>
                  <span className={style.ctaIcon}>
                    <FcApproval />
                  </span>
                  <span className={style.ctaContactText}>
                    <span className={style.ctaLabel}>HARERA registered</span>
                    {/* <wbr /> lets a narrow phone wrap the number after a slash, not mid-number */}
                    <span className={style.ctaValue}>
                      HARERA/
                      <wbr />
                      GGM/
                      <wbr />
                      1813/
                      <wbr />
                      1408/
                      <wbr />
                      2022/
                      <wbr />
                      181
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default App;
