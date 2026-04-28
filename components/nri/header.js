import React, { useEffect, useState, useRef } from 'react';
import styles from './header.module.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';
import Ajax1 from '../helper/Ajax1';
import { useRouter } from 'next/router';

const Header = ({ name = "General Enquiry", popUpenable, pdf, onClickOff }) => {

  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const recaptchaRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    projectName: name,
  });

  useEffect(() => {
    if (popUpenable) {
      setIsAnimating(true);
      setMessage("");
    } else {
      setIsAnimating(false);
    }
  }, [popUpenable]);

  // ✅ handle input change
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ phone input handler
  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber: value,
    }));
  };

  // ✅ submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const toastId = toast.loading("Submitting form...");

      const action = {
        method: 'POST',
        url: '/enquiry/project',
        data: { ...formData, message },
        token: false,
      };

      const response = await Ajax1(action);

      if (response.data.status === 'success') {
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

        setMessage("");

        setTimeout(() => {
          router.push('/thank-you');
        }, 2000);

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const section = document.getElementById('NriAbout');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
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
                  <strong>GURGAON'S  Premium</strong> Luxury{' '}
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
            <div className={styles.bannerRight}>
              <nav>Register your Interest</nav>

              <form onSubmit={handleSubmit}>
                <div>

                  <div className={styles.formGroup} style={{ alignItems: "flex-start" }}>
                    <label>Name*</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.input}
                      type="text"
                      placeholder="Ex: Michael Collins"
                      required
                    />
                  </div>

                  <div className={styles.formGroup} style={{ alignItems: "flex-start" }}>
                    <label>Email*</label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.input}
                      type="email"
                      placeholder="Ex: michael.collins@gmail.com"
                      required
                    />
                  </div>

                  <div className={styles.formGroup} style={{ alignItems: "flex-start" }}>
                    <label>Phone Number*</label>

                    <PhoneInput
                      country={'us'}
                      enableSearch={true}
                      value={formData.phoneNumber}
                      onChange={handlePhoneChange}
                      inputClass={styles.input}
                      containerClass={styles.phoneContainer}
                      buttonClass={styles.flagDropdown}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className={styles.formGroup} style={{ alignItems: "flex-start" }}>
                    <label>Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={styles.input}
                      placeholder="Share any information here"
                    />
                  </div>

                  <div className={styles.submitBtn}>
                    <button type="submit" disabled={loading}>
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>

                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;