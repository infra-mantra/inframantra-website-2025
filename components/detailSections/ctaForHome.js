import {  useState, useRef , useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import Ajax1 from '../helper/Ajax1';
import { useRouter } from 'next/router';
import ctaStyle from "./cta.module.css";
import style from "./ctaForHome.module.css"
import { MdLocationOn } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { MdMail } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
function App({name ,displayMap = true}) {
  
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

  const router = useRouter();


  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    projectName: name,
  });

  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (recaptchaRef.current) {
      try {
        const token = await recaptchaRef.current.executeAsync();
        setCaptchaToken(token);
        const action = {
          method: 'POST',
          url: '/enquiry/project',
          data: { ...formData, captchaToken: token },
          token: false,
        };

        const response = await Ajax1(action);

        if (response.data.status === 'success') {
          toast.success('Form submitted successfully');
          setFormData({ name: '', phoneNumber: '', email: '' });

          

          setTimeout(() => {
            router.push('/thank-you');
          }, 5000);
        } else {
          toast.error('Form submission failed');
        }
      } catch (error) {
        toast.error('Error submitting form');
        console.error('Error submitting form:', error);
      }
    } else {
      alert('reCAPTCHA not loaded properly.');
    }
  };





  return (
    <div className={style.homeApp}>
     
        <div className={style.homeCtaMainWrapper}>
            
          <div
            className={style.homePageContactUsLeftDetailSection}
               style={{ display: displayMap === false ? "none" : "block" }}
>
          {isDesktop && (
            <div className={style.homePageContactUsLeftMapPhotoContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14032.085916196966!2d77.0413113!3d28.4487689!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d193e2433c0cf%3A0xef40ba926f65e0ec!2sINFRAMANTRA!5e0!3m2!1sen!2sin!4v1731478063313!5m2!1sen!2sin"
                width="500"
                height="300"
                style={{ border: "0px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className={style.homePageMapPhotoBgdTopLeft}></div>
              <div className={style.homePageMapPhotoBgdBottomRight}></div>
            </div>
          )}
         
            <img
              className={style.homePageContactUsLeftDetailSectionImg}
              src="https://inframantra.blr1.cdn.digitaloceanspaces.com/miscellaneous/inframantraLogoBlack.png"
              alt="Inframantra-Logo"
            />
            
   
          <div className={style.homePageContactUsLeftDetailsContainer}>
            <div className={style.homePageContactUsLeftDetailFlex}>
              <div  style={{ color: '#E7B554', fontSize: '25px', marginRight: '10px' }}><MdLocationOn /></div>
              <p>95, Institutional Area, Sector 32, Gurugram</p>
            </div>
            <div className={style.homePageContactUsLeftDetailFlex}>
              <div style={{ color: '#E7B554', fontSize: '25px', marginRight: '10px' }}><IoMdCall /></div>
              <p>+91 86 9800 9900</p>
            </div>
            <div className={style.homePageContactUsLeftDetailFlex}>
              <div style={{ color: '#E7B554', fontSize: '25px', marginRight: '10px' }}><MdMail /></div>
              <p>marketing@inframantra.com</p>
            </div>
              <div className={style.homePageContactUsLeftDetailFlex}>
              <div style={{ color: '#E7B554', fontSize: '25px', marginRight: '10px' }}><FcApproval /></div>
              <p> HARERA/GGM/1813/1408/2022/181</p>
            </div>
          </div>
        </div>
     
          <div className={style.homeCtaInnerWrapper}  style={{ width: displayMap === false ? "100%" : "" }}>
            <form onSubmit={handleSubmit}>
                <div className={ctaStyle.headingForm}>
              <p style ={{marginTop:'0px!important'}} className={style.homePopUpHead}>Please share your contact details</p>
              <p className={style.homePopUpHead2}> TO UNLOCK EXCLUSIVE DEALS</p>
            </div>

              <div className={ctaStyle.formGroup}>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => {
                    const alphabeticValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setFormData({ ...formData, name: alphabeticValue });
                  }}
                  required
                />
              </div>
              <div className={ctaStyle.formGroup}>
                <input
                  type="tel"
                  id="mobile"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, phoneNumber: onlyNumbers });
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  minLength="10"
                  required
                />
              </div>
              <div className={ctaStyle.formGroup}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="recaptcha-container">
                <ReCAPTCHA
                  sitekey="6LfrSTUqAAAAAOy2-j9cNvTIujOI5GKjtMVsn2Uk"
                  size="invisible"
                  ref={recaptchaRef}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#E7B554",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
              <p className={style.homePropertyPageHeaderContactUsDisclaimer} style={{ padding: "10px" }}>
                *By submitting, I accept Inframantra{' '}
                <a href="https://inframantra.com/page/terms-conditions" target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
                  Terms & Conditions
                </a>{' '}and{' '}
                <a href="https://inframantra.com/page/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "blue" }}>
                  Privacy Policy.
                </a>
              </p>
            </form>
            <div className={style.homePagePropertyPageHeaderContactIconContainer2}>
              <hr width="100%" color="#DCAA4C" size="1" />
              <div style={{ display: "flex" }}>
                <div className={style.homeCtaText}>
                  <p className={style.hometextForm}>Give us a call and book your visit now!</p>
                </div>
                <img src="/guruCollection/guru_call.png" alt="Call Icon" />
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
}

export default App;
