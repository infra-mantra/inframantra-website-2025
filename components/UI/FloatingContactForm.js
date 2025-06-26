import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import Ajax from '../helper/Ajax'
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import Link from 'next/link'

const FloatingContactForm = (props) => {
  const [closeContactForm, setCloseContactForm] = useState(false);
  const router = useRouter()
  const onCloseHandler = (closeContactForm) => {
    closeContactForm ? setCloseContactForm(false) : setCloseContactForm(true);
    closeContactForm ? props.onOpen(false) : props.onOpen(true);
  };

  const sendFormData = async(values) =>{
    const formData = {
      "name": values.full_name,
      ...(values.address && {"address": values.address}),
      "phone": `${values.contact_number}`,
      "email": values.email,  
      "concern": values.message
    }
    const action = {
      method: 'POST',
      url: '/enquiry',
      data: formData,
      loader: true
    }
    const formSendStatus = await Ajax(action)
    if(formSendStatus.data.status === 'SUCCESS!'){
      toast.success("Enquiry sent successfully")
      router.push('/thank-you')
    }
  }

  return (
    <div className="floating-form">
      {/* <picture className="floating-image-container">
        <img src="/assets/Untitled-1,1.jpg" alt="" className="floating-guru-img"/>
      </picture> */}
      <Formik
          initialValues={{ full_name: "", contact_number: "", email: "", ...(props.type && {address: ""}), message: "" }}
          validationSchema={Yup.object({
              full_name: Yup.string()
                  .max(50, 'Must be 50 characters or less')
                  .required('Required'),
              messsage: Yup.string()
                  .max(500, 'Must be 500 characters or less'),
              email: Yup.string().email('Invalid email address').required('Required'),
              ...(props.type === "getIntouch" && {address: Yup.string()
                .max(500, 'Must be 500 characters or less')}),
              contact_number: Yup.string()
              .matches(/^[0-9]+$/, "Must be only digits")
                        .max(10, '10 digit valid contact number required')
                        .min(10, '10 digit valid contact number required')
                        .required('Please enter a valid phone number'),
          })}
          onSubmit={(values, {resetForm}) => {
            sendFormData(values)
            resetForm()
          }}
      >
        <Form>
          <div className="form-head">
            <h3>{props.heading}</h3>
            <p>
              Fill the details below and we will get in touch with you within 24
              hours.
            </p>

            <div className="close-btn" onClick={onCloseHandler}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M11 1L1 11"
                  stroke="#E7B554"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 1L11 11"
                  stroke="#E7B554"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="form-area">
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <Field type="text" name="full_name"/>
              <div className="error">
                <ErrorMessage name="full_name" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="number">Phone</label>
              <div className="number-field">
                <div className="label-91">+91</div>
                <Field type="tel" maxLength="10" name="contact_number"/>
              </div>
              <div className="error">
                <ErrorMessage name="contact_number" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field type="email" name="email"/>
              <div className="error">
                <ErrorMessage name="email" />
              </div>
            </div>
            {props.type === "getIntouch" && (
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <Field type="text" name="address"/>
                <div className="error">
                  <ErrorMessage name="address" />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="message">Messsage</label>
              <Field as="textarea" name="message" rows="4"/>
              <div className="error">
                <ErrorMessage name="message" />
              </div>
            </div>
            <div className="form-group">
              <button type="submit" className="theme-btn btn-full">
                Submit
              </button>
            </div>
          </div>
        </Form>
      </Formik>
      <div className="form-contact desk-show">
         <div className="form-call">
          <Link href={`https://in.linkedin.com/company/inframantra`} target="_blank">
                <a target="_blank">
                  <FaLinkedin className="icon"/>
                </a>
          </Link>
         </div>
         <div className="form-insta">
            <Link href={`https://www.instagram.com/inframantraofficial`} target="_blank">
                <a target="_blank">
                    <FaInstagram className="icon"/>
                </a>
            </Link>
         </div>
         <div className="form-facebook">
           <Link href={`https://www.facebook.com/inframantraofficial`} target="_blank">
                 <a target="_blank">
                 <FaFacebookSquare className="icon"/>
                 </a>
           </Link>
         </div>
         <div className="form-whats">
            <Link href={`href="https://www.youtube.com/@inframantraofficial"`} target="_blank">
               <a target="_blank">
                  <FaYoutube className="icon"/>
               </a>
            </Link>
         </div>
      </div>
    </div>
  );
};

export default FloatingContactForm;
