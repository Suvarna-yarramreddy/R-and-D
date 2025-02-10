import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./svecw.jpg";

const Navbar = ({ setIsLoggedIn, setRole }) => {
  const [isLoggedIn, setLocalIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem("isLoggedIn") === "true";
    const userRole = sessionStorage.getItem("role") || "";
    setLocalIsLoggedIn(loggedInStatus);
    setIsLoggedIn(loggedInStatus);  // Update state in Layout
    setRole(userRole);  // Update role in Layout
  }, [location.pathname, setIsLoggedIn, setRole]);

  const handleLogout = () => {
    sessionStorage.clear();
    setLocalIsLoggedIn(false);
    setIsLoggedIn(false);  // Sync the logout state
    setRole("");  // Clear the role on logout
    navigate("/", { replace: true });
  };

  const handleHomeClick = () => {
    if (isLoggedIn) {
      navigate("/home");
    } else {
      alert("Please log in to access the welcome page.");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-primary bg-opacity-100">
      <div className="container-fluid d-flex align-items-center">
        {/* Logo */}
        <div className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="SVECW Logo" style={{ height: "60px" }} />
          <span className="ms-2"><b>SVECW</b></span>
        </div>

        {/* Navbar Toggle */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className="nav-link" onClick={handleHomeClick}>Home</button>
            </li>
            {!isLoggedIn ? (
              <>
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                    Login
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><button className="dropdown-item" onClick={() => navigate("/login")}>Login as Faculty</button></li>
                    <li><button className="dropdown-item" onClick={() => navigate("/coordinatorlogin")}>Login as Department R&D Coordinator</button></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <button className="nav-link" onClick={() => navigate("/signup")}>Signup</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
