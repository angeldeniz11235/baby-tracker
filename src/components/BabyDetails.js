// src/components/BabyDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function BabyDetails() {
  const { babyId } = useParams();
  const [baby, setBaby] = useState(null);

  useEffect(() => {
    const jwt = Cookies.get("jwt");
    if (jwt) {
      axios
        .get(`http://localhost:1337/api/babies/${babyId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          setBaby(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching baby details:", error.response);
        });
    }
  }, [babyId]);

  if (!baby) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">{baby.attributes.name}'s Details</h2>
      <p>Date of Birth: {baby.attributes.date_of_birth}</p>
      <p>Gender: {baby.attributes.gender}</p>
      {/* Add more details and styling as needed */}
    </div>
  );
}

export default BabyDetails;
