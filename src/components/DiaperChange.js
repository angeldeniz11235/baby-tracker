// src/components/DiaperChange.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { fetchParentData } from "./functions/fetchParentData";
import { fetchUserData } from "./functions/fetchUserData";
import getStrapiURL from "./functions/getStrapiURL";

function DiaperChange() {
  const getCurrentLocalTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - offset * 60 * 1000);
    return localTime.toISOString().slice(0, 16);
  };
  const { babyId } = useParams();
  const [time, setTime] = useState(getCurrentLocalTime());
  const [type, setType] = useState("Both");
  const [error, setError] = useState("");
  const [parentId, setParentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParentId = async () => {
      const jwt = Cookies.get("jwt");
      try {
        const user = await fetchUserData(jwt);
        console.log("Fetched user data:", user.data); // Debugging line
        if (user && user.id) {
          const parent = await fetchParentData(user, jwt);
            if (parent) {
                setParentId(parent.id);
            } else {
                setError("Parent ID not found for the current user.");
            }
        } else {
          setError("Parent information not found for the current user.");
        }
      } catch (error) {
        console.error("Error fetching user information:", error.response);
        setError("Failed to fetch user information. Please try again.");
      }
    };

    fetchParentId();
  }, []);

  const handleCreateDiaperChange = async (e) => {
    e.preventDefault();
    const jwt = Cookies.get("jwt");

    if (!time || !type || !parentId) {
      setError("All fields are required");
      return;
    }

    try {
      const url = getStrapiURL() + "/api";
      // Convert time to UTC
      const utcDate = new Date(time);
      const offset = utcDate.getTimezoneOffset();
      const utcTime = new Date(utcDate.getTime() + offset * 60 * 1000);

      await axios.post(
        url + "/diaper-changes",
        {
          data: {
            time: utcTime,
            type: type,
            baby: babyId,
            parent: parentId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      // Redirect back to baby details after adding diaper change
      navigate(`/baby/${babyId}`);
    } catch (error) {
      console.error("Error creating diaper change:", error.response);
      setError("Failed to create diaper change. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 min-h-screen flex flex-col justify-center">
      <form onSubmit={handleCreateDiaperChange} className="space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add Diaper Change
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select Type</option>
          <option value="Wet">Wet</option>
          <option value="Soiled">Soiled</option>
          <option value="Both">Both</option>
        </select>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Diaper Change
        </button>
      </form>
    </div>
  );
}

export default DiaperChange;
