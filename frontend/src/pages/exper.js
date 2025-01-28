import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignUpForm = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    institute_name: '',
    faculty_id: '',
    faculty_name: '',
    department: '',
    designation: '',
    research_domain: '',
    major_specialization: '',
    research_skills: '',
    qualification: '',
    phd_status: '',
    phd_registration_date: '',
    phd_university: '',
    phd_completed_year: '',
    guide_name: '',
    guide_phone_number: '',
    guide_mail_id: '',
    guide_department: '',
    date_of_joining_svecw: '',
    experience_in_svecw: '',
    previous_teaching_experience: '',
    total_experience: '',
    industry_experience: '',
    ratified: '',
    official_mail_id: '',
    phone_number: '',
    course_network_id: '',
    faculty_profile_weblink: '',
    scopus_id: '',
    orcid: '',
    google_scholar_id: '',
    vidwan_portal: '',
    password1: '',
  });

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

  const validate = () => {
    let formErrors = {};

    // Institute Name - only text
    if (!formData.institute_name || !/^[a-zA-Z\s]+$/.test(formData.institute_name)) {
        formErrors.institute_name = "Institute Name should only contain letters.";
    }

    // Faculty ID - alphanumeric
    if (!formData.faculty_id || !/^[a-zA-Z0-9]+$/.test(formData.faculty_id)) {
        formErrors.faculty_id = "Faculty ID should only contain letters and numbers.";
    }

    // Faculty Name - only text
    if (!formData.faculty_name || !/^[a-zA-Z\s]+$/.test(formData.faculty_name)) {
        formErrors.faculty_name = "Faculty Name should only contain letters.";
    }

    // Department - only text
    if (!formData.department || !/^[a-zA-Z\s]+$/.test(formData.department)) {
        formErrors.department = "Department should only contain letters.";
    }

    // Designation - only text
    if (!formData.designation || !/^[a-zA-Z\s]+$/.test(formData.designation)) {
        formErrors.designation = "Designation should only contain letters.";
    }

    // Research Domain - only text
    if (!formData.research_domain || !/^[a-zA-Z\s]+$/.test(formData.research_domain)) {
        formErrors.research_domain = "Research Domain should only contain letters.";
    }

    // Major Specialization - only text
    if (!formData.major_specialization || !/^[a-zA-Z\s]+$/.test(formData.major_specialization)) {
        formErrors.major_specialization = "Major Specialization should only contain letters.";
    }

    // Research Skills - only text
    if (!formData.research_skills || !/^[a-zA-Z\s]+$/.test(formData.research_skills)) {
        formErrors.research_skills = "Research Skills should only contain letters.";
    }

    // Qualification - only text
    if (!formData.qualification || !/^[a-zA-Z\s]+$/.test(formData.qualification)) {
        formErrors.qualification = "Qualification should only contain letters.";
    }

    // PhD Status - only text
    if (!formData.phd_status || !/^[a-zA-Z\s]+$/.test(formData.phd_status)) {
        formErrors.phd_status = "PhD Status should only contain letters.";
    }

    // PhD Registration Date - valid date
    if (!formData.phd_registration_date || !/\d{4}-\d{2}-\d{2}/.test(formData.phd_registration_date)) {
        formErrors.phd_registration_date = "PhD Registration Date must be a valid date (YYYY-MM-DD).";
    }

    // PhD University - only text
    if (!formData.phd_university || !/^[a-zA-Z\s]+$/.test(formData.phd_university)) {
        formErrors.phd_university = "PhD University should only contain letters.";
    }

    // PhD Completed Year - only numbers
    if (!formData.phd_completed_year || !/^\d{4}$/.test(formData.phd_completed_year)) {
        formErrors.phd_completed_year = "PhD Completed Year must be a valid year (4 digits).";
    }

    // Guide Name - only text
    if (!formData.guide_name || !/^[a-zA-Z\s]+$/.test(formData.guide_name)) {
        formErrors.guide_name = "Guide Name should only contain letters.";
    }

    // Guide Phone Number - 10 digits
    if (!formData.guide_phone_number || !/^\d{10}$/.test(formData.guide_phone_number)) {
        formErrors.guide_phone_number = "Guide Phone Number must be a valid 10-digit number.";
    }

    // Guide Email ID - valid email format
    if (!formData.guide_mail_id || !/\S+@\S+\.\S+/.test(formData.guide_mail_id)) {
        formErrors.guide_mail_id = "Guide Email ID must be a valid email.";
    }

    // Guide Department - only text
    if (!formData.guide_department || !/^[a-zA-Z\s]+$/.test(formData.guide_department)) {
        formErrors.guide_department = "Guide Department should only contain letters.";
    }

    // Date of Joining - valid date
    if (!formData.date_of_joining_svecw || !/\d{4}-\d{2}-\d{2}/.test(formData.date_of_joining_svecw)) {
        formErrors.date_of_joining_svecw = "Date of Joining must be a valid date (YYYY-MM-DD).";
    }

    // Experience in SVECW - only numbers
    if (!formData.experience_in_svecw || !/^\d+$/.test(formData.experience_in_svecw)) {
        formErrors.experience_in_svecw = "Experience in SVECW must be a valid number.";
    }

    // Previous Teaching Experience - only numbers
    if (!formData.previous_teaching_experience || !/^\d+$/.test(formData.previous_teaching_experience)) {
        formErrors.previous_teaching_experience = "Previous Teaching Experience must be a valid number.";
    }

    // Total Experience - only numbers
    if (!formData.total_experience || !/^\d+$/.test(formData.total_experience)) {
        formErrors.total_experience = "Total Experience must be a valid number.";
    }

    // Industry Experience - only numbers
    if (!formData.industry_experience || !/^\d+$/.test(formData.industry_experience)) {
        formErrors.industry_experience = "Industry Experience must be a valid number.";
    }

    // Ratified - required
    if (!formData.ratified) {
        formErrors.ratified = "Ratified status is required.";
    }

    // Official Email ID - valid email format
    if (!formData.official_mail_id || !/\S+@\S+\.\S+/.test(formData.official_mail_id)) {
        formErrors.official_mail_id = "Official Email ID must be a valid email.";
    }

    // Phone Number - 10 digits
    if (!formData.phone_number || !/^\d{10}$/.test(formData.phone_number)) {
        formErrors.phone_number = "Phone Number must be a valid 10-digit number.";
    }

    // Course Network ID - alphanumeric
    if (!formData.course_network_id || !/^[a-zA-Z0-9]+$/.test(formData.course_network_id)) {
        formErrors.course_network_id = "Course Network ID should only contain letters and numbers.";
    }

    // Faculty Profile Weblink - valid URL
    if (!formData.faculty_profile_weblink || !/^https?:\/\/\S+\.\S+/.test(formData.faculty_profile_weblink)) {
        formErrors.faculty_profile_weblink = "Faculty Profile Weblink must be a valid URL.";
    }

    // Scopus ID - alphanumeric
    if (!formData.scopus_id || !/^[a-zA-Z0-9]+$/.test(formData.scopus_id)) {
        formErrors.scopus_id = "Scopus ID should only contain letters and numbers.";
    }

    // ORCID - valid ORCID format
    if (!formData.orcid || !/^0000-0002-[0-9]{4}-[0-9]{3}[0-9]{1}$/.test(formData.orcid)) {
        formErrors.orcid = "ORCID must be a valid format.";
    }

    // Google Scholar ID - alphanumeric
    if (!formData.google_scholar_id || !/^[a-zA-Z0-9]+$/.test(formData.google_scholar_id)) {
        formErrors.google_scholar_id = "Google Scholar ID should only contain letters and numbers.";
    }

    // Vidwan Portal - valid URL
    if (!formData.vidwan_portal || !/^https?:\/\/\S+\.\S+/.test(formData.vidwan_portal)) {
        formErrors.vidwan_portal = "Vidwan Portal must be a valid URL.";
    }

    // Password1 - required and minimum length
    if (!formData.password1 || formData.password1.length < 6) {
        formErrors.password1 = "Password must be at least 6 characters long.";
    }

    return formErrors;
};
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length === 0) {
      console.log("Form Data Submitted:", formData);
      alert("Project Details Submitted Successfully!");
    } else {
      setErrors(errors);
      const firstErrorField = Object.keys(errors)[0];
      document.getElementsByName(firstErrorField)[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Signup</h1>
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
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="form-control"
          />
          {errors.department && <div className="text-danger">{errors.department}</div>}
        </div>
        <div className="col-md-4">
          <label htmlFor="designation" className="form-label">Designation</label>
          <select
                className="form-control"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
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
                required
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
                required
              />{errors.research_skills && <div className="text-danger">{errors.research_skills}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Qualification:</label>
              <select
                className="form-control"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
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
                  required
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
                required
              />
              {errors.guide_name && <div className="text-danger">{errors.guide_name}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Guide Phone Number:</label>
              <input
                type="number"
                className="form-control"
                name="guide_phone_number"
                value={formData.guide_phone_number}
                onChange={handleChange}
                required
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
                    required
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
                  required
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
                  required
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
                required
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
                  required
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
                  required
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
                  required
                />
              {errors.official_mail_id && <div className="text-danger">{errors.official_mail_id}</div>}
              </div>    
        </div>
            <div className="row mt-3">
                <div className="col-md-4">
                  <label className="form-label">Phone Number (WhatsApp):</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
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
                  required
                />
                {errors.password1 && <div className="text-danger">{errors.password1}</div>}
              </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
                  <button type="submit" className="btn btn-success btn-lg">
                    Submit
                  </button>
                </div>
    </form>
    </div>
  );
};

export default SignUpForm;
