import React from "react";
import styles from "./HeaderSe.module.css";
import LocationCard from "./LocationCard.jsx";
import RegistrationForm from "./RegistrationForm.jsx";

function HeaderSec({ name }) {
  return (
    <section>
      <div className={styles.bgImg}>
        <div className={styles.overlayContent}>
          {/* LEFT CONTENT */}
          <div className={styles.leftSection}>
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/text-over-img-desktop-icon.png"
              alt="NRI Expo"
              className={styles.desktopImg}
            />

            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/text-over-img-icon.png"
              alt="NRI Expo"
              className={styles.mobileImg}
            />

            <LocationCard />
          </div>

          {/* RIGHT FORM */}
          <div className={styles.rightSection}>
            <div className={styles.displayNone}>
              <RegistrationForm name={name} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeaderSec;
