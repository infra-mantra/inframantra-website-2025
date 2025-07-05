import React from 'react';
import Link from 'next/link';
import Wrapper from '../components/UI/Wrapper';
import Section from '../components/UI/Section';
import styles from'../styles/thankyoupage.module.css'; // Ensure this path is correct

const ThankYou = () => {
    return (
        <Wrapper title="Thank You">
            <div className={styles.thankyoupage}>
                <div className={styles.thankyoubackground}>
                    <Section classes={styles.thankyousection}>
                        <div className={styles.thankyoucontainer}>
                            <div className={styles.thankyouoverlay}>
                                {/* Circle with checkmark */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
                                    <circle cx="20.4032" cy="20.4032" r="20.4032" fill="#E7B554" />
                                    <svg xmlns="http://www.w3.org/2000/svg" x="9" y="10" width="23" height="20" viewBox="0 0 23 20" fill="none">
                                        <path d="M18.9564 0.128906L9.18266 13.2548L3.40424 7.373L0.737915 10.089L9.62427 19.1409L22.0685 2.84491L18.9564 0.128906Z" fill="white" />
                                    </svg>
                                </svg>
                                <h1>Thank You!</h1>
                                <p>
                                    We’ve received your message, and our team will get back to you shortly.
                                </p>
                                <Link href="/">
                                    <a className={styles.backhomebtn} aria-label="Back to Home Page">
                                        Back to Home Page
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </Section>
                </div>
            </div>
        </Wrapper>
    );
};

export default ThankYou;
