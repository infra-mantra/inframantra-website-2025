import React from 'react'
import styles from './aboutEvent.module.css'

function aboutEvent() {
  return (
   <section className={styles.eventContainer}> 
     {/* Heading */}
          <div className={styles.headingWrapper}>
            <h2 className={styles.heading}>
              About Expo
            </h2>
          </div>
       <div className={styles.storyText}>
    
              {/* <span className={styles.highlightName}>
                Shiwang Suraj
              </span>{" "}
              and{" "}
              <span className={styles.highlightName}>
                Garvit Tiwari
              </span>{" "} */}
             At the Expo, you’ll get the opportunity to meet our Founder & Director, Mr. Shiwang Suraj and Co-Founder & Director,s Mr.Garvit Tiwari, along with senior executives from some of India’s most reputed developers like Godrej Properties, Tulip Infratech, Whiteland Corporation, and more. We’re bringing a curated selection of premium luxury residences, giving you direct access to high-potential opportunities in India’s dynamic real estate market.
    
              <br /><br />
    
             This Expo goes beyond property discovery, it’s about making confident, well-informed investment decisions. You’ll also gain clarity on key aspects of investing in India, including repatriation of funds, ensuring a seamless and transparent investment journey.
    
    
    
            </div>
   </section>
  )
}

export default aboutEvent