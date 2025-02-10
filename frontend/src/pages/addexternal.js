import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { useNavigate } from "react-router-dom";
const ExternalFunded = () => {
  const faculty_id = sessionStorage.getItem("faculty_id");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    financialYear: "",
    applicationNumber: "",
    agency: "",
    scheme: "",
    piName: "",
    piDept: "",
    piContact: "",
    piEmail: "",
    copiName: "",
    copiDept: "",
    copiContact: "",
    copiEmail: "",
    duration: "",
    title: "",
    status: "",
    startDate: "",
    objectives: "",
    outcomes: "",
    amountApplied: "",
    amountReceived: "",
    amountSanctioned: "",
  });

  const [errors, setErrors] = useState({});
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "financialYear":
        if (!value) {
          error = "Financial Year is required.";
        } else if (!/^\d+$/.test(value)) {
          error = "Financial Year should only contain numbers.";
        }
        break;
      case "applicationNumber":
        case "duration":
      if (!value) {
          error = `${name === "applicationNumber" ? "applicationNumber" : "duration"} is required.`;
        } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
          error = `${name === "applicationNumber" ? "applicationNumber" : "duration"} should only contain letters and numbers.`;
        }
        break;
      case "agency":
      case "scheme":
        if (!value) {
          error = `${name === "agency" ? "Agency" : "Scheme"} is required.`;
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = `${name === "agency" ? "Agency" : "Scheme"} should only contain letters.`;
        }
        break;
      case "piName":
      case "piDept":
        if (!value) {
          error = `${name === "piName" ? "PI Name" : "PI Department"} is required.`;
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = `${name === "piName" ? "PI Name" : "PI Department"} should only contain letters.`;
        }
        break;
      case "piContact":
        if (!value) {
          error = "PI Contact is required.";
        } else if (!/^\d{10}$/.test(value)) {
          error = "Contact Number must be a valid 10-digit number.";
        }
        break;
      case "piEmail":
        if (!value) {
          error = "PI Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email must be valid.";
        }
        break;

      case "title":
      case "objectives":
      case "outcomes":
        if (!value) {
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
        } else if (!/^[a-zA-Z0-9\s.,]+$/.test(value)) {
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} should only contain letters, numbers, spaces, and punctuation.`;
        }
        break;
      case "startDate":
        if (!value) {
          error = "Start Date is required.";
        }
        break;
      case "status":
        if (!value) {
          error = "Status is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Status should only contain letters.";
        }
        break;
        case "amountApplied":
          if (formData.status === "applied" && !value) {
            error = "Amount Applied is required when status is 'Applied'.";
          } else if (value && !/^\d+$/.test(value)) {
            error = "Amount Applied should contain only numbers.";
          }
          break;
        case "amountSanctioned":
          if (formData.status === "completed" && !value) {
            error = "Amount Sanctioned is required when status is 'Completed'.";
          } else if (value && !/^\d+$/.test(value)) {
            error = "Amount Sanctioned should contain only numbers.";
          }
          break;
        case "amountReceived":
          if (
            (formData.status === "ongoing" || formData.status === "completed") &&
            !value
          ) {
            error = "Amount Received is required when status is 'Ongoing' or 'Completed'.";
          } else if (value && !/^\d+$/.test(value)) {
            error = "Amount Received should contain only numbers.";
          }
          break;
        
      default:
        break;
    }
    return error;
  };
  
  const validate = () => {
    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) formErrors[key] = error;
    });
    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form...");
  
    try {
      // Perform form validation
      const formErrors = validate();
      console.log("Validation Errors:", formErrors);
  
      if (Object.keys(formErrors).length === 0) {
        console.log("No validation errors, proceeding to submit.");
  
        // Ensure faculty_id is available (replace with your actual method to get it)
        if (!faculty_id) {
          console.error("Error: Faculty ID is missing.");
          alert("Faculty ID is required.");
          return;
        }
  
        // Ensure coInvestigators is an array (convert if it's a string)
        const updatedFormData = {
          ...formData,
          faculty_id: faculty_id
        };
  
       
  
        // Make API call to submit the form data to the server
        const response = await fetch("http://localhost:5003/addFundedProject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        });
  
        if (response.ok) {
          console.log("Form data submitted to server successfully.");
  
          // Navigate to /viewexternal after successful submission
          navigate("/viewprojects");
  
          // Reset form fields
          setFormData({
            financialYear: "",
            applicationNumber: "",
            agency: "",
            scheme: "",
            piName: "",
            piDept: "",
            piContact: "",
            piEmail: "",
            copiName: "",
            copiDept: "",
            copiContact: "",
            copiEmail: "",
            duration: "",
            title: "",
            status: "",
            startDate: "",
            objectives: "",
            outcomes: "",
            amountApplied: "",
            amountReceived: "",
            amountSanctioned: "",
          });
          setErrors({});
        } else {
          const errorText = await response.text();
          console.error("Error submitting form data to server:", errorText);
          alert(`Error: ${errorText}`);
        }
      } else {
        console.log("Validation failed.");
        setErrors(formErrors);
  
        // Scroll to the first error field
        const firstErrorField = Object.keys(formErrors)[0];
        const fieldElement = document.getElementsByName(firstErrorField)[0];
        if (fieldElement) {
          fieldElement.scrollIntoView({ behavior: "smooth", block: "center" });
          fieldElement.focus();
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };
  

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">External Funded Projects</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* General Information */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Financial Year</label>
            <input
              type="text"
              className="form-control"
              name="financialYear"
              value={formData.financialYear}
              onChange={handleChange}
            />
            {errors.financialYear && <div className="text-danger">{errors.financialYear}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Application Number</label>
            <input
              type="text"
              className="form-control"
              name="applicationNumber"
              value={formData.applicationNumber}
              onChange={handleChange}
            />
            {errors.applicationNumber && <div className="text-danger">{errors.applicationNumber}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Agency</label>
            <input
              type="text"
              className="form-control"
              name="agency"
              value={formData.agency}
              onChange={handleChange}
            />
            {errors.agency && <div className="text-danger">{errors.agency}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Scheme</label>
            <input
              type="text"
              className="form-control"
              name="scheme"
              value={formData.scheme}
              onChange={handleChange}
            />
            {errors.scheme && <div className="text-danger">{errors.scheme}</div>}
          </div>
        </div>

        {/* PI Credentials */}
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Name of the PI</label>
              <input
                type="text"
                className="form-control"
                name="piName"
                value={formData.piName}
                onChange={handleChange}
              />
              {errors.piName && <div className="text-danger">{errors.piName}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Department of PI</label>
              <input
                type="text"
                className="form-control"
                name="piDept"
                value={formData.piDept}
                onChange={handleChange}
              />
              {errors.piDept && <div className="text-danger">{errors.piDept}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Contact Number of PI</label>
              <input
                type="text"
                className="form-control"
                name="piContact"
                value={formData.piContact}
                onChange={handleChange}
              />
              {errors.piContact && <div className="text-danger">{errors.piContact}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Email id of PI</label>
              <input
                type="email"
                className="form-control"
                name="piEmail"
                value={formData.piEmail}
                onChange={handleChange}
              />
              {errors.piEmail && <div className="text-danger">{errors.piEmail}</div>}
            </div>
          </div>

          {/* Co-PI Credentials (Optional) */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Name of the Co-PI</label>
              <input
                type="text"
                className="form-control"
                name="copiName"
                value={formData.copiName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Department of Co-PI</label>
              <input
                type="text"
                className="form-control"
                name="copiDept"
                value={formData.copiDept}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contact Number of Co-PI</label>
              <input
                type="text"
                className="form-control"
                name="copiContact"
                value={formData.copiContact}
                onChange={handleChange}
              />
              {errors.copiContact && <div className="text-danger">{errors.copiContact}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Email id of Co-PI</label>
              <input
                type="email"
                className="form-control"
                name="copiEmail"
                value={formData.copiEmail}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Duration of Project</label>
            <input
              type="text"
              className="form-control"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            />
            {errors.duration && <div className="text-danger">{errors.duration}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Title of the Project</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <div className="text-danger">{errors.title}</div>}
          </div>
          <div className="row">
  {/* Status of the Project */}
  <div className="col-md-6 mb-3">
    <label className="form-label">Status of the Project</label>
    <select
      className="form-select"
      name="status"
      value={formData.status}
      onChange={handleChange}
    >
      <option value="">Select the status</option>
      <option value="ongoing">Ongoing</option>
      <option value="completed">Completed</option>
      <option value="applied">Applied</option>
    </select>
    {errors.status && <div className="text-danger">{errors.status}</div>}
  </div>

  {/* Start Date */}
  <div className="col-md-6 mb-3">
    <label className="form-label">Start Date</label>
    <input
      type="date"
      className="form-control"
      name="startDate"
      value={formData.startDate}
      onChange={handleChange}
    />
    {errors.startDate && <div className="text-danger">{errors.startDate}</div>}
  </div>
</div>

{/* Amount Applied */}
{["applied", "ongoing", "completed"].includes(formData.status) && (
  <div className="col-md-6 mb-3">
    <label className="form-label">Amount Applied</label>
    <input
      type="text"
      className="form-control"
      name="amountApplied"
      value={formData.amountApplied || ""}
      onChange={handleChange}
    />
    {errors.amountApplied && <div className="text-danger">{errors.amountApplied}</div>}
  </div>
)}

{/* Amount Received */}
{["ongoing", "completed"].includes(formData.status) && (
  <div className="col-md-6 mb-3">
    <label className="form-label">Amount Received</label>
    <input
      type="text"
      className="form-control"
      name="amountReceived"
      value={formData.amountReceived || ""}
      onChange={handleChange}
    />
    {errors.amountReceived && <div className="text-danger">{errors.amountReceived}</div>}
  </div>
)}

{/* Amount Sanctioned */}
{formData.status === "completed" && (
  <div className="col-md-6 mb-3">
    <label className="form-label">Amount Sanctioned</label>
    <input
      type="text"
      className="form-control"
      name="amountSanctioned"
      value={formData.amountSanctioned || ""}
      onChange={handleChange}
    />
    {errors.amountSanctioned && <div className="text-danger">{errors.amountSanctioned}</div>}
  </div>
)}





          <div className="col-md-6 mb-3">
            <label className="form-label">Objectives of the Project</label>
            <textarea
              className="form-control"
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
            />
            {errors.objectives && <div className="text-danger">{errors.objectives}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Outcomes of the Project</label>
            <textarea
              className="form-control"
              name="outcomes"
              value={formData.outcomes}
              onChange={handleChange}
            />
            {errors.outcomes && <div className="text-danger">{errors.outcomes}</div>}
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">
            Submit Project Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExternalFunded;