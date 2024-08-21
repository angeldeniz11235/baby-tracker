// src/components/NewBaby.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewBaby() {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

  const handleCreateBaby = async (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem('jwt');

    try {
      const response = await axios.post('http://localhost:1337/api/babies', 
      {
        data: {
          name: name,
          date_of_birth: dateOfBirth,
          gender: gender,
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
    }
  };

  return (
    <form onSubmit={handleCreateBaby}>
      <h2>Add New Baby</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Baby's Name"
        required
      />
      <input
        type="date"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        placeholder="Date of Birth"
        required
      />
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit">Create Baby</button>
    </form>
  );
}

export default NewBaby;
