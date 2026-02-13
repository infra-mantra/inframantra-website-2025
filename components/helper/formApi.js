import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Ajax1 from "../helper/Ajax1";

export default function EnquiryForm({ slug = "" }) {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    projectName: slug || "Website Blog"
  });

  const [errors, setErrors] = useState({});

  // ✅ Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.name || !/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Valid name required";
    }

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Valid email required";
    }

    if (formData.phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Valid 10 digit phone required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ API Submit
  const handleSubmit = async () => {

    if (!validate()) return;
    if (loading) return;

    try {
      setLoading(true);

      const toastId = toast.loading("Submitting form...");

      const action = {
        method: "POST",
        url: "/enquiry/project",
        data: {
          ...formData,
          message: ""
        },
        token: false,
      };

      const response = await Ajax1(action);

      if (response?.data?.status === "success") {

        toast.update(toastId, {
          render: "Form submitted successfully",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          projectName: slug || "Website Blog"
        });

        // Redirect
        setTimeout(() => {
          router.push("/thank-you");
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
      toast.error("Error submitting form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>

      <h6 style={headingStyle}>
        Best Properties · Best Deals
      </h6>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>

        {/* Name */}
        <div style={fieldStyle}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value.replace(/[^a-zA-Z\s]/g, "")
              })
            }
            style={inputStyle}
          />
          <div style={errorStyle}>{errors.name}</div>
        </div>

        {/* Email */}
        <div style={fieldStyle}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            style={inputStyle}
          />
          <div style={errorStyle}>{errors.email}</div>
        </div>

        {/* Phone */}
        <div style={fieldStyle}>
          <input
            type="tel"
            placeholder="Phone"
            maxLength="10"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                phoneNumber: e.target.value.replace(/[^0-9]/g, "")
              })
            }
            style={inputStyle}
          />
          <div style={errorStyle}>{errors.phoneNumber}</div>
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading ? "#ccc" : "#D69D2E",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            minWidth: "100%"
          }}
        >
          {loading ? "Submitting..." : "Enquire Now"}
        </button>

      </div>
    </div>
  );
}

/* ===== Styles ===== */

const containerStyle = {
  padding: "20px",
  background: "#f4f5f7",
  fontFamily: "Arial",
  width: "100%",
  boxSizing: "border-box",
  margin: "20px 0"
};

const headingStyle = {
  display: "flex",
  justifyContent: "center",
  fontSize: "1.2rem",
  margin: "1rem 0"
};

const fieldStyle = {
  flex: 1,
  minWidth: "200px"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px"
};

const errorStyle = {
  color: "red",
  fontSize: "12px"
};
