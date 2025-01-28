import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Loginpage = () => {
  const [loginData, setLoginData] = useState({
    faculty_id: "",
    password1: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.faculty_id || !loginData.password1) {
      setErrorMessage("All fields are required.");
    } else if (loginData.password1.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
    } else {
      setErrorMessage("");

      try {
        const response = await axios.post("http://localhost:5000/login", loginData);

        if (response.status === 200) {
          const { faculty_name, faculty_id } = response.data;

          // Set session storage
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("faculty_id", faculty_id);
          sessionStorage.setItem("faculty_name", faculty_name);
          sessionStorage.setItem("role", "faculty");  // Ensure faculty role is set

          // Navigate to faculty dashboard
          navigate("/home");
        }
      } catch (error) {
        setErrorMessage("Invalid credentials.");
      }
    }
  };

  return (
    <div className="container mt-3" style={{ maxWidth: "500px" }}>
      <h1 className="text-center mb-4">Faculty Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Faculty ID:</label>
          <input
            type="text"
            className="form-control"
            name="faculty_id"
            value={loginData.faculty_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            name="password1"
            value={loginData.password1}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
        {errorMessage && (
          <div className="alert alert-danger mt-3">{errorMessage}</div>
        )}
      </form>
    </div>
  );
};

export default Loginpage;
