"use client";

import React, { useState, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { State, City } from 'country-state-city';
import { toast } from 'react-toastify';
import style from './jobAccordion.module.css';
import axios from 'axios';

const MAX_FILE_SIZE = 5 * 1024 * 1024; 

const JobAccordion = ({ data, onClose }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [fileError, setFileError] = useState('');
  const [resumeError, setResumeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasFile, setHasFile] = useState(false); // ✅ FIX
  const resumeFile = useRef();

  useEffect(() => {
    const stateList = State.getStatesOfCountry('IN');
    setStates(stateList);
  }, []);

  const handleStateChange = (e, setFieldValue) => {
    const stateCode = e.target.value;

    setFieldValue("state", stateCode);
    setFieldValue("city", "");

    const cityList = City.getCitiesOfState('IN', stateCode);
    setCities(cityList);
  };

  const handleFileChange = (e) => {
    setFileError('');
    setResumeError('');

    const file = e.target.files[0];

    if (!file) {
      setHasFile(false);
      setResumeError("Resume is required");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError('File size must be less than 5 MB');
      setHasFile(false);
      e.target.value = '';
      return;
    }

    setHasFile(true); // ✅ valid file
  };

  const sendFormData = async (values, reset) => {

    if (!hasFile) {
      setResumeError("Resume is required");
      toast.error("Please upload your resume");
      return;
    }

    if (fileError) {
      toast.error('Please fix the file upload error before submitting.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    const selectedState = states.find(s => s.isoCode === values.state);

    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("type", values.type);
    formData.append("jobs", values.jobs);
    formData.append("state", selectedState?.name || "");
    formData.append("city", values.city);
    formData.append("appliedFor", values.appliedFor);

    if (resumeFile.current.files.length > 0) {
      formData.append("file", resumeFile.current.files[0]);
    }

    try {
      const response = await axios.post(
        "https://apitest.inframantra.com/api/v1/career/apply",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.statusCode === 409) {
        toast.info(response.data.message || "Already applied");
      } 
      else if (response?.data?.statusCode === 200) {
        toast.success(response.data.message || "Application submitted successfully 🎉");

        reset();
        setCities([]);
        setResumeError('');
        setHasFile(false);

        if (resumeFile.current) {
          resumeFile.current.value = "";
        }
      } 
      else {
        toast.error(response?.data?.message || "Something went wrong");
      }

    } catch (error) {
      console.error("Error:", error);

      toast.error(
        error?.response?.data?.message ||
        error.message ||
        "Failed to submit the form."
      );
    } finally {
      setLoading(false);
    }
  };

  const { title, jobType, id } = data;

  return (
    <Popup
      open={true}
      modal
      nested
      onClose={onClose}
      closeOnDocumentClick
      contentStyle={{
        padding: 0,
        borderRadius: '15px',
        maxWidth: '800px',
        width: '90%'
      }}
    >
      {(close) => (
        <div className={style.modal}>
          <div className={style.modalBody}>

            <button
              className={style.close}
              onClick={() => { close(); onClose(); }}
            >
              &times;
            </button>

            <div className={style.content}>
              <h2>Apply for {title}</h2>

              <Formik
                initialValues={{
                  name: "",
                  city: "",
                  state: "",
                  type: jobType || "",
                  email: "",
                  phone: "",
                  appliedFor: title,
                  jobs: id
                }}
                validationSchema={Yup.object({
                  name: Yup.string().max(50).required('Required'),
                  email: Yup.string().email().required('Required'),
                  phone: Yup.string()
                    .matches(/^[0-9]+$/, "Only digits allowed")
                    .length(10, '10 digit number required')
                    .required('Required'),
                  state: Yup.string().required('Required'),
                  city: Yup.string().required('Required'),
                })}
                onSubmit={(values, { resetForm }) =>
                  sendFormData(values, resetForm)
                }
              >
                <Form className={style.contactFormWrap}>

                  <div className={style.formGroup}>
                    <Field name="name" type="text" placeholder="Full name" />
                    <ErrorMessage name="name" component="div" className={style.error} />
                  </div>

                  <div className={style.formGroup}>
                    <Field name="email" type="email" placeholder="Email" />
                    <ErrorMessage name="email" component="div" className={style.error} />
                  </div>

                  <div className={style.formGroup}>
                    <Field name="phone" type="tel" maxLength="10" placeholder="Contact No." />
                    <ErrorMessage name="phone" component="div" className={style.error} />
                  </div>

                  <div className={style.formGroup}>
                    <Field name="state">
                      {({ field, form }) => (
                        <select
                          {...field}
                          className={style.formSelect}
                          onChange={(e) => handleStateChange(e, form.setFieldValue)}
                        >
                          <option value="">Select State</option>
                          {states.map((state) => (
                            <option key={state.isoCode} value={state.isoCode}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </Field>
                    <ErrorMessage name="state" component="div" className={style.error} />
                  </div>

                  <div className={style.formGroup}>
                    <Field as="select" name="city" className={style.formSelect}>
                      <option value="">Select City</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="city" component="div" className={style.error} />
                  </div>

                  <div className={style.formGroup}>
                    <Field name="type" type="text" readOnly />
                  </div>

                  <div className={style.formGroup}>
                    <Field name="appliedFor" type="text" readOnly />
                  </div>

                  <div className={style.formGroup}>
                    <label htmlFor="resume">Upload Resume *</label>
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,.docx,.txt"
                      ref={resumeFile}
                      onChange={handleFileChange}
                    />

                    {resumeError && <div className={style.error}>{resumeError}</div>}
                    {fileError && <div className={style.error}>{fileError}</div>}
                  </div>

                  <div className={style.formGroup}>
                    <button
                      type="submit"
                      className={style.themeBtn}
                      disabled={loading || !hasFile}
                    >
                      {loading ? <span className={style.loader}></span> : "Submit"}
                    </button>
                  </div>

                </Form>
              </Formik>

            </div>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default JobAccordion;