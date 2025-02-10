import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function SeedMoneyPage() {
  const faculty_id = sessionStorage.getItem("faculty_id");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    financialYear: '',
    facultyName: '',
    department: '',
    numStudents: 0,
    projectTitle: '',
    amountSanctioned: '',
    amountReceived: '',
    objectives: '',
    outcomes: '',
    proof: [], // Store multiple files
    students: [{ registration: '', name: '' }]
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value); // real-time validation after each change
  };
  
  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...formData.students];
    updatedStudents[index][field] = value;
    setFormData((prevData) => ({ ...prevData, students: updatedStudents }));
    validateField(`student-${field}-${index}`, value); // real-time validation for student fields
  };
  
  const handleNumStudentsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const students = value > 0 ? Array.from({ length: value }, () => ({ registration: "", name: "" })) : [];
    setFormData((prevData) => ({ ...prevData, numStudents: value, students }));
    validateField("numStudents", value); // real-time validation
  };
  
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      proof: [...prevData.proof, ...newFiles],
    }));
    validateField("proof", newFiles); // real-time validation for proof files
  };
  
 
  
 // Validation logic for the form
 const validateForm = () => {
  let isValid = true;
  const newErrors = {}; // Initialize an empty error object

  // Validate each field in formData
  Object.keys(formData).forEach((key) => {
    const value = formData[key];
    console.log(`Validating ${key}: ${value}`);  // Log each key and value

    // Skip optional fields like numStudents and proof
    if (key === "numStudents" || key === "proof") return;

    // Check if the field is empty or invalid
    if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '')) {
      newErrors[key] = `${key} is required.`;  // Populate error message
      isValid = false; // Mark the form as invalid
    }
  });

  // Validate student registration and name only if numStudents > 0
  if (formData.numStudents > 0) {
    formData.students.forEach((student, index) => {
      console.log(`Validating student ${index}:, student`);  // Log student details

      if (!student.registration.trim()) {
        newErrors[`student-registration-${index}`] = `Student ${index + 1}: Registration is required.`;
        isValid = false;
      }

      if (!student.name.trim()) {
        newErrors[`student-name-${index}`] = `Student ${index + 1}: Name is required.`;
        isValid = false;
      }
    });
  }

  // Log the errors object for debugging
  console.log('Validation errors:', newErrors);

  setErrors(newErrors);  // Update the error state
  return isValid;
};


