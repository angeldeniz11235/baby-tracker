import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import getStrapiURL from "./functions/getStrapiURL";

function Login() {
  const [identifier, setIdentifier] = useState(""); // Updated to handle both username and email
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = Cookies.get("jwt");
    if (jwt) {
      navigate("/dashboard"); // Redirect to dashboard if JWT exists
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const url = getStrapiURL() + "/api/auth/local";
    try {
      const response = await axios.post(
        url,
        {
          identifier: identifier, // Use identifier to handle both username and email
          password: password,
        }
      );
      const jwt = response.data.jwt;
      Cookies.set("jwt", jwt, { expires: 7 }); // Store the JWT in a cookie
      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setErrorMessage("Invalid username or password. Please try again.");
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        setErrorMessage("No response from server. Please try again later.");
        console.error("Error request data:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrorMessage("An error occurred. Please try again.");
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup"); // Redirect to the sign-up page
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
      <form
        onSubmit={handleLogin}
        className="max-w-md mx-auto bg-white shadow-md rounded p-6"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {errorMessage && (
          <div className="mb-4 text-red-500">
            {errorMessage}
          </div>
        )}
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Username or Email"
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>

      <div className="text-center">
        <p className="mb-2 text-gray-600">Don't have an account?</p>
        <button
          onClick={handleSignupRedirect}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Login;