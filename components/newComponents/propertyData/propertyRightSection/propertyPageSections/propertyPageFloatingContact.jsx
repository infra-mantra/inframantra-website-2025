import React, { useState, useRef, useEffect } from 'react';
import PropertyWrapper from '../../propertyLeftSection/propertyPageSections/propertyWrapper';
import ReCAPTCHA from 'react-google-recaptcha';
// import './PropertyPageFloatingContact.css';
import styles from './propertyPageFloatingContact.module.css'

import Ajax1 from '../../../../helper/Ajax1';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const contactFormStyles = {
    textField: {
        marginBottom: '10px',
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    checkBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: '30px',
        width: '100%',
    },
};

function PropertyPageFloatingContact({ name,propertyType }) {
    const router = useRouter();
    const [isDesktop, setIsDesktop] = useState(true);
    const [isMobile, setIsMobile] = useState(true);
    const checkScreenWidth = () => {
        setIsDesktop(window.innerWidth >= 768); // You can adjust the threshold for desktop here
        setIsMobile(window.innerWidth <= 768);
    };
    useEffect(() => {
        checkScreenWidth();
        window.addEventListener('resize', checkScreenWidth);

        return () => {
            window.removeEventListener('resize', checkScreenWidth);
        };
    }, []);

    const [formData, setFormData] = useState({
        projectName: name || '',
        name: '',
        email: '',
        phoneNumber: '',
        configuration: '',
    });
    const [selectedConfigurations, setSelectedConfigurations] = useState([]);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [captchaError, setCaptchaError] = useState('');
    const recaptchaRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setSelectedConfigurations((prev) =>
            checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
    };

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
     
            try {
                const token = await recaptchaRef.current.executeAsync(); // Execute reCAPTCHA
                setCaptchaToken(token); // Set the token in state
    
                // Prepare the action for the AJAX request
                const action = {
                    method: 'POST',
                    url: '/enquiry/project', // Adjust this URL to your API endpoint
                    data: {
                        ...formData,
                        configuration: selectedConfigurations.join(', '), // Include configurations if needed
                        captchaToken: token, // Include the captcha token
                    },
                    token: false, // Set to true if token is required
                };
    
                // Make the AJAX request
                const response = await Ajax1(action);
    
                if (response.data.status === 'success') {
                    toast.success('Enquiry sent successfully', 'success');
                    router.push('/thank-you');
                } else {
                    toast.error(`Failed to send enquiry: ${response.data.error}`, 'error');
                }
            } catch (error) {
                toast.error(`Failed to send enquiry: ${error.message}`, 'error');
            }
      
    };
    

    return (
        <PropertyWrapper>
            <form className={styles.aboutProjectWrapper} onSubmit={handleSubmit}>
                <div className={styles.propertyPageFloatingContactHeaderWrapper}>
                    <p>Get Expert Advice and Information for</p>
                    <p
                        style={{
                            color: '#e7b554',
                            fontWeight: '700',
                            fontSize: '20px',
                            marginBottom: '10px',
                        }}
                    >
                        {name}
                    </p>
                </div>
                <div className={styles.propertyPageFloatingContactWrapper}>
                    <div className="form-group-project">
                        {/* <label htmlFor="name">Name</label> */}
                        <div className='form-group-input'>
                            <input
                                type="text"
                                id="name"
                                required ={true}
                                name="name"
                                placeholder="Name *"
                                value={formData.name}
                                onChange={(e) => {
                                    const alphabeticValue = e.target.value.replace(/[^a-zA-Z\s]/g, ''); 
                                    setFormData({ ...formData, name: alphabeticValue });
                                  }}
                            />
                        </div>
                    </div>
                    <div className="form-group-project">
                    <div className='form-group-input'>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Phone Number *"
                            value={formData.phoneNumber}
                            onChange={(e) => {
                                const onlyNumbers = e.target.value.replace(/[^0-9]/g, ''); 
                                setFormData({ ...formData, phoneNumber: onlyNumbers });
                              }}
                              inputMode="numeric" 
                              pattern="[0-9]*" 
                              maxLength="10"
                              

                        />
                        </div>
                        {/* <label htmlFor="phoneNumber">Phone Number</label> */}
                    </div>
                    <div className="form-group-project">
                    <div className='form-group-input'>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email Address *"
                            value={formData.email}
                             onChange={handleChange}
                             required = {true}
                        />
                        </div>
                        {/* <label htmlFor="email">Email Address</label> */}
                    </div>
                </div>
                <div className="propertyPageFloatingContactWrapper propertyPageCheckBox">
                  {propertyType!="Commercial"?
                  <>
                  <p>I’m looking For</p>
                  <div style={contactFormStyles.checkBox}>
                        <label>
                            <input
                                type="checkbox"
                                value="2BHK"
                                checked={selectedConfigurations.includes('2BHK')}
                                onChange={handleCheckboxChange}
                            />
                            <span>2BHK</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="3BHK"
                                checked={selectedConfigurations.includes('3BHK')}
                                onChange={handleCheckboxChange}
                            />
                            <span>3BHK</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="4BHK"
                                checked={selectedConfigurations.includes('4BHK')}
                                onChange={handleCheckboxChange}
                             
                            />
                            <span>4BHK</span>
                        </label>
                    </div>
                    </>:null}  
                   
                    <div className="recaptcha-container">
                    <ReCAPTCHA
            sitekey={`6LfrSTUqAAAAAOy2-j9cNvTIujOI5GKjtMVsn2Uk`}
            size="invisible"
            ref={recaptchaRef} 
          />
                    </div>
                    {/* {captchaError && <p className="recaptcha-error">{captchaError}</p>} */}
                    <button
                        type="submit"
                        className="search-button"
                        style={{ width: isMobile ? "60vw" : '16vw', marginBottom: '10px', fontWeight: '700', fontSize: '16px', borderRadius: '8px' , cursor:'pointer'}}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </PropertyWrapper>
    );
}

export default PropertyPageFloatingContact;
