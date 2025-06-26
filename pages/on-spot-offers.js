import React, { useState } from "react";
import Wrapper from "../components/UI/Wrapper";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import Ajax from "../components/helper/Ajax";

function OnSpotOffers() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    city: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? value.replace(/[^0-9]/g, "").slice(0, 10) : value,
    }));

    // Real-time validation
    if (name === "name" && !/^[a-zA-Z\s]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, name: "Name must contain only letters." }));
    } else if (name === "name") {
      setErrors((prev) => ({ ...prev, name: "" }));
    }

    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address." }));
    } else if (name === "email") {
      setErrors((prev) => ({ ...prev, email: "" }));
    }

    if (name === "phone" && value.length <= 10) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number must be exactly 10 digits.",
      }));
    } else if (name === "phone") {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }

    if (name === "city" && value === "") {
      setErrors((prev) => ({ ...prev, city: "Please select a project." }));
    } else if (name === "city") {
      setErrors((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation check
    const newErrors = {
      name: formData.name ? /^[a-zA-Z\s]+$/.test(formData.name) ? "" : "Name must contain only letters." : "Name is required.",
      email: formData.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "" : "Invalid email address." : "Email is required.",
      phone: formData.phone.length === 10 ? "" : "Phone number must be exactly 10 digits.",
      city: formData.city ? "" : "Please select a project.",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return; // Prevent submission if there are validation errors
    }

    try {
      const action = {
        method: 'POST',
        url: '/enquiry/offerEnquiry',
        data: formData,
        loader: true,
      };
  
      const response = await Ajax(action);



      if (response.data.status  === "SUCCESS!" ) {
        toast.success("Enquiry sent successfully");
        router.push("/thank-you");
      } else {
        toast.error(`Failed to send enquiry: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      toast.error(`Failed to send enquiry: ${error.message}`);
    }
  };

  return (
    <>
      <Wrapper title="Special offer">
        {/* <div className="offer-card-container">
          <div className="offer-card">
            <div className="offer-content">
              <h1>
                Secure your dream home with exclusive discounts on premium properties.
              </h1>
            </div>
            <div className="offer-icon">
              <div className="right-offer">
                <picture>
                  <img src="/assets/special-offer-icon.png" alt="Special Offer" />
                </picture>
              </div>
            </div>
          </div>
        </div>
           */}
        <div
          className="main"
          style={{
            textAlign: "center",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            marginTop: "40px",
          }}
        >
     
           <div className="offer-section-head">
            <h1>Inframantra Special Offer</h1>
          </div>
         </div> 
        <div className="contact-container">
          <span className="big-circle"></span>
          <div className="form">
            <div className="contact-info-offer"></div>
            <div className="offer-contact-form">
              <span className="circle one"></span>
              <span className="circle two"></span>
              <form onSubmit={handleSubmit}>
                <h3 className="title">Fill the form to get an exciting offer</h3>
                <div className="input-container">
                  <input
                    name="name"
                    type="text"
                    className="input"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div className="input-container">
                  <input
                    name="email"
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="input-container">
                  <input
                    name="phone"
                    type="number"
                    className="input"
                    placeholder="Phone no"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && <span className="error">{errors.phone}</span>}
                </div>
                <div className="input-container">
                  <select
                    name="city"
                    className="input"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled style={{color:"#757575"}}>
                      Select a Project
                    </option>
                    <option value="Vatika Seven Elements" style={{color:"#757575"}}>Vatika Seven Elements</option>
                    <option value="Vatika Sovereign Park" style={{color:"#757575"}}> Vatika Sovereign Park</option>
                  </select>
                  {errors.city && <span className="error">{errors.city}</span>}
                </div>
                <div className="input-container textarea">
                  <textarea
                    name="message"
                    className="input"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button type="submit" value="Submit" className="btn" disabled={Object.values(errors).some(error => error)}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
}

export default OnSpotOffers;
