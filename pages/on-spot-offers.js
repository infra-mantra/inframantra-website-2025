import React, { useState } from "react";
import Wrapper from "../components/UI/Wrapper";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Ajax from "../components/helper/Ajax";
import styles from "../styles/on_spot_offers.module.css";

function OnSpotOffers() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    city: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? value.replace(/[^0-9]/g, "").slice(0, 10) : value,
    }));

    if (name === "name" && !/^[a-zA-Z\s]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, name: "Name must contain only letters." }));
    } else if (name === "name") {
      setErrors((prev) => ({ ...prev, name: "" }));
    }

    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address." }));
    } else if (name === "email") {
      setErrors((prev) => ({ ...prev, email: "" }));
    }

    if (name === "phone" && value.length <= 10) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number must be exactly 10 digits.",
      }));
    } else if (name === "phone") {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }

    if (name === "city" && value === "") {
      setErrors((prev) => ({ ...prev, city: "Please select a project." }));
    } else if (name === "city") {
      setErrors((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: formData.name ? /^[a-zA-Z\s]+$/.test(formData.name) ? "" : "Name must contain only letters." : "Name is required.",
      email: formData.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "" : "Invalid email address." : "Email is required.",
      phone: formData.phone.length === 10 ? "" : "Phone number must be exactly 10 digits.",
      city: formData.city ? "" : "Please select a project.",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) return;

    try {
      const action = {
        method: 'POST',
        url: '/enquiry/offerEnquiry',
        data: formData,
        loader: true,
      };

      const response = await Ajax(action);

      if (response.data.status === "SUCCESS!") {
        toast.success("Enquiry sent successfully");
        router.push("/thank-you");
      } else {
        toast.error(`Failed to send enquiry: ${response.error || "Unknown error"}`);
      }
    } catch (error) {
      toast.error(`Failed to send enquiry: ${error.message}`);
    }
  };

  return (
    <Wrapper title="Special offer">
      <div className={styles.main}>
        <div className={styles.offerSectionHead}>
          <h1>Inframantra Special Offer</h1>
        </div>
      </div>
      <div className={styles.contactContainer}>
        <span className={styles.bigCircle}></span>
        <div className={styles.form}>
          <div className={styles.contactInfoOffer}></div>
          <div className={styles.offerContactForm}>
            <span className={`${styles.circle} ${styles.one}`}></span>
            <span className={`${styles.circle} ${styles.two}`}></span>
            <form onSubmit={handleSubmit}>
              <h3 className={styles.title}>Fill the form to get an exciting offer</h3>
              <div className={styles.inputContainer}>
                <input name="name" type="text" className={styles.input} placeholder="Name" value={formData.name} onChange={handleChange} required />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>
              <div className={styles.inputContainer}>
                <input name="email" type="email" className={styles.input} placeholder="Email" value={formData.email} onChange={handleChange} required />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>
              <div className={styles.inputContainer}>
                <input name="phone" type="number" className={styles.input} placeholder="Phone no" value={formData.phone} onChange={handleChange} required />
                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
              </div>
              <div className={styles.inputContainer}>
                <select name="city" className={styles.input} value={formData.city} onChange={handleChange} required>
                  <option value="" disabled>Select a Project</option>
                  <option value="Vatika Seven Elements">Vatika Seven Elements</option>
                  <option value="Vatika Sovereign Park">Vatika Sovereign Park</option>
                </select>
                {errors.city && <span className={styles.error}>{errors.city}</span>}
              </div>
              <div className={`${styles.inputContainer} ${styles.textarea}`}>
                <textarea name="message" className={`${styles.inputcontainerText} ${styles.input}` } placeholder="Message" value={formData.message} onChange={handleChange}></textarea>
              </div>
              <button type="submit" className={styles.btn} disabled={Object.values(errors).some(error => error)}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default OnSpotOffers;