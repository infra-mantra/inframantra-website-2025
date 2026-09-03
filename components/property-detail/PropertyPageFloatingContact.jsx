import React, { useState, useRef, useEffect } from "react";
import PropertyWrapper from "./PropertyWrapper.jsx";
import ReCAPTCHA from "react-google-recaptcha";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import styles from "./PropertyPageFloatingContact.module.css";

import Ajax1 from "../lib/ajax1.js";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const contactFormStyles = {
  textField: {
    marginBottom: "10px",
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },

  checkBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: "30px",
    width: "100%",
  },
};

// The CMS stores configuration as one free-text string per project, and the
// feed is inconsistent: "3/4 BHK", " 3.5/4.5/5.5 BHK   ", "5.5 BHK",
// "2/3/4 BHK/Penthouse". Only the final segment usually carries the unit, so
// split on "/", then give the bare numbers the unit the last one declared.
// Non-numeric segments (Penthouse, Villa) are labels in their own right.
const DEFAULT_CONFIGURATIONS = ["2BHK", "3BHK", "4BHK"];

export function parseConfigurations(configuration) {
  if (typeof configuration !== "string" || !configuration.trim()) {
    return DEFAULT_CONFIGURATIONS;
  }

  const parts = configuration
    .split("/")
    .map((x) => x.trim())
    .filter(Boolean);
  if (!parts.length) return DEFAULT_CONFIGURATIONS;

  // Take the unit from the first segment that actually pairs a number with a
  // word ('4 BHK'), NOT from the end of the string — in '2/3/4 BHK/Penthouse'
  // the trailing word is a separate label and would turn '2' into '2 Penthouse'.
  const unitSource = parts.find((x) => /^[d.]+s*[a-zA-Z]/.test(x));
  const unit = unitSource ? unitSource.replace(/^[d.]+s*/, "").trim() : "BHK";

  const out = [];
  for (const part of parts) {
    if (/^[d.]+$/.test(part)) {
      out.push(part + " " + unit); // '3'   -> '3 BHK'
    } else if (/^[d.]+s*[a-zA-Z]/.test(part)) {
      out.push(part.replace(/s+/g, " ")); // '4 BHK' -> '4 BHK'
    } else {
      out.push(part); // 'Penthouse'
    }
  }

  const unique = [...new Set(out)];
  return unique.length ? unique : DEFAULT_CONFIGURATIONS;
}
function PropertyPageFloatingContact({
  name,
  propertyType,
  // Raw CMS string for this project, e.g. "3.5/4.5 BHK". Falls back to the
  // generic 2/3/4 BHK set when the feed omits it.
  configuration,
  // Supplied when this form is shown inside the enquiry modal. Rendered inline
  // on the property page, where there is nothing to close, it stays undefined.
  onClose,
}) {
  const router = useRouter();

  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 768);
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  const [formData, setFormData] = useState({
    projectName: name || "",
    name: "",
    email: "",
    phoneNumber: "",
    configuration: "",
  });

  const [selectedConfigurations, setSelectedConfigurations] = useState([]);

  const [captchaToken, setCaptchaToken] = useState(null);

  const [captchaError, setCaptchaError] = useState("");

  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setSelectedConfigurations((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await recaptchaRef.current.executeAsync();

      setCaptchaToken(token);

      const action = {
        method: "POST",
        url: "/enquiry/project",
        data: {
          ...formData,
          configuration: selectedConfigurations.join(", "),
          captchaToken: token,
        },
        token: false,
      };

      const response = await Ajax1(action);

      if (response.data.status === "success") {
        toast.success("Enquiry sent successfully");

        router.push("/thank-you");
      } else {
        toast.error(`Failed to send enquiry: ${response.data.error}`);
      }
    } catch (error) {
      toast.error(`Failed to send enquiry: ${error.message}`);
    }
  };

  return (
    <PropertyWrapper>
      <form className={styles.imEnqForm} onSubmit={handleSubmit}>
        {onClose && (
          <button
            type="button"
            className={styles.imEnqClose}
            onClick={onClose}
            aria-label="Close enquiry form"
          >
            &times;
          </button>
        )}

        <header className={styles.imEnqHead}>
          <p className={styles.imEnqEyebrow}>Get expert advice and information for</p>
          <h2 className={styles.imEnqTitle}>{name}</h2>
        </header>

        <div className={styles.imEnqFields}>
          {/* NAME */}
          <div className={styles.imEnqField}>
            <label className={styles.imEnqLabel} htmlFor="name">
              Name<span aria-hidden="true">*</span>
            </label>
            <input
              className={styles.imEnqInput}
              type="text"
              id="name"
              required={true}
              name="name"
              autoComplete="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => {
                const alphabeticValue = e.target.value.replace(/[^a-zA-Zs]/g, "");
                setFormData({ ...formData, name: alphabeticValue });
              }}
            />
          </div>

          {/* PHONE */}
          <div className={`${styles.imEnqField} ${styles.imEnqPhone}`}>
            <label className={styles.imEnqLabel} htmlFor="enquiry-phone">
              Phone number<span aria-hidden="true">*</span>
            </label>
            <PhoneInput
              country={"in"}
              enableSearch={true}
              value={formData.phoneNumber}
              onChange={(phone) => setFormData({ ...formData, phoneNumber: phone })}
              placeholder="00000 00000"
              inputProps={{ id: "enquiry-phone", name: "phone", autoComplete: "tel" }}
            />
          </div>

          {/* EMAIL */}
          <div className={styles.imEnqField}>
            <label className={styles.imEnqLabel} htmlFor="email">
              Email address<span aria-hidden="true">*</span>
            </label>
            <input
              className={styles.imEnqInput}
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required={true}
            />
          </div>
        </div>

        {propertyType != "Commercial" ? (
          <fieldset className={styles.imEnqField} style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className={styles.imEnqGroupLabel}>I&rsquo;m looking for</legend>
            <div className={styles.imEnqChips}>
              {parseConfigurations(configuration).map((cfg) => (
                <label className={styles.imEnqChip} key={cfg}>
                  <input
                    type="checkbox"
                    value={cfg}
                    checked={selectedConfigurations.includes(cfg)}
                    onChange={handleCheckboxChange}
                  />
                  <span className={styles.imEnqChipBox} aria-hidden="true" />
                  <span className={styles.imEnqChipText}>{cfg}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        <div className={styles.imEnqFoot}>
          <div className="recaptcha-container">
            <ReCAPTCHA
              sitekey="6LfrSTUqAAAAAOy2-j9cNvTIujOI5GKjtMVsn2Uk"
              size="invisible"
              ref={recaptchaRef}
              onChange={handleCaptchaChange}
            />
          </div>

          <button type="submit" className={styles.imEnqSubmit}>
            Submit
          </button>
        </div>
      </form>
    </PropertyWrapper>
  );
}

export default PropertyPageFloatingContact;
