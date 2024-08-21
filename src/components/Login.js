// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: email,
        password: password,
      });
      localStorage.setItem('jwt', response.data.jwt); // Save the JWT
      navigate('/dashboard'); // Redirect after login
    } catch (error) {
      console.error('An error occurred:', error.response);
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup'); // Redirect to the sign-up page
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      
      <div>
        <p>Don't have an account?</p>
        <button onClick={handleSignupRedirect}>Sign Up</button>
      </div>
    </div>
  );
}

export default Login;
