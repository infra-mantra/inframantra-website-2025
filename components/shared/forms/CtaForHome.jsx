import { useState, useRef, useEffect } from "react";
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
import { MdMail } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
import { FaWhatsapp } from "react-icons/fa";
import { useRecaptchaEnabled } from "../../lib/recaptcha.js";

function App({ name, displayMap = true, countryCode = "in" }) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const [whatsappConsent, setWhatsappConsent] = useState(true);

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 768);
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
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
    <div className={style.homeApp}>
      <div className={style.homeCtaMainWrapper}>
        {/* LEFT SECTION */}
        <div
          className={style.homePageContactUsLeftDetailSection}
          style={{
            display: displayMap === false ? "none" : "block",
          }}
        >
          {isDesktop && (
            <div className={style.homePageContactUsLeftMapPhotoContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14032.085916196966!2d77.0413113!3d28.4487689!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d193e2433c0cf%3A0xef40ba926f65e0ec!2sINFRAMANTRA!5e0!3m2!1sen!2sin!4v1731478063313!5m2!1sen!2sin"
                width="500"
                height="300"
                style={{ border: "0px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              <div className={style.homePageMapPhotoBgdTopLeft}></div>

              <div className={style.homePageMapPhotoBgdBottomRight}></div>
            </div>
          )}

          <img
            className={style.homePageContactUsLeftDetailSectionImg}
            src="/logos/logo-black.webp"
            alt="Inframantra-Logo"
            width={280}
            height={56}
            loading="lazy"
          />

          <div className={style.homePageContactUsLeftDetailsContainer}>
            {/* LOCATION */}
            <div className={style.homePageContactUsLeftDetailFlex}>
              <span className={style.homeCtaIconBadge}>
                <MdLocationOn />
              </span>

              <div className={style.homeCtaContactText}>
                <span className={style.homeCtaContactLabel}>Our Office</span>
                <span className={style.homeCtaContactValue}>
                  95, Institutional Area, Sector 32, Gurugram
                </span>
              </div>
            </div>

            {/* PHONE */}
            <div className={style.homePageContactUsLeftDetailFlex}>
              <span className={style.homeCtaIconBadge}>
                <IoMdCall />
              </span>

              <div className={style.homeCtaContactText}>
                <span className={style.homeCtaContactLabel}>Call Us</span>
                <a href="tel:+918698009900" className={style.homeCtaContactValue}>
                  +91 86 9800 9900
                </a>
              </div>
            </div>

            {/* EMAIL */}
            <div className={style.homePageContactUsLeftDetailFlex}>
              <span className={style.homeCtaIconBadge}>
                <MdMail />
              </span>

              <div className={style.homeCtaContactText}>
                <span className={style.homeCtaContactLabel}>Email Us</span>
                <a href="mailto:marketing@inframantra.com" className={style.homeCtaContactValue}>
                  marketing@inframantra.com
                </a>
              </div>
            </div>

            {/* RERA */}
            <div className={style.homePageContactUsLeftDetailFlex}>
              <span className={`${style.homeCtaIconBadge} ${style.homeCtaIconBadgeVerify}`}>
                <FcApproval />
              </span>

              <div className={style.homeCtaContactText}>
                <span className={style.homeCtaContactLabel}>HARERA Registered</span>
                <span className={style.homeCtaContactValue}>HARERA/GGM/1813/1408/2022/181</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div
          className={style.homeCtaInnerWrapper}
          style={{
            width: displayMap === false ? "100%" : "",
          }}
        >
          <form
            onSubmit={handleSubmit}
            onFocusCapture={() => setCaptchaReady(true)}
            onMouseEnter={() => setCaptchaReady(true)}
          >
            {/* HEADING */}
            <div className={ctaStyle.headingForm}>
              <p style={{ marginTop: "0px" }} className={style.homePopUpHead}>
                Please share your contact details
              </p>

              <p className={style.homePopUpHead2}>TO UNLOCK EXCLUSIVE DEALS</p>
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
                onChange={(e) => setWhatsappConsent(e.target.checked)}
                style={{
                  marginTop: "4px",
                  cursor: "pointer",
                  accentColor: "green",
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
                    marginRight: "6px",
                    fontSize: "16px",
                    verticalAlign: "middle",
                  }}
                />
                I consent/authorize Inframantra to send me updates and promotional messages on
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

            {/* BUTTON */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button type="submit" className={style.homeCtaSubmitBtn}>
                Submit
              </button>
            </div>

            {/* DISCLAIMER */}
            <p
              className={style.homePropertyPageHeaderContactUsDisclaimer}
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
                Privacy Policy.
              </a>
            </p>
          </form>

          {/* FOOTER */}
          <div className={style.homePagePropertyPageHeaderContactIconContainer2}>
            <hr width="100%" color="#DCAA4C" size="1" />

            <div style={{ display: "flex" }}>
              <div className={style.homeCtaText}>
                <p className={style.hometextForm}>Give us a call and book your visit now!</p>
              </div>

              <img
                src="/guruCollection/guru_call.png"
                alt="Call Icon"
                className="callImage"
                width="146"
                height="115"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
