import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import Ajax from '../../components/helper/Ajax'
import { toast } from 'react-toastify';
import style from './jobAccordion.module.css';


const JobAccordion = (props) => {
  const [isActive, setIsActive] = useState(false);
  const [stateList, setStateList] = useState(null);
  const resumeFile = useRef()
  useEffect(()=>{
    const getResponse = setTimeout(function(){
      (async()=>{
        const stateData = await Ajax({
          url:'/setting/states',
        })
        setStateList(stateData.data.result)
      })()
    },100)

    return()=>{
      clearInterval(getResponse)
    }
  },[])

  let title = props.data.title;
  let location = props.data.location;
  let type = props.data.jobType;
  let content = props.data.description;


   
  const sendFormData = async(values, reset) =>{
    const formData = new FormData()
    formData.append("name",values.name)
    formData.append("email",values.email)
    formData.append("phone",`${values.phone}`)
    formData.append("type",values.type)
    formData.append("jobs",values.jobs)
    formData.append("state",values.state)
    formData.append("city",values.city)
    formData.append("appliedFor",values.appliedFor)
    if(resumeFile.current.value !== ''){
      formData.append("file",resumeFile.current.files[0])
    }
    try {
      const action = {
        method: 'POST',
        url: '/career/apply',
        data: formData,
        loader: true,
      };
  
      const formSendStatus = await Ajax(action);
  
      if (formSendStatus.data.status === 'SUCCESS!') {
        toast.success('Successfully applied for a position');
        reset();
        resumeFile.current.value = '';
      } else {
        // Handle other status scenarios if needed
        console.error('Unexpected formSendStatus:', formSendStatus);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      // Handle error, e.g., display a user-friendly message
      toast.error('Failed to submit the form. Please try again.');
    }
  } 



//   function handleSubmit(values) {
//     const formData = new FormData();
//     formData.append("name", values.name);
//     formData.append("email", values.email);
//     formData.append("phone", `${values.phone}`);
//     formData.append("type", values.type);
//     formData.append("jobs", values.jobs);
//     formData.append("state", values.state);
//     formData.append("city", values.city);
//     formData.append("appliedFor", values.appliedFor);
//     if (resumeFile.current.value !== '') {
//         formData.append("file", resumeFile.current.files[0]);
//     }

//     // Create an array for attachments
//     const attachments = [
//         {
//             filename: 'resume.pdf',  // Specify the desired filename
//             content: resumeFile.current.files[0].buffer,  // Use buffer for the file content
//         },
//         // Add more attachments as needed
//     ];

//     fetch("/api/sendEmail", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ formData, attachments }),  // Pass attachments to the server
//     })
//     .then((response) => response.json())
//     .then((data) => {
//         if (data.success) {
//             toast.success("Form Submitted Successfully");
//         } else {
//             toast.error("Error sending email:", data.error);
//         }
//     });
// }

  

  return (
    <div className={style.accordionItem}>
      <div role="button" className={style.accordionTitle} onClick={() => setIsActive(!isActive)}>
        <div className={style.jobTitle}>{title}</div>
        <div className={style.jobLocation}>{location}</div>
        <div className={style.jobType}>{type}</div>

        <div className={style.icon}>{isActive ? '-' : '+'}</div>
      </div>
      {isActive && 
      <div className={style.accordionContent}>
        <div className={style.textWrap} dangerouslySetInnerHTML={{__html: content}} />

        <Popup
          trigger={
            <div className={style.btnWrap}>
                <button  className={style.themeBtn}>
                Apply Now
                <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                >
                <path
                    d="M1 6H11"
                    stroke="#E7B554"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M6 1L11 6L6 11"
                    stroke="#E7B554"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                </svg>
                </button>
            </div>
          }
          modal
          nested
        >
          {close => (
            <div className={`${style.modal} ${style.careerModal}`}>
              <div className={`${style.modalBody}`}>
                <button className={`${style.close}`} onClick={close}>
                  &times;
                </button>
                <div className={`${style.content}`}>
                  <div className={`${style.contactFormWrap} ${style.careerForm}`}>
                    <Formik
                      initialValues={{ name: "", city: "", state: "", type: "", email: "", phone: "", appliedFor: "", jobs: props.data.id }}
                      validationSchema={Yup.object({
                        name: Yup.string()
                          .max(15, 'Must be 15 characters or less')
                          .required('Required'),
                        email: Yup.string().email('Invalid email address').required('Required'),
                        phone: Yup.string()
                        .matches(/^[0-9]+$/, "Must be only digits")
                        .max(10, '10 digit valid contact number required')
                        .min(10, '10 digit valid contact number required')
                        .required('Please enter a valid phone number'),
                        city: Yup.string(),
                        state: Yup.string()
                      })}
                      onSubmit={(values, {resetForm}) => {
                        sendFormData(values, resetForm)
                        // handleSubmit(values, resetForm)
                      }}
                    >
                      <Form>
                        <div className={`${style.formArea} ${style.contactForm} ${style.unfloatLabels}`}>
                          <div className={style.formHead}>
                            <h3>Apply for {title}</h3>
                          </div>
                          <div className={style.formRow}>
                            <div className={`${style.formGroup} ${style.cl12}`}>
                              <Field name="name" type="text" placeholder="Full name" />
                              <div className={`${style.error}`}>
                              <ErrorMessage name="name" />
                              </div>
                            </div>
                            <div className={`${style.formGroup} ${style.cl6}`}>
                              <Field name="email" type="email" placeholder="Email" />
                              <div className={`${style.error}`}>
                                <ErrorMessage name="email" />
                              </div>
                            </div>
                            <div className={`${style.formGroup} ${style.cl6}`}>
                              <Field name="phone" type="tel" maxLength="10" placeholder="Contact No." />
                              <div className={`${style.error}`}>
                                <ErrorMessage name="phone" />
                              </div>
                            </div>
                            <div className={`${style.formGroup} ${style.cl6}`}>
                              <Field as="select" name="state" className={`${style.formSelect}`} >
                                <option value="" disabled>Select</option>
                                {stateList === null ? <option>State Loading...</option> : stateList.map((data)=>(
                                    <option key={data._id} value={data._id}>{data.name}</option>
                                ))}
                              </Field>
                              <div className={`${style.error}`}>
                                <ErrorMessage name="state" />
                              </div>
                            </div>
                            <div className={`${style.formGroup} ${style.cl6}`}>
                              <Field name="city" type="text" placeholder="City" />
                              <div className={`${style.error}`}>
                                <ErrorMessage name="city" />
                              </div>
                            </div>
                            <div className={`${style.formGroup} ${style.cl6}`}>
                              <Field name="type" type="text" placeholder="Job Type" />
                              <div className={`${style.error}`}>
                                <ErrorMessage name="type" />
                              </div>
                            </div>
                            <div className={`${style.formGroup} ${style.cl6}`}>
                              <Field name="appliedFor" type="text" placeholder="Applied For" />
                              <div className={`${style.error}`}>
                                <ErrorMessage name="appliedFor" />
                              </div>
                            </div>
                            <div className={`${style.formGroup} ${style.cl12}`}>
                              <label>Upload Resume</label>
                              <input type="file" accept='.pdf,.docx,.txt' ref={resumeFile} name="resume" />
                            </div>
                            <Field name="jobs" type="hidden"></Field>
                            <div className={`${style.formGroup} ${style.cl12}`}>
                              <button type="submit" className={`${style.themeBtn}`}>
                                Submit
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                >
                                  <path
                                    d="M1 6H11"
                                    stroke="#E7B554"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M6 1L11 6L6 11"
                                    stroke="#E7B554"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Popup>

      </div>
      }
    </div>
  );
};

export default JobAccordion;