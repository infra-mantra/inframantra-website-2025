import React from 'react'
import styles from './aboutEvent.module.css'
import RegistrationForm from './RegistrationForm'

// Default copy = USA NRI Expo (used by /usa-nri-event).
// Pass `heading` / `body` to re-use this section for another event.
const DEFAULT_HEADING = 'About Expo'

const DefaultBody = () => (
  <>
    At the Expo, you’ll get the opportunity to meet our Founder &amp; Director, Mr. Shiwang Suraj and Co-Founder &amp; Director, Mr. Garvit Tiwari, along with senior executives from some of India’s most reputed developers like Godrej Properties, Tulip Infratech, Whiteland Corporation, and more. We’re bringing a curated selection of premium luxury residences, giving you direct access to high-potential opportunities in India’s dynamic real estate market.
    <br /><br />
    This Expo goes beyond property discovery, it’s about making confident, well-informed investment decisions. You’ll also gain clarity on key aspects of investing in India, including repatriation of funds, ensuring a seamless and transparent investment journey.
  </>
)

function aboutEvent({ name, heading = DEFAULT_HEADING, body, cities, cityDateMap, phoneCountry, showCity, showDate, eventDateLabel, compactTitle, compact = false, hideCopyOnDesktop = false }) {
  return (
   <section className={styles.eventContainer}>
     {/* Heading */}
     <div className={styles.displayMobile}>
           <RegistrationForm name={name} cities={cities} cityDateMap={cityDateMap} phoneCountry={phoneCountry} showCity={showCity} showDate={showDate} eventDateLabel={eventDateLabel} compactTitle={compactTitle} />
            </div>
          <div className={`${styles.headingWrapper} ${hideCopyOnDesktop ? styles.aboutEventDesktopHidden : ""}`}>
            <h2
              className={`${styles.aboutEventHeading} ${
                compact ? styles.aboutEventHeadingCompact : ''
              }`}
            >
              {heading}
            </h2>
          </div>
       <div className={`${styles.storyText} ${hideCopyOnDesktop ? styles.aboutEventDesktopHidden : ""}`}>
             {body || <DefaultBody />}
            </div>
   </section>
  )
}

export default aboutEvent