// Real-time field validation
const validateField = (name, value) => {
  const newErrors = { ...errors };

  switch (name) {
    case "financialYear":
      if (!value) newErrors.financialYear = "Financial Year is required.";
      else delete newErrors.financialYear;
      break;

    case "facultyName":
      if (!value.trim()) newErrors.facultyName = "Faculty Name is required.";
      else if (!/^[A-Za-z\s]+$/.test(value)) // Only characters and spaces
        newErrors.facultyName = "Faculty Name must contain only letters and spaces.";
      else delete newErrors.facultyName;
      break;

    case "department":
      if (!value.trim()) newErrors.department = "Department is required.";
      else if (!/^[A-Za-z\s]+$/.test(value)) // Only characters and spaces
        newErrors.department = "Department name must contain only letters and spaces.";
      else delete newErrors.department;
      break;

    case "numStudents":
      // Skip validation for numStudents since it's not required
      break;

    case "projectTitle":
      if (!value.trim()) newErrors.projectTitle = "Project Title is required.";
      else delete newErrors.projectTitle;
      break;

    case "amountSanctioned":
      if (!value || isNaN(value))
        newErrors.amountSanctioned = "Amount Sanctioned must be a valid number.";
      else if (parseFloat(value) <= 0)
        newErrors.amountSanctioned = "Amount Sanctioned must be greater than zero.";
      else delete newErrors.amountSanctioned;
      break;

    case "amountReceived":
      if (!value || isNaN(value))
        newErrors.amountReceived = "Amount Received must be a valid number.";
      else if (parseFloat(value) > parseFloat(formData.amountSanctioned))
        newErrors.amountReceived = "Amount Received cannot exceed Amount Sanctioned.";
      else delete newErrors.amountReceived;
      break;

    case "objectives":
      if (!value.trim()) newErrors.objectives = "Objectives are required.";
      else delete newErrors.objectives;
      break;

    case "outcomes":
      if (!value.trim()) newErrors.outcomes = "Outcomes are required.";
      else delete newErrors.outcomes;
      break;

    case "proof":
      // Skip validation for proof since it's not required
      break;

    default:
      // Validate student fields if numStudents > 0
      if (formData.numStudents > 0) {
        if (name.startsWith("student-registration")) {
          const index = parseInt(name.split("-")[2], 10);
          if (!value.trim()) newErrors[`student-registration-${index}`] = `Student ${index + 1}: Registration is required.`;
          else delete newErrors[`student-registration-${index}`];
        }

        if (name.startsWith("student-name")) {
          const index = parseInt(name.split("-")[2], 10);
          if (!value.trim()) newErrors[`student-name-${index}`] = `Student ${index + 1}: Name is required.`;
          else if (!/^[A-Za-z\s]+$/.test(value)) // Only characters and spaces for student names
            newErrors[`student-name-${index}`] = `Student ${index + 1}: Name must contain only letters and spaces.`;
          else delete newErrors[`student-name-${index}`];
        }
      }
      break;
  }

  setErrors(newErrors); // Update the error state
  return newErrors;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (validateForm()) {
    // Form is valid, prepare the data to be sent
    const formDataToSend = new FormData();
    formDataToSend.append('faculty_id', faculty_id); // Add faculty_id from context
    formDataToSend.append('financialYear', formData.financialYear);
    formDataToSend.append('facultyName', formData.facultyName);
    formDataToSend.append('department', formData.department);
    formDataToSend.append('numStudents', formData.numStudents);
    formDataToSend.append('projectTitle', formData.projectTitle);
    formDataToSend.append('amountSanctioned', formData.amountSanctioned);
    formDataToSend.append('amountReceived', formData.amountReceived);
    formDataToSend.append('objectives', formData.objectives);
    formDataToSend.append('outcomes', formData.outcomes);

    if (formData.proof && Array.isArray(formData.proof)) {
      formData.proof.forEach(file => {
          if (file instanceof File) {
              formDataToSend.append('proof', file);  // Append each valid file
          }
      });
  } else {
      formDataToSend.append('proof', null); // Send null if no files are selected
  }
    // Handle students dynamically (if there are multiple students)
    formData.students.forEach((student, index) => {
      formDataToSend.append(`students[${index}][registration]`, student.registration);
      formDataToSend.append(`students[${index}][name]`, student.name);
    });

    try {
      // Send form data to backend (server)
      const response = await fetch('http://localhost:9000/addSeedMoney', {
        method: 'POST',
        body: formDataToSend,  // Send FormData instead of JSON
      });

      // Check the response content type
      const contentType = response.headers.get('Content-Type');
      let data;

      // If the response is JSON, parse it
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();  // Parse response as JSON
      } else {
        // Handle plain text or other response types
        data = await response.text();  // Read the response as plain text
      }

      if (response.ok) {

        if (data.message === 'Form submitted successfully!') {
          // Reset the form after successful submission
          setFormData({
            financialYear: '',
            facultyName: '',
            department: '',
            numStudents: 0,
            projectTitle: '',
            amountSanctioned: '',
            amountReceived: '',
            objectives: '',
            outcomes: '',
            proof: null,
            students: [{ registration: '', name: '' }]
          });
        }
        if (response.status === 200) {
          navigate("/viewseedmoney");
        }
      } else {
        console.error('Error:', data);
        alert('Failed to submit the form: ' + (data.message || data));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit the form due to network issues');
    }
  } else {
    // If form is invalid, scroll to the first error field
    const firstErrorField = Object.keys(errors)[0];
    const errorField = document.querySelector([`name=${firstErrorField}`]);
    if (errorField) {
      errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};


  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Seed Money Application</h1>
      <form onSubmit={handleSubmit}  method="POST" enctype="multipart/form-data">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Financial Year</label>
            <select
            className="form-select"
            name="financialYear"
            value={formData.financialYear}
            onChange={handleChange}
            >
              <option value="">Select Financial Year</option>
              <option value="2020-21">2020-21</option>
              <option value="2021-22">2021-22</option>
              <option value="2022-23">2022-23</option>
              <option value="2024-25">2024-25</option>
              </select>
              {errors.financialYear && <div className="text-danger">{errors.financialYear}</div>}
            </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Faculty Name</label>
            <input
              type="text"
              className="form-control"
              name="facultyName"
              value={formData.facultyName}
              onChange={handleChange}
            />
            {errors.facultyName && <div className="text-danger">{errors.facultyName}</div>}
          </div>
          </div>
          <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-control"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
            {errors.department && <div className="text-danger">{errors.department}</div>}
          </div>
        {/* Student Details */}
        
          <div className="col-md-6 mb-3">
            <label className="form-label">Number of Students Involved</label>
            <input
              type="number"
              className="form-control"
              name="numStudents"
              value={formData.numStudents}
              onChange={handleNumStudentsChange}
              min="0"
            />
          </div>
        </div>

        {formData.numStudents > 0 && formData.students.map((student, index) => (
          <div className="row" key={index}>
            <div className="col-md-6 mb-3">
              <label className="form-label">Registration Number (Student {index + 1})</label>
              <input
                type="text"
                className="form-control"
                name="registration"
                value={student.registration}
                onChange={(e) => handleStudentChange(index, 'registration', e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Name (Student {index + 1})</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={student.name}
                onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
              />
            </div>
          </div>
        ))}

        {/* Project Details */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Title of the Project</label>
            <input
              type="text"
              className="form-control"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
            />
            {errors.projectTitle && <div className="text-danger">{errors.projectTitle}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Amount Sanctioned (in Rupees)</label>
            <input
              type="text"
              className="form-control"
              name="amountSanctioned"
              value={formData.amountSanctioned}
              onChange={handleChange}
            />
            {errors.amountSanctioned && <div className="text-danger">{errors.amountSanctioned}</div>}
          </div>
          </div>
          <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Amount Received (in Rupees)</label>
            <input
              type="text"
              className="form-control"
              name="amountReceived"
              value={formData.amountReceived}
              onChange={handleChange}
            />
            {errors.amountReceived && <div className="text-danger">{errors.amountReceived}</div>}
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Objectives of the Project</label>
            <textarea
              className="form-control"
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              style={{ height: '30%' }}
            />
            {errors.objectives && <div className="text-danger">{errors.objectives}</div>}
          </div>
          </div>
          <div className='row'>
          <div className="col-md-6 mb-3">
            <label className="form-label">Outcomes of the Project</label>
            <textarea
              className="form-control"
              name="outcomes"
              value={formData.outcomes}
              onChange={handleChange}
              style={{ height: '30%' }}
            />
            {errors.outcomes && <div className="text-danger">{errors.outcomes}</div>}
          </div>
        
          <div className="col-md-6 mb-3">
  <label className="form-label">Upload Proof</label>
  <div className="custom-file">
    <input
      type="file"
      name="proof"
      className="form-control"
      multiple
      onChange={handleFileChange}
    />
  </div>
  {formData.proof.length > 0 && (
    <div className="mt-3">
      <label className="form-label">Selected Files:</label>
      <ul className="list-group">
        {formData.proof.map((file, index) => (
          <li className="list-group-item" key={index}>
            <span className="file-name">{file.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

        
        </div>
        
        <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
        </div>
      </form>
    </div>
  );
}

export default SeedMoneyPage;