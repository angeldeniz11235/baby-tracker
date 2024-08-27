// src/components/Logout.js
import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Logout({ isAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("jwt"); // Remove the JWT cookie
    navigate("/"); // Redirect to login page
  };

  return (
    <>
      {isAuthenticated && ( // Conditionally render the logout button based on isAuthenticated
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </>
  );
}

export default Logout;
