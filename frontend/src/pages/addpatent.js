import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";
import { useNavigate } from "react-router-dom";
const PatentForm = () => {
  const faculty_id = sessionStorage.getItem("faculty_id");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    iprType: "",
    applicationNumber: "",
    applicantName: "",
    department: "",
    filingDate: "",
    inventionTitle: "",
    numOfInventors: 0,
    inventors: [],
    status: "",
    dateOfPublished: "",
    dateOfGranted: "",
    proofOfPatent: null,
  });

  const [errors, setErrors] = useState({});

  
  // Handle Number of Inventors Change
  const handleNumOfInventorsChange = (e) => {
    const value = parseInt(e.target.value);
    setFormData({
      ...formData,
      numOfInventors: value,
      inventors: Array(value).fill(""), // Reset inventors' fields
    });
  
    // After updating, validate the inventors
    validateInventors(value, Array(value).fill(""));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });
  
    // Real-time validation for the changed field
    let newErrors = { ...errors };
  
    // Validate the specific field that was changed
    newErrors = validateField(name, value, newErrors);
  
    // Set the errors state
    setErrors(newErrors);
  };
  
  const handleInventorChange = (index, e) => {
    const newInventors = [...formData.inventors];
    newInventors[index] = e.target.value; // Update the specific inventor's name
  
    // Update the form data
    setFormData({
      ...formData,
      inventors: newInventors,
    });
  
    // Validate the inventors and update the errors state
    const updatedErrors = validateInventors(formData.numOfInventors, newInventors);
    setErrors(updatedErrors);
  };
  
  
  const validateInventors = (numOfInventors, inventors) => {
    let newErrors = { ...errors }; // Use the current error state
  
    if (numOfInventors > 0) {
      const allFilled = inventors.every((inv) => inv.trim() !== ""); // Check if all names are filled
  
      if (!allFilled) {
        newErrors.inventors = "Please ensure that all inventor names are entered.";
      } else {
        delete newErrors.inventors; // Clear the error if all names are valid
      }
    } else {
      delete newErrors.inventors; // Clear the error if there are no inventors
    }
  
    return newErrors; // Return the updated error object
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      proofOfPatent: file,
    });

    let newErrors = { ...errors };

    if (file) {
      if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) {
        newErrors.proofOfPatent = "Please upload a valid file (PDF, PNG, JPEG).";
      } else {
        delete newErrors.proofOfPatent;
      }
    } else {
      newErrors.proofOfPatent = "Please upload a proof of patent (e.g., PDF, image file).";
    }

    setErrors(newErrors);
  };

  

// Validate individual fields
const validateField = (name, value, newErrors) => {
  // Ensure newErrors is always initialized as an empty object
  newErrors = newErrors || {};

  switch (name) {
    case "category":
      if (!value) {
        newErrors.category = "Please select a category (National or International).";
      } else {
        delete newErrors.category;
      }
      break;

    case "iprType":
      if (!value) {
        newErrors.iprType = "Please select the type of IPR (Utility Patent, Design Patent, etc.).";
      } else {
        delete newErrors.iprType;
      }
      break;

    case "applicationNumber":
      if (!value) {
        newErrors.applicationNumber = "Please enter the application number (e.g., AP-12345).";
      } else {
        delete newErrors.applicationNumber;
      }
      break;

    case "applicantName":
      if (!value) {
        newErrors.applicantName = "Please enter the full name of the applicant.";
      } else {
        delete newErrors.applicantName;
      }
      break;

    case "department":
      if (!value) {
        newErrors.department = "Please enter the department where the patent is filed.";
      } else {
        delete newErrors.department;
      }
      break;

    case "filingDate":
      if (!value) {
        newErrors.filingDate = "Please select a valid filing date.";
      } else if (isNaN(new Date(value))) {
        newErrors.filingDate = "The filing date entered is not valid. Please select a valid date.";
      } else {
        delete newErrors.filingDate;
      }
      break;

    case "inventionTitle":
      if (!value) {
        newErrors.inventionTitle = "Please provide a title for your invention.";
      } else {
        delete newErrors.inventionTitle;
      }
      break;

    case "status":
      if (!value) {
        newErrors.status = "Please select the status of the patent (Filed, Published, Granted).";
      } else {
        delete newErrors.status;
      }
      break;

    case "dateOfPublished":
      if (formData.status === "published" && !value) {
        newErrors.dateOfPublished = "Please enter the date when the patent was published.";
      } else if (formData.status === "published" && isNaN(new Date(value))) {
        newErrors.dateOfPublished = "Please select a valid publication date.";
      } else {
        delete newErrors.dateOfPublished;
      }
      break;

    case "dateOfGranted":
      if (formData.status === "granted" && !value) {
        newErrors.dateOfGranted = "Please enter the date when the patent was granted.";
      } else if (formData.status === "granted" && isNaN(new Date(value))) {
        newErrors.dateOfGranted = "Please select a valid granted date.";
      } else {
        delete newErrors.dateOfGranted;
      }
      break;

      case "proofOfPatent":
        if (!value) {
          newErrors.proofOfPatent = "Please upload a proof of patent (e.g., PDF, image file).";
        } else if (!value.name) {
          newErrors.proofOfPatent = "It seems the file upload failed. Please try uploading the proof again.";
        } else if (!["application/pdf", "image/png", "image/jpeg"].includes(value.type)) {
          newErrors.proofOfPatent = "Please upload a valid file (PDF, PNG, JPEG).";
        } else {
          delete newErrors.proofOfPatent; // Remove error if the field is correct
        }
        break;
    default:
      break;
  }
  return newErrors;
};

