// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [babies, setBabies] = useState([]); // Initialize as an empty array
  const navigate = useNavigate();

  const fetchBabies = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      navigate('/'); // Redirect to login if not authenticated
    } else {
      // Fetch the babies associated with the logged-in parent
      axios.get('http://localhost:1337/api/babies', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.data)) {
          setBabies(response.data.data);
        } else {
          setBabies([]); // Set as empty array if not an array
        }
      })
      .catch(error => {
        console.error('Error fetching babies:', error.response);
        setBabies([]); // Set as empty array in case of error
      });
    }
  };

  useEffect(() => {
    fetchBabies();
  }, [navigate]);

  const handleNewBaby = () => {
    navigate('/new-baby');
  };

  const handleSelectBaby = (babyId) => {
    navigate(`/baby/${babyId}`);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {babies.length === 0 ? (
        <button onClick={handleNewBaby}>New Baby</button>
      ) : (
        <div>
          {babies.map(baby => (
            <button key={baby.id} onClick={() => handleSelectBaby(baby.id)}>
              {baby.attributes.name}
            </button>
          ))}
          <button onClick={handleNewBaby}>New Baby</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
