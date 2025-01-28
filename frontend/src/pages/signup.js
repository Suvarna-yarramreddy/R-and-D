import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const FacultySignupPage = () => {
  const [formData, setFormData] = useState({
    institute_name: "",
    faculty_id: "",
    faculty_name: "",
    department: "",
    designation: "",
    research_domain: "",
    major_specialization: "",
    research_skills: "",
    qualification: "",
    phd_status: "",
    phd_registration_date: "",
    phd_university: "",
    phd_completed_year: "",
    guide_name: "",
    guide_phone_number: "",
    guide_mail_id: "",
    guide_department: "",
    date_of_joining_svecw: "",
    experience_in_svecw: "",
    previous_teaching_experience: "",
    total_experience: 0,
    industry_experience: "",
    ratified: "",
    official_mail_id: "",
    phone_number: "",
    course_network_id: "",
    faculty_profile_weblink: "",
    scopus_id: "",
    orcid: "",
    google_scholar_id: "",
    vidwan_portal: "",
    password1:""
  });
  const navigate=useNavigate();
  
  // Function to calculate Experience in SVECW and Total Experience
  const calculateExperience = useCallback(() => {
    if (formData.date_of_joining_svecw) {
      const joiningDate = new Date(formData.date_of_joining_svecw);
      const currentDate = new Date();
      const yearsInSVECW = currentDate.getFullYear() - joiningDate.getFullYear();
      const monthsInSVECW = currentDate.getMonth() - joiningDate.getMonth();

      const experienceInSVECW =
        monthsInSVECW < 0 ? yearsInSVECW - 1 : yearsInSVECW;
      setFormData((prevData) => ({
        ...prevData,
        experience_in_svecw: experienceInSVECW,
      }));

      // Calculate Total Experience (Previous teaching experience + Experience in SVECW + Industry Experience)
      const totalExperience =
        parseFloat(formData.previous_teaching_experience || 0) +
        experienceInSVECW 
      setFormData((prevData) => ({
        ...prevData,
        total_experience: totalExperience,
      }));
    }
  }, [formData.date_of_joining_svecw, formData.previous_teaching_experience]);

  useEffect(() => {
    calculateExperience();
  }, [
    formData.date_of_joining_svecw,
    formData.previous_teaching_experience,
    formData.industry_experience,
    calculateExperience,
  ]);
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate field as it changes
    const error = validateField(name, value);

    // Update state for form data and errors
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };
  const validateField = (fieldName, value) => {
    let error = "";
  
    const validateEmail = (email) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
   const validatePhoneNumber = (phoneNumber) =>
  /^[7-9][0-9]{9}$/.test(phoneNumber.trim());
  
    const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);
    const validateDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date); // YYYY-MM-DD format
    const validateUrl = (url) =>
      /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9]{2,4}(\/.*)?$/.test(url);
    const validateYear = (year) =>
      /^\d{4}$/.test(year) && parseInt(year) >= 1900 && parseInt(year) <= new Date().getFullYear();
    const validateOrcid = (orcid) =>
      /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(orcid);
    const validateCourseNetworkId = (courseNetworkId) => 
      /^[a-zA-Z0-9-]+$/.test(courseNetworkId);    
    const validateScopusId = (id) =>
      /^[a-zA-Z0-9]+$/.test(id); // Scopus ID format: alphanumeric
    const validateGoogleScholarId = (id) =>
      /^[a-zA-Z0-9-]+$/.test(id);
  
    switch (fieldName) {
      case "institute_name":
        error = value ? "" : "Institute name is required.";
        break;
      case "faculty_id":
        error = /^[a-zA-Z0-9]+$/.test(value)
          ? ""
          : "Faculty ID must be alphanumeric.";
        break;
      case "faculty_name":
        error = validateName(value)
          ? ""
          : "Faculty name must only contain alphabets and spaces.";
        break;
        case "research_domain":
        case "major_specialization":
        case "research_skills":
      case "department":
      case "designation":
      case "qualification":
      case "guide_department":
        error = value ? "" : `${fieldName.replace("_", " ")} is required.`;
        break;
      case "ratified":
      error = value ? "" : `${fieldName.replace("_", " ")} must be Y or N.`;
      break;
      case "phd_status":
        error = ["On Going", "Completed", "Not Pursuing"].includes(value)
          ? ""
          : "Invalid PhD status.";
        break;
      case "phd_registration_date":
        error = value && !validateDate(value)
          ? "Date must be in the format YYYY-MM-DD."
          : "";
        break;
        case "date_of_joining_svecw":
          error = !value || !validateDate(value)
            ? "Date of joining is required."
            : "";
          break;
      case "phd_completed_year":
        error = value && !validateYear(value)
          ? "Invalid year."
          : "";
        break;
      case "guide_name":
        error = !value || !validateName(value)
          ? "Guide name must only contain alphabets and spaces."
          : "";
        break;
      case "guide_phone_number":
      case "phone_number":
        error = !value || !validatePhoneNumber(value)
          ? "Phone number must start with 7, 8, or 9 and contain 10 digits."
          : "";
        break;
      case "guide_mail_id":
      case "official_mail_id":
        error = !value || !validateEmail(value)
          ? "Invalid email address."
          : "";
        break;
      case "faculty_profile_weblink":
      case "vidwan_portal":
        error = !value || !validateUrl(value)
          ? "Invalid URL format."
          : "";
        break;
      case "orcid":
        error = !value || !validateOrcid(value)
          ? "Invalid ORCID format."
          : "";
        break;
        case "course_network_id":
      error = !value || !validateCourseNetworkId(value)
        ? "Invalid Course Network ID. It should be alphanumeric with optional dashes."
        : "";
      break;
    case "scopus_id":
      error = !value || !validateScopusId(value)
        ? "Invalid Scopus ID. It should be alphanumeric."
        : "";
      break;
    case "google_scholar_id":
      error = !value || !validateGoogleScholarId(value)
        ? "Invalid Google Scholar ID. It should be alphanumeric with optional dashes."
        : "";
      break;
      case "total_experience":
      case "previous_teaching_experience":
      case "industry_experience":
        error = (!value || value < 0)? `${fieldName.replace("_", " ")} must be a positive number.`: "";
        break;
      case "password1":
        error =
          value.length >= 6 ? "" : "Password must be at least 6 characters long.";
        break;
      default:
        break;
    }
  
    return error;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    let formIsValid = true;
    const newErrors = {};

    // Validate all form fields
    Object.keys(formData).forEach((fieldName) => {
        const error = validateField(fieldName, formData[fieldName]);
        if (error) {
            formIsValid = false;
            newErrors[fieldName] = error;
        } else {
            newErrors[fieldName] = ''; // Reset error if field is valid
        }
    });

    setErrors(newErrors);

    // Stop execution if the form is not valid
    if (!formIsValid) {
        alert("Form contains errors. Please fix them.");
        return;
    }

    console.log("Form submitted successfully:", formData);

    try {
        const response = await axios.post("http://localhost:5000/signup", formData);

        if (response.status === 201) {
            const { faculty_name, faculty_id } = response.data;

            // Save login state and faculty details to sessionStorage
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("faculty_name", faculty_name);
            sessionStorage.setItem("faculty_id", faculty_id);

            // Navigate to the home page after successful signup
            navigate("/home");
        }
    } catch (error) {
        if (error.response) {
            // Handling 400 error or other server errors gracefully
            if (error.response.status === 400) {
                alert("FacultyId or Official Mail Id already exists.");
            } else if (error.response.status === 500) {
                alert("An internal server error occurred. Please try again later.");
            } else {
                alert(error.response.data.message || "An error occurred.");
            }

            // Set error message for form submission
            setErrors((prevErrors) => ({
                ...prevErrors,
                form: error.response.data.message || "An error occurred.",
            }));
        } else {
            alert("Network error. Please check your connection.");
        }
    }
};

  
  
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Faculty Signup</h1>
    <form onSubmit={handleSubmit} >
      {/* Row 1 */}
      <div className="row">
      <div className="col-md-4">
          <label htmlFor="faculty_id" className="form-label">Faculty ID</label>
          <input
            type="text"
            id="faculty_id"
            name="faculty_id"
            value={formData.faculty_id}
            onChange={handleChange}
            className="form-control"
          />
          {errors.faculty_id && <div className="text-danger">{errors.faculty_id}</div>}
        </div>
        <div className="col-md-4">
          <label htmlFor="institute_name" className="form-label">Institute Name</label>
          <input
            type="text"
            id="institute_name"
            name="institute_name"
            value={formData.institute_name}
            onChange={handleChange}
            className="form-control"
          />
          {errors.institute_name && <div className="text-danger">{errors.institute_name}</div>}
        </div>
        
        <div className="col-md-4">
          <label htmlFor="faculty_name" className="form-label">Faculty Name</label>
          <input
            type="text"
            id="faculty_name"
            name="faculty_name"
            value={formData.faculty_name}
            onChange={handleChange}
            className="form-control"
          />
          {errors.faculty_name && <div className="text-danger">{errors.faculty_name}</div>}
        </div>
      </div>

      {/* Row 2 */}
      <div className="row mt-3">
      <div className="col-md-4">
              <label htmlFor="department" className="form-label">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select Department</option>
                <option value="cse">CSE</option>
                <option value="aiml">AIML</option>
                <option value="aids">AIDS</option>
                <option value="it">IT</option>
                <option value="cs">CS</option>
                <option value="eee">EEE</option>
                <option value="ece">ECE</option>
                <option value="civil">Civil</option>
                <option value="me">ME</option>
              </select>
              {errors.department && <div className="text-danger">{errors.department}</div>}
            </div>

        <div className="col-md-4">
          <label htmlFor="designation" className="form-label">Designation</label>
          <select
                className="form-control"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                
              >
                <option value="">Select Designation</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value={"Dean"}>Dean</option>
                <option value={"Vice Principle"}>Vice Principle</option>
                <option value={"Principle"}>Principle</option>
              </select>
          {errors.designation && <div className="text-danger">{errors.designation}</div>}
        </div>
        <div className="col-md-4">
          <label htmlFor="research_domain" className="form-label">Research Domain</label>
          <input
            type="text"
            id="research_domain"
            name="research_domain"
            value={formData.research_domain}
            onChange={handleChange}
            className="form-control"
          />
          {errors.research_domain && <div className="text-danger">{errors.research_domain}</div>}
        </div>
      </div>

      <div className="row mt-3">
            <div className="col-md-4">
              <label className="form-label">Major Specialization:</label>
              <input
                type="text"
                className="form-control"
                name="major_specialization"
                value={formData.major_specialization}
                onChange={handleChange}
                
              />{errors.major_specialization && <div className="text-danger">{errors.major_specialization}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Research Skills:</label>
              <input
                type="text"
                className="form-control"
                name="research_skills"
                value={formData.research_skills}
                onChange={handleChange}
                
              />{errors.research_skills && <div className="text-danger">{errors.research_skills}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Qualification:</label>
              <select
                className="form-control"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                
              >
                <option value="">Select Qualification</option>
                <option value="M.Tech.">M.Tech.</option>
                <option value="Ph.D.">Ph.D.</option>
                <option value="Ph.D. (pursuing)">Ph.D. (pursuing)</option>
                <option value="M.Sc.">M.Sc.</option>
                <option value="M.Phil">M.Phil.</option>
              </select>
              {errors.qualification && <div className="text-danger">{errors.qualification}</div>}
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-4">
                <label className="form-label">PhD Status:</label>
                <select
                  className="form-control"
                  name="phd_status"
                  value={formData.phd_status}
                  onChange={handleChange}
                  
                >
                  <option value="">Select PhD Status</option>
                  <option value="On Going">On Going</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Pursuing">Not Pursuing</option>
                </select>
                {errors.phd_status && <div className="text-danger">{errors.phd_status}</div>}
              </div>
              {formData.phd_status === "On Going" && (
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Date of Ph.D. Registered:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="phd_registration_date"
                      value={formData.phd_registration_date}
                      onChange={handleChange}
                    />
                    {errors.phd_registration_date && <div className="text-danger">{errors.phd_registration_date}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">University of Ph.D.:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phd_university"
                      value={formData.phd_university}
                      onChange={handleChange}
                    />
                    {errors.phd_university && <div className="text-danger">{errors.phd_university}</div>}
                  </div>
                  </div>
                )}
                 {formData.phd_status === "Completed" && (
                <div className="row mt-3">
                  <div className="col-md-4">
                    <label className="form-label">Date of Ph.D. Registered:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="phd_registration_date"
                      value={formData.phd_registration_date}
                      onChange={handleChange}
                    />
                    {errors.phd_registration_date && <div className="text-danger">{errors.phd_registration_date}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">University of Ph.D.:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phd_university"
                      value={formData.phd_university}
                      onChange={handleChange}
                    />{errors.phd_university && <div className="text-danger">{errors.phd_university}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Year of Ph.D. Completion:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phd_completed_year"
                      value={formData.phd_completed_year}
                      onChange={handleChange}
                    />{errors.phd_completed_year && <div className="text-danger">{errors.phd_completed_year}</div>}
                  </div>
                </div>
              )}  
              <div className="col-md-4">
              <label className="form-label">Guide Name:</label>
              <input
                type="text"
                className="form-control"
                name="guide_name"
                value={formData.guide_name}
                onChange={handleChange}
                
              />
              {errors.guide_name && <div className="text-danger">{errors.guide_name}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Guide Phone Number:</label>
              <input
                type=""
                className="form-control"
                name="guide_phone_number"
                value={formData.guide_phone_number}
                onChange={handleChange}
                
              />
              {errors.guide_phone_number && <div className="text-danger">{errors.guide_phone_number}</div>}
            </div>
        </div>
        <div className="row mt-3">
              <div className="col-md-4">
                  <label className="form-label">Guide Mail Id:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="guide_mail_id"
                    value={formData.guide_mail_id}
                    onChange={handleChange}
                    
                  />
                  {errors.guide_mail_id && <div className="text-danger">{errors.guide_mail_id}</div>}
                </div>
              <div className="col-md-4">
                <label className="form-label">Guide Department:</label>
                <input
                  type="text"
                  className="form-control"
                  name="guide_department"
                  value={formData.guide_department}
                  onChange={handleChange}
                  
                />
                {errors.guide_department && <div className="text-danger">{errors.guide_department}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Date of Joining SVECW:</label>
                <input
                  type="date"
                  className="form-control"
                  name="date_of_joining_svecw"
                  value={formData.date_of_joining_svecw}
                  onChange={handleChange}
                  
                />
                {errors.date_of_joining_svecw && <div className="text-danger">{errors.date_of_joining_svecw}</div>}
              </div>
        </div>
        <div className="row mt-3">
            <div className="col-md-4">
                <label className="form-label">Experience in SVECW (Years):</label>
                <input
                  type="text"
                  className="form-control"
                  name="experience_in_svecw"
                  value={formData.experience_in_svecw}
                  readOnly
                />
              </div>
              <div className="col-md-4">
              <label className="form-label">Previous Teaching Experience (Years):</label>
              <input
                type="number"
                className="form-control "
                name="previous_teaching_experience"
                value={formData.previous_teaching_experience}
                onChange={handleChange}
                
              />
              {errors.previous_teaching_experience && <div className="text-danger">{errors.previous_teaching_experience}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Total Experience (Years):</label>
              <input
                type="text"
                className="form-control "
                name="total_experience"
                value={formData.total_experience}
                readOnly
              />
            </div>
        </div>
        <div className="row mt-3">
        <div className="col-md-4">
                <label className="form-label">Industry Experience (Years):</label>
                <input
                  type="number"
                  className="form-control "
                  name="industry_experience"
                  value={formData.industry_experience}
                  onChange={handleChange}
                  
                />
                {errors.industry_experience && <div className="text-danger">{errors.industry_experience}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label ">Ratified:</label>
                <input
                  type="text"
                  className="form-control "
                  name="ratified"
                  value={formData.ratified}
                  onChange={handleChange}
                  
                />
                {errors.ratified && <div className="text-danger">{errors.ratified}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Official Mail ID:</label>
                <input
                  type="email"
                  className="form-control "
                  name="official_mail_id"
                  value={formData.official_mail_id}
                  onChange={handleChange}
                  
                />
              {errors.official_mail_id && <div className="text-danger">{errors.official_mail_id}</div>}
              </div>    
        </div>
            <div className="row mt-3">
                <div className="col-md-4">
                  <label className="form-label">Phone Number (WhatsApp):</label>
                  <input
                    type=""
                    className="form-control"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    
                  />
                  {errors.phone_number && <div className="text-danger">{errors.phone_number}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Course Network ID/Link:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="course_network_id"
                    value={formData.course_network_id}
                    onChange={handleChange}
                  />
                  {errors.course_network_id && <div className="text-danger">{errors.course_network_id}</div>}
                </div>
                <div className="col-md-4">
                <label className="form-label ">Faculty Profile Weblink (College):</label>
                <input
                  type="text"
                  className="form-control "
                  name="faculty_profile_weblink"
                  value={formData.faculty_profile_weblink}
                  onChange={handleChange}
                />
                {errors.faculty_profile_weblink && <div className="text-danger">{errors.faculty_profile_weblink}</div>}
              </div>
            </div>
            <div className="row mt-3">
            <div className="col-md-4">
                <label className="form-label ">Scopus ID:</label>
                <input
                  type="text"
                  className="form-control "
                  name="scopus_id"
                  value={formData.scopus_id}
                  onChange={handleChange}
                />
                {errors.scopus_id && <div className="text-danger">{errors.scopus_id}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">ORCID:</label>
                <input
                  type="text"
                  className="form-control "
                  name="orcid"
                  value={formData.orcid}
                  onChange={handleChange}
                />
                {errors.orcid && <div className="text-danger">{errors.orcid}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label ">Google Scholar ID:</label>
                <input
                  type="text"
                  className="form-control "
                  name="google_scholar_id"
                  value={formData.google_scholar_id}
                  onChange={handleChange}
                />
                {errors.google_scholar_id && <div className="text-danger">{errors.google_scholar_id}</div>}
              </div>
            </div>
            <div className="row mt-3">
            <div className="col-md-4">
                <label className="form-label ">Vidwan Portal:</label>
                <input
                  type="text"
                  className="form-control "
                  name="vidwan_portal"
                  value={formData.vidwan_portal}
                  onChange={handleChange}
                />
                {errors.vidwan_portal && <div className="text-danger">{errors.vidwan_portal}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Password:</label>
                <input
                  type="password"
                  className="form-control "
                  name="password1"
                  value={formData.password1}
                  onChange={handleChange}
                  
                />
                {errors.password1 && <div className="text-danger">{errors.password1}</div>}
              </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Submit
                  </button>
                </div>
    </form>
    </div>
  );
};

export default FacultySignupPage;
