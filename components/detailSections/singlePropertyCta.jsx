import { useState, useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import ctaStyle from "./cta.module.css";
import style from "./ctaForHome.module.css";
import Ajax1 from '../helper/Ajax1';
import { useRouter } from 'next/router';

function App({ name }) {

  const [isDesktop, setIsDesktop] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [loading, setLoading] = useState(false); // NEW

  const checkScreenWidth = () => {
    setIsDesktop(window.innerWidth >= 768);
    setIsMobile(window.innerWidth <= 768);
  };

  const router = useRouter();

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

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

  if (loading) return;

  try {
    setLoading(true);
    const toastId = toast.loading("Submitting form...");

    const action = {
      method: 'POST',
      url: '/enquiry/project',
      data: { ...formData },
      token: false,
    };

    const response = await Ajax1(action);

    if (response?.data?.status === 'success') {
      toast.update(toastId, {
        render: "Form submitted successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setFormData({
        name: '',
        phoneNumber: '',
        email: '',
        projectName: name,
      });

      setTimeout(() => {
        router.push('/thank-you');
      }, 3000);
    } else {
      toast.update(toastId, {
        render: "Form submission failed",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  } catch (error) {
    toast.error('Error submitting form');
    console.error('Error submitting form:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={style.homeApp}>
      <div className={`${style.homeCtaMainWrapper} ${style.pt}`}>
        <div className={style.homeCtaInnerWrapper} style={{ width: "100%" }}>
          <form onSubmit={handleSubmit}>

            <div className={ctaStyle.headingForm}>
              <p style={{ marginTop: '0px' }} className={style.homePopUpHead}>
                Please share your contact details
              </p>
              <p className={style.homePopUpHead2}>TO UNLOCK EXCLUSIVE DEALS</p>
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

           

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: loading ? "#ccc" : "#E7B554",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                  justifyContent: 'center',
                  display: 'flex'
                }}
              >
                {loading ? "Submitting..." : "Submit"}
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
              <img src="https://inframantra.com/guruCollection/guru_call.png" alt="Call Icon" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
