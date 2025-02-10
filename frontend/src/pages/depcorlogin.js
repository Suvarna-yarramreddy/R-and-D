import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginCorPage = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    coordinatorid: "",
    password1: "",
    department: "", // New state for department
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.coordinatorid || !loginData.password1 || !loginData.department) {
      setErrorMessage("All fields are required.");
    } else {
      setErrorMessage("");

      try {
        const response = await axios.post("http://localhost:4000/coordinatorlogin", loginData);

        if (response.data.success) {
          // Set session storage
          const {coordinatorid} = response.data;  // Error here because `coordinatorid` is not sent in response
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("coordinatorid", coordinatorid);
          sessionStorage.setItem("role", "coordinator"); // Set role for coordinator

          // Navigate to coordinator dashboard
          navigate("/coordinatorwelcome");
        } else {
          setErrorMessage("Invalid credentials.");
        }
      } catch (error) {
        setErrorMessage("ID or password is incorrect.");
      }
    }
  };


  return (
    <div className="container mt-3" style={{ maxWidth: "500px" }}>
      <h1 className="text-center mb-4">Department Coordinator Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Department Coordinator ID:</label>
          <input
            type="text"
            className="form-control"
            name="coordinatorid"
            value={loginData.coordinatorid}
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
        <div className="mb-3">
          <label className="form-label">Department:</label>
          <select
            className="form-select"
            name="department"
            value={loginData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="cse">CSE</option>
            <option value="aiml">AI & ML</option>
            <option value="aids">AIDS</option>
            <option value="cs">CS</option>
            <option value="ece">ECE</option>
            <option value="eee">EEE</option>
            <option value="civil">Civil</option>
            <option value="it">IT</option>
            <option value="me">ME</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
        {errorMessage && (
          <div className="alert alert-danger mt-3">{errorMessage}</div>
        )}
      </form>
    </div>
  );
};

export default LoginCorPage;
