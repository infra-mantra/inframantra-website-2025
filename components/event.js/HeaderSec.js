import React from 'react'
import styles from './headerSe.module.css'
import LocationCard from './LocationCard'

function HeaderSec() {
  return (
    <section>
      <div className={styles.bgImg}>
        <div className={styles.overlayContent}>

          <img
            src="https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/text-over-img-desktop.png"
            alt="NRI Expo"
            className={styles.desktopImg}
          />

          <img
            src="https://inframantra.blr1.cdn.digitaloceanspaces.com/nri-event-expo/text-over-img.png"
            alt="NRI Expo"
            className={styles.mobileImg}
          />

       
          <LocationCard />

        </div>
      </div>
    </section>
  )
}

export default HeaderSec
