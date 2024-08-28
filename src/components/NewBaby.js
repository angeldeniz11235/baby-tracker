// src/components/NewBaby.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { fetchUserData } from './functions/fetchUserData';
import { fetchParentData } from './functions/fetchParentData';

function NewBaby() {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [parentId, setParentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParentId = async () => {
      const jwt = Cookies.get('jwt');
      try {
        const user = await fetchUserData(jwt);
        console.log('Fetched user data:', user); // Debugging line
        if (user && user.id) {
          const parent = await fetchParentData(user, jwt);
          if (parent) {
            setParentId(parent.id);
          } else {
            setError('Parent information not found for the current user.');
          }
        } else {
          setError('Parent information not found for the current user.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error.response);
        setError('Failed to fetch user information. Please try again.');
      }
    };

    fetchParentId();
  }, []);

  const handleCreateBaby = async (e) => {
    e.preventDefault();
    const jwt = Cookies.get('jwt');

    if (!name || !dateOfBirth || !gender || !parentId) {
      setError('All fields are required');
      return;
    }

    try {
      console.log('Creating baby with parent ID:', parentId); // Debugging line
      await axios.post('http://localhost:1337/api/babies', 
      {
        data: {
          name: name,
          date_of_birth: dateOfBirth,
          gender: gender,
          parents: parentId,
        }
      }, 
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      // Redirect back to dashboard after adding baby
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating baby:', error.response);
      setError('Failed to create baby. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 min-h-screen flex flex-col justify-center">
      <form onSubmit={handleCreateBaby} className="space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Baby</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Baby's Name"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Baby
        </button>
      </form>
    </div>
  );
}

export default NewBaby;