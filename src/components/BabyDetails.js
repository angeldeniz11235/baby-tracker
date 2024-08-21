// src/components/BabyDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BabyDetails() {
  const { babyId } = useParams(); // Get babyId from URL parameters
  const [baby, setBaby] = useState(null); // Initialize state to hold baby data

  useEffect(() => {
    const fetchBabyDetails = async () => {
      const jwt = localStorage.getItem('jwt');

      try {
        const response = await axios.get(`http://localhost:1337/api/babies/${babyId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        setBaby(response.data.data); // Set the baby data
      } catch (error) {
        console.error('Error fetching baby details:', error.response);
      }
    };

    fetchBabyDetails();
  }, [babyId]);

  if (!baby) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  return (
    <div>
      <h1>{baby.attributes.name}</h1> {/* Display the baby's name */}
      {/* Add more baby details here */}
    </div>
  );
}

export default BabyDetails;
