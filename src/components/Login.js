// src/components/Login.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = Cookies.get("jwt");
    if (jwt) {
      navigate("/dashboard"); // Redirect to dashboard if JWT exists
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:1337/api/auth/local",
        {
          identifier: email,
          password: password,
        }
      );
      const jwt = response.data.jwt;
      Cookies.set("jwt", jwt, { expires: 7 }); // Store the JWT in a cookie
      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("An error occurred:", error.response);
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
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
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
