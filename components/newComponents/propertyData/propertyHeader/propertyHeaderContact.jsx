import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';

import { FaPhoneAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import Ajax1 from '../../../helper/Ajax1';
import { useRouter } from 'next/router';

const textFieldStyles = {
  width: '90%',
  height: '20px',
  marginBottom: '12px',
  padding: '10px',
  borderColor: 'transparent',
  borderBottom: '1px solid #E7B554',
  borderRadius: '4px',
  outline: 'none',
};

const CustomTextFieldWrapper = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  height: '70%',
};

function PropertyHeaderContact({ name }) {
// console.log(name,"#######")
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_SITE_KEY;
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    projectName: name,
  });
  const [captchaToken, setCaptchaToken] = useState(null);
//   const dispatch = useDispatch();
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (recaptchaRef.current) {
      try {
        const token = await recaptchaRef.current.executeAsync(); // Execute reCAPTCHA
        setCaptchaToken(token); // Set the token in state
        // console.log('reCAPTCHA token:', token);
        // console.log(formData);
        const action = {
          method: 'POST',
          url: '/enquiry/project', // Adjust this URL to your API endpoint
          data: { ...formData, captchaToken: token }, // Include captcha token in data
          token: false, // Set to true if token is required
        };
  
        const response = await Ajax1(action); // Use your Ajax1 function to submit
  
        if (response.data.status === 'success') {
          toast.success('Form submitted successfully:', response.data);
          // Reset form after successful submission
          setFormData({
            name: '',
            phoneNumber: '',
            email: '',
          });
          router.push('/thank-you'); // Redirect to Thank You page
        } else {
          toast.error('Form submission failed:', response);
          // console.log('Form submission failed:', response);
        }
      } catch (error) {
        toast.error('Error submitting form:', error);
        console.error('Error submitting form:', error);
      }
    } else {
      alert('reCAPTCHA not loaded properly.');
    }
  };

  return (
    <div className="propertyPageHeaderContactUs" style={name === "display" ? { width: "120%",height:"100%" } : {}}>
      <h4 className=''>Please share your contact details<br/>
        TO UNLOCK EXCLUSIVE DEALS</h4>
      {/* <div className="propertyPageHeaderContactUsPhoneFlex" >
         <span role="img" aria-label="phone" style={{ color: 'green' }}><FaPhoneAlt/></span
        <p style={{ margin: '0' }}>+ 91 86 9800 9900</p>
      </div> */}
      <form onSubmit={handleSubmit} className="propertyTopFormContact">
        <div style={CustomTextFieldWrapper} className="propertyTopForm">
          <input
            name="name"
            type="text"
            placeholder="Name"
            style={textFieldStyles}
            value={formData.name}
            onChange={(e) => {
              const alphabeticValue = e.target.value.replace(/[^a-zA-Z\s]/g, ''); 
              setFormData({ ...formData, name: alphabeticValue });
            }}
          />
          <input
            name="phoneNumber"
            type="text"
            placeholder="Phone Number"
            style={textFieldStyles}
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
            name="email"
            type="email"
            placeholder="Email"
            style={textFieldStyles}
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="recaptcha-container">
          <ReCAPTCHA
            sitekey={`6LfrSTUqAAAAAOy2-j9cNvTIujOI5GKjtMVsn2Uk`}
            size="invisible"
            ref={recaptchaRef} // Reference to the ReCAPTCHA component
          />
        </div>
       
        <button type="submit" style={{ width: '12rem', padding: '10px', backgroundColor: '#E7B554', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' , marginTop: '1.5rem',}}>
          Submit  
        </button>
        <p className="propertyPageHeaderContactUsDisclaimer">
          * By submitting, I accept Inframantra{' '}
          <a href="https://inframantra.com/page/terms-conditions" target='_blank' style={{color:"blue"}}> Terms & Conditions </a> and{' '}
          <a href="https://inframantra.com/page/privacy-policy" target='_blank' style={{color:"blue"}}> Privacy Policy</a>
        </p>
      </form>
      <div className='line'></div>

        
        
  <div className="propertyPageHeaderContactIconContainer">
      <hr width="80%;" color="#DCAA4C" size="4"/>
      <p>
  <span role="img" aria-label="phone" style={{ color: 'green', marginRight: '1rem' }}>
    <FaPhoneAlt />
  </span>
  + 91 86 9800 9900
</p>

       
      </div>
    </div>
  );
}

export default PropertyHeaderContact;