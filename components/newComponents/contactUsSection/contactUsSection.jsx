import React, { useState, useEffect } from 'react';
import { MdLocationOn } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { MdMail } from "react-icons/md";
import Link from 'next/link';
import Ajax1 from '../../helper/Ajax1';
import { toast } from 'react-toastify';
import styles from './contactUsSection.module.css';

function ContactUsSection() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 768);
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = {
      method: 'POST',
      url: '/enquiry/contact',
      data: formData,
      token: false,
    };

    try {
      const response = await Ajax1(action);
      if (response.data.status === 'success') {
        toast.success('Form submitted successfully:', response.data);
        setFormData({ name: '', phoneNumber: '', email: '' });
      } else {
        console.error('Form submission failed:', response);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className={styles.contactUsSectionContainer}>
      <div className={styles.contactUsSectionWrapper}>
        <div className={styles.contactUsLeftDetailSection}>
          {isDesktop && (
            <div className={styles.contactUsLeftMapPhotoContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14032.085916196966!2d77.0413113!3d28.4487689!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d193e2433c0cf%3A0xef40ba926f65e0ec!2sINFRAMANTRA!5e0!3m2!1sen!2sin!4v1731478063313!5m2!1sen!2sin"
                width="500"
                height="300"
                style={{ border: "0px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className={styles.mapPhotoBgdTopLeft}></div>
              <div className={styles.mapPhotoBgdBottomRight}></div>
            </div>
          )}
          {isDesktop && (
            <img
              className={styles.contactUsLeftDetailSectionImg}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/inframantraLogoBlack.png"
              alt="Inframantra-Logo"
            />
          )}
          <div className={styles.contactUsLeftDetailsContainer}>
            <div className={styles.contactUsLeftDetailFlex}>
              <div  style={{ color: '#E7B554', fontSize: '25px', marginRight: '10px' }}><MdLocationOn /></div>
              <p>95, Institutional Area, Sector 32, Gurugram</p>
            </div>
            <div className={styles.contactUsLeftDetailFlex}>
              <div style={{ color: '#E7B554', fontSize: '25px', marginRight: '10px' }}><IoMdCall /></div>
              <p>+91 86 9800 9900</p>
            </div>
            <div className={styles.contactUsLeftDetailFlex}>
              <div style={{ color: '#E7B554', fontSize: '25px', marginRight: '10px' }}><MdMail /></div>
              <p>marketing@inframantra.com</p>
            </div>
          </div>
        </div>

        <div className={styles.contactUsRightMapSection}>
          <img
            className={styles.contactUsRightMapSectionGuruImg}
            src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/guruImageHomeContact.png"
            alt="Guru Randhawa"
          />
          <div className={styles.contactUsSectionForm}>
            <form onSubmit={handleSubmit} className={styles.contactUsSectionFormFlex}>
              <h4>Please shars your contact details <br />TO UNLOCK EXLUSIVE DEALS</h4>
              <div className={styles.contactUsTop}>
                <div className={styles.iconGreen} style={{color:'green',fontSize:'25px'}}><IoMdCall /></div>
                <p><a href='tel:+91 86 9800 9900'>+91 86 9800 9900</a></p>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                className={`${styles.contactFormField} ${styles.customPlaceholder}`}
                  style={{ width: '70%', marginBottom: '6%' }}
                value={formData.name}
                onChange={(e) => {
                  const alphabeticValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setFormData({ ...formData, name: alphabeticValue });
                }}
              />
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Phone Number"
             className={`${styles.contactFormField} ${styles.customPlaceholder}`}
                 style={{ width: '70%', marginBottom: '6%' }}
                value={formData.phoneNumber}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, phoneNumber: onlyNumbers });
                }}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="10"
              />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
               className={`${styles.contactFormField} ${styles.customPlaceholder}`}
                   style={{ width: '70%', marginBottom: '6%' }}
                value={formData.email}
                onChange={handleChange}
                required
              />
              <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
            <p>
              By submitting, I accept Inframantra{' '}
              <Link href="/page/disclaimer">Terms & Conditions</Link> and{' '}
              <Link href="/page/privacy-policy">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUsSection;