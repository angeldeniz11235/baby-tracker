import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie
import getStrapiURL from './functions/getStrapiURL';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate phone number (optional)
    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      setError('Phone number must be 10 digits');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const url = getStrapiURL() + '/api'
      // Check if username or email already exists
      const existingUserResponse = await axios.get(url + '/users', {
        params: {
          _where: {
            _or: [
              { username: username },
              { email: email }
            ]
          }
        }
      });

      if (existingUserResponse.data.length > 0) {
        setError('Username or email already exists');
        return;
      }

      // Create the user
      const userResponse = await axios.post(url + '/auth/local/register', {
        username: username,
        email: email,
        password: password,
      });

      const userId = userResponse.data.user.id;
      const jwt = userResponse.data.jwt;

      // Create the parent
      await axios.post(url + '/parents', {
        data: {
          name: fullName,
          email: email,
          phone_number: phoneNumber,
          user: userId,
        }
      }, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      Cookies.set('jwt', jwt, { expires: 7 }); // Save the JWT as a cookie
      navigate('/dashboard'); // Redirect after signup
    } catch (error) {
      console.error('An error occurred:', error.response);
      setError('Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 min-h-screen flex flex-col justify-center">
      <form onSubmit={handleSignup} className="space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number (optional)"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;