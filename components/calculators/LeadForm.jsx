import React, { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Ajax1 from "../helper/Ajax1";
import styles from "./calculators.module.css";

/* Inline lead-capture band for the calculator pages. Reuses the same
   /enquiry/project submission flow as the property pop-up form. */
function LeadForm({
  projectName = "Calculators",
  heading = "Get a free home-loan consultation",
  sub = "Share your details and an Inframantra advisor will help you find the right property and loan.",
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [whatsappConsent, setWhatsappConsent] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    projectName,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.name || !formData.phoneNumber || !formData.email) {
      toast.error("Please fill in your name, phone and email.");
      return;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Submitting...");

      const action = {
        method: "POST",
        url: "/enquiry/project",
        data: {
          ...formData,
          message: { message: `Lead from ${projectName}`, whatsAppConsent: whatsappConsent },
        },
        token: false,
      };

      const response = await Ajax1(action);

      if (response?.data?.status === "success") {
        toast.update(toastId, {
          render: "Thanks! We'll be in touch shortly.",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setFormData({ name: "", phoneNumber: "", email: "", projectName });
        setTimeout(() => router.push("/thank-you"), 2500);
      } else {
        toast.update(toastId, {
          render: "Submission failed. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (err) {
      toast.error("Error submitting form");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.leadBand}>
      <div className={styles.leadInner}>
        <div className={styles.leadCopy}>
          <h2 className={styles.leadHeading}>{heading}</h2>
          <p className={styles.leadSub}>{sub}</p>
          <ul className={styles.leadPoints}>
            <li>Expert guidance on loan eligibility &amp; lowest rates</li>
            <li>Hand-picked RERA-approved properties</li>
            <li>End-to-end support, zero brokerage hassle</li>
          </ul>
        </div>

        <form className={styles.leadForm} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
              })
            }
            className={styles.leadInput}
            required
          />

          <PhoneInput
            country={"in"}
            enableSearch={true}
            value={formData.phoneNumber}
            onChange={(phone) => setFormData({ ...formData, phoneNumber: phone })}
            inputClass={styles.leadPhoneInput}
            containerClass={styles.leadPhone}
            placeholder="Phone number"
          />

          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={styles.leadInput}
            required
          />

          <label className={styles.leadConsent}>
            <input
              type="checkbox"
              checked={whatsappConsent}
              onChange={(e) => setWhatsappConsent(e.target.checked)}
            />
            <span>
              <FaWhatsapp style={{ color: "#25D366", verticalAlign: "-2px", marginRight: 4 }} />
              Send me updates on WhatsApp
            </span>
          </label>

          <button type="submit" className={styles.leadBtn} disabled={loading}>
            {loading ? "Submitting..." : "Talk to an advisor"}
          </button>

          <p className={styles.leadDisclaimer}>
            By submitting you accept our{" "}
            <a href="/page/terms-conditions" target="_blank" rel="noopener noreferrer">
              Terms
            </a>{" "}
            &amp;{" "}
            <a href="/page/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </section>
  );
}

export default LeadForm;
