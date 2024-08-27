// src/AppWrapper.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import App from "./App";

function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = Cookies.get("jwt");
    if (jwt) {
      navigate("/dashboard"); // Redirect to dashboard if JWT exists
    }
  }, [navigate]);

  return <App />;
}

export default function WrappedApp() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
