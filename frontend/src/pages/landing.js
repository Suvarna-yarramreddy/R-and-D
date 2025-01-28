import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <div className="container-fluid p-0">
      <div className="text-white text-center py-5" style={{ background: "linear-gradient(135deg, #2C3E50, #3498DB)" }}>
        <h1 className="display-5 fw-bold"> Shri Vishnu Engineering College for Women</h1>
        <p className="lead">Empowering Women in Engineering and Research</p>
      </div>

      {/* Main Content Section */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 bg-light p-5 rounded shadow">
            <h2 className="text-center text-secondary mb-4">
              Welcome to the Research and Development Portal
            </h2>
            <p className="text-center text-muted">
              Manage your academic and research details efficiently and
              effectively.
            </p>
            <div className="d-flex justify-content-center gap-4 mt-4">
              <button
                onClick={handleSignupClick}
                className="btn btn-primary btn-lg px-5"
              >
                Signup
              </button>
              <button
                onClick={handleLoginClick}
                className="btn btn-success btn-lg px-5"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default LandingPage;