import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import getStrapiURL from "./functions/getStrapiURL";

function EditFeeding() {
  const { babyId, feedingId } = useParams();
  const [time, setTime] = useState("");
  const [type, setType] = useState("Breastfeeding");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const url = getStrapiURL() + "/api";
    const fetchFeeding = async () => {
      const jwt = Cookies.get("jwt");
      try {
        const response = await axios.get(
          url + `/feedings/${feedingId}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        const { time, type, amount } = response.data.data.attributes;
        // Convert UTC time to local time
        const utcDate = new Date(time);
        const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
        const localTimeString = localDate.getFullYear() + '-' +
          String(localDate.getMonth() + 1).padStart(2, '0') + '-' +
          String(localDate.getDate()).padStart(2, '0') + 'T' +
          String(localDate.getHours()).padStart(2, '0') + ':' +
          String(localDate.getMinutes()).padStart(2, '0');
        setTime(localTimeString);
        setType(type);
        setAmount(amount);
      } catch (error) {
        console.error("Error fetching feeding:", error.response);
        setError("Failed to fetch feeding. Please try again.");
      }
    };

    fetchFeeding();
  }, [feedingId]);

  const handleUpdateFeeding = async (e) => {
    e.preventDefault();
    const jwt = Cookies.get("jwt");

    if (!time || !type || !amount) {
      setError("All fields are required");
      return;
    }

    try {
      const url = getStrapiURL() + "/api";
      // Convert time to UTC
      const utcDate = new Date(time);
      const offset = utcDate.getTimezoneOffset();
      const utcTime = new Date(utcDate.getTime() + offset * 60 * 1000);
      await axios.put(
        url + `/feedings/${feedingId}`,
        {
          data: {
            time: utcTime,
            type: type,
            amount: amount,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      // Redirect back to baby details after updating feeding
      navigate(`/baby/${babyId}`);
    } catch (error) {
      console.error("Error updating feeding:", error.response);
      setError("Failed to update feeding. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 min-h-screen flex flex-col justify-center">
      <form onSubmit={handleUpdateFeeding} className="space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Edit Feeding
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
          Update Feeding
        </button>
      </form>
    </div>
  );
}

export default EditFeeding;