const validateForm = () => {
  let newErrors = {};

  // Validate other fields
  Object.keys(formData).forEach((key) => {
    if (key !== "inventors") {
      newErrors = validateField(key, formData[key], newErrors);
    }
  });

  // Validate inventor fields explicitly
  const inventorErrors = validateInventors(formData.numOfInventors, formData.inventors);
  newErrors = { ...newErrors, ...inventorErrors }; // Merge inventor errors with others

  return newErrors;
};


const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate all fields before submission
  let newErrors = validateForm();

  // Check if there are any errors
  if (Object.keys(newErrors).length > 0) {
    // Set the errors to state
    setErrors(newErrors);
    console.log("Form validation failed:", newErrors);
  } else {
    // If no errors, submit the form
    console.log("Form submitted successfully:", formData);

    try {
      const dataToSend = new FormData();
      dataToSend.append('faculty_id', faculty_id);
      dataToSend.append('category', formData.category);
      dataToSend.append('iprType', formData.iprType);
      dataToSend.append('applicationNumber', formData.applicationNumber);
      dataToSend.append('applicantName', formData.applicantName);
      dataToSend.append('department', formData.department);
      dataToSend.append('filingDate', formData.filingDate);
      dataToSend.append('inventionTitle', formData.inventionTitle);
      dataToSend.append('numOfInventors', formData.numOfInventors);

      // Serialize the inventors array to JSON string before appending
      const inventorsJson = JSON.stringify(formData.inventors);
      dataToSend.append('inventors', inventorsJson);

      dataToSend.append('status', formData.status);
      dataToSend.append('dateOfPublished', formData.dateOfPublished);
      dataToSend.append('dateOfGranted', formData.dateOfGranted);
      dataToSend.append('proofOfPatent', formData.proofOfPatent);

      const response = await axios.post(
        "http://localhost:5001/addPatent",
        dataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.status === 200) {
        console.log("Patent form submitted successfully", response.data);
        navigate("/viewpatents");
      } else {
        console.error("Patent form submission failed");
      }
    } catch (error) {
      console.error("Error submitting patent form:", error);
    }
  }
};

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Patent Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Category and IPR Type */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="national">National</option>
              <option value="international">International</option>
            </select>
            {errors.category && <div className="text-danger">{errors.category}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Type of IPR</label>
            <select
              name="iprType"
              className="form-control"
              value={formData.iprType}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="utilityPatent">Utility Patent/Product</option>
              <option value="designPatent">Design Patent</option>
              <option value="copyright">Copyright</option>
              <option value="trademark">Trademark</option>
            </select>
            {errors.iprType && <div className="text-danger">{errors.iprType}</div>}
          </div>
        </div>

        {/* Application Number and Applicant Name */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Application Number</label>
            <input
              type="text"
              name="applicationNumber"
              className="form-control"
              value={formData.applicationNumber}
              onChange={handleChange}
            />
            {errors.applicationNumber && <div className="text-danger">{errors.applicationNumber}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Applicant Name</label>
            <input
              type="text"
              name="applicantName"
              className="form-control"
              value={formData.applicantName}
              onChange={handleChange}
            />
            {errors.applicantName && <div className="text-danger">{errors.applicantName}</div>}
          </div>
        </div>

        {/* Department and Filing Date */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Department</label>
            <input
              type="text"
              name="department"
              className="form-control"
              value={formData.department}
              onChange={handleChange}
            />
            {errors.department && <div className="text-danger">{errors.department}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Date of Filing</label>
            <input
              type="date"
              name="filingDate"
              className="form-control"
              value={formData.filingDate}
              onChange={handleChange}
            />
            {errors.filingDate && <div className="text-danger">{errors.filingDate}</div>}
          </div>
        </div>

        {/* Title of Invention and Number of Inventors */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Title of Invention</label>
            <input
              type="text"
              name="inventionTitle"
              className="form-control"
              value={formData.inventionTitle}
              onChange={handleChange}
            />
            {errors.inventionTitle && <div className="text-danger">{errors.inventionTitle}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Number of Inventors</label>
            <select
              name="numOfInventors"
              className="form-control"
              value={formData.numOfInventors}
              onChange={handleNumOfInventorsChange}
            >
              <option value={0}>Select Number</option>
              {[...Array(10).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {errors.inventors && <div className="text-danger">{errors.inventors}</div>}
          </div>
        </div>

        {/* Dynamically Render Inventor Fields */}
{formData.numOfInventors > 0 &&
  // Group inventors in pairs
  [...Array(Math.ceil(formData.numOfInventors / 2))].map((_, rowIndex) => (
    <div className="row" key={rowIndex}>
      {/* Render the first inventor in the pair */}
      <div className="col-md-6 mb-3">
        <label>Inventor {rowIndex * 2 + 1}</label>
        <input
          type="text"
          name={`inventor${rowIndex * 2 + 1}`}
          className="form-control"
          value={formData.inventors[rowIndex * 2] || ""}
          onChange={(e) => handleInventorChange(rowIndex * 2, e)}
        />
      </div>

      {/* Render the second inventor in the pair, if it exists */}
      {rowIndex * 2 + 1 < formData.numOfInventors && (
        <div className="col-md-6 mb-3">
          <label>Inventor {rowIndex * 2 + 2}</label>
          <input
            type="text"
            name={`inventor${rowIndex * 2 + 2}`}
            className="form-control"
            value={formData.inventors[rowIndex * 2 + 1] || ""}
            onChange={(e) => handleInventorChange(rowIndex * 2 + 1, e)}
          />
        </div>
      )}
    </div>
  ))}


        {/* Status and Conditional Date Fields */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Status</label>
            <select
              name="status"
              className="form-control"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="filed">Filed</option>
              <option value="published">Published</option>
              <option value="granted">Granted</option>
            </select>
            {errors.status && <div className="text-danger">{errors.status}</div>}
          </div>

          {formData.status === "published" && (
            <div className="col-md-6 mb-3">
              <label>Date of Publication</label>
              <input
                type="date"
                name="dateOfPublished"
                className="form-control"
                value={formData.dateOfPublished}
                onChange={handleChange}
              />
              {errors.dateOfPublished && <div className="text-danger">{errors.dateOfPublished}</div>}
            </div>
          )}

          {formData.status === "granted" && (
            <div className="col-md-6 mb-3">
              <label>Date of Granted</label>
              <input
                type="date"
                name="dateOfGranted"
                className="form-control"
                value={formData.dateOfGranted}
                onChange={handleChange}
              />
              {errors.dateOfGranted && <div className="text-danger">{errors.dateOfGranted}</div>}
            </div>
          )}

        {/* Proof of Patent Upload */}
        <div className="col-md-6 mb-3">
            <label>Proof of Patent (PDF, PNG, JPEG)</label>
            <input
              type="file"
              name="proofOfPatent"
              className="form-control"
              onChange={handleFileChange}
            />
            {errors.proofOfPatent && <div className="text-danger">{errors.proofOfPatent}</div>}
      </div>

        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">
            Submit 
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatentForm;
