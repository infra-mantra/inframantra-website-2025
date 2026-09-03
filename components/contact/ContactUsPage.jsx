import React, { useState, useEffect } from "react";
import { SocialIcon } from "react-social-icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import Link from "next/link";
import { useRouter } from "next/router";

import { MdLocationOn } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { MdMail } from "react-icons/md";

import Ajax1 from "../lib/ajax1.js";
import { toast } from "react-toastify";

import styles from "./ContactUsPage.module.css";

const formPaperStyles = {
  width: "40vw",
  height: "100%",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

const formPaperMobileStyles = {
  width: "95vw",
  height: "100%",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

const mobileLocationPaperStyles = {
  width: "46vw",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: "20px",
  borderRadius: "10px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

const mobileIconPaper = {
  width: "95vw",
  height: "17vh",
  marginTop: "35px",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

export default function ContactUsPage() {
  const router = useRouter();

  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 769);
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
    name: "",
    phoneNumber: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const action = {
      method: "POST",
      url: "/enquiry/contact",
      data: formData,
      token: false,
    };

    try {
      const response = await Ajax1(action);

      if (response.data.status === "success") {
        toast.success("Form submitted successfully");

        setFormData({
          name: "",
          phoneNumber: "",
          email: "",
        });

        router.push("/thank-you");
      } else {
        toast.error("Form submission failed");
      }
    } catch (error) {
      toast.error("Error submitting form");

      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className={styles.contactUsPageWrapper}>
      {/* DESKTOP */}
      {isDesktop && (
        <>
          <div className={styles.contactUsPageBannerContainer}>
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/contact-us-banner%20f%20copy.avif"
              alt="infra-banner"
            />
          </div>

          <div className={styles.contactUsPageFormSectionContainer}>
            <div className={styles.contactUsPageFormSectionGuruImgContainer}>
              <img
                className={styles.contactPageGuruImg}
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/guruContactPage.png"
                alt="Guru Randhawa Inframantra"
              />
            </div>

            <div style={formPaperStyles}>
              <h3 className={styles.contactUsPageSecondSectionHeader}>
                Let`s Find Your <span style={{ color: "#E7B554" }}>Dream Home</span> Together!
              </h3>

              <form
                className={styles.contactUsPageSecondSectionFormWrapper}
                onSubmit={handleSubmit}
              >
                {/* NAME */}
                <input
                  name="name"
                  placeholder="Full Name"
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

                {/* PHONE INPUT */}
                <PhoneInput
                  country={"in"}
                  enableSearch={true}
                  value={formData.phoneNumber}
                  onChange={(phone) =>
                    setFormData({
                      ...formData,
                      phoneNumber: phone,
                    })
                  }
                  placeholder="Phone Number"
                  containerStyle={{
                    width: "100%",
                    marginBottom: "10px",
                  }}
                  inputStyle={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "8px",

                    paddingLeft: "48px",
                    fontSize: "16px",
                  }}
                  buttonStyle={{
                    border: "1px solid #ccc",
                    borderRadius: "8px 0 0 8px",
                    backgroundColor: "#fff",
                  }}
                />

                {/* EMAIL */}
                <input
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />

                {/* BUTTON */}
                <button
                  className={styles.searchButton}
                  style={{
                    borderRadius: "8px",
                    width: "20vw",
                    fontSize: "20px",
                    padding: "10px",
                  }}
                  type="submit"
                >
                  Contact Now
                </button>

                <p className={styles.contactUsPageConditions}>
                  By submitting, I accept Inframantra{" "}
                  <Link href="/page/disclaimer">Terms &amp; Conditions</Link> and{" "}
                  <Link href="/page/privacy-policy">Privacy Policy</Link>
                </p>
              </form>
            </div>
          </div>

          {/* LOCATION SECTION */}
          <div className={styles.contactUsPageLocationSectionContainer}>
            <div className={styles.contactUsPageLocationSectionMapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14032.085916196966!2d77.0413113!3d28.4487689!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d193e2433c0cf%3A0xef40ba926f65e0ec!2sINFRAMANTRA!5e0!3m2!1sen!2sin!4v1731478063313!5m2!1sen!2sin"
                width="500"
                height="300"
                allowFullScreen=""
                loading="lazy"
                style={{ border: "0px" }}
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className={styles.contactUsPageLocationSectionAddressContainer}>
              <div className={styles.contactUsPageLocationSectionAddressFlex}>
                <span
                  style={{
                    color: "#E4A951",
                    fontSize: "2rem",
                  }}
                >
                  <MdLocationOn />
                </span>

                <div className={styles.contactUsPageLocationSectionAddressDataFlex}>
                  <p className={styles.contactUsPageThirdSectionLocationCity}>Gurgaon</p>

                  <p className={styles.contactUsPageThirdSectionLocationAddress}>
                    95, Institutional Area, Sector 32, Gurugram, Haryana 122002
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className={styles.contactUsPageLastSectionDivider} />

          {/* CONTACT DETAILS */}
          <div className={styles.contactUsPageLastSectionContainer}>
            <p className={styles.contactUsPageLastSectionContainerHeader}>Contact Us Now!</p>

            <p className={styles.contactUsPageLastSectionContainerSubHeader}>
              <span
                style={{
                  color: "#E4A951",
                  marginRight: "15px",
                  fontSize: "1.5rem",
                }}
              >
                <FaPhoneAlt />
              </span>
              + 91 86 9800 9900
            </p>

            <p className={styles.contactUsPageLastSectionContainerSubHeader}>
              <span
                style={{
                  color: "#E4A951",
                  marginRight: "15px",
                  fontSize: "1.5rem",
                }}
              >
                <MdMail />
              </span>
              info@inframantra.com
            </p>
          </div>
        </>
      )}

      {/* MOBILE */}
      {!isDesktop && (
        <>
          <h3 className={styles.contactUsPageSecondSectionHeader}>
            Let`s Find Your <span style={{ color: "#E7B554" }}>Dream Home</span> Together!
          </h3>

          <div style={formPaperMobileStyles}>
            <form className={styles.contactUsPageSecondSectionFormWrapper} onSubmit={handleSubmit}>
              {/* NAME */}
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => {
                  const alphabeticValue = e.target.value.replace(/[^a-zA-Z\s]/g, "");

                  setFormData({
                    ...formData,
                    name: alphabeticValue,
                  });
                }}
                className={styles.inputField}
                required
              />

              {/* PHONE INPUT */}
              <PhoneInput
                country={"in"}
                enableSearch={true}
                value={formData.phoneNumber}
                onChange={(phone) =>
                  setFormData({
                    ...formData,
                    phoneNumber: phone,
                  })
                }
                placeholder="Phone Number"
                containerStyle={{
                  width: "100%",
                  marginBottom: "10px",
                }}
                inputStyle={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "8px",
                  // border: '1px solid #ccc',
                  paddingLeft: "48px",
                  fontSize: "16px",
                }}
                buttonStyle={{
                  border: "1px solid #ccc",
                  borderRadius: "8px 0 0 8px",
                  backgroundColor: "#fff",
                }}
              />

              {/* EMAIL */}
              <input
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.inputField}
                required
              />

              {/* BUTTON */}
              <button className={styles.searchButton} type="submit">
                Contact Now
              </button>

              <p className={styles.contactUsPageConditions}>
                By submitting, I accept Inframantra{" "}
                <Link href="/page/disclaimer">Terms &amp; Conditions</Link> and{" "}
                <Link href="/page/privacy-policy">Privacy Policy</Link>
              </p>
            </form>

            <img
              className={styles.contactPageGuruImg}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/guruContactPage.png"
              alt="Guru Randhawa Brand Ambassador Inframantra"
            />
          </div>
        </>
      )}
    </div>
  );
}
