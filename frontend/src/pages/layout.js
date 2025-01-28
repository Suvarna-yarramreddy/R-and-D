import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import CoordinatorSidebar from "./depcorsidebar"; // Import Coordinator Sidebar

const Layout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(""); // Track the user's role
  const location = useLocation();

  useEffect(() => {
    // Check login status and role from sessionStorage
    const loggedInStatus = sessionStorage.getItem("isLoggedIn") === "true";
    const userRole = sessionStorage.getItem("role")?.toLowerCase() || ""; // Normalize role
    setIsLoggedIn(loggedInStatus);
    setRole(userRole);
  }, [location.pathname]); // Trigger on route changes

  return (
    <div>
      {/* Navbar at the top */}
      <Navbar setIsLoggedIn={setIsLoggedIn} setRole={setRole} />

      {/* Flexbox Layout for Sidebar and Content */}
      <div style={{ display: "flex", height: "calc(100vh - 80px)" }}>
        {/* Render Sidebar based on role */}
        {isLoggedIn && (
          <div style={{ width: "250px", backgroundColor: "#f9f9f9" }}>
            {role === "coordinator" ? (
              <CoordinatorSidebar /> // Show Coordinator Sidebar
            ) : (
              <Sidebar /> // Show Faculty Sidebar
            )}
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
