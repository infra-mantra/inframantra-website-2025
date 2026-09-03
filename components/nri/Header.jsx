import React, { useEffect, useState, useRef } from "react";
import styles from "./Header.module.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
import Ajax1 from "../lib/ajax1.js";
import { useRouter } from "next/router";
import RegistrationForm from "../events/RegistrationForm.jsx";

const Header = ({ name }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const router = useRouter();
  const recaptchaRef = useRef(null);

  const handleScroll = () => {
    const section = document.getElementById("NriAbout");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="banner" className={styles.banner}>
      <div className={styles.container}>
        <div className={styles.bannerSection}>
          <div className={styles.bannerInner}>
            {/* LEFT SIDE */}
            <div className={styles.bannerLeft}>
              <div>
                <nav className={styles.benchmark}>Benchmark in Luxury Living</nav>

                <h1>
                  <strong>GURGAON'S Premium</strong> Luxury{" "}
                  <span className={styles.dynamicPrice}>Residences</span>
                </h1>

                <span className={styles.mainHeadingSpan}>
                  Setting the Standard for Luxury Housing in Gurgaon
                </span>
              </div>

              <button onClick={handleScroll} className={styles.scrollBtn}>
                <div className={styles.scrollCircle}>
                  <div className={styles.animatedArrowContainer}>
                    <div className={styles.movingArrow}>
                      <img src="./nripage/arrow-down.svg" alt="Scroll Arrow" />
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* RIGHT SIDE FORM */}
            {/* <div className={styles.bannerRight}> */}
            <div className={styles.displayNone}>
              <RegistrationForm name={name} />
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
