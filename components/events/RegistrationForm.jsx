import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import styles from "./RegistrationForm.module.css";
import Ajax1 from "../helper/Ajax1";

const RegistrationForm = ({
  cities = [
    { value: "Seattle", labelR: "Seattle" },
    { value: "San Jose", labelR: "San Jose" },
  ],

  eyebrow = "By Invitation",
  title = "Register for",
  titleAccent = "Exclusive Access",
  submitlabelR = "Reserve My Seat",

  // project name prop
  name = "USA EXPO",
}) => {

  /* ============================================
     Dynamic dates based on city
     ============================================ */

  const cityDateMap = {
    Seattle: [
      {
        value: "May 30, 2026",
        labelR: "30th May 2026",
      },
      {
        value: "May 31, 2026",
        labelR: "31st May 2026",
      },
    ],

    "San Jose": [
      {
        value: "June 6, 2026",
        labelR: "6th June 2026",
      },
      {
        value: "June 7, 2026",
        labelR: "7th June 2026",
      },
    ],
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    date: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [isSubmitted, setIsSubmitted] =
    useState(false);

  /* ============================================
     Available Dates
     ============================================ */

  const availableDates = formData.city
    ? cityDateMap[formData.city] || []
    : [];

  /* ============================================
     Validation
     ============================================ */

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName =
        "Please enter your full name";
    } else if (
      formData.fullName.trim().length < 2
    ) {
      newErrors.fullName =
        "Name is too short";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile =
        "Mobile number is required";
    } else if (
      formData.mobile.replace(/\D/g, "")
        .length < 10
    ) {
      newErrors.mobile =
        "Enter a valid mobile number";
    }

    if (!formData.city) {
      newErrors.city =
        "Please select a city";
    }

    if (!formData.date) {
      newErrors.date =
        "Please select a date";
    }

    return newErrors;
  };

  /* ============================================
     Handle Input Change
     ============================================ */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "city") {
      setFormData((prev) => ({
        ...prev,
        city: value,
        date: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setApiError("");
  };

  /* ============================================
     Handle Phone Change
     ============================================ */

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({
      ...prev,
      mobile: phone,
    }));

    if (errors.mobile) {
      setErrors((prev) => ({
        ...prev,
        mobile: "",
      }));
    }

    setApiError("");
  };

  /* ============================================
     Submit Form
     ============================================ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {

      /* ============================================
         MESSAGE = CITY + DATE
         ============================================ */

      const message = `${formData.city} ${formData.date}`;

      /* ============================================
         API PAYLOAD
         ============================================ */

      const payload = {
        name: formData.fullName,
        phoneNumber: `+${formData.mobile}`,
        email: formData.email,
        projectName: name,
        message: message,
      };

      /* ============================================
         API CALL
         ============================================ */

      const response = await Ajax1({
        method: "POST",
        url: '/enquiry/project',
        data: payload,
      });

      console.log(
        "API Response:",
        response
      );

      /* ============================================
         RESET FORM
         ============================================ */

      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        city: "",
        date: "",
      });

      setIsSubmitted(true);

    } catch (err) {

      console.error(
        "Form submission error:",
        err
      );

      setApiError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to submit form"
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============================================
     Success State
     ============================================ */

  if (isSubmitted) {
    return (
      <div className={styles.formCard}>
        <div className={styles.successWrap}>

          <div className={styles.successIcon}>
            <svg
              viewBox="0 0 60 60"
              fill="none"
            >
              <circle
                cx="30"
                cy="30"
                r="28"
                stroke="#c9a961"
                strokeWidth="1.5"
              />

              <path
                d="M18 30L26 38L42 22"
                stroke="#c9a961"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h3 className={styles.successTitle}>
            Registration Confirmed
          </h3>

        

          <div
            className={styles.successDivider}
          />

        </div>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>

      {/* Header */}

      <div className={styles.headerR}>
        <span className={styles.eyebrowR}>
          {eyebrow}
        </span>

        <h3 className={styles.titleR}>
          {title}{" "}
          <em
            className={
              styles.titleAccent
            }
          >
            {titleAccent}
          </em>
        </h3>
      </div>

      {/* Form */}

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
      >

        {/* Full Name */}

        <div
          className={`${styles.field} ${
            errors.fullName
              ? styles.fieldError
              : ""
          }`}
        >

          <labelR
            className={styles.labelR}
            htmlFor="fullName"
          >
            Full Name{" "}
            <span className={styles.req}>
              *
            </span>
          </labelR>

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
            <span
              className={
                styles.errorText
              }
            >
              {errors.fullName}
            </span>
          )}

        </div>

        {/* Email */}

        <div
          className={`${styles.field} ${
            errors.email
              ? styles.fieldError
              : ""
          }`}
        >

          <labelR
            className={styles.labelR}
            htmlFor="email"
          >
            Email Address{" "}
            <span className={styles.req}>
              *
            </span>
          </labelR>

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

          {errors.email && (
            <span
              className={
                styles.errorText
              }
            >
              {errors.email}
            </span>
          )}

        </div>

        {/* Mobile */}

        <div
          className={`${styles.field} ${
            errors.mobile
              ? styles.fieldError
              : ""
          }`}
        >

          <labelR
            className={styles.labelR}
            htmlFor="mobile"
          >
            Mobile Number{" "}
            <span className={styles.req}>
              *
            </span>
          </labelR>

          <PhoneInput
            country={"us"}
            value={formData.mobile}
            onChange={handlePhoneChange}
            inputProps={{
              name: "mobile",
            }}
            containerClass={
              styles.phoneContainer
            }
            inputClass={
              styles.phoneInputNew
            }
            buttonClass={
              styles.phoneDropdown
            }
            dropdownClass={
              styles.phoneDropdownMenu
            }
            placeholder="Enter mobile number"
            enableSearch={true}
          />

          {errors.mobile && (
            <span
              className={
                styles.errorText
              }
            >
              {errors.mobile}
            </span>
          )}

        </div>

        {/* City Dropdown */}

        <div
          className={`${styles.field} ${
            errors.city
              ? styles.fieldError
              : ""
          }`}
        >

          <labelR
            className={styles.labelR}
            htmlFor="city"
          >
            Select City{" "}
            <span className={styles.req}>
              *
            </span>
          </labelR>

          <select
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">
              Choose your city
            </option>

            {cities.map((city) => (
              <option
                key={city.value}
                value={city.value}
              >
                {city.labelR}
              </option>
            ))}
          </select>

          {errors.city && (
            <span
              className={
                styles.errorText
              }
            >
              {errors.city}
            </span>
          )}

        </div>

        {/* Date Dropdown */}

        <div
          className={`${styles.field} ${
            errors.date
              ? styles.fieldError
              : ""
          }`}
        >

          <labelR
            className={styles.labelR}
            htmlFor="date"
          >
            Select Date{" "}
            <span className={styles.req}>
              *
            </span>
          </labelR>

          <select
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={styles.select}
            disabled={!formData.city}
          >
            <option value="">
              {formData.city
                ? "Choose event date"
                : "Select city first"}
            </option>

            {availableDates.map((date) => (
              <option
                key={date.value}
                value={date.value}
              >
                {date.labelR}
              </option>
            ))}
          </select>

          {errors.date && (
            <span
              className={
                styles.errorText
              }
            >
              {errors.date}
            </span>
          )}

        </div>

        {/* API Error */}

        {apiError && (
          <div className={styles.errorText}>
            {apiError}
          </div>
        )}

        {/* Submit */}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >

          <span>
            {isSubmitting
              ? "Securing your spot..."
              : submitlabelR}
          </span>

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

      </form>

    </div>
  );
};

export default RegistrationForm;