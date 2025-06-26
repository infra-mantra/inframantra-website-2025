import React, { useState, useEffect } from 'react';
import { SocialIcon } from 'react-social-icons';


import Link from 'next/link';
import { useRouter } from 'next/router';

import { MdLocationOn } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import Ajax1 from '../../helper/Ajax1';
import { toast } from 'react-toastify';


const formPaperStyles = {
  width: '40vw',
  height: '100%',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
};

const formPaperMobileStyles = {
  width: '95vw',
  height: '100%',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
};

const mobileLocationPaperStyles = {
  width: '46vw',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '20px',
  borderRadius: '10px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
};

const mobileIconPaper = {
  width: '95vw',
  height: '17vh',
  marginTop: '35px',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
};



export default function ContactUsPage() {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 769); // You can adjust the threshold for desktop here
    setIsMobile(window.innerWidth <= 768);
  };
  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);
  // State management for form fields
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
  });
  // Handler for input changes
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
      method: 'POST',
      url: '/enquiry/contact', // Adjust this URL to your API endpoint
      data: formData,
      token: false, // Set to true if token is required
    };

    try {
      const response = await Ajax1(action);
      if (response.data.status === 'success') {
        toast.success('Form submitted successfully:', response.data);
        // Reset form after successful submission
        setFormData({
          name: '',
          phoneNumber: '',
          email: '',
        });
        router.push('/thank-you');
      } else {
        toast.error('Form submission failed:', response);
        console.log('Form submission failed:', response);
      }
    } catch (error) {
      toast.error('Error submitting form:', error);
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="contactUsPageWrapper">
      {isDesktop && (
        <>
          <div className="contactUsPageBannerContainer">
            <img
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/contact-us-banner%20f%20copy.avif"
              alt="infra-banner"
            />
          </div>

          <div className="contactUsPageFormSectionContainer">
            <div className="contactUsPageFormSectionGuruImgContainer">
              <img
                className="contactPageGuruImg"
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/guruContactPage.png"
                alt="Guru Randhawa Inframantra"
              />
            </div>
            <div style={formPaperStyles}>
              <h3 className="contactUsPageSecondSectionHeader">
                Let`s Find Your{' '}
                <span style={{ color: '#E7B554' }}>Dream Home </span>Together!
              </h3>
              <form
                className="contactUsPageSecondSectionFormWrapper"
                onSubmit={handleSubmit}
              >
                <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => {
                    const alphabeticValue = e.target.value.replace(/[^a-zA-Z\s]/g, ''); 
                    setFormData({ ...formData, name: alphabeticValue });
                  }}
                  required
                />
                <input
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/[^0-9]/g, ''); 
                    setFormData({ ...formData, phoneNumber: onlyNumbers });
                  }}
                  inputMode="numeric" 
                  pattern="[0-9]*" 
                  maxLength="10"
                  minLength={10}
                  required
                />
                <input
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <button
                  className='search-button'
                  style={{ borderRadius: '8px', width: '20vw', fontSize: '20px', padding: '10px' }}
                  type="submit"
                >
                  Contact Now
                </button>
              </form>
              <p className='contactUsPageConditions'>By submitting, I accept Inframantra <Link href="/page/disclaimer">Terms &amp; Conditions</Link> and <Link href="/page/privacy-policy">Privacy Policy</Link></p>
            </div>
          </div>
          <div className="contactUsPageLocationSectionContainer">
            <div className="contactUsPageLocationSectionMapContainer">
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14032.085916196966!2d77.0413113!3d28.4487689!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d193e2433c0cf%3A0xef40ba926f65e0ec!2sINFRAMANTRA!5e0!3m2!1sen!2sin!4v1731478063313!5m2!1sen!2sin" width="500" height="300"  allowfullscreen="" loading="lazy"style={{border:"0px"}}referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
              
            <div className="contactUsPageLocationSectionAddressContainer">
              <div className="contactUsPageLocationSectionAddressFlex">
                <span
                  style={{
                    color: '#E4A951',
                    height: '100%',
                    fontSize: '2rem',
                  }}
                >
                  <MdLocationOn />
                </span>
                <div className="contactUsPageLocationSectionAddressDataFlex">
                  <p className="contactUsPageThirdSectionLocationCity">
                    Gurgaon
                  </p>
                  <p className="contactUsPageThirdSectionLocationAddress">
                    95, Institutional Area, Sector 32, Gurugram, Haryana 122002
                  </p>
                </div>
              </div>
              <div className="contactUsPageLocationSectionAddressFlex">
                <span
                  style={{
                    color: '#E4A951',
                    height: '100%',
                    fontSize: '2rem',
                  }}
                >
                  <MdLocationOn />
                </span>
                <div className="contactUsPageLocationSectionAddressDataFlex">
                  <p className="contactUsPageThirdSectionLocationCity">Noida</p>
                  <p className="contactUsPageThirdSectionLocationAddress">
                    Assotech Business Cresterra, Unit No: 416, Tower 1,
                    Sector-135, Noida, U.P., 201301
                  </p>
                </div>
              </div>
              <div className="contactUsPageLocationSectionAddressFlex">
                <span
                  style={{
                    color: '#E4A951',
                    height: '100%',
                    fontSize: '2rem',
                  }}
                >
                  <MdLocationOn />
                </span>
                <div className="contactUsPageLocationSectionAddressDataFlex">
                  <p className="contactUsPageThirdSectionLocationCity">Pune</p>
                  <p className="contactUsPageThirdSectionLocationAddress">
                    Pune - 2nd Floor, Mantri Court, near RTO Office, Narveer Tanaji Wadi, Shivajinagar, Pune, Maharashtra 411001
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr className="contactUsPageLastSectionDivider" />
          <div className="contactUsPageLastSectionContainer">
            <p className="contactUsPageLastSectionContainerHeader">
              Contact Us Now!
            </p>
            <p className="contactUsPageLastSectionContainerSubHeader">
              <span style={{ color: '#E4A951', marginRight: '15px', fontSize: '1.5rem' }}><FaPhoneAlt /></span>
              + 91 86 9800 9900
            </p>
            <p className="contactUsPageLastSectionContainerSubHeader">
              <span style={{ color: '#E4A951', marginRight: '15px', fontSize: '1.5rem' }}><MdMail /></span>
              info@inframantra.com
            </p>
            <p className="contactUsPageLastSectionContainerSubHeader">
              <span style={{ color: '#E4A951', marginRight: '15px', fontSize: '1.5rem' }}><MdMail /></span>
              marketing@inframantra.com
            </p>
          </div>
        </>
      )}
      {!isDesktop && (
        <>
          <h3 className="contactUsPageSecondSectionHeader">
            Let`s Find Your{' '}
            <span style={{ color: '#E7B554' }}>Dream Home </span>Together!
          </h3>
          <div style={formPaperMobileStyles}>
            <form
              className="contactUsPageSecondSectionFormWrapper"
              onSubmit={handleSubmit}
            >
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                style={{ width: '80%', padding: '10px', margin: '10px 0' }}
                required
              />
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                style={{ width: '80%', padding: '10px', margin: '10px 0' }}
                required
                maxLength={10}
                minLength={10}
              />
              <input
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleInputChange}
                style={{ width: '80%', padding: '10px', margin: '10px 0' }}
                required
              />
              <button
                style={{
                  width: '80vw',
                  fontSize: '20px',
                  padding: '10px',
                  borderRadius: '8px',
                }}
                className='search-button'
                type="submit"
              >
                Contact Now
              </button>
            </form>
            <p className='contactUsPageConditions'>By submitting, I accept Inframantra <Link href="/page/disclaimer">Terms &amp; Conditions</Link> and <Link href="/page/privacy-policy">Privacy Policy</Link></p>
            <img className="contactPageGuruImg" src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/guruContactPage.png" alt="Guru Randhawa Brand Ambassador Inframantra"></img>
          </div>
          <div className='contactUsPageThirdSectionContainer'>
            <div className='contactUsPageThirdSectionLocationUpper'>
              <div className="contactUsPageLocationSectionAddressFlex">
                <div className='contactUsPageThirdSectionLocationCity'>
                  <span
                    style={{
                      color: '#E4A951',
                      height: '100%',
                      fontSize: '2rem',
                    }}
                  >
                    <MdLocationOn />
                  </span>
                  Gurgaon
                </div>
                <p className="contactUsPageThirdSectionLocationAddress">
                  95, Institutional Area, Sector 32, Gurugram, Haryana 122002
                </p>
              </div>
              <div className="contactUsPageLocationSectionAddressFlex">
                <div className='contactUsPageThirdSectionLocationCity'>
                  <span
                    style={{
                      color: '#E4A951',
                      height: '100%',
                      fontSize: '2rem',
                    }}
                  >
                    <MdLocationOn />
                  </span>
                  Noida
                </div>
                <p className="contactUsPageThirdSectionLocationAddress">
                  Assotech Business Cresterra, Unit No: 416, Tower 1, Sector-135,
                  Noida, U.P., 201301
                </p>
              </div>
            </div>
            <div className='contactUsPageThirdSectionLocationUpper'>
              <div className="contactUsPageLocationSectionAddressFlex">
                <div className='contactUsPageThirdSectionLocationCity'>
                  <span
                    style={{
                      color: '#E4A951',
                      height: '100%',
                      fontSize: '2rem',
                    }}
                  >
                    <MdLocationOn />
                  </span>
                  Pune
                </div>
                <p className="contactUsPageThirdSectionLocationAddress">
                  Pune - 2nd Floor, Mantri Court, near RTO Office, Narveer Tanaji Wadi, Shivajinagar, Pune, Maharashtra 411001
                </p>
              </div>
              <div className="contactUsPageLocationSectionAddressFlex">
                <div class="contactUsPageThirdSectionIconFlex">
                  <span style={{
                    color: '#E4A951',
                    height: '100%',
                    fontSize: '2rem',
                  }}><FaPhoneAlt /></span>
                  <p>+ 91 86 9800 9900</p>
                </div>
                <hr class="contactUsPageThirdSectionIconDivider"></hr>
                <div class="contactUsPageThirdSectionIconFlex">
                  <span style={{
                    color: '#E4A951',
                    height: '100%',
                    fontSize: '2rem',
                  }}><MdMail /></span>
                  <p>info@inframantra.com</p>
                </div>
              </div>
            </div>
            <div style={mobileIconPaper}>
              <h4 style={{ fontSize: '14px', color: '#e4a951' }}>Follow Us For Latest Updates</h4>
              <div className="contactUsPageThirdSectionSocialMediaFlex">
              <SocialIcon url="https://www.facebook.com/inframantraofficial" style={{ height: '40px', width: '40px' }} />
                <SocialIcon url="https://x.com/INFRAMANTRA_" style={{ height: '40px', width: '40px' , backdropFilter: "#FFF"}} />
                <SocialIcon url="https://www.instagram.com/inframantraofficial/" style={{ height: '40px', width: '40px' }} />
                <SocialIcon url="https://www.youtube.com/@inframantraofficial" style={{ height: '40px', width: '40px' }} />
                <SocialIcon url="https://in.linkedin.com/company/inframantra" style={{ height: '40px', width: '40px' }} />
                <SocialIcon url="https://in.pinterest.com/inframantraofficial/" style={{ height: '40px', width: '40px' }} />
                </div>
            </div>
          
          </div>
        </>
      )}
    </div>
  );
}
