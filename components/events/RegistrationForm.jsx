import React, { useState } from "react";
import styles from "./RegistrationForm.module.css";


const RegistrationForm = ({
  onSubmit,
  cities = [
    { value: "mumbai", label: "Mumbai" },
    { value: "delhi", label: "Delhi NCR" },
    { value: "bangalore", label: "Bangalore" },
    { value: "pune", label: "Pune" },
    { value: "hyderabad", label: "Hyderabad" },
    { value: "chennai", label: "Chennai" },
    { value: "goa", label: "Goa" },
    { value: "kolkata", label: "Kolkata" },
  ],
  eyebrow = "By Invitation",
  title = "Register for",
  titleAccent = "Exclusive Access",
  subtitle = "Limited seats. Reserve yours today.",
  submitLabel = "Reserve My Seat",
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name is too short";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10,15}$/.test(formData.mobile.replace(/\s/g, ""))) {
      newErrors.mobile = "Enter a valid mobile number";
    }
    if (!formData.city) {
      newErrors.city = "Please select a city";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await new Promise((r) => setTimeout(r, 1200));
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className={styles.formCard}>
        <div className={styles.successWrap}>
          <div className={styles.successIcon}>
            <svg viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="28" stroke="#c9a961" strokeWidth="1.5" />
              <path
                d="M18 30L26 38L42 22"
                stroke="#c9a961"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className={styles.successTitle}>Registration Confirmed</h3>
          <p className={styles.successText}>
            Thank you, {formData.fullName.split(" ")[0]}. Our team will reach out
            within 24 hours with exclusive event details.
          </p>
          <div className={styles.successDivider} />
          <p className={styles.successSubtext}>
            Confirmation sent to <strong>{formData.email}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h3 className={styles.title}>
          {title} <em className={styles.titleAccent}>{titleAccent}</em>
        </h3>
      
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className={`${styles.field} ${errors.fullName ? styles.fieldError : ""}`}>
          <label className={styles.label} htmlFor="fullName">
            Full Name <span className={styles.req}>*</span>
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your name"
            className={styles.input}
            autoComplete="name"
          />
          {errors.fullName && (
            <span className={styles.errorText}>{errors.fullName}</span>
          )}
        </div>

        {/* Email */}
        <div className={`${styles.field} ${errors.email ? styles.fieldError : ""}`}>
          <label className={styles.label} htmlFor="email">
            Email Address <span className={styles.req}>*</span>
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={styles.input}
            autoComplete="email"
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        {/* Mobile */}
        <div className={`${styles.field} ${errors.mobile ? styles.fieldError : ""}`}>
          <label className={styles.label} htmlFor="mobile">
            Mobile Number <span className={styles.req}>*</span>
          </label>
          <div className={styles.phoneRow}>
            <div className={styles.countryCode}>
              <span className={styles.flag}>🇮🇳</span>
              <span>+91</span>
            </div>
            <input
              id="mobile"
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile number"
              className={`${styles.input} ${styles.phoneInput}`}
              autoComplete="tel"
              maxLength={15}
            />
          </div>
          {errors.mobile && <span className={styles.errorText}>{errors.mobile}</span>}
        </div>

      

        {/* Submit */}
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          <span>{isSubmitting ? "Securing your spot..." : submitLabel}</span>
          {!isSubmitting && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <p className={styles.disclaimer}>
          Your information is kept strictly confidential.
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;
