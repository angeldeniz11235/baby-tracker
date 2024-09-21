// src/components/Feeding.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { fetchParentData } from "./functions/fetchParentData";
import { fetchUserData } from "./functions/fetchUserData";
import getStrapiURL from "./functions/getStrapiURL";

function Feeding() {
  const getCurrentLocalTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - offset * 60 * 1000);
    return localTime.toISOString().slice(0, 16);
  };
  const { babyId } = useParams();
  const [time, setTime] = useState(getCurrentLocalTime());
  const [type, setType] = useState("Breastfeeding");
  const [amount, setAmount] = useState("");
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

  const handleCreateFeeding = async (e) => {
    e.preventDefault();
    const jwt = Cookies.get("jwt");

    if (!time || !type || !amount || !parentId) {
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
        url + "/feedings",
        {
          data: {
            time: utcTime,
            type: type,
            amount: amount,
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

      // Redirect back to baby details after adding feeding
      navigate(`/baby/${babyId}`);
    } catch (error) {
      console.error("Error creating feeding:", error.response);
      setError("Failed to create feeding. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 min-h-screen flex flex-col justify-center">
      <form onSubmit={handleCreateFeeding} className="space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add Feeding
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
          <option value="Breastfeeding">Breastfeeding</option>
          <option value="Formula">Formula</option>
          <option value="Solid Food">Solid Food</option>
        </select>
        <label className="block text-gray-700">
          Amount (ml)
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Amount (ml)"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Feeding
        </button>
      </form>
    </div>
  );
}

export default Feeding